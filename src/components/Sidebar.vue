<template>
  <aside class="sidebar" :class="{ 'collapsed': !isOpen }">
    
    <div class="sidebar-header">
      <RouterLink to="/" class="logo-link">
        <div class="logo-icon-box">🐾</div>
        <span class="logo-text" v-if="isOpen">Meong.id</span>
      </RouterLink>
    </div>

    <nav class="sidebar-menu">
      
      <RouterLink to="/" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span class="text" v-if="isOpen">Beranda</span>
      </RouterLink>

      <RouterLink to="/learning" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
        <span class="text" v-if="isOpen">Kelas Online</span>
      </RouterLink>

      <RouterLink to="/report" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <span class="text" v-if="isOpen">Lapor Kucing</span>
      </RouterLink>

      <RouterLink to="/adoption" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <span class="text" v-if="isOpen">Adopsi</span>
      </RouterLink>

      <RouterLink to="/hospital-shelter" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
        <span class="text" v-if="isOpen">RS & Shelter</span>
      </RouterLink>

      <RouterLink to="/articles" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
        <span class="text" v-if="isOpen">Artikel</span>
      </RouterLink>

      <RouterLink to="/donation" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        <span class="text" v-if="isOpen">Donasi</span>
      </RouterLink>

      <RouterLink to="/community" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span class="text" v-if="isOpen">Komunitas</span>
      </RouterLink>

      <RouterLink to="/shop" class="nav-item" active-class="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <span class="text" v-if="isOpen">Shop</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="avatar">
          <img :src="store.user?.avatar || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'" alt="User">
        </div>
        <div class="user-info" v-if="isOpen">
          <p class="user-name">{{ store.user?.name || 'User' }}</p>
          <RouterLink to="/profile" class="user-link">Lihat Profil</RouterLink>
        </div>
      </div>
    </div>

  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { store } from '../store.js'

const isOpen = computed(() => store.value.isSidebarOpen)
</script>

<style scoped>
/* --- 1. Variabel Warna --- */
.sidebar {
  --bg-color: #F6F4EE; /* Cream agar menyatu dengan halaman */
  --text-color: #64748B;
  --active-bg: #A9C47F;
  --active-text: #FFFFFF;
  --hover-bg: #ffffff;
  --border-color: #E2E8F0;
}

/* --- 2. Layout Sidebar Utama --- */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh; /* Full tinggi layar */
  width: 260px;
  background-color: var(--bg-color);
  border-right: 1px solid var(--border-color);
  
  /* Flexbox Kunci Layout Rapi */
  display: flex;
  flex-direction: column; 
  
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  padding: 1.5rem 1rem;
  overflow: hidden; /* Mencegah scroll ganda di body */
}

.sidebar.collapsed {
  width: 80px;
  padding: 1.5rem 0.75rem;
}

/* --- 3. Header (Logo) --- */
.sidebar-header {
  margin-bottom: 1.5rem;
  height: 40px;
  display: flex;
  align-items: center;
  /* ini tulisannya */
  justify-content: end;
  /* Agar header tidak ikut mengecil saat di-scroll */
  flex-shrink: 0; 
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #333;
  font-weight: 800;
  font-size: 1.5rem;
  white-space: nowrap;
}

.logo-icon-box {
  font-size: 1.8rem;
  min-width: 40px;
  text-align: center;
}

/* --- 4. Menu Area (SCROLLABLE) --- */
.sidebar-menu {
  /* KUNCI SCROLLING: */
  flex-grow: 1; /* Mengisi sisa ruang kosong */
  overflow-y: auto; /* Scroll vertikal jika konten panjang */
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  /* Sembunyikan scrollbar tapi tetap bisa scroll (opsional) */
  scrollbar-width: thin; 
  padding-right: 5px; /* Jarak biar scrollbar ga nempel */
}

/* Style Scrollbar (Chrome/Safari) */
.sidebar-menu::-webkit-scrollbar { width: 4px; }
.sidebar-menu::-webkit-scrollbar-track { background: transparent; }
.sidebar-menu::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

/* --- 5. Menu Items --- */
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.8rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0; /* Jangan biarkan item menyusut */
}

.nav-item:hover {
  background-color: var(--hover-bg);
  color: #333;
  transform: translateX(4px);
}

.nav-item.active {
  background-color: var(--active-bg);
  color: var(--active-text);
  box-shadow: 0 4px 10px rgba(169, 196, 127, 0.3);
}

.nav-icon {
  width: 22px;
  height: 22px;
  min-width: 22px; /* Agar ikon tidak gepeng */
  stroke-width: 2px;
}

/* --- 6. Footer (Profile) --- */
.sidebar-footer {
  margin-top: auto; /* Dorong ke paling bawah */
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  flex-shrink: 0; /* Jangan mengecil */
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.5rem;
  background-color: rgba(255,255,255,0.5);
  border-radius: 12px;
  overflow: hidden;
}

.avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #A9C47F;
}

.user-info {
  display: flex;
  flex-direction: column;
  white-space: nowrap;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #333;
}

.user-link {
  font-size: 0.75rem;
  color: #A9C47F;
  text-decoration: none;
}
</style>