<template>
  <main>
    <section class="page-header">
      <div class="container">
        <h1>Rumah Sakit & Shelter Kucing</h1>
        <p>Temukan tempat terbaik untuk merawat dan menyelamatkan kucing kesayanganmu di seluruh Indonesia.</p>
      </div>
    </section>

    <section class="adoption-section">
      <div class="container">
        
        <div class="adoption-filters">
          <div class="search-bar">
             <input v-model="searchQuery" type="text" placeholder="🔍 Cari nama atau lokasi..." class="filter-input">
          </div>
          <select v-model="selectedType" class="filter-select">
            <option value="ALL">Semua Tipe</option>
            <option value="HOSPITAL">🏥 Rumah Sakit</option>
            <option value="SHELTER">🏠 Shelter</option>
          </select>
        </div>

        <div v-if="isLoading" class="loading-state">
          <p>Sedang memuat data...</p>
        </div>

        <div v-else class="adoption-grid">
          <div v-for="place in filteredPlaces" :key="place.id" class="pet-card">
            <div class="image-wrapper">
               <img :src="place.image || '/shelter1.jpg'" :alt="place.title">
               <span class="type-tag" :class="place.type.toLowerCase()">
                 {{ place.type === 'HOSPITAL' ? 'RS Hewan' : 'Shelter' }}
               </span>
            </div>
            
            <div class="pet-info">
              <h3>{{ place.title }}</h3>
              <p class="pet-breed">📍 {{ place.location }}</p>
              <p class="pet-description">{{ truncateText(place.description, 80) }}</p>

              <div class="pet-buttons">
                
                <a 
                  :href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.location)}`" 
                  target="_blank" 
                  class="btn btn-outline btn-full"
                >
                  🗺️ Petunjuk Arah
                </a>

                <RouterLink 
                  v-if="place.type === 'SHELTER'"
                  :to="`/donation/${place.id}/pay`" 
                  class="btn btn-primary btn-full"
                >
                  ❤️ Donasi
                </RouterLink>

                <a 
                  v-if="place.type === 'HOSPITAL' && place.contact"
                  :href="`tel:${place.contact}`" 
                  class="btn btn-secondary btn-full"
                >
                  📞 Hubungi
                </a>

                <RouterLink :to="`/hospital-shelter/${place.id}`" class="lihat-detail">
                  Lihat Detail Selengkapnya →
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
import { ref, computed, onMounted } from "vue";

const places = ref([]);
const isLoading = ref(true);
const searchQuery = ref("");
const selectedType = ref("ALL");

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/campaigns');
    const data = await res.json();
    // Filter hanya HOSPITAL dan SHELTER
    places.value = data.filter(item => item.type === 'HOSPITAL' || item.type === 'SHELTER');
  } catch (e) {
    console.error("Gagal load data", e);
  } finally {
    isLoading.value = false;
  }
});

const filteredPlaces = computed(() => {
  return places.value.filter((place) => {
    const matchType = selectedType.value === "ALL" || place.type === selectedType.value;
    const query = searchQuery.value.toLowerCase();
    const matchSearch = place.title.toLowerCase().includes(query) || 
                        (place.location && place.location.toLowerCase().includes(query));
    return matchType && matchSearch;
  });
});

const truncateText = (text, len) => {
  if(!text) return '';
  return text.length > len ? text.substring(0, len) + '...' : text;
}
</script>

<style scoped>
/* --- STYLE BAWAAN (YANG KAMU SUKA) --- */
.page-header {
  text-align: center;
  background: #f8f7f3;
  padding: 4rem 1rem 3rem;
  border-bottom: 1px solid #e5e5e5;
}
.page-header h1 { color: var(--dark-green); font-size: 2.5rem; font-weight: 700; }

/* --- GRID & CARD --- */
.adoption-section { padding: 4rem 0; }
.adoption-filters { display: flex; gap: 1rem; margin-bottom: 2rem; justify-content: center; flex-wrap: wrap; }
.filter-input, .filter-select { padding: 0.75rem 1.2rem; border: 2px solid #ddd; border-radius: 10px; }
.filter-select { border-color: #A9C47F; background: white; color: #4C6A4C; font-weight: bold; }

.adoption-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }

.pet-card {
  background: white; border: 1px solid #eee; border-radius: 15px; overflow: hidden;
  transition: transform 0.3s; display: flex; flex-direction: column;
}
.pet-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }

.image-wrapper { position: relative; height: 200px; }
.image-wrapper img { width: 100%; height: 100%; object-fit: cover; }

.type-tag {
  position: absolute; top: 10px; left: 10px;
  padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; 
  color: white; font-weight: bold; text-transform: uppercase;
}
.type-tag.hospital { background: #2980b9; }
.type-tag.shelter { background: #e67e22; }

.pet-info { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
.pet-info h3 { color: #4C6A4C; margin-bottom: 0.5rem; font-size: 1.25rem; }
.pet-breed { color: #888; font-size: 0.9rem; margin-bottom: 1rem; }
.pet-description { color: #555; font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.5; flex-grow: 1; }

.pet-buttons { display: flex; flex-direction: column; gap: 0.8rem; margin-top: auto; }

/* Tombol Custom */
.btn-full { width: 100%; display: block; text-align: center; padding: 0.7rem; border-radius: 8px; text-decoration: none; font-weight: 600; transition: 0.2s; }

.btn-primary { background: #A9C47F; color: white; border: 1px solid #A9C47F; }
.btn-primary:hover { background: #8eab65; }

.btn-secondary { background: #f0f0f0; color: #333; }
.btn-secondary:hover { background: #e0e0e0; }

.btn-outline { background: white; color: #2980b9; border: 1px solid #2980b9; }
.btn-outline:hover { background: #f0f8ff; }

.lihat-detail {
  text-align: center; color: #4C6A4C; font-weight: 600; cursor: pointer;
  font-size: 0.9rem; margin-top: 1rem; text-decoration: none; display: block;
}
.lihat-detail:hover { text-decoration: underline; }

.loading-state { text-align: center; padding: 3rem; color: #888; }

@media (max-width: 768px) {
  .adoption-filters { flex-direction: column; }
  .filter-input { width: 100%; }
}
</style>