<template>
    <section class="page-header" style="background-color: #F8F8F0; padding: 2rem 0; text-align: left;">
            <div class="container">
                <h1 style="color: #4C6A4C; font-size: 2.5rem; margin-bottom: 0;">Lapor Kucing</h1>
            </div>
        </section>
    <main class="page-content">
        <div class="container">
            <div class="header-toggles">
                <RouterLink to="/lost-cats" class="btn-toggle">Kucing Hilang</RouterLink>
                <RouterLink to="/report" class="btn-toggle active">Buat Laporan</RouterLink>
            </div>
            <section class="page-header" style="padding-top: 1rem;">
                <h1>Lapor Kucing Hilang</h1>
                <p>Laporkan Kucingmu Yang Hilang</p>
            </section>

            <section class="form-section" style="padding: 0 0 4rem 0; background-color: transparent;">
                <div class="form-container" style="max-width: 700px; margin-top: 0;">
                    <form class="report-form" @submit.prevent="submitReport">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="reporter-name">Nama Kucing</label> <input type="text" id="reporter-name" name="reporter-name" placeholder="Nama Kucing yang hilang" required v-model="reportForm.name">
                            </div>

                            <div class="form-group">
                                <label for="contact">Nomor Telepon Kontak</label>
                                <input type="tel" id="contact" name="contact" placeholder="No Telepon yang bisa dihubungi" required v-model="reportForm.contact">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="location">Lokasi Terakhir Terlihat</label>
                                <input type="text" id="location" name="Lokasi" placeholder="Lokasi Kucing Hilang" required v-model="reportForm.location">
                            </div>
                            </div>

                        <div class="form-group">
                            <label for="description">Deskripsi</label>
                            <textarea id="description" name="description" rows="5" placeholder="Deksripsi kucing yang hilang (warna, ciri khas, sifat)" required v-model="reportForm.description"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="photo">Foto</label>
                            <div class="file-upload">
                                <input type="file" id="photo" name="photo" accept="image/*" @change="handleFileUpload"> 
                                <label for="photo" class="file-upload-label">
                                    <span>🐾 Upload Photo</span>
                                </label>
                            </div>
                            <p class="form-hint">Unggah foto yang jelas kalau bisa(opsional)</p>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary" :disabled="!store.isLoggedIn">Kirim Laporan</button>
                        </div>
                    </form>

                    <div class="info-box">
                        <h3>Kasus Emergency</h3>
                        
                        <p>If the animal is in immediate danger or severely injured, please call our emergency hotline:</p>
                        <p class="emergency-number">📞 +1 (555) 911-PETS</p>
                    </div>
                </div>
            </section>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router' // Tambahkan useRouter
import { store } from '@/store.js' // Impor store untuk token

const router = useRouter()
const API_BASE_URL = 'http://localhost:3000'

// 🔥 Data Reaktif Form
const reportForm = ref({
    name: '', // Nama Kucing
    description: '',
    location: '',
    contact: '', // Nomor Telepon
    lastSeen: '' // Tanggal Terakhir Terlihat (opsional, jika Anda tambahkan inputnya)
})
const imageFile = ref(null) 

const handleFileUpload = (event) => {
    imageFile.value = event.target.files[0]
}

// 🔥 Fungsi Submit
const submitReport = async () => {
    if (!store.value.isLoggedIn) {
        alert('Anda harus login untuk membuat laporan.')
        return
    }

    const formData = new FormData();
    formData.append('name', reportForm.value.name);
    formData.append('description', reportForm.value.description);
    formData.append('location', reportForm.value.location);
    formData.append('contact', reportForm.value.contact);

    if (imageFile.value) {
        formData.append('imageFile', imageFile.value); // Pastikan key 'imageFile'
    }

    try {
        const response = await fetch(`${API_BASE_URL}/lost-cats`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${store.value.token}`
            },
            body: formData 
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Gagal mengirim laporan.')
        }

        alert('Laporan kucing hilang berhasil dikirim!');
        // 🔥 Redirect ke halaman daftar kucing hilang
        router.push('/lost-cats')
        
    } catch (error) {
        console.error('Error submitting report:', error)
        alert(`Gagal mengirim laporan: ${error.message}.`);
    }
}

</script>

<style scoped>
/* Tambahkan style untuk header-toggles jika belum ada di style.css global */
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
  background-color: var(--light-gray); /* Abu muda */
  color: var(--text-black);
  transition: all 0.2s;
}

.btn-toggle:hover {
  background-color: #d1d1d1;
}

.btn-toggle.active {
  background-color: var(--dark-green); /* Hijau tua */
  color: var(--white);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Sesuaikan padding main.page-content */
.page-content {
    padding-top: 3rem;
    padding-bottom: 3rem;
    background-color: var(--light-cream);
}
</style>