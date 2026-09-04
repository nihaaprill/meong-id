<template>
  <main>
    
    <div v-if="store.isLoggedIn" class="dashboard-3d-container">
      <div class="container">
        
        <div class="welcome-header">
          <div class="text-content">
            <h1>Halo, <span>{{ store.user?.name || 'Pecinta Kucing' }}</span>! 👋</h1>
            <p>Selamat datang kembali di markas besar Meong.id.</p>
          </div>
          <div class="floating-cat">
            <img src="/kucing.png" alt="Cat 3D">
          </div>
        </div>

        <div class="grid-3d">
          <RouterLink to="/adoption" class="card-3d card-adoption">
            <div class="card-content">
              <span class="icon-3d">🏠</span>
              <h3>Adopsi Kucing</h3>
              <p>Temukan teman bulu baru untuk dirawat.</p>
            </div>
            <div class="card-bg"></div>
          </RouterLink>

          <RouterLink to="/report" class="card-3d card-report">
            <div class="card-content">
              <span class="icon-3d">📢</span>
              <h3>Lapor Hilang</h3>
              <p>Bantu kucing yang tersesat pulang.</p>
            </div>
            <div class="card-bg"></div>
          </RouterLink>

          <RouterLink to="/donation" class="card-3d card-donation">
            <div class="card-content">
              <span class="icon-3d">❤️</span>
              <h3>Donasi</h3>
              <p>Sisihkan rezeki untuk shelter kucing.</p>
            </div>
            <div class="card-bg"></div>
          </RouterLink>

          <RouterLink to="/articles" class="card-3d card-article">
            <div class="card-content">
              <span class="icon-3d">📚</span>
              <h3>Edukasi & Tips</h3>
              <p>Pelajari cara merawat anabul dengan benar dari para ahli.</p>
            </div>
            <div class="card-bg"></div>
          </RouterLink>
        </div>

      </div>
    </div>


    <div v-else>
      
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <h1>Welcome to Meong id</h1>
              <p class="hero-subtitle">
                Lapor dan Temukan Kucing kamu yang hilang
              </p>
              
              <p class="hero-description">
                kamu juga bisa bergabung dengan komunitas kucing di seluruh
                dunia Daftar Sekarang Gratis
              </p>
              <div class="hero-buttons">
               <RouterLink to="/signup" class="btn btn-primary">Daftar</RouterLink>
                <RouterLink to="/login" class="btn btn-outline">Login</RouterLink>
              </div>
              
            </div>
            <div class="hero-image">
              <img src="/kucing.png" alt="Happy rescued dog" />
            </div>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="container">
          <h2 class="section-title">Features</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">📚</div>
              <h3>Artikel</h3>
              <p>
                Temukan berbagai artikel menarik seputar dunia hewan peliharaan
                — mulai dari cara merawat hewan dengan baik hingga tips penting.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📢</div>
              <h3>Laporkan Hewan</h3>
              <p>
                Jika kamu melihat hewan terlantar, tersesat, atau membutuhkan
                pertolongan, segera beri tahu kami.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">👥</div>
              <h3>Komunitas</h3>
              <p>
                Bergabunglah dengan komunitas pecinta hewan dari berbagai
                daerah untuk saling berbagi cerita.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🏠</div>
              <h3>Adopsi</h3>
              <p>
                Lihat daftar hewan lucu dan penuh kasih yang sedang mencari
                rumah baru.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💚</div>
              <h3>Donasi</h3>
              <p>
                Bantu kami melanjutkan misi penyelamatan hewan melalui donasi.
              </p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🤝</div>
              <h3>Shelter</h3>
              <p>
                Belum siap untuk adopsi permanen? Kamu tetap bisa membantu
                dengan menjadi rumah sementara.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="community-section">
        <div class="community-content">
          <div class="community-icon">
            <img
              src="https://cdn-icons-png.flaticon.com/512/456/456212.png"
              alt="Komunitas"
            />
          </div>
          <div class="community-text">
            <h2>Bergabunglah Dengan <br /><span>Komunitas Kami</span></h2>
            <p>
              Dapatkan ruang berbagi pengalaman, cerita lucu, dan inspirasi
              bersama para pecinta kucing lainnya. Komunitas ini adalah tempat
              untuk tumbuh bersama!
            </p>
            <RouterLink to="/community" class="btn btn-primary">Gabung Komunitas →</RouterLink>
          </div>
        </div>
        <div class="paw-trail">🐾 🐾 🐾</div>
      </section>

      <section class="article-section" id="artikel">
        <h2>Artikel & Edukasi</h2>
        <p class="subtext">
          Bantu kamu dapat insight menarik dan edukasi seputar kucing
        </p>

        <div class="article-cards">
          <div class="card green">
            <img src="/artikel1.jpg" alt="Cara Merawat Kucing" />
            <h3>Cara Merawat Kucing</h3>
            <RouterLink to="/articles" class="read-more">Pelajari lebih lanjut →</RouterLink>
          </div>

          <div class="card blue">
            <img src="/artikel2.jpg" alt="Tips Kesehatan Kucing" />
            <h3>Tips Kesehatan Kucing</h3>
            <RouterLink to="/articles" class="read-more">Pelajari lebih lanjut →</RouterLink>
          </div>

          <div class="card blue">
            <img src="/artikel3.avif" alt="Kucing & Lingkungan" />
            <h3>Kucing & Lingkungan</h3>
            <RouterLink to="/articles" class="read-more">Pelajari lebih lanjut →</RouterLink>
          </div>
        </div>
      </section>

    </div>

  </main>
</template>

<script setup>
import { store } from '../store.js';
import { RouterLink } from 'vue-router';
</script>

<style scoped>
/* ========================================= */
/* CSS KHUSUS MEMBER (3D DASHBOARD)         */
/* ========================================= */
.dashboard-3d-container {
  padding: 3rem 0 5rem;
  background-color: #F6F4EE;
  min-height: 85vh;
  perspective: 1000px;
}

.welcome-header {
  display: flex; justify-content: space-between; align-items: center;
  background: linear-gradient(135deg, #4C6A4C 0%, #8EAB65 100%);
  padding: 3rem; border-radius: 25px; color: white; margin-bottom: 3rem;
  box-shadow: 0 15px 40px rgba(76, 106, 76, 0.3); position: relative; overflow: hidden;
  transform-style: preserve-3d; transition: transform 0.3s;
}
.welcome-header:hover { transform: translateY(-5px); }
.welcome-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800; }
.welcome-header span { color: #ffeb3b; }
.floating-cat img { width: 200px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); animation: float 3s ease-in-out infinite; }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }

.grid-3d { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
.card-3d {
  position: relative; background: white; height: 220px; border-radius: 20px; padding: 2rem;
  text-decoration: none; color: #333; display: flex; flex-direction: column; justify-content: center;
  transform-style: preserve-3d; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(255,255,255,0.5);
}
.card-3d:hover { transform: translateY(-15px) rotateX(5deg) scale(1.03); box-shadow: 0 25px 50px rgba(0,0,0,0.15); z-index: 10; }
.icon-3d { font-size: 3rem; margin-bottom: 1rem; display: block; transform: translateZ(20px); }
.card-content h3 { font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem; color: #2d3436; transform: translateZ(10px); }
.card-content p { font-size: 0.9rem; color: #636e72; transform: translateZ(10px); }
.card-adoption { background: linear-gradient(to bottom right, #fff, #e3f2fd); }
.card-report { background: linear-gradient(to bottom right, #fff, #ffebee); }
.card-donation { background: linear-gradient(to bottom right, #fff, #e8f5e9); }
.card-article { background: linear-gradient(to bottom right, #fff, #fff3e0); grid-column: span 1; }

@media (min-width: 900px) { .card-article { grid-column: span 3; } }
@media (max-width: 768px) {
  .welcome-header { flex-direction: column; text-align: center; gap: 1rem; }
  .floating-cat img { width: 150px; }
  .card-article { grid-column: span 1; }
}

/* ========================================= */
/* CSS KHUSUS TAMU (ORIGINAL STYLE)         */
/* ========================================= */

/* 1. Hero */
.hero { background-color: var(--light-cream); padding: 4rem 0; }
.hero-content { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.hero-text h1 { font-size: 3rem; color: var(--dark-green); margin-bottom: 1rem; font-family: poppins, sans-serif; }
.hero-subtitle { font-size: 1.5rem; color: var(--soft-green); margin-bottom: 1rem; font-weight: 600; }
.hero-description { font-size: 1.1rem; color: var(--text-black); margin-bottom: 2rem; }
.hero-buttons { display: flex; gap: 1rem; }
.hero-image img { width: 80%; }

/* 2. Features (Grid 3 kolom x 2 baris = 6 kartu) */
.features { padding: 4rem 0; }
.section-title { text-align: center; font-size: 2.5rem; color: var(--dark-green); margin-bottom: 3rem; }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.feature-card { background-color: var(--white); padding: 2rem; border-radius: 15px; text-align: center; box-shadow: var(--shadow); transition: all 0.3s; }
.feature-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); }
.feature-icon { font-size: 3rem; margin-bottom: 1rem; }
.feature-card h3 { font-size: 1.5rem; color: var(--dark-green); margin-bottom: 0.5rem; }

/* 3. Community Section */
.community-section {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 5rem 2rem; background: linear-gradient(to bottom, #f9f9f9, #fff);
}
.community-icon img { width: 120px; margin-bottom: 1rem; }
.community-text h2 { font-size: 2rem; color: #1f3523; margin-bottom: 1rem; }
.community-text span { color: #355e3b; }
.paw-trail { font-size: 1.2rem; margin-top: 2rem; }

/* 4. Article Section */
.article-section { background: #f5f5f5; text-align: center; padding: 4rem 2rem; }
.article-section h2 { font-size: 1.8rem; color: #1f3523; margin-bottom: 0.5rem; }
.article-cards { display: flex; justify-content: center; flex-wrap: wrap; gap: 2rem; margin-top: 2rem; }
.card { width: 260px; border-radius: 12px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; text-align: left; transition: transform 0.3s ease; }
.card:hover { transform: translateY(-8px); }
.card img { width: 100%; height: 160px; object-fit: cover; }
.card h3 { font-size: 1.1rem; color: #1f3523; margin: 1rem; }
.card .read-more { display: block; margin: 0 1rem 1rem; color: #1f3523; font-weight: 500; text-decoration: none; }
.card.green { border-top: 6px solid #8bc34a; }
.card.blue { border-top: 6px solid #2196f3; }

/* Responsive Tamu */
@media (max-width: 768px) {
  .hero-content { grid-template-columns: 1fr; text-align: center; }
  .features-grid { grid-template-columns: 1fr; }
  .hero-buttons { justify-content: center; }
  .hero-image img { width: 60%; margin: 0 auto; }
}
</style>