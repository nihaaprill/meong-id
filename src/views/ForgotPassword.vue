<template>
  <div class="auth-container">
    <div class="auth-content">
      <div class="auth-form-section">
        <div class="auth-form-wrapper">
          <div class="auth-logo">
            <span class="logo-icon">🐾</span>
            <span class="logo-text">Meong id</span>
          </div>
          <h1 class="auth-title">Lupa Password?</h1>
          <p class="auth-subtitle">
            Jangan khawatir! Masukkan email-mu dan kami akan kirimkan link untuk reset password.
          </p>

          <form class="auth-form" @submit.prevent="handleReset">
            
            <InputField 
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              v-model="email"
              required
            />

            <Button type="submit" variant="primary" :block="true">
              Kirim Link Reset
            </Button>
          </form>

          <p class="auth-footer">
            Ingat password-mu? 
            <RouterLink to="/login" class="link">Login di sini</RouterLink>
          </p>

        </div>
      </div>

      <div class="auth-image-section">
        <img src="/kucing.png" alt="Happy rescued cat">
        <div class="auth-image-overlay">
          <h2>Satu Langkah Lagi</h2>
          <p>Kami akan membantumu kembali ke akunmu.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Buat "wadah" reaktif untuk data form
const email = ref('')

const handleReset = () => {
  // Nanti, kamu bisa tambahkan logika kirim email sesungguhnya di sini
  console.log('Password reset requested for:', email.value)
  alert('Link reset password telah dikirim ke email-mu! (Hanya demo)')
  // Kosongkan field email setelah submit
  email.value = ''
}
</script>

<style scoped>
/* Halaman ini akan otomatis menggunakan style global dari
  'style.css' untuk .auth-container, .auth-content, dll.
  Kita tidak perlu menambahkan banyak style di sini.
*/
.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}
</style>