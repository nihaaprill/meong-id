
<template>
    <main>
        <section class="page-header" style="background-color: #F8F8F0; padding: 2rem 0; text-align: left;">
            <div class="container">
                <h1 style="color: #4C6A4C; font-size: 2.5rem; margin-bottom: 0;">Adopsi Kucing</h1>
            </div>
        </section>

        <div class="container" style="padding-top: 1.5rem; display: flex; justify-content: flex-end;">
            <button @click="openRegistrationModal" class="btn btn-primary" style="background-color: var(--dark-green); padding: 0.75rem 1.5rem;">
                Taro Kucing untuk Adopsi
            </button>
        </div>
        <section class="adoption-section" style="padding-top: 2rem;">
            <div class="container">
                <div class="adoption-filters" style="justify-content: flex-start; gap: 0.75rem;">
                    <div class="search-bar" style="position: relative; flex-grow: 0; width: 400px;">
                        <input 
                            type="text" 
                            placeholder="🔍Cari nama" 
                            class="filter-input"
                            v-model="filters.search"
                            @input="applyFilters"
                        >
                    </div>
                    
                    <select class="filter-select" style="width: 150px;" v-model="filters.race" @change="applyFilters">
                        <option value="">Ras</option>
                        <option value="Domestic">Domestic</option>
                        <option value="Persia">Persia</option>
                        <option value="Anggora">Anggora</option>
                    </select>
                    
                    <select class="filter-select" style="width: 150px;" v-model="filters.age" @change="applyFilters">
                        <option value="">Usia</option>
                        <option value="Kitten">Kitten</option>
                        <option value="Adult">Adult</option>
                    </select>
                    
                    <select class="filter-select" style="width: 150px;" v-model="filters.location" @change="applyFilters">
                        <option value="">Lokasi</option>
                        <option value="Jakarta">Jakarta</option>
                        <option value="Bandung">Bandung</option>
                        <option value="Surabaya">Surabaya</option>
                    </select>
                </div>

                <div class="adoption-grid">
                    <div class="pet-card" v-for="pet in adoptablePets" :key="pet.id">
                        <img :src="pet.image" :alt="pet.name"> 
                        <div class="pet-info">
                            <h3 style="color: #4C6A4C;">{{ pet.name }}</h3>
                            <p style="font-size: 0.85rem; color: #777;">
                                <strong>Ras:</strong> {{ pet.race }} | <strong>Usia:</strong> {{ pet.age }}
                                <br>
                                <strong>Lokasi:</strong> {{ pet.location }}
                            </p>
                            <p class="pet-description" style="color: #555; font-size: 0.95rem; margin-bottom: 1.5rem;">{{ pet.description }}</p>
                            <RouterLink 
                                :to="`/adoption/${pet.id}`" 
                                class="btn btn-primary btn-full" 
                                style="padding: 0.6rem 1rem; text-align: center;">
                                Lihat Detail & Adopsi
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <h2 class="modal-title">Form Adopsi - {{ selectedPet.name }}</h2>
            <form class="adoption-form" @submit.prevent="submitAdoptionForm">
                <InputField label="Nama Lengkap" type="text" placeholder="Masukkan nama lengkap Anda" required v-model="adoptionForm.fullName" />
                <InputField label="Email" type="email" placeholder="Masukkan alamat email Anda" required v-model="adoptionForm.email" />
                <InputField label="Nomor Telepon" type="tel" placeholder="Nomor telepon aktif" required v-model="adoptionForm.phone" />
                <InputField label="Pekerjaan" type="text" placeholder="Pekerjaan saat ini" required v-model="adoptionForm.occupation" />
                <TextArea label="Alamat Lengkap" placeholder="Alamat lengkap Anda" required v-model="adoptionForm.address" />

                <div v-if="!store.isLoggedIn" class="alert alert-warning" style="color: red; margin-top: 1rem;">
                    Anda harus **login** untuk mengirim aplikasi adopsi.
                </div>

                <div class="form-actions" style="margin-top: 1.5rem; justify-content: flex-end;">
                    <button type="submit" class="btn btn-primary" style="background-color: #A9C47F;" :disabled="!store.isLoggedIn">Kirim Aplikasi Adopsi</button>
                    <button type="button" @click="closeModal" class="btn btn-secondary" style="background-color: #F0F0F0;">Batal</button>
                </div>
            </form>
        </div>
    </div>
    <div v-if="isRegistrationModalOpen" class="modal-overlay" @click.self="closeRegistrationModal">
        <div class="modal-content">
            <h2 class="modal-title">Daftarkan Kucing untuk Adopsi</h2>
            <p style="margin-bottom: 1.5rem; color: #555;">Isi detail kucing yang ingin Anda daftarkan.</p>
            <form class="registration-form" @submit.prevent="submitRegistrationForm">
                <InputField label="Nama Kucing" type="text" placeholder="Contoh: Meong, Cimol" required v-model="registrationForm.name" />
                <TextArea label="Deskripsi Kucing" placeholder="Jelaskan ras, sifat, dan kondisi kesehatan kucing" required v-model="registrationForm.description" />
                
                <InputField label="Ras Kucing" type="text" placeholder="Contoh: Persia, Domestic" required v-model="registrationForm.race" />
                <InputField label="Usia Kucing" type="text" placeholder="Contoh: Kitten (3 bulan), Adult" required v-model="registrationForm.age" />
                <InputField label="Jenis Kelamin" type="text" placeholder="Contoh: Jantan, Betina" required v-model="registrationForm.gender" />
                <InputField label="Lokasi Kucing" type="text" placeholder="Contoh: Jakarta Selatan" required v-model="registrationForm.location" />

                <div class="form-group">
                    <label for="imageFile">Upload Foto Kucing</label>
                    <input 
                        id="imageFile" 
                        type="file" 
                        @change="handleFileUpload" 
                        accept="image/*"
                        class="filter-input" 
                    />
                    <p class="form-hint">Pilih file foto kucing (Maks 5MB)</p>
                </div>

                <div v-if="!store.isLoggedIn" class="alert alert-warning" style="color: red; margin-top: 1rem;">
                    Anda harus **login** untuk mendaftarkan kucing adopsi.
                </div>

                <div class="form-actions" style="margin-top: 1.5rem; justify-content: flex-end;">
                    <button type="submit" class="btn btn-primary btn-full" style="background-color: var(--soft-green);" :disabled="!store.isLoggedIn">Kirim Form Adopsi</button>
                </div>
            </form>
            <button type="button" @click="closeRegistrationModal" class="btn btn-secondary btn-full" style="background-color: #F0F0F0; margin-top: 1rem;">Batal</button>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import InputField from '@/components/ui/InputField.vue'
import TextArea from '@/components/ui/TextArea.vue'
import { store } from '@/store.js' // Impor store untuk akses token dan status login

// --- BASE URL BACKEND ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// 🔥 State untuk Search dan Filter
const filters = ref({
    search: '',
    race: '',
    age: '',
    location: ''
})

// --- Data Reaktif ---
const adoptablePets = ref([])
const isRegistrationModalOpen = ref(false)

// Tambahkan variabel reaktif untuk menampung file
const imageFile = ref(null) 

// Handler untuk menyimpan file yang dipilih
const handleFileUpload = (event) => {
    imageFile.value = event.target.files[0]
}

// Data Formulir Adopsi
const adoptionForm = ref({
    fullName: '',
    email: '',
    phone: '',
    occupation: '',
    address: ''
})

// Data Formulir Registrasi Kucing
const registrationForm = ref({
    name: '',
    description: '',
    race: '', // Tambahan untuk menyesuaikan skema backend
    age: '',   // Tambahan
    gender: '', // Tambahan
    location: '', // Tambahan
    contact: '', // Nanti akan menggunakan phone dari store/input, tapi kita pakai input telepon pemilik di form
    image: null,
    ownerPhone: '' // Nomor telepon pemilik dari input form
})


// --- FUNGSI UTAMA ---

/**
 * Mengambil daftar kucing yang tersedia dari backend.
 */
const fetchAdoptions = async () => {
    // Bangun query string dari filters
    const params = new URLSearchParams(filters.value).toString();


    try {
        const response = await fetch(`${API_BASE_URL}/adoptions?${params}`)
        if (!response.ok) {
            throw new Error('Gagal mengambil data adopsi')
        }
        const data = await response.json()
        
        // Memformat data dari backend agar sesuai dengan struktur `pet-card`
        adoptablePets.value = data.map(pet => ({
            id: pet.id,
            name: pet.name,
            description: pet.description,
            // 🔥 PERBAIKAN DI SINI: tambahkan API_BASE_URL jika image ada
           image: pet.image 
            ? (pet.image.startsWith('http') ? pet.image : `${API_BASE_URL}${pet.image}`) 
            : '/default-cat.jpeg',
        

            location: pet.location,
            race: pet.race,
            age: pet.age,
        }))
    } catch (error) {
        console.error('Error fetching adoptions:', error)
        alert('Gagal memuat daftar adopsi. Cek koneksi server.')
    }
}



/**
 * Handler untuk submit Form Aplikasi Adopsi. (POST /adoptions/:id/apply)
 */
const submitAdoptionForm = async () => {
    if (!store.value.isLoggedIn) {
        alert('Anda harus login untuk mengajukan permohonan adopsi.')
        return
    }

    try {
        // Data yang dikirim ke backend (sesuai skema AdoptionApplication)
        const applicationData = {
            message: `Nama: ${adoptionForm.value.fullName}, Email: ${adoptionForm.value.email}, Telepon: ${adoptionForm.value.phone}, Pekerjaan: ${adoptionForm.value.occupation}, Alamat: ${adoptionForm.value.address}`
        }

        const response = await fetch(`${API_BASE_URL}/adoptions/${selectedPet.value.id}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${store.value.token}` // Kirim token
            },
            body: JSON.stringify(applicationData)
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Gagal mengirim aplikasi adopsi.')
        }

        alert(`Aplikasi adopsi untuk ${selectedPet.value.name} berhasil dikirim! Kami akan segera menghubungi Anda.`);
        closeModal();
        
        // Reset form setelah berhasil
        adoptionForm.value = { fullName: '', email: '', phone: '', occupation: '', address: '' }

    } catch (error) {
        console.error('Error submitting adoption application:', error)
        alert(`Gagal mengirim aplikasi adopsi: ${error.message}`);
    }
}


/**
 * Handler untuk submit Form Registrasi Kucing. (POST /adoptions)
 */
const submitRegistrationForm = async () => {
    if (!store.value.isLoggedIn) {
        alert('Anda harus login untuk mendaftarkan kucing adopsi.')
        return
    }

    // 🔥 Gunakan FormData untuk mengirim data non-JSON (termasuk file)
    const formData = new FormData();
    formData.append('name', registrationForm.value.name);
    formData.append('description', registrationForm.value.description);
    formData.append('race', registrationForm.value.race || 'Unknown');
    formData.append('age', registrationForm.value.age || 'Adult');
    formData.append('gender', registrationForm.value.gender || 'Unknown');
    formData.append('location', registrationForm.value.location || 'Not Specified');
    
    // Jika ada file, tambahkan ke FormData
    if (imageFile.value) {
        formData.append('imageFile', imageFile.value); 
    }

    try {
        const response = await fetch(`${API_BASE_URL}/adoptions`, {
            method: 'POST',
            // 🔥 TIDAK PERLU header 'Content-Type': 'application/json',
            // Browser akan menambahkan 'Content-Type': 'multipart/form-data' secara otomatis
            headers: {
                'Authorization': `Bearer ${store.value.token}`
            },
            body: formData // Kirim FormData
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Gagal mendaftarkan kucing adopsi.')
        }

        alert('Kucing Anda berhasil didaftarkan untuk adopsi! Mohon tunggu konfirmasi dari admin.');
        closeRegistrationModal();
        fetchAdoptions(); // Muat ulang daftar
        
        // Reset form registrasi
        registrationForm.value = { name: '', description: '', race: '', age: '', gender: '', location: '', contact: '', image: null, ownerPhone: '' }

    } catch (error) {
        console.error('Error submitting registration:', error)
        alert(`Gagal mendaftarkan kucing adopsi: ${error.message}.`);
    }
}


// --- FUNGSI MODAL ---



const openRegistrationModal = () => {
    isRegistrationModalOpen.value = true
}

const closeRegistrationModal = () => {
    isRegistrationModalOpen.value = false
}

// 🔥 Fungsi untuk memicu fetch saat filter berubah (debounced/langsung)
const applyFilters = () => {
    // Di lingkungan nyata, ini perlu debounce (delay). Di sini kita panggil langsung.
    fetchAdoptions();
}

// --- Lifecycle Hook ---
onMounted(() => {
    fetchAdoptions()
})

</script>

<style scoped>
/* Styling Tambahan untuk Modal */
.file-upload {
    position: relative;
    /* Ambil dari style.css global */
}
/* Sebelum */
/* Setelah */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center; 
    z-index: 2000;
    
    /* 🔥 Perubahan untuk mengaktifkan scroll pada modal */
    overflow-y: auto; 
    padding: 20px 0; /* Memberi jarak atas/bawah agar konten tidak mentok */
}

/* Biarkan modal-content tetap, atau pastikan margin: auto; ada */
.modal-content {
    background: white;
    padding: 2.5rem;
    border-radius: 15px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    position: relative;
    border: 10px solid #f8f8f0; 
    margin: auto; /* Ini penting agar konten berada di tengah saat di-scroll */
}

.modal-title {
    color: var(--dark-green);
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
}

.adoption-form, .registration-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.registration-form :deep(.form-group) {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.registration-form :deep(input[type="text"]),
.registration-form :deep(input[type="tel"]),
.registration-form :deep(input[type="email"]),
.registration-form :deep(textarea) {
    width: 100%; /* Memastikan lebar penuh */
    box-sizing: border-box; /* Penting untuk padding */
    padding: 0.75rem; /* Ambil dari style.css global */
    border: 2px solid var(--light-gray); /* Ambil dari style.css global */
    border-radius: 10px; /* Ambil dari style.css global */
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    justify-content: flex-end;
}

/* Style untuk Filter */
.filter-input {
    padding: 0.75rem;
    border: 2px solid var(--light-gray);
    border-radius: 10px;
    font-size: 1rem;
    font-family: 'Nunito', sans-serif;
    transition: border-color 0.3s;
    width: 100%;
}

.filter-input:focus {
    outline: none;
    border-color: var(--soft-green);
}

/* Penyesuaian Style Card Adopsi (hanya untuk tampilan) */
.pet-card {
    /* Style dasar dari style.css */
    border: 1px solid var(--light-gray);
}
.pet-card img {
    /* Ganti object-fit agar gambar tidak terpotong */
    height: 200px; 
    object-fit: contain; 
    background-color: #e5e5d9; /* Background kontras */
}

/* Override Style Global untuk menyesuaikan layout grid */
.adoption-section {
    padding: 4rem 0;
}
.adoption-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;
}
.adoption-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}
@media (max-width: 768px) {
    .adoption-filters {
        flex-direction: column;
    }
    .adoption-grid {
        grid-template-columns: 1fr;
    }
}
</style>
