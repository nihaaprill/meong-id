<template>
  <div class="profile-page">
    <PageHeader title="Profil Saya" subtitle="Kelola aktivitas dan akun Anda di sini." />

    <div class="container">
      <div class="profile-layout">
        
        <aside class="profile-sidebar">
          <div class="user-card">
            <div class="avatar-wrapper">
              <img :src="store.user?.avatar || defaultAvatar" alt="Avatar" class="avatar-img">
            </div>
            <h2 class="user-name">{{ store.user?.name }}</h2>
            <p class="user-email">{{ store.user?.email }}</p>
            <span class="badge-role">{{ store.user?.role || 'USER' }}</span>
            
            <div class="sidebar-menu">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="['menu-btn', { active: activeTab === tab.id }]"
              >
                {{ tab.label }}
              </button>
            </div>

            <hr class="divider">
            
            <button @click="$router.push('/profile/edit')" class="btn-action">✏️ Edit Profil</button>
            <button @click="handleLogout" class="btn-action danger">🚪 Logout</button>
          </div>
        </aside>

        <main class="profile-content">
          
          <div v-if="activeTab === 'kucingku'">
            <div class="tab-header">
              <h3>Kucing Adopsi Saya</h3>
              <RouterLink to="/adoption" class="btn-small">+ Tambah</RouterLink>
            </div>
            
            <div v-if="myAdoptions.length === 0" class="empty-state">Belum ada kucing yang didaftarkan.</div>
            
            <div class="item-list">
              <div v-for="cat in myAdoptions" :key="cat.id" class="item-card">
                <img :src="getImageUrl(cat.image)" class="item-thumb" alt="Foto Kucing">
                <div class="item-info">
                  <h4>{{ cat.name }}</h4>
                  <p>{{ cat.race }} • {{ cat.age }}</p>
                  <div class="status-badge" :class="cat.status.toLowerCase()">{{ cat.status }}</div>
                </div>
                <div class="item-actions">
                  <button 
                    v-if="cat.status === 'AVAILABLE'" 
                    @click="updateStatus('adoptions', cat.id, 'ADOPTED')"
                    class="btn-done"
                  >
                    ✅ Tandai Teradopsi
                  </button>
                  <button v-else class="btn-disabled" disabled>Sudah Diadopsi</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'laporanku'">
            <div class="tab-header">
              <h3>Laporan Kucing Hilang</h3>
              <RouterLink to="/report" class="btn-small">+ Lapor</RouterLink>
            </div>

            <div v-if="myReports.length === 0" class="empty-state">Tidak ada laporan aktif.</div>

            <div class="item-list">
              <div v-for="report in myReports" :key="report.id" class="item-card">
               <img :src="getImageUrl(report.image)" class="item-thumb" alt="Foto Laporan">
                <div class="item-info">
                  <h4>{{ report.name }}</h4>
                  <p>📍 {{ report.location }}</p>
                  <div class="status-badge" :class="report.status.toLowerCase()">{{ report.status }}</div>
                </div>
                <div class="item-actions">
                  <button 
                    v-if="report.status === 'LOST'" 
                    @click="updateStatus('lost-cats', report.id, 'FOUND')"
                    class="btn-done"
                  >
                    🏠 Sudah Ketemu
                  </button>
                  <span v-else class="text-success">Kasus Selesai</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'lamaran'">
            <div class="tab-header">
              <h3>Lamaran Adopsi Masuk</h3>
            </div>

            <div v-if="myIncomingApplications.length === 0" class="empty-state">Belum ada lamaran masuk untuk kucing Anda.</div>

            <div class="item-list">
              <div v-for="app in myIncomingApplications" :key="app.id" class="item-card">
                <div class="item-info">
                  <h4>Melamar Kucing: {{ app.listingName }}</h4>
                  <p>Pelamar: {{ app.applicant?.name || 'User Tidak Dikenal' }}</p>
                  <p>Pesan: {{ app.message ? app.message.substring(0, 50) + '...' : 'Tidak ada pesan' }}</p>
                  <div class="status-badge" :class="app.status.toLowerCase()">Status: {{ app.status }}</div>
                </div>
                <div class="item-actions">
                  <button 
                    v-if="app.status === 'PENDING'" 
                    @click="updateApplicationStatus(app.id, 'APPROVED')"
                    class="btn-done"
                  >
                    👍 Terima
                  </button>
                  <button 
                    v-if="app.status === 'PENDING'" 
                    @click="updateApplicationStatus(app.id, 'REJECTED')"
                    class="btn-action danger" 
                    style="padding: 0.7rem 1.2rem; background-color: #ff7675; color: white; border: none; margin-left: 0.5rem;"
                  >
                    ✖ Tolak
                  </button>
                  <span v-else class="text-success" style="color: #00b894; font-weight: bold;">Sudah diproses</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'donasi'">
            <h3>Riwayat Kebaikan</h3>
            <div v-if="myDonations.length === 0" class="empty-state">Belum ada riwayat donasi.</div>
            
            <div class="donation-list">
              <div v-for="d in myDonations" :key="d.id" class="donation-item">
                <div class="d-icon">❤️</div>
                <div class="d-info">
                  <h4>Donasi ke: {{ d.campaign?.title || 'Umum' }}</h4>
                  <p class="d-date">{{ formatDate(d.createdAt) }}</p>
                </div>
                <div class="d-amount">
                  Rp {{ formatPrice(d.amount) }}
                  <span class="d-status" :class="d.status.toLowerCase()">{{ d.status }}</span>
                </div>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store, logout } from '../store.js'

const router = useRouter()
const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
const defaultCat = '/default-cat.jpeg'
const API_BASE_URL = 'http://localhost:3000'

// --- FUNGSI BARU: Handle URL Gambar ---
const getImageUrl = (imagePath) => {
  if (!imagePath) return defaultCat;
  
  // Jika gambar adalah link eksternal (http...)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Jika gambar dari upload lokal (mulai dengan /uploads/...)
  // Gabungkan dengan URL Backend
  return `${API_BASE_URL}${imagePath}`;
}

// State Tab
const activeTab = ref('kucingku') // Default tab
const tabs = [
  { id: 'kucingku', label: '🐾 Kucingku' },
  { id: 'laporanku', label: '📢 Laporanku' },
  {id: 'lamaran', label: '📝 Lamaran Masuk'},
  { id: 'donasi', label: '❤️ Donasi' }
]

// Data Lists
const myAdoptions = ref([])
const myReports = ref([])
const myDonations = ref([])

// Formatters
const formatPrice = (val) => new Intl.NumberFormat('id-ID').format(val)
const formatDate = (date) => new Date(date).toLocaleDateString('id-ID')

// Fetch Data
const fetchData = async () => {
  if (!store.value.token) return;
  const headers = { 'Authorization': `Bearer ${store.value.token}` }

  try {

    const resAdop = await fetch('http://localhost:3000/me/listings', { headers })
    // Fetch Adoptions
    if(resAdop.ok) {
        const dataAdop = await resAdop.json();
        myAdoptions.value = dataAdop;

        // 🔥 Kumpulkan semua aplikasi yang masuk dari semua listing user
        const allApplications = dataAdop.flatMap(listing => 
            listing.applicants.map(app => ({
                ...app,
                listingName: listing.name, // Tambahkan nama kucing untuk konteks
                // Pastikan applicant aman diakses
                applicantName: app.applicant ? app.applicant.name : 'Pengguna Terhapus',
                applicantEmail: app.applicant ? app.applicant.email : '-'
            }))
        );
        myIncomingApplications.value = allApplications;
    }
    // Fetch Reports
    const resRep = await fetch('http://localhost:3000/me/reports', { headers })
    if(resRep.ok) myReports.value = await resRep.json()

    // Fetch Donations
    const resDon = await fetch('http://localhost:3000/me/donations', { headers })
    if(resDon.ok) myDonations.value = await resDon.json()

  } catch (e) { console.error(e) }
}

// Update Status (Mark as Adopted / Found)
const updateStatus = async (endpoint, id, newStatus) => {
  if(!confirm(`Ubah status menjadi ${newStatus}?`)) return;

  try {
    const res = await fetch(`http://localhost:3000/${endpoint}/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${store.value.token}` 
      },
      body: JSON.stringify({ status: newStatus })
    });

    if(res.ok) {
      fetchData(); // Refresh data
      alert('Status berhasil diperbarui!');
    }
  } catch(e) { alert('Gagal update status'); }
}

const updateApplicationStatus = async (appId, newStatus) => {
    if(!confirm(`Yakin ingin ${newStatus === 'APPROVED' ? 'Menerima' : 'Menolak'} lamaran ini?`)) return;

    try {
        const res = await fetch(`http://localhost:3000/applications/${appId}/status`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${store.value.token}` 
            },
            body: JSON.stringify({ status: newStatus })
        });

        if(res.ok) {
            fetchData(); // Refresh data
            alert(`Lamaran berhasil ${newStatus === 'APPROVED' ? 'DITERIMA' : 'DITOLAK'}!`);
        }
    } catch(e) { alert('Gagal update status lamaran'); }
}

const handleLogout = () => {
  if (confirm("Yakin ingin logout?")) {
    logout();
    router.push('/login');
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* --- LAYOUT UTAMA --- */
.profile-page {
  background-color: #F6F4EE; /* Warna Cream lembut */
  min-height: 100vh; /* Memastikan warna memenuhi layar */
  
  /* SOLUSI PUTIH DI ATAS: 
     Kita hapus margin default yang mungkin mengganggu, 
     dan gunakan padding untuk memberi jarak dalam. */
  padding-top: 2rem; 
  padding-bottom: 5rem;
}

/* Layout Grid Kiri-Kanan */
.profile-layout {
  display: grid;
  /* Ubah lebar kolom kiri agar lebih proporsional (300px), sisanya untuk konten */
  grid-template-columns: 300px 1fr; 
  
  /* SOLUSI "MEPET": Perbesar gap antar kolom */
  gap: 3rem; 
  
  margin-top: 1rem;
  align-items: start; /* Agar sidebar tidak ketarik memanjang ke bawah */
}

/* --- SIDEBAR KIRI (User Card) --- */
.user-card {
  background: white;
  padding: 2.5rem 2rem; /* Padding lebih lega */
  border-radius: 20px; /* Radius lebih tumpul agar terlihat modern */
  text-align: center;
  
  /* Efek Shadow yang lebih halus & elegan */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); 
  border: 1px solid rgba(0,0,0,0.02);
  
  /* Agar sidebar tetap diam saat discroll (Opsional, terlihat keren di desktop) */
  position: sticky;
  top: 100px; 
}

.avatar-wrapper {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  /* Border ganda untuk efek premium */
  border: 4px solid white;
  box-shadow: 0 0 0 3px #A9C47F; 
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 1.4rem;
  font-weight: 800; /* Lebih tebal */
  color: #2d3436;
  margin-bottom: 0.3rem;
  letter-spacing: -0.5px;
}

.user-email {
  color: #636e72;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.badge-role {
  background: #e0f2f1;
  color: #00695c;
  padding: 6px 16px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* --- MENU NAVIGASI SIDEBAR --- */
.sidebar-menu {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem; /* Jarak antar tombol menu */
}

.menu-btn {
  background: transparent;
  border: none;
  padding: 1rem 1.5rem;
  text-align: left;
  width: 100%;
  cursor: pointer;
  border-radius: 12px;
  font-weight: 700;
  color: #636e72;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-btn:hover {
  background: #f1f2f6;
  color: #2d3436;
  transform: translateX(5px); /* Efek geser sedikit saat hover */
}

.menu-btn.active {
  background: #A9C47F;
  color: white;
  box-shadow: 0 4px 15px rgba(169, 196, 127, 0.4);
}

.divider {
  border: 0;
  border-top: 2px dashed #f1f2f6;
  margin: 2rem 0;
}

.btn-action {
  width: 100%;
  padding: 0.9rem;
  border: 2px solid #f1f2f6;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 0.8rem;
  font-weight: 700;
  color: #636e72;
  transition: all 0.2s;
}

.btn-action:hover {
  border-color: #b2bec3;
  color: #2d3436;
}

.btn-action.danger {
  border-color: #ffebee;
  color: #ff7675;
  background: #fff5f5;
}

.btn-action.danger:hover {
  background: #ffe0e0;
  border-color: #ff7675;
}

/* --- KONTEN KANAN --- */
.profile-content {
  background: white;
  padding: 2.5rem; /* Padding dalam lebih besar */
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  min-height: 500px;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f2f6;
}

.tab-header h3, .profile-content h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2d3436;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: #fafafa;
  border-radius: 15px;
  color: #b2bec3;
  font-style: italic;
}

/* --- ITEM CARD (List Kucing/Laporan) --- */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.item-card {
  display: flex;
  gap: 1.5rem;
  background: white;
  border: 1px solid #f1f2f6;
  padding: 1.2rem;
  border-radius: 16px;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  border-color: #A9C47F;
}

.item-thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  background: #f0f0f0;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 0.4rem 0;
  color: #2d3436;
  font-size: 1.2rem;
  font-weight: 700;
}

.item-info p {
  color: #636e72;
  font-size: 0.95rem;
  margin: 0;
}

.status-badge {
  display: inline-block;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 6px;
  margin-top: 8px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Warna Status */
.status-badge.available { background: #e3f2fd; color: #0984e3; }
.status-badge.adopted, .status-badge.found { background: #e8f5e9; color: #00b894; }
.status-badge.lost { background: #ffebee; color: #d63031; }

.btn-done {
  background: #A9C47F;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: 0.2s;
}

.btn-done:hover {
  background: #4C6A4C;
}

/* --- DONATION LIST --- */
.donation-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.donation-item {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
  background: #fff;
  border: 1px solid #f1f2f6;
  border-radius: 16px;
  transition: 0.2s;
}

.donation-item:hover {
  border-color: #A9C47F;
  background: #fdfffc;
}

.d-icon {
  width: 50px;
  height: 50px;
  background: #ffebee;
  color: #ff7675;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.d-info h4 {
  font-size: 1.1rem;
  margin: 0 0 0.3rem 0;
  color: #2d3436;
  font-weight: 700;
}

.d-amount {
  font-weight: 800;
  color: #A9C47F;
  font-size: 1.1rem;
  text-align: right;
}

.d-status {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  margin-top: 4px;
}
.d-status.success { color: #00b894; }

/* --- RESPONSIVE (HP) --- */
@media (max-width: 900px) {
  .profile-layout {
    grid-template-columns: 1fr; /* Jadi 1 kolom di HP */
    gap: 2rem;
  }
  
  .user-card {
    position: static; /* Matikan sticky di HP */
  }
  
  .item-card {
    flex-direction: column;
    text-align: center;
  }
  
  .item-actions {
    width: 100%;
  }
  
  .btn-done {
    width: 100%;
  }
}
</style>