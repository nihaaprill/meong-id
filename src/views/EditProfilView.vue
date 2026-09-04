<template>
  <div class="edit-profile-page">
    <div class="container content-wrapper">
      <div class="edit-card">
        <h2>Edit Profil</h2>
        <p class="sub">Perbarui informasi pribadi Anda</p>

        <form @submit.prevent="saveProfile">
          
          <ImageUpload 
            label="Foto Profil"
            v-model="previewAvatar"
            @change="handleFileSelect"
          />

          <InputField 
            id="name"
            label="Nama Lengkap" 
            v-model="form.name" 
            placeholder="Nama Anda" 
          />
          
          <InputField 
            id="email"
            label="Email" 
            v-model="form.email" 
            placeholder="email@contoh.com" 
          />

          <InputField 
            id="phone"
            label="Nomor Telepon" 
            v-model="form.phone" 
            placeholder="0812..." 
          />

          <div class="buttons">
            <Button type="submit" :disabled="isLoading" :block="true">
              {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </Button>
            <button type="button" @click="$router.back()" class="btn-cancel">
              Batal
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store.js'
import ImageUpload from '@/components/ui/ImageUpload.vue'

const router = useRouter()
const isLoading = ref(false)
const API_BASE_URL = 'http://localhost:3000'

// Data Form Text
const form = reactive({
  name: '',
  email: '',
  phone: ''
})

// Data Gambar
const previewAvatar = ref('') // Untuk tampilan UI saja
const selectedFile = ref(null) // File asli yang akan diupload

// Setup Data Awal
onMounted(() => {
  if (store.value.user) {
    form.name = store.value.user.name
    form.email = store.value.user.email
    form.phone = store.value.user.phone || ''
    
    // Cek apakah avatar dari link luar atau lokal
    const avatarPath = store.value.user.avatar
    if (avatarPath) {
        previewAvatar.value = avatarPath.startsWith('http') ? avatarPath : `${API_BASE_URL}${avatarPath}`
    }
  }
})

// Simpan File saat user memilih gambar baru
const handleFileSelect = (file) => {
  selectedFile.value = file
}

const saveProfile = async () => {
  isLoading.value = true
  
  // Gunakan FormData untuk upload file
  const formData = new FormData()
  formData.append('name', form.name)
  formData.append('email', form.email)
  formData.append('phone', form.phone)
  
  // Hanya append jika ada file baru dipilih
  if (selectedFile.value) {
    formData.append('avatarFile', selectedFile.value)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'PUT',
      headers: {
        // Jangan set Content-Type secara manual saat pakai FormData!
        'Authorization': `Bearer ${store.value.token}`
      },
      body: formData
    });

    if (response.ok) {
      const updatedData = await response.json();
      
      // Update Store & LocalStorage
      store.value.user = updatedData;
      localStorage.setItem('user', JSON.stringify(updatedData));

      alert('Profil berhasil diperbarui! 🎉');
      router.push('/profile');
    } else {
      alert('Gagal memperbarui profil.');
    }
  } catch (e) {
    console.error(e);
    alert('Terjadi kesalahan koneksi.');
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.edit-profile-page { background-color: #F6F4EE; min-height: 100vh; padding: 2rem 0; }
.content-wrapper { max-width: 500px; margin: 0 auto; }

.edit-card {
  background: white; padding: 2.5rem; border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}
h2 { color: #333; margin-bottom: 0.2rem; }
.sub { color: #888; font-size: 0.9rem; margin-bottom: 2rem; }

.buttons { margin-top: 2rem; display: flex; flex-direction: column; gap: 10px; }

.btn-cancel {
  background: none; border: none; color: #666; font-weight: 600; cursor: pointer; padding: 10px;
}
.btn-cancel:hover { color: #333; text-decoration: underline; }
</style>