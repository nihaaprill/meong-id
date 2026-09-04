import { ref, reactive } from 'vue'


const savedUser = JSON.parse(localStorage.getItem('user'))
const savedToken = localStorage.getItem('token')

export const store = ref({
  isLoggedIn: !!savedToken,
  isSidebarOpen: false,
  user: savedUser || null,
  token: savedToken || null
})

// --- FITUR TOAST GLOBAL ---
// Kita pakai reactive object biasa untuk event bus sederhana
export const toastState = reactive({
  trigger: null // Akan diisi object { msg, type, id } saat ada notif
})

// Fungsi helper untuk memanggil toast
export const showToast = (message, type = 'success') => {
  toastState.trigger = { message, type, id: Date.now() }
}

// Fungsi helper untuk Toggle Dark Mode
export const toggleTheme = () => {
  store.value.isDarkMode = !store.value.isDarkMode
  localStorage.setItem('theme', store.value.isDarkMode ? 'dark' : 'light')
  applyTheme()
}

// Terapkan tema ke body
export const applyTheme = () => {
  if (store.value.isDarkMode) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
}

// Fungsi helper untuk login (simpan ke localStorage)
export const login = (token, userData) => {
  store.value.isLoggedIn = true
  store.value.token = token
  store.value.user = userData
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(userData))
  showToast(`Selamat datang kembali, ${userData.name}!`, 'success')
}

// Fungsi helper untuk logout (hapus dari localStorage)
export const logout = () => {
  store.value.isLoggedIn = false
  store.value.token = null
  store.value.user = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  showToast('Anda telah keluar.', 'info')
}