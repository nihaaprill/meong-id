<template>
  <section class="page-header" style="background-color: #F8F8F0; padding: 2rem 0; text-align: left;">
    <div class="container">
      <h1 style="color: #4C6A4C; font-size: 2.5rem; margin-bottom: 0;">Kucing Hilang</h1>
    </div>
  </section>

  <main class="page-content">
    <div class="container">
      <div class="header-toggles">
        <RouterLink to="/lost-cats" class="btn-toggle active">Kucing Hilang</RouterLink>
        <RouterLink to="/report" class="btn-toggle">Buat Laporan</RouterLink>
      </div>

      <div class="search-and-filter">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search"
            v-model="filters.search"
            @input="applyFilters"
          >
        </div>
        
        <select class="filter-select" v-model="filters.location" @change="applyFilters">
          <option value="">Semua Lokasi</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Bandung">Bandung</option>
        </select>
        
        <select class="filter-select">
          <option>Semua Kategori</option>
        </select>
      </div>

      <div class="lost-cats-grid">
        <Card v-for="cat in lostCats" :key="cat.id" class="lost-cat-card">
          <img :src="cat.image" :alt="cat.name" class="card-image"/>
          <div class="card-content">
            <h3>{{ cat.name }}</h3>
            <p class="description">{{ cat.description }}</p>
            <p class="location">📍 {{ cat.location }}</p>
            
            <a 
              :href="getWhatsappLink(cat.contact, cat.name)" 
              target="_blank" 
              class="btn btn-contact btn-small"
            >
              📞 Hubungi via WA
            </a>
          </div>
        </Card>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const API_BASE_URL = 'http://localhost:3000'

const filters = ref({
    search: '',
    location: ''
})

const lostCats = ref([]) 

// --- FUNGSI BARU: Format Link WhatsApp ---
const getWhatsappLink = (phone, catName) => {
  if (!phone) return '#';
  
  // Bersihkan nomor dari karakter non-angka (misal: 0812-3456 -> 08123456)
  let number = phone.replace(/\D/g, '');
  
  // Ubah 08... menjadi 628...
  if (number.startsWith('0')) {
    number = '62' + number.substring(1);
  }
  
  // Buat pesan otomatis
  const message = `Halo, saya melihat laporan kucing hilang "${catName}" di Meong.id. Apakah masih dicari?`;
  
  // Return link lengkap
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

const fetchLostCats = async () => {
    const params = new URLSearchParams(filters.value).toString();
  
    try {
        const response = await fetch(`${API_BASE_URL}/lost-cats?${params}`)
        if (!response.ok) {
            throw new Error('Gagal mengambil data laporan kucing hilang')
        }
        const data = await response.json()
        
        lostCats.value = data.map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            location: cat.location,
            contact: cat.contact,
            // Pastikan path gambar benar
            image: cat.image 
              ? (cat.image.startsWith('http') ? cat.image : `${API_BASE_URL}${cat.image}`) 
              : '/default-cat.jpeg',
            reporterName: cat.reporter ? cat.reporter.name : 'Anonim'
        }))
    } catch (error) {
        console.error('Error fetching lost cats:', error)
    }
}

const applyFilters = () => {
    fetchLostCats();
}

onMounted(() => {
    fetchLostCats()
})
</script>

<style scoped>
.page-content {
  padding: 3rem 0;
  background-color: var(--light-cream);
  min-height: calc(100vh - 100px);
}

.header-toggles {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.btn-toggle {
  padding: 0.6rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  background-color: var(--light-gray);
  color: var(--text-black);
  transition: all 0.2s;
}

.btn-toggle:hover {
  background-color: #d1d1d1;
}

.btn-toggle.active {
  background-color: var(--dark-green);
  color: var(--white);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-and-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.search-bar {
  position: relative;
  flex-grow: 1;
  max-width: 500px;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1.2rem 0.75rem 3rem;
  border: 1px solid var(--light-gray);
  border-radius: 10px;
  font-size: 1rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.filter-select {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--light-gray);
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  background-color: var(--white);
}

.lost-cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.lost-cat-card {
  width: 100%;
  max-width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s;
  background-color: var(--white);
}

.lost-cat-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: var(--light-gray);
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  font-size: 1.25rem;
  color: var(--dark-green);
  margin-bottom: 0.25rem;
}

.card-content .description {
  color: #555;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  min-height: 40px;
}

.card-content .location {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1rem;
}

/* Style Tombol Kontak */
.btn-contact {
  margin-top: auto;
  align-self: flex-start;
  background-color: var(--soft-green); 
  color: var(--white);
  padding: 0.5rem 1.5rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  text-decoration: none; /* Tambahan agar link tidak ada garis bawah */
  display: inline-block; /* Agar padding berfungsi di tag <a> */
  transition: background-color 0.2s;
}

.btn-contact:hover {
  background-color: var(--dark-green);
}

@media (max-width: 600px) {
  .search-and-filter {
    flex-direction: column;
  }
  .search-bar {
    max-width: 100%;
  }
}
</style>