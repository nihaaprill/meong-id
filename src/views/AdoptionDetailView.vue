<template>
    <main class="detail-page-content">
        <div class="container">
            <div v-if="pet" class="detail-section">
                <div class="detail-header">
                    <h1 style="color: #4C6A4C;">Detail Adopsi: {{ pet.name }}</h1>
                    <span :class="['status-badge', pet.status.toLowerCase()]">{{ pet.status }}</span>
                </div>
                
                <div class="detail-grid">
                    <div class="detail-image">
                        <img :src="pet.image" :alt="pet.name">
                    </div>
                    <div class="detail-info">
                        <h2>Informasi Kucing</h2>
                        <p><strong>Ras:</strong> {{ pet.race || 'Tidak Diketahui' }}</p>
                        <p><strong>Usia:</strong> {{ pet.age || 'Dewasa' }}</p>
                        <p><strong>Jenis Kelamin:</strong> {{ pet.gender || '-' }}</p>
                        <p><strong>Lokasi:</strong> {{ pet.location || 'Tidak Tersedia' }}</p>
                        <p class="description-text">{{ pet.description }}</p>

                        <h2 style="margin-top: 1.5rem;">Informasi Pemilik</h2>
                        <p><strong>Nama Pemilik:</strong> {{ pet.owner.name }}</p>
                        <p>Hubungi: <a :href="`tel:${pet.owner.phone}`">{{ pet.owner.phone || 'N/A' }}</a></p>
                    </div>
                </div>
            </div>

            <div v-else class="loading-state">
                <p>Memuat detail kucing...</p>
            </div>
            
            <div v-if="pet && pet.status === 'AVAILABLE'" class="form-section">
                <SectionTitle title="Ajukan Permohonan Adopsi" style="margin-top: 3rem;"/>
                <p class="form-description">Isi formulir di bawah ini untuk menyatakan minat adopsi. Tim kami akan menghubungi Anda.</p>
                
                <form class="adoption-form" @submit.prevent="submitAdoptionForm">
                    <InputField label="Nama Lengkap" type="text" placeholder="Masukkan nama lengkap Anda" required v-model="adoptionForm.fullName" />
                    <InputField label="Email" type="email" placeholder="Masukkan alamat email Anda" required v-model="adoptionForm.email" />
                    <InputField label="Nomor Telepon" type="tel" placeholder="Nomor telepon aktif" required v-model="adoptionForm.phone" />
                    <InputField label="Pekerjaan" type="text" placeholder="Pekerjaan saat ini" required v-model="adoptionForm.occupation" />
                    <TextArea label="Alamat Lengkap" placeholder="Alamat lengkap Anda" required v-model="adoptionForm.address" />

                    <div v-if="!store.isLoggedIn" class="alert alert-warning">
                        Anda harus **login** untuk mengirim aplikasi adopsi.
                    </div>
                    <div v-if="isOwner" class="alert alert-warning">
                        Anda tidak dapat melamar kucing yang Anda daftarkan sendiri.
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary btn-lg" 
                                :disabled="!store.isLoggedIn || isOwner">
                            Kirim Aplikasi Adopsi
                        </button>
                    </div>
                </form>
            </div>
            <div v-else-if="pet" class="status-message">
                <h2>Status: Sudah Diadopsi</h2>
                <p>Kucing ini sudah menemukan rumah barunya. Terima kasih atas perhatian Anda!</p>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/store.js' // Impor store untuk akses token

// Asumsi komponen ini diimpor secara global di main.js
// import InputField from '@/components/ui/InputField.vue'
// import TextArea from '@/components/ui/TextArea.vue'
// import SectionTitle from '@/components/ui/SectionTitle.vue' 

const route = useRoute()
const API_BASE_URL = 'http://localhost:3000'

// --- State Data ---
const pet = ref(null)
const listingId = route.params.id // Ambil ID dari URL
const isOwner = ref(false)

// Data Formulir Adopsi
const adoptionForm = ref({
    fullName: store.value.user?.name || '',
    email: store.value.user?.email || '',
    phone: store.value.user?.phone || '',
    occupation: '', // Ini perlu diisi
    address: '' // Ini perlu diisi
})

// --- FUNGSI API ---

const fetchPetDetail = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/adoptions/${listingId}`)
        if (!response.ok) {
            throw new Error('Gagal mengambil detail adopsi')
        }
        let data = await response.json()
        
        // Perbaiki URL Gambar
        data.image = data.image ? `${API_BASE_URL}${data.image}` : '/default-cat.jpeg';

        pet.value = data
        
        // Cek apakah user adalah pemilik
        if (store.value.isLoggedIn && pet.value.ownerId === store.value.user.id) {
            isOwner.value = true
        }

    } catch (error) {
        console.error('Error fetching detail:', error)
        alert('Gagal memuat detail adopsi. Cek ID atau koneksi server.')
    }
}

/**
 * Handler untuk submit Form Aplikasi Adopsi. (POST /adoptions/:id/apply)
 */
const submitAdoptionForm = async () => {
    if (!store.value.isLoggedIn || isOwner.value) return;

    try {
        // Data yang dikirim ke backend (sesuai skema AdoptionApplication)
        const applicationData = {
            message: `Nama: ${adoptionForm.value.fullName}, Email: ${adoptionForm.value.email}, Telepon: ${adoptionForm.value.phone}, Pekerjaan: ${adoptionForm.value.occupation}, Alamat: ${adoptionForm.value.address}`
        }

        const response = await fetch(`${API_BASE_URL}/adoptions/${listingId}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${store.value.token}`
            },
            body: JSON.stringify(applicationData)
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Gagal mengirim aplikasi adopsi.')
        }

        alert(`Aplikasi adopsi untuk ${pet.value.name} berhasil dikirim!`);
        // Redirect atau beri notifikasi sukses
        
    } catch (error) {
        console.error('Error submitting application:', error)
        alert(`Gagal mengirim aplikasi adopsi: ${error.message}`);
    }
}


// --- Lifecycle Hook ---
onMounted(() => {
    fetchPetDetail()
})
</script>

<style scoped>
.detail-page-content {
    padding: 3rem 0;
    background-color: var(--light-cream);
}
.detail-section {
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    margin-bottom: 3rem;
}
.detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
}
.status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: bold;
    color: white;
    font-size: 0.9rem;
}
.status-badge.available { background-color: #4C6A4C; }
.status-badge.adopted { background-color: #d9534f; }

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
}
.detail-image img {
    width: 100%;
    height: 350px;
    object-fit: cover;
    border-radius: 10px;
    background: #e5e5d9;
}
.detail-info h2 {
    color: #4C6A4C;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    border-bottom: 1px dashed #ddd;
    padding-bottom: 0.5rem;
}
.detail-info p {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #333;
}
.description-text {
    margin-top: 1.5rem;
    line-height: 1.6;
    background: #f8f8f0;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #A9C47F;
}

/* Style Form */
.form-section {
    padding: 2rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.adoption-form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2rem;
}
.adoption-form :deep(.form-group:last-child) {
    grid-column: 1 / -1; /* TextArea ambil 2 kolom */
}
.form-description {
    color: #666;
    margin-bottom: 1.5rem;
}
.form-actions {
    grid-column: 2 / 3;
    display: flex;
    justify-content: flex-end;
}
.alert {
    padding: 1rem;
    background-color: #f7d794;
    color: #a0522d;
    border-radius: 8px;
    margin-top: 1rem;
    grid-column: 1 / -1;
}
.status-message {
    text-align: center;
    padding: 4rem;
    background: #fdfaf6;
    border: 2px solid #d9534f;
    border-radius: 10px;
    margin-top: 3rem;
}

@media (max-width: 768px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }
    .adoption-form {
        grid-template-columns: 1fr;
    }
    .form-actions {
        grid-column: 1 / -1;
        justify-content: center;
    }
}
</style>