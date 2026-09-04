<template>
  <div id="app" :class="{ 
      'logged-in-layout': store.isLoggedIn, 
      'sidebar-open': store.isLoggedIn && store.isSidebarOpen 
    }">
    
    <Toast ref="toastRef" />

    <ChatWidget />

    <button v-if="store.isLoggedIn" @click="toggleSidebar" class="global-toggle-btn">
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
    </button>

    <Navbar v-if="!store.isLoggedIn" />
    <Sidebar v-if="store.isLoggedIn" />

    <main>
      <RouterView />
    </main>
    
    <FooterComp />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Navbar from './components/Navbar.vue'
import FooterComp from './components/Footer.vue'
import Sidebar from './components/Sidebar.vue'
import Toast from './components/ui/Toast.vue'
import ChatWidget from './components/ChatWidget.vue' 
import { store, toastState } from './store.js'

// --- LOGIKA TOAST ---
// ref(null) ini akan otomatis tersambung ke <Toast ref="toastRef"> di template
const toastRef = ref(null)

// Dengarkan sinyal dari store.js
watch(() => toastState.trigger, (newVal) => {
  // Pastikan komponen Toast sudah siap (tidak null) sebelum dipanggil
  if (newVal && toastRef.value) {
    toastRef.value.add(newVal.message, newVal.type)
  }
})

// --- LOGIKA SIDEBAR ---
const toggleSidebar = () => {
  store.value.isSidebarOpen = !store.value.isSidebarOpen
}
</script>

<style>
/* Import style.css global-mu */
@import './assets/style.css';

/* ... (style #app dan main lama) ... */
#app { 
  min-height:100vh; 
  display:flex; 
  flex-direction:column; 
  overflow-x: hidden;  
  /* overflow untuk ngilangin sampign */
}
main { 
  flex:1; 
  padding-top:0; 
  transition: margin-left 0.3s ease;
}

/* Style Sidebar & Footer saat Login */
main, .footer {
  transition: margin-left 0.3s ease;
}

#app.logged-in-layout:not(.sidebar-open) .sidebar {
  transform: translateX(-100%);
}
/* ubah disini kalo sidebarnyaa gk sesuai */
#app.logged-in-layout.sidebar-open main {
  margin-left: 50px; /* Sesuaikan dengan lebar sidebar barumu */
  padding-top: 0;
  padding: 0; 
}

#app.logged-in-layout.sidebar-open .footer {
  margin-left: 260px; 
}

/* Tombol Hamburger */
.global-toggle-btn {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1100;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
}

.hamburger-bar {
  display: block;
  width: 20px;
  height: 2px;
  background-color: #333;
  margin: 4px 0;
}

/* Responsive HP */
@media (max-width: 768px) {
  #app.logged-in-layout.sidebar-open main,
  #app.logged-in-layout.sidebar-open .footer {
    margin-left: 0; /* Di HP konten tidak perlu geser */
  }
}
</style>