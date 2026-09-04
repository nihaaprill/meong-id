<template>
  <div class="classroom-layout" v-if="course">

    <aside class="playlist-sidebar">
      <div class="playlist-header">
        <RouterLink to="/learning" class="back-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          Kembali ke Kelas
        </RouterLink>
        
        <h3 class="course-title-sm">{{ course.title }}</h3>
        
        <div class="progress-wrapper">
          <div class="progress-info">
            <span>Progres Belajar</span>
            <span>{{ Math.round(progress) }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="module-list-container">
        <ul class="module-list">
          <li 
            v-for="(mod, index) in course.modules" 
            :key="index"
            :class="{ 
              'module-item': true,
              'active': currentModuleIndex === index,
              'completed': index < currentModuleIndex 
            }"
            @click="playModule(index)"
          >
            <div class="module-status">
              <div v-if="currentModuleIndex === index" class="icon-playing">▶</div>
              <div v-else-if="index < currentModuleIndex" class="icon-check">✓</div>
              <div v-else class="icon-lock">{{ index + 1 }}</div>
            </div>
            <div class="module-info">
              <span class="module-title">{{ mod.title }}</span>
              <span class="module-duration">Video • 10 Min</span> </div>
          </li>
        </ul>
      </div>
    </aside>

    <main class="player-content">
      <div class="content-wrapper">
        
        <div class="video-container">
          <div class="video-wrapper">
            <iframe 
              :src="`https://www.youtube.com/embed/${currentVideoId}?rel=0&autoplay=1&modestbranding=1`" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <div class="lesson-body">
          <div class="lesson-header">
            <h1 class="lesson-title">{{ currentModule.title }}</h1>
            
            <div class="lesson-nav">
              <button 
                class="nav-btn prev" 
                :disabled="currentModuleIndex === 0"
                @click="playModule(currentModuleIndex - 1)"
              >
                ← Sebelumnya
              </button>
              <button 
                class="nav-btn next" 
                :disabled="currentModuleIndex === course.modules.length - 1"
                @click="playModule(currentModuleIndex + 1)"
              >
                Selanjutnya →
              </button>
            </div>
          </div>

          <div class="lesson-tabs">
            <div class="tab-headers">
              <button class="tab-link active">Deskripsi Materi</button>
            
            </div>
            <div class="tab-panel">
              <p>
                Selamat datang di materi <strong>{{ currentModule.title }}</strong>. 
                Video ini adalah bagian dari kursus <em>{{ course.title }}</em>. 
                Simak dengan baik langkah-langkah yang dijelaskan agar Anda dapat merawat anabul kesayangan dengan lebih baik.
              </p>
              
              <div class="tip-box">
                <strong>💡 Tips Pro:</strong> Catat poin-poin penting atau praktikkan langsung sambil menonton video ini!
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>

  </div>
  
  <div v-else class="loading-state">
    <div class="spinner"></div>
    <p>Sedang memuat kelas...</p>
  </div>
</template>

<script setup>
import { store } from '@/store.js'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const course = ref(null)
const currentModuleIndex = ref(0)
const isLoading = ref(true)
// STATE DISKUSI
const activeTab = ref('description') // 'description' atau 'discussion'
const comments = ref([])
const newComment = ref('')
const isSending = ref(false)

// --- FUNGSI API DISKUSI ---

// 1. Ambil Komentar
const fetchComments = async () => {
  if (!currentModule.value.id) return
  try {
    const res = await fetch(`http://localhost:3000/modules/${currentModule.value.id}/comments`)
    if (res.ok) comments.value = await res.json()
  } catch (e) { console.error("Gagal load komentar:", e) }
}

// 2. Kirim Komentar
const postComment = async () => {
  if (!newComment.value.trim()) return
  if (!store.value.isLoggedIn) return alert("Login dulu untuk komentar!")

  isSending.value = true
  try {
    const res = await fetch(`http://localhost:3000/modules/${currentModule.value.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.value.token}`
      },
      body: JSON.stringify({ text: newComment.value })
    })

    if (res.ok) {
      newComment.value = '' // Reset input
      fetchComments() // Refresh daftar komentar
    }
  } catch (e) { alert("Gagal mengirim komentar") }
  finally { isSending.value = false }
}

// --- WATCHER ---
// Jika ganti video (currentModuleIndex berubah), ambil komentar baru
import { watch } from 'vue'
watch(currentModuleIndex, () => {
  if (activeTab.value === 'discussion') fetchComments()
})

// Modifikasi watch activeTab
watch(activeTab, (val) => {
  if (val === 'discussion') fetchComments()
})

const currentModule = computed(() => {
  if (!course.value || !course.value.modules) return {}
  return course.value.modules[currentModuleIndex.value]
})

const currentVideoId = computed(() => {
  return currentModule.value?.videoId || ''
})

const progress = computed(() => {
  if (!course.value || !course.value.modules) return 0
  // Hitung progress: (Index Modul Saat Ini / Total Modul) * 100
  // Kita asumsikan jika sedang menonton modul ke-2, berarti modul ke-1 sudah selesai.
  return ((currentModuleIndex.value) / course.value.modules.length) * 100
})

const playModule = (index) => {
  if (course.value && index >= 0 && index < course.value.modules.length) {
    currentModuleIndex.value = index
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/courses/${route.params.id}`)
    if (res.ok) {
      course.value = await res.json()
    }
  } catch (error) {
    console.error("Gagal ambil materi:", error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* FONTS */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

.classroom-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
  background-color: #F8F9FA; /* Light Gray Background untuk konten utama */
}

/* --- SIDEBAR (KIRI) --- */
.playlist-sidebar {
  width: 350px; /* Lebar sidebar */
  background: #FFFFFF;
  border-right: 1px solid #EAEAEA;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 50;
  box-shadow: 2px 0 15px rgba(0,0,0,0.02);
}

/* Header Sidebar */
.playlist-header {
  padding: 1.5rem;
  border-bottom: 1px solid #F0F0F0;
  background-color: #FFFFFF;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #636E72;
  text-decoration: none;
  margin-bottom: 1rem;
  transition: color 0.2s;
}
.back-btn:hover { color: #A9C47F; }

.course-title-sm {
  font-size: 1.1rem;
  font-weight: 800;
  color: #2D3436;
  margin-bottom: 1rem;
  line-height: 1.4;
}

/* Progress Bar */
.progress-wrapper { margin-top: 0.5rem; }
.progress-info {
  display: flex; justify-content: space-between; font-size: 0.8rem; color: #888; margin-bottom: 6px; font-weight: 600;
}
.progress-bar {
  height: 8px; background: #F1F2F6; border-radius: 4px; overflow: hidden;
}
.progress-fill {
  height: 100%; background: linear-gradient(90deg, #A9C47F, #8EAB65); border-radius: 4px; transition: width 0.4s ease;
}

/* Module List */
.module-list-container {
  flex: 1; overflow-y: auto;
}
/* Custom Scrollbar */
.module-list-container::-webkit-scrollbar { width: 6px; }
.module-list-container::-webkit-scrollbar-track { background: transparent; }
.module-list-container::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }

.module-list { list-style: none; padding: 0; margin: 0; }

.module-item {
  display: flex;
  gap: 15px;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #F9F9F9;
  cursor: pointer;
  transition: all 0.2s;
  align-items: flex-start;
  position: relative;
}

.module-item:hover { background-color: #FAFAFA; }

.module-item.active {
  background-color: #F0FDF4; /* Hijau sangat muda */
}
.module-item.active::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background-color: #A9C47F;
}

/* Icons Status */
.module-status {
  width: 28px; height: 28px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; font-size: 0.8rem; font-weight: bold;
}

.icon-playing { background: #A9C47F; color: white; box-shadow: 0 2px 8px rgba(169, 196, 127, 0.4); width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.icon-check { color: #2ECC71; font-size: 1rem; }
.icon-lock { color: #B2BEC3; border: 1px solid #DFE6E9; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; }

.module-info { display: flex; flex-direction: column; gap: 4px; }
.module-title { font-size: 0.95rem; font-weight: 700; color: #2D3436; line-height: 1.4; }
.module-duration { font-size: 0.75rem; color: #A0AEC0; }
.module-item.active .module-title { color: #4C6A4C; }

/* --- MAIN CONTENT (KANAN) --- */
.player-content {
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
}
.content-wrapper { max-width: 1000px; margin: 0 auto; }

/* Video Container */
.video-container {
  background: #000;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}
.video-wrapper {
  position: relative; padding-bottom: 56.25%; height: 0;
}
.video-wrapper iframe {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
}

/* Lesson Body */
.lesson-header {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;
}
.lesson-title {
  font-size: 1.8rem; font-weight: 800; color: #2D3436; flex: 1; min-width: 300px;
}

.lesson-nav { display: flex; gap: 1rem; }
.nav-btn {
  padding: 0.7rem 1.2rem; border-radius: 10px; border: 1px solid #E0E0E0; background: white;
  font-weight: 700; color: #636E72; cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; gap: 8px; font-size: 0.9rem;
}
.nav-btn:hover:not(:disabled) {
  border-color: #A9C47F; color: #A9C47F; background: #FAFAFA; transform: translateY(-2px);
}
.nav-btn:disabled { opacity: 0.5; cursor: not-allowed; background: #F9F9F9; }

/* Tabs */
.lesson-tabs { background: white; padding: 2rem; border-radius: 16px; border: 1px solid #F0F0F0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
.tab-headers {
  display: flex; gap: 2rem; border-bottom: 2px solid #F5F5F5; margin-bottom: 1.5rem;
}
.tab-link {
  background: none; border: none; padding-bottom: 1rem; font-size: 1rem; font-weight: 600; color: #95A5A6; cursor: pointer; position: relative; top: 2px; border-bottom: 2px solid transparent; transition: 0.3s;
}
.tab-link.active {
  color: #4C6A4C; border-color: #4C6A4C;
}
.tab-panel p { font-size: 1rem; line-height: 1.7; color: #4A5568; margin-bottom: 1rem; }
.tip-box {
  background: #FFF8E1; border-left: 4px solid #FFC107; padding: 1rem; border-radius: 4px; color: #5D4037; margin-top: 1.5rem;
}

/* Loading */
.loading-state {
  display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; background: #F8F9FA; color: #888;
}
.spinner {
  width: 50px; height: 50px; border: 5px solid #E0E0E0; border-top-color: #A9C47F; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 1024px) {
  .classroom-layout { flex-direction: column; }
  .playlist-sidebar {
    width: 100%; height: auto; max-height: 400px; position: relative; order: 2; border-right: none; border-top: 1px solid #eee;
  }
  .player-content { padding: 1.5rem; order: 1; }
  .lesson-header { flex-direction: column; }
  .lesson-nav { width: 100%; justify-content: space-between; }
}
</style>