<template>
  <div class="detail-page" v-if="campaign">
    <div class="hero-banner">
      <img :src="campaign.image || '/shelter1.jpg'" :alt="campaign.title">
      <div class="overlay"></div>
      <RouterLink to="/donation" class="back-btn">← Kembali</RouterLink>
    </div>

    <div class="container content-container">
      <div class="detail-card">
        <h1 class="title">{{ campaign.title }}</h1>
        <p class="org">Verified Shelter • Yayasan Meong Indonesia</p>

        <div class="stats-row">
          <div class="stat">
            <span class="amount">Rp {{ formatPrice(campaign.collected) }}</span>
            <span class="label">Terkumpul dari target Rp {{ formatPriceCompact(campaign.target) }}</span>
          </div>
          <div class="progress-bar">
             <div class="progress-fill" :style="{ width: calculatePercentage(campaign.collected, campaign.target) + '%' }"></div>
          </div>
          <p class="donor-count">{{ campaign._count?.donations || 0 }} Donatur telah berpartisipasi</p>
        </div>

        <hr class="divider">

        <div class="description">
          <h3>Cerita Penggalangan Dana</h3>
          <p class="desc-text">{{ campaign.description }}</p>
        </div>
      </div>
    </div>

    <div class="sticky-footer">
      <div class="container">
        <RouterLink :to="`/donation/${campaign.id}/pay`" class="btn-donate-big">
          Donasi Sekarang
        </RouterLink>
      </div>
    </div>
  </div>
  
  <div v-else class="loading-screen">Memuat...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const campaign = ref(null)

const formatPrice = (value) => new Intl.NumberFormat('id-ID').format(value)
const formatPriceCompact = (value) => {
  if (value >= 1000000) return (value / 1000000).toFixed(0) + ' Juta';
  return value;
}
const calculatePercentage = (collected, target) => {
  if (!target) return 0;
  return Math.min((collected / target) * 100, 100);
}

onMounted(async () => {
  try {
    // Ambil detail kampanye berdasarkan ID dari URL
    const res = await fetch(`http://localhost:3000/campaigns/${route.params.id}`)
    if (res.ok) {
      campaign.value = await res.json()
    }
  } catch (e) { console.error(e) }
})
</script>

<style scoped>
.detail-page { background-color: #F6F4EE; min-height: 100vh; padding-bottom: 100px; }
.hero-banner { position: relative; height: 300px; width: 100%; }
.hero-banner img { width: 100%; height: 100%; object-fit: cover; }
.overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent); }
.back-btn { position: absolute; top: 20px; left: 20px; color: white; text-decoration: none; font-weight: bold; background: rgba(0,0,0,0.4); padding: 0.5rem 1rem; border-radius: 20px; backdrop-filter: blur(4px); }

.content-container { margin-top: -3rem; position: relative; z-index: 10; padding: 0 1rem; }
.detail-card { background: white; border-radius: 20px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }

.title { font-size: 1.8rem; color: #333; margin-bottom: 0.5rem; line-height: 1.3; }
.org { color: #2196F3; font-weight: 600; font-size: 0.9rem; margin-bottom: 1.5rem; }

.stats-row { background: #f9f9f9; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; }
.amount { font-size: 1.5rem; font-weight: 800; color: #A9C47F; display: block; margin-bottom: 0.2rem; }
.label { font-size: 0.85rem; color: #666; }
.progress-bar { height: 8px; background: #e0e0e0; border-radius: 4px; margin: 1rem 0 0.5rem; overflow: hidden; }
.progress-fill { height: 100%; background: #A9C47F; border-radius: 4px; }
.donor-count { font-size: 0.85rem; color: #555; font-weight: 600; }

.divider { border: none; border-top: 1px solid #eee; margin: 2rem 0; }
.description h3 { font-size: 1.2rem; margin-bottom: 1rem; color: #333; }
.desc-text { line-height: 1.8; color: #555; white-space: pre-line; }

.sticky-footer { position: fixed; bottom: 0; left: 0; width: 100%; background: white; padding: 1rem; box-shadow: 0 -4px 20px rgba(0,0,0,0.05); z-index: 100; text-align: center; }
.btn-donate-big { background: #A9C47F; color: white; text-decoration: none; font-weight: bold; font-size: 1.1rem; padding: 0.8rem 2rem; border-radius: 50px; display: block; max-width: 500px; margin: 0 auto; transition: 0.2s; }
.btn-donate-big:hover { background: #4C6A4C; transform: translateY(-2px); }
</style>