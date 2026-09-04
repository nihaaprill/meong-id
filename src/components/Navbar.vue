<template>
  <header class="navbar-clean">
    <div class="container navbar-container">
      
      <div class="logo-wrapper">
        <RouterLink to="/" class="logo-link" @click="closeSidebar">
          <div class="logo-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="brand-icon">
              <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21S3 17.9 3 13.44C3 12.24 3.43 11.07 4 10c0 0-1.82-6.42-.42-7 1.39-.58 4.64.26 6.42 2.26.65-.17 1.33-.26 2-.26z"></path>
            </svg>
          </div>
          <span class="brand-name">Meong.id</span>
        </RouterLink>
      </div>

      <nav class="desktop-nav">
        
        <RouterLink to="/" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Beranda
        </RouterLink>

        <RouterLink to="/articles" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Artikel
        </RouterLink>

        <RouterLink to="/donation" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Donasi
        </RouterLink>

        <RouterLink to="/about-us" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          Tentang Kami
        </RouterLink>

      </nav>

      <div class="nav-actions">
        <RouterLink to="/login" class="btn-login-nav">
          Masuk <span class="arrow">→</span>
        </RouterLink>
        
        <button class="mobile-toggle" @click="toggleSidebar" :class="{ 'is-active': isSidebarOpen }">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>

      <div class="mobile-menu" :class="{ 'is-open': isSidebarOpen }">
        <div class="mobile-menu-header">
          <span class="mobile-brand">Meong.id</span>
          <button class="close-btn" @click="closeSidebar">✕</button>
        </div>
        <ul class="mobile-links">
          <li>
            <RouterLink to="/" @click="closeSidebar">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Beranda
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/articles" @click="closeSidebar">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
              Artikel
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/donation" @click="closeSidebar">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              Donasi
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/about-us" @click="closeSidebar">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Tentang Kami
            </RouterLink>
          </li>
          <li><RouterLink to="/login" @click="closeSidebar" class="mobile-login">🔐 Masuk</RouterLink></li>
        </ul>
      </div>

      <div class="nav-overlay" v-if="isSidebarOpen" @click="closeSidebar"></div>

    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<style scoped>
/* --- NAVBAR STYLE (Eterna Style Clean) --- */
.navbar-clean {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Logo */
.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.logo-icon-box {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #A9C47F, #8EAB65);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transform: rotate(-5deg);
  transition: transform 0.3s ease;
  box-shadow: 0 4px 10px rgba(169, 196, 127, 0.4);
}
.logo-link:hover .logo-icon-box { transform: rotate(0deg) scale(1.1); }
.brand-icon { width: 24px; height: 24px; }
.brand-name { font-size: 1.5rem; font-weight: 800; color: #2d3436; letter-spacing: -0.5px; }

/* Menu Desktop */
.desktop-nav {
  display: flex;
  gap: 2.5rem;
}

.nav-item {
  text-decoration: none;
  color: #636e72;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

/* ICON SVG STYLE (Sama dengan Sidebar) */
.nav-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2px; /* Garis tipis elegan */
  transition: transform 0.3s ease, stroke 0.3s ease;
  opacity: 0.7;
}

/* Hover Effects */
.nav-item:hover { color: #A9C47F; }
.nav-item:hover .nav-icon {
  transform: translateY(-2px); /* Ikon naik sedikit saat hover */
  opacity: 1;
  stroke: #A9C47F;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; width: 0; height: 2px;
  background-color: #A9C47F;
  transition: width 0.3s ease;
  border-radius: 2px;
}
.nav-item:hover::after, .nav-item.router-link-active::after { width: 100%; }
.nav-item.router-link-active { color: #2d3436; }
.nav-item.router-link-active .nav-icon { stroke: #2d3436; opacity: 1; }

/* Tombol Login */
.nav-actions { display: flex; align-items: center; gap: 1rem; }
.btn-login-nav {
  text-decoration: none;
  background-color: #2d3436;
  color: white;
  padding: 0.7rem 1.6rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: flex; align-items: center; gap: 8px;
}
.btn-login-nav:hover {
  background-color: #A9C47F;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(169, 196, 127, 0.3);
}
.arrow { transition: transform 0.2s; }
.btn-login-nav:hover .arrow { transform: translateX(3px); }

/* Mobile Menu */
.mobile-toggle { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 6px; padding: 5px; }
.bar { width: 28px; height: 3px; background-color: #2d3436; border-radius: 2px; transition: 0.3s; }

.mobile-menu {
  position: fixed; top: 0; right: -320px; width: 280px; height: 100vh;
  background: white; box-shadow: -5px 0 30px rgba(0,0,0,0.1);
  z-index: 2000; padding: 2rem;
  transition: right 0.4s cubic-bezier(0.77, 0, 0.175, 1);
  display: flex; flex-direction: column;
}
.mobile-menu.is-open { right: 0; }
.mobile-menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #f1f2f6; padding-bottom: 1rem; }
.mobile-brand { font-size: 1.5rem; font-weight: 800; color: #A9C47F; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #636e72; transition: transform 0.2s; }
.close-btn:hover { transform: rotate(90deg); color: #d63031; }

.mobile-links { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; }
.mobile-links a {
  text-decoration: none; color: #2d3436; font-size: 1.1rem; font-weight: 600;
  display: flex; align-items: center; gap: 10px;
  padding: 1rem; border-radius: 12px; transition: 0.2s;
  background-color: #fff; border: 1px solid transparent;
}
.mobile-links a:hover, .mobile-links a.router-link-active {
  background-color: #F6F4EE; color: #A9C47F; border-color: #A9C47F; padding-left: 1.5rem;
}
.mobile-links .nav-icon { width: 20px; height: 20px; }

.mobile-login { background-color: #2d3436 !important; color: white !important; text-align: center; margin-top: 1.5rem; justify-content: center; }
.nav-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1500; backdrop-filter: blur(4px); }

@media (max-width: 900px) {
  .desktop-nav { display: none; }
  .mobile-toggle { display: flex; }
  .btn-login-nav { display: none; }
  .navbar-container { padding: 0 1rem; }
}
</style>