<template>
  <div class="donation-list-page">
    
    <section class="page-header-modern">
      <div class="container">
        <h1>Bantu Mereka Bertahan ❤️</h1>
        <p>Pilih kampanye atau shelter yang ingin kamu bantu hari ini.</p>
      </div>
    </section>

    <div class="container content-wrapper">
      
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Sedang memuat daftar kebaikan...</p>
      </div>

      <div v-else-if="campaigns.length === 0" class="empty-state">
        <img src="/kucing.png" alt="Kosong" class="empty-img">
        <h3>Belum ada penggalangan dana aktif</h3>
        <p>Nantikan kampanye terbaru dari kami segera.</p>
      </div>

      <div v-else class="campaign-grid">
        <RouterLink 
          v-for="campaign in campaigns" 
          :key="campaign.id" 
          :to="`/donation/${campaign.id}`" 
          class="campaign-card"
        >
          <div class="card-image-wrapper">
            <img :src="campaign.image || '/shelter1.jpg'" :alt="campaign.title" class="card-img">
            <div v-if="campaign.verified" class="badge-verified">
              <span class="icon">✓</span> Terverifikasi
            </div>
          </div>
          
          <div class="card-body">
            <h3 class="campaign-title">{{ campaign.title }}</h3>
            <div class="organizer">
              <span class="org-icon">🏢</span> Yayasan Meong Indonesia
            </div>
            
            <div class="progress-container">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: calculatePercentage(campaign.collected, campaign.target) + '%' }"></div>
              </div>
              <div class="progress-labels">
                <div class="collected">
                  <span class="label">Terkumpul</span>
                  <span class="amount">Rp {{ formatPriceCompact(campaign.collected) }}</span>
                </div>
                <div class="days-left">
                  <span class="label">Sisa waktu</span>
                  <span class="value">∞ Hari</span>
                </div>
              </div>
            </div>

            <button class="btn-action">Donasi Sekarang</button>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const campaigns = ref([])
const isLoading = ref(true)

// Format Angka Kompak (1.5jt, 500rb)
const formatPriceCompact = (value) => {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1).replace(/\.0$/, '') + ' M';
  if (value >= 1000000) return (value / 1000000).toFixed(1).replace(/\.0$/, '') + ' Juta';
  if (value >= 1000) return (value / 1000).toFixed(0) + ' rb';
  return value;
}

const calculatePercentage = (collected, target) => {
  if (!target) return 0;
  const percent = (collected / target) * 100;
  return percent > 100 ? 100 : percent;
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/campaigns');
    if (res.ok) {
      campaigns.value = await res.json();
    }
  } catch (error) {
    console.error("Gagal ambil data:", error);
  } finally {
    isLoading.value = false;
  }
})
</script>

<style scoped>
/* --- Layout Dasar --- */
.donation-list-page {
  background-color: #F8F9FA; /* Abu sangat muda, bersih */
  min-height: 100vh;
  padding-bottom: 5rem;
  font-family: 'Nunito', sans-serif;
}

.container {
  max-width: 1100px; /* Sedikit lebih lebar agar grid 3 kolom pas */
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* --- Header Modern --- */
.page-header-modern {
  background: linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%);
  padding: 3rem 0 2rem;
  text-align: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
}

.page-header-modern h1 {
  font-size: 2rem;
  color: #2d3748;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.page-header-modern p {
  color: #718096;
  font-size: 1.1rem;
}

/* --- Content Wrapper --- */
.content-wrapper {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- Grid Layout --- */
.campaign-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* Responsif otomatis */
  gap: 2rem;
}

/* --- Campaign Card --- */
.campaign-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02), 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  height: 100%; /* Agar tinggi kartu sama rata */
}

.campaign-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #A9C47F;
}

/* Gambar Kartu */
.card-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.campaign-card:hover .card-img {
  transform: scale(1.05);
}

.badge-verified {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(33, 150, 243, 0.9);
  color: white;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 700;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Body Kartu */
.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.campaign-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  /* Batasi judul max 2 baris */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.organizer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 1.5rem;
}

/* Progress Section */
.progress-container {
  margin-top: auto; /* Dorong ke bawah agar rata */
}

.progress-track {
  height: 8px;
  background: #EDF2F7;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.8rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #A9C47F, #8EAB65);
  border-radius: 4px;
  transition: width 1s ease-out;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.2rem;
}

.collected .label, .days-left .label {
  font-size: 0.75rem;
  color: #A0AEC0;
  display: block;
  margin-bottom: 2px;
}

.collected .amount {
  font-size: 1rem;
  font-weight: 800;
  color: #4C6A4C; /* Hijau tua */
}

.days-left .value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #4a5568;
}

/* Tombol Aksi */
.btn-action {
  width: 100%;
  padding: 0.8rem;
  background: transparent;
  border: 1px solid #A9C47F;
  color: #A9C47F;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.campaign-card:hover .btn-action {
  background: #A9C47F;
  color: white;
}

/* --- Loading & Empty States --- */
.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

.spinner {
  width: 40px; height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #A9C47F;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-img {
  width: 150px;
  opacity: 0.5;
  margin-bottom: 1rem;
}

/* Responsif Mobile */
@media (max-width: 640px) {
  .campaign-grid {
    grid-template-columns: 1fr; /* 1 kolom di HP */
  }
  .page-header-modern {
    padding: 2rem 1rem;
  }
  .page-header-modern h1 {
    font-size: 1.75rem;
  }
}
</style>