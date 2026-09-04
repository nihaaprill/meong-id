<template>
  <div class="auth-container">
    <div class="auth-content">
      <div class="auth-form-section">
        <div class="auth-form-wrapper">
          <div class="auth-logo">
            <span class="logo-icon">🐾</span>
            <span class="logo-text">Meong.id</span>
          </div>
          <h1 class="auth-title">Selamat datang</h1>
          <p class="auth-subtitle">Masukkan akun Anda untuk melanjutkan.</p>

          <form class="auth-form" @submit.prevent="handleLogin">
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              v-model="email"
              required
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              v-model="password"
              required
            />

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" name="remember" />
                <span>Ingat saya</span>
              </label>
              <RouterLink to="/forgot-password" class="link">Lupa Password?</RouterLink>
            </div>

            <Button type="submit" variant="primary" :block="true" :disabled="isLoading">
              {{ isLoading ? 'Memuat...' : 'Masuk' }}
            </Button>
          </form>

          <p class="auth-footer">
            Tidak punya akun?
            <RouterLink to="/signup" class="link">Buat Akun</RouterLink>
          </p>

          <RouterLink to="/" class="back-link">← Kembali ke beranda</RouterLink>
        </div>
      </div>

      <div class="auth-image-section">
        <img src="/kucing.png" alt="Meong.id" />
        <div class="auth-image-overlay">
          <h2>Selamat datang di Meong.id</h2>
          <p>Kami senang melihatmu kembali</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { store, login, showToast } from '../store.js'; // Import showToast

const router = useRouter();
const email = ref("");
const password = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true; // Tampilkan status loading di tombol
  
  try {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${API_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: email.value,
    password: password.value
  })
});

    const data = await response.json();

    if (response.ok) {
      // SUKSES: Panggil fungsi login dari store
      // (Fungsi login di store.js sudah ada showToast 'Selamat datang', jadi kita tidak perlu panggil lagi disini agar tidak double)
      login(data.token, data.user);
      
      router.push("/profile");
    } else {
      // GAGAL: Tampilkan Toast Error
      showToast(data.message || "Login gagal, periksa email/password.", "error");
    }

  } catch (error) {
    console.error("Error:", error);
    showToast("Terjadi kesalahan koneksi ke server", "error");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Style tetap sama */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
</style>