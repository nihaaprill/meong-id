<template>
  <transition-group name="toast-anim" tag="div" class="toast-container">
    <div 
      v-for="toast in toasts" 
      :key="toast.id" 
      class="toast" 
      :class="toast.type"
    >
      <div class="icon-wrapper">
        <span v-if="toast.type === 'success'">Check</span>
        <span v-else>!</span>
      </div>
      
      <div class="content">
        <span class="title">{{ toast.type === 'success' ? 'Berhasil' : 'Perhatian' }}</span>
        <span class="message">{{ toast.message }}</span>
      </div>

      <button class="close-btn" @click="remove(toast.id)">✕</button>
    </div>
  </transition-group>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let idCounter = 0

const add = (message, type = 'success') => {
  const id = idCounter++
  toasts.value.push({ id, message, type })
  setTimeout(() => remove(id), 4000)
}

const remove = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

defineExpose({ add })
</script>

<style scoped>
/* --- CONTAINER: TENGAH ATAS --- */
.toast-container {
  position: fixed;
  top: 200px; /* Jarak dari atas */
  left: 65%;
  transform: translateX(-50%); /* Trik agar benar-benar di tengah */
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  pointer-events: none; /* Agar area kosong di sekitar toast bisa diklik */
}

/* --- CARD STYLE: ELEGANT PILL --- */
.toast {
  pointer-events: auto; /* Kembalikan klik untuk toastnya */
  background: rgba(255, 255, 255, 0.95); /* Sedikit transparan */
  backdrop-filter: blur(8px); /* Efek blur di belakangnya (Glassmorphism) */
  padding: 0.8rem 1.2rem;
  border-radius: 50px; /* Bentuk Kapsul/Pill */
  box-shadow: 0 8px 25px rgba(76, 106, 76, 0.15); /* Shadow lembut kehijauan */
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 320px;
  max-width: 90vw;
  border: 1px solid #f0f0f0;
}

/* --- ICON WRAPPER --- */
.icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  flex-shrink: 0;
}

/* Warna Khusus Brand Meong.id */
.toast.success .icon-wrapper {
  background-color: #E8F5E9; /* Hijau muda lembut */
  color: #4C6A4C; /* Dark Green brand */
  font-size: 0.9rem; /* Kecilin dikit ikon check-nya */
}
.toast.success .icon-wrapper span::before {
  content: '✓'; /* Pakai simbol centang CSS */
}

.toast.error .icon-wrapper {
  background-color: #FFEBEE; 
  color: #D32F2F;
}

/* --- TEXT --- */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.title {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.toast.success .title { color: #A9C47F; } /* Soft Green Brand */
.toast.error .title { color: #ef5350; }

.message {
  font-size: 0.9rem;
  color: #444;
  font-weight: 600;
}

/* --- CLOSE BUTTON --- */
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #aaa;
  font-size: 1rem;
  padding: 0 5px;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #333;
}

/* --- ANIMASI: SLIDE DOWN & BOUNCE --- */
.toast-anim-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Efek membal */
}
.toast-anim-leave-active {
  transition: all 0.3s ease-in;
}

.toast-anim-enter-from,
.toast-anim-leave-to {
  opacity: 0;
  transform: translateY(-30px); /* Muncul dari atas */
}
</style>