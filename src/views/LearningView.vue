<template>
  <main class="learning-page">
    
    <section class="academy-hero">
      <div class="container hero-container">
        <div class="hero-text">
          <span class="tagline">✨ E-Learning Khusus Pecinta Kucing</span>
          <h1>Meong Academy <span class="icon-grad">🎓</span></h1>
          <p>
            Tingkatkan wawasanmu tentang dunia anabul. Dari perawatan dasar hingga 
            penanganan medis darurat, semua ada di sini.
          </p>
        </div>
        <div class="hero-decoration">
          <div class="circle-1"></div>
          <div class="circle-2"></div>
        </div>
      </div>
    </section>

    <section class="course-section">
      <div class="container">
        
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Menyiapkan materi...</p>
        </div>

        <div v-else class="course-grid">
          
          <div v-for="course in coursesList" :key="course.id" class="course-card">
            
            <div class="card-thumb">
              <img :src="course.image" :alt="course.title">
              <div class="overlay">
                <span class="play-icon">▶</span>
              </div>
              <span class="badge-level" :class="getLevelClass(course.level)">
                {{ course.level }}
              </span>
            </div>

            <div class="card-content">
              <div class="card-meta">
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                  {{ course.modules.length }} Video
                </span>
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {{ course.duration }}
                </span>
              </div>

              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-desc">{{ truncate(course.description, 80) }}</p>

              <div class="card-footer">
                <RouterLink :to="`/learning/${course.id}`" class="btn-start">
                  Mulai Belajar
                  <span class="arrow">→</span>
                </RouterLink>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const coursesList = ref([])
const isLoading = ref(true)

// Helper: Warna Badge Level
const getLevelClass = (level) => {
  if (level === 'Pemula') return 'bg-green';
  if (level === 'Menengah') return 'bg-blue';
  return 'bg-purple';
}

// Helper: Potong Teks Panjang
const truncate = (text, length) => {
  if(!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/courses')
    if (res.ok) {
      coursesList.value = await res.json()
    }
  } catch (error) {
    console.error("Gagal ambil kursus:", error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* --- GLOBAL --- */
.learning-page {
  background-color: #F8F9FA; /* Abu sangat muda, bersih */
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
  padding-bottom: 5rem;
}

/* --- HERO SECTION --- */
.academy-hero {
  background: #F6F4EE;
  padding: 1rem 0;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  box-shadow: 0 10px 30px rgba(76, 106, 76, 0.2);
}

.hero-text { position: relative; z-index: 2; color:#000000; }

.tagline {
  display: inline-block;
  background:#4C6A4C;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 1rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.2);
}

.academy-hero h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
  color:#4C6A4C;
}

.academy-hero p {
  font-size: 1.15rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* Dekorasi Abstrak */
.hero-decoration div {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
}
.circle-1 { width: 300px; height: 300px; top: -50px; left: -50px; }
.circle-2 { width: 400px; height: 400px; bottom: -100px; right: -50px; }

/* --- COURSE GRID --- */
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

/* --- CARD STYLE --- */
.course-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  position: relative;
  top: 0;
}

.course-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  border-color: #A9C47F;
}

/* Thumbnail Image */
.card-thumb {
  height: 200px;
  position: relative;
  overflow: hidden;
}
.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.course-card:hover .card-thumb img {
  transform: scale(1.1);
}

/* Overlay Play Icon */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.course-card:hover .overlay { opacity: 1; }
.play-icon {
  font-size: 2rem;
  color: white;
  background: rgba(255,255,255,0.2);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  border: 2px solid white;
}

/* Badge Level */
.badge-level {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 30px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
.bg-green { background: #2ecc71; }
.bg-blue { background: #3498db; }
.bg-purple { background: #9b59b6; }

/* Content */
.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 0.8rem;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.course-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #2d3436;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.course-desc {
  font-size: 0.95rem;
  color: #636e72;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1; /* Push footer down */
}

.card-footer {
  margin-top: auto;
}

.btn-start {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f4f7f6;
  color: #4C6A4C;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.2s ease;
}

.btn-start:hover {
  background-color: #A9C47F;
  color: white;
  padding-right: 1.5rem; /* Efek geser panah */
}
.arrow { transition: transform 0.2s; }
.btn-start:hover .arrow { transform: translateX(5px); }

/* Loading */
.loading-state { text-align: center; padding: 4rem; color: #888; }
.spinner { width: 40px; height: 40px; border: 4px solid #eee; border-top-color: #A9C47F; border-radius: 50%; margin: 0 auto 1rem; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Responsive */
@media (max-width: 768px) {
  .academy-hero { padding: 3rem 1rem; border-radius: 0 0 30px 30px; }
  .academy-hero h1 { font-size: 2rem; }
}
</style>