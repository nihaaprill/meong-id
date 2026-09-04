<template>
  <main class="shop-page">
    <section class="page-header">
      <div class="container">
        <h1>Meong Shop 🛒</h1>
        <p>Penuhi kebutuhan anabulmu sambil berdonasi.</p>
      </div>
    </section>

    <div class="container content-wrapper">
      
      <div class="shop-filters">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          :class="['filter-btn', { active: activeCategory === cat }]"
        >
          {{ cat }}
        </button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <p>Sedang mengambil barang...</p>
      </div>

      <div v-else class="product-grid">
        <div v-for="item in filteredProducts" :key="item.id" class="product-card">
          <div class="img-wrapper">
            <img :src="item.image || '/kucing.png'" :alt="item.name">
            <span class="category-tag">{{ item.category }}</span>
          </div>
          
          <div class="card-body">
            <h3>{{ item.name }}</h3>
            <p class="price">Rp {{ formatPrice(item.price) }}</p>
            <p class="desc">{{ truncate(item.description, 60) }}</p>
            
            <a 
              :href="generateWaLink(item)" 
              target="_blank" 
              class="btn-buy"
            >
              Beli via WhatsApp 🛍️
            </a>
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const products = ref([])
const isLoading = ref(true)
const activeCategory = ref('Semua')
const categories = ['Semua', 'Makanan', 'Aksesoris', 'Perlengkapan']

// Format Rupiah
const formatPrice = (val) => new Intl.NumberFormat('id-ID').format(val)

// Potong Teks
const truncate = (text, len) => text.length > len ? text.substring(0, len) + '...' : text

// Filter Kategori
const filteredProducts = computed(() => {
  if (activeCategory.value === 'Semua') return products.value
  return products.value.filter(p => p.category === activeCategory.value)
})

// Generator Link WA
const generateWaLink = (item) => {
  const phone = "6281234567890" // GANTI DENGAN NOMOR ADMIN KAMU
  const text = `Halo Admin Meong.id, saya berminat membeli produk:\n\n*${item.name}*\nHarga: Rp ${formatPrice(item.price)}\n\nApakah stok masih ada?`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/products')
    if(res.ok) products.value = await res.json()
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
})
</script>

<style scoped>
/* --- GLOBAL STYLES --- */
.shop-page {
  background-color: #F6F4EE; /* Warna latar belakang yang lembut */
  min-height: 100vh;
  padding-bottom: 5rem;
  font-family: 'Nunito', sans-serif;
}

/* --- HEADER --- */
.page-header {
  background: #F6F4EE; /* Gradasi hijau yang elegan */
  color: white;
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 3rem;
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  box-shadow: 0 10px 30px rgba(76, 106, 76, 0.2);
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
}

.page-header p {
  font-size: 1.15rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

/* --- FILTERS --- */
.shop-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  border: 2px solid transparent;
  background: white;
  cursor: pointer;
  font-weight: 700;
  color: #666;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

.filter-btn.active {
  background: #A9C47F;
  color: white;
  border-color: #A9C47F;
  box-shadow: 0 4px 15px rgba(169, 196, 127, 0.4);
}

/* --- PRODUCT GRID --- */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

/* --- PRODUCT CARD --- */
.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  position: relative;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  border-color: #A9C47F;
}

/* Image Wrapper */
.img-wrapper {
  position: relative;
  height: 220px;
  background: #f9f9f9;
  overflow: hidden;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .img-wrapper img {
  transform: scale(1.1);
}

/* Category Tag */
.category-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(76, 106, 76, 0.9); /* Dark green semi-transparent */
  color: white;
  padding: 5px 12px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  backdrop-filter: blur(5px);
}

/* Card Body */
.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-body h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2d3436;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #A9C47F;
  margin-bottom: 0.8rem;
}

.desc {
  font-size: 0.95rem;
  color: #636e72;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1; /* Push button down */
}

/* Button Buy */
.btn-buy {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); /* Gradasi warna WA */
  color: white;
  text-decoration: none;
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

.btn-buy:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
  background: linear-gradient(135deg, #128C7E 0%, #075E54 100%);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem;
  color: #888;
  font-size: 1.2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 3rem 1rem;
    border-radius: 0 0 30px 30px;
  }
  .page-header h1 {
    font-size: 2rem;
  }
  .shop-filters {
    gap: 0.5rem;
  }
  .filter-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
}
</style>