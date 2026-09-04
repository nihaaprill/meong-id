<template>
  <div class="shelter-detail-page">
    
    <div v-if="isLoading" class="loading-wrapper">
      <div class="spinner"></div>
      <p>Memuat data...</p>
    </div>

    <div v-else-if="place" class="content-wrapper">
      
      <div class="banner-image">
        <img :src="place.image || '/shelter1.jpg'" :alt="place.title">
        <div class="overlay"></div>
        
        <!-- <RouterLink to="/hospital-shelter" class="back-btn">← Kembali</RouterLink> -->
        
        <div class="container banner-content">
          <span class="badge-type" :class="place.type.toLowerCase()">
            {{ place.type === 'HOSPITAL' ? 'Rumah Sakit' : 'Shelter' }}
          </span>
          <h1>{{ place.title }}</h1>
          <p class="location">📍 {{ place.location || 'Lokasi tidak tersedia' }}</p>
        </div>
      </div>

      <div class="container main-body">
        <div class="grid-layout">
          
          <div class="details-column">
            <div class="card-box info-card">
              <h3 class="section-title">Tentang {{ place.type === 'HOSPITAL' ? 'Rumah Sakit' : 'Shelter' }} Ini</h3>
              <p class="description">{{ place.description }}</p>
              
              <div class="info-list">
                <div class="info-item">
                  <span class="label">Kontak:</span>
                  <span class="value">{{ place.contact || '-' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Status Verifikasi:</span>
                  <span class="value verified" v-if="place.verified">✅ Terverifikasi</span>
                  <span class="value unverified" v-else>❌ Belum Terverifikasi</span>
                </div>
              </div>
            </div>

            <div class="card-box map-card">
              <h3 class="section-title">Lokasi</h3>
              <div class="map-container">
                 <iframe 
                  width="100%" 
                  height="250" 
                  frameborder="0" 
                  style="border:0; border-radius: 12px;" 
                  :src="`https://maps.google.com/maps?q=${encodeURIComponent(place.location || place.title)}&t=&z=15&ie=UTF8&iwloc=&output=embed`" 
                  allowfullscreen>
                </iframe>
              </div>
              <a 
                :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.location || place.title)}`" 
                target="_blank" 
                class="btn-rute"
              >
                📍 Buka Rute di Google Maps
              </a>
            </div>
          </div>

          <div class="action-column">
            <div class="action-card sticky">
              
              <div v-if="place.type === 'SHELTER' || place.type === 'EVENT'">
                <h3>Bantu Mereka Bertahan</h3>
                <div class="donation-progress" v-if="place.target > 0">
                  <div class="progress-bar">
                    <div class="fill" :style="{ width: (place.collected / place.target * 100) + '%' }"></div>
                  </div>
                  <p class="progress-text">
                    Terkumpul <strong>Rp {{ formatPrice(place.collected) }}</strong> <br>
                    <small>dari target Rp {{ formatPrice(place.target) }}</small>
                  </p>
                </div>

                <div class="buttons">
                  <RouterLink :to="`/donation/${place.id}/pay`" class="btn btn-primary btn-block">
                    ❤️ Donasi Sekarang
                  </RouterLink>
                </div>
              </div>

              <div v-else>
                <h3>Butuh Layanan Medis?</h3>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">
                  Hubungi rumah sakit ini untuk konsultasi atau keadaan darurat.
                </p>
                <div class="buttons">
                   <a v-if="place.contact" :href="`tel:${place.contact}`" class="btn btn-primary btn-block">
                    📞 Hubungi Sekarang
                  </a>
                  <a v-if="place.contact" :href="`https://wa.me/${formatPhone(place.contact)}`" target="_blank" class="btn btn-outline btn-block">
                    💬 Chat WhatsApp
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const place = ref(null)
const isLoading = ref(true)

const formatPrice = (value) => new Intl.NumberFormat('id-ID').format(value)
const formatPhone = (phone) => phone ? phone.replace(/\D/g, '') : ''

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/campaigns/${route.params.id}`)
    if (res.ok) {
      place.value = await res.json()
    }
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false;
  }
})
</script>

<style scoped>
.shelter-detail-page { background-color: #F5F7FA; min-height: 100vh; padding-bottom: 5rem; font-family: 'Nunito', sans-serif; }

.loading-wrapper {
  height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #888;
}
.spinner {
  width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #A9C47F; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Banner Area */
.banner-image { position: relative; height: 400px; width: 100%; overflow: hidden; }
.banner-image img { width: 100%; height: 100%; object-fit: cover; }
.overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%); }

/* .back-btn {
  position: absolute; top: 20px; left: 20px; background: rgba(255,255,255,0.2); backdrop-filter: blur(5px);
  color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-weight: 600; transition: 0.2s;
  border: 1px solid rgba(255,255,255,0.3);
}
.back-btn:hover { background: rgba(255,255,255,0.4); } */

.banner-content {
  position: absolute;  bottom: 0; left: 0; right: 0; padding: 9rem 1rem; color: white; z-index: 10;
  max-width: 1200px; margin: 0 auto;
}
.banner-content h1 { font-size: 2.8rem; margin-bottom: 0.5rem; font-weight: 800; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.location { font-size: 1.2rem; opacity: 0.95; font-weight: 500; }

.badge-type { 
  background: #4C6A4C; color: white; padding: 0.4rem 1rem; border-radius: 30px; 
  font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 1rem; display: inline-block;
  letter-spacing: 1px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}
.badge-type.hospital { background: #3498db; }

/* Layout Grid */
.main-body { margin-top: -4rem; position: relative; z-index: 20; }
.grid-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }

/* Cards */
.card-box { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); margin-bottom: 2rem; }
.section-title { font-size: 1.4rem; font-weight: 700; color: #2d3748; margin-bottom: 1.5rem; border-bottom: 2px solid #f0f0f0; padding-bottom: 0.8rem; }

.description { line-height: 1.8; color: #4a5568; font-size: 1.05rem; white-space: pre-line; }

.info-list { margin-top: 2rem; border-top: 1px dashed #e2e8f0; padding-top: 1.5rem; }
.info-item { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 1rem; }
.info-item .label { color: #718096; }
.info-item .value { font-weight: 700; color: #2d3748; }
.verified { color: #27ae60; }

/* Map */
.map-container { border-radius: 12px; overflow: hidden; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.btn-rute { 
  display: block; text-align: center; padding: 0.8rem; background: #f7fafc; color: #4a5568; 
  text-decoration: none; border-radius: 8px; font-weight: 600; border: 1px solid #e2e8f0; transition: 0.2s;
}
.btn-rute:hover { background: #edf2f7; color: #2d3748; }

/* Action Column */
.action-card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #f0f0f0; }
.action-card.sticky { position: sticky; top: 100px; }
.action-card h3 { font-size: 1.3rem; margin-bottom: 1rem; color: #2d3748; }

.donation-progress { margin-bottom: 1.5rem; background: #f8f9fa; padding: 1rem; border-radius: 10px; }
.progress-bar { height: 10px; background: #e2e8f0; border-radius: 5px; overflow: hidden; margin-bottom: 0.8rem; }
.fill { height: 100%; background: linear-gradient(90deg, #A9C47F, #8EAB65); transition: width 1s ease; }
.progress-text { font-size: 0.95rem; color: #4a5568; line-height: 1.4; }
.progress-text strong { color: #4C6A4C; font-size: 1.1rem; }

.buttons { display: flex; flex-direction: column; gap: 0.8rem; }
.btn-block { width: 100%; display: block; text-align: center; padding: 0.9rem; border-radius: 10px; text-decoration: none; font-weight: 700; transition: 0.2s; }

.btn-primary { background: #A9C47F; color: white; border: none; box-shadow: 0 4px 10px rgba(169, 196, 127, 0.4); }
.btn-primary:hover { background: #8EAB65; transform: translateY(-2px); }

.btn-outline { background: transparent; border: 2px solid #A9C47F; color: #A9C47F; }
.btn-outline:hover { background: #f0fdf4; }

/* Responsive */
@media (max-width: 900px) {
  .grid-layout { grid-template-columns: 1fr; }
  .banner-image { height: 280px; }
  .banner-content h1 { font-size: 2rem; }
  .main-body { margin-top: 1rem; }
}
</style>