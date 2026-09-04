<template>
  <div class="donation-page">
    <transition name="slide-down">
      <div v-if="isSuccess" class="success-alert">
        <div class="alert-content">
          <div class="icon-check">✓</div>
          <div class="text">
            <h4>Alhamdulillah, Donasi Berhasil!</h4>
            <p>
              Terima kasih
              <b>{{ form.isAnonymous ? "Orang Baik" : form.name }}</b
              >, donasi Anda sangat berarti.
            </p>
          </div>
          <button @click="isSuccess = false" class="close-btn">✕</button>
        </div>
      </div>
    </transition>

    <PageHeader
      title="Mari Berbagi Kebaikan"
      subtitle="Sedikit bantuanmu, nyawa bagi mereka."
    />

    <div class="container main-content">
      <form @submit.prevent="submitDonation" class="form-grid">
        <div class="left-column">
          <div class="section-box">
            <h3 class="section-title">1. Mau donasi berapa?</h3>
            <div class="nominal-grid">
              <label
                v-for="amount in presets"
                :key="amount"
                class="nominal-card"
                :class="{ active: selectedNominal === amount }"
              >
                <input type="radio" v-model="selectedNominal" :value="amount" />
                <span class="amount-text">Rp {{ formatPrice(amount) }}</span>
                <div class="check-mark" v-if="selectedNominal === amount">
                  ✓
                </div>
              </label>

              <label
                class="nominal-card"
                :class="{ active: selectedNominal === 'custom' }"
              >
                <input type="radio" v-model="selectedNominal" value="custom" />
                <span class="amount-text">Nominal Lain</span>
              </label>
            </div>

            <div v-if="selectedNominal === 'custom'" class="custom-input-box">
              <span class="currency-label">Rp</span>
              <input
                type="number"
                v-model="customAmount"
                placeholder="Masukkan jumlah (min 10.000)"
                class="input-clean"
              />
            </div>
          </div>

          <div class="section-box">
            <h3 class="section-title">2. Metode Pembayaran</h3>
            <div class="payment-list">
              <label
                class="payment-item"
                :class="{ active: form.paymentMethod === 'qris' }"
              >
                <input type="radio" v-model="form.paymentMethod" value="qris" />
                <div class="payment-info">
                  <span class="payment-icon">📷</span>
                  <span>QRIS (Gopay, OVO, Dana)</span>
                </div>
                <div class="radio-circle"></div>
              </label>

              <label
                class="payment-item"
                :class="{ active: form.paymentMethod === 'bca' }"
              >
                <input type="radio" v-model="form.paymentMethod" value="bca" />
                <div class="payment-info">
                  <span class="payment-icon">🏦</span>
                  <span>Transfer Bank BCA</span>
                </div>
                <div class="radio-circle"></div>
              </label>

              <label
                class="payment-item"
                :class="{ active: form.paymentMethod === 'mandiri' }"
              >
                <input
                  type="radio"
                  v-model="form.paymentMethod"
                  value="mandiri"
                />
                <div class="payment-info">
                  <span class="payment-icon">🏦</span>
                  <span>Transfer Bank Mandiri</span>
                </div>
                <div class="radio-circle"></div>
              </label>
            </div>

            <transition name="fade">
              <div class="payment-details-box" v-if="form.paymentMethod">
                <div
                  v-if="form.paymentMethod === 'qris'"
                  class="details-content center-content"
                >
                  <p class="instruction">Scan QRIS di bawah ini:</p>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                    alt="QRIS"
                    class="qris-img"
                  />
                  <div class="merchant-info">
                    <h4>YAYASAN MEONG INDONESIA</h4>
                    <p>NMID: ID10200239485</p>
                  </div>
                </div>

                <div
                  v-else-if="form.paymentMethod === 'bca'"
                  class="details-content"
                >
                  <div class="bank-card bca-theme">
                    <div class="bank-header">
                      <span>BANK BCA</span><span>🏦</span>
                    </div>
                    <div class="bank-body">
                      <p class="rek-label">Nomor Rekening</p>
                      <h2 class="rek-number">123 456 7890</h2>
                      <p class="rek-name">a.n Yayasan Meong Indonesia</p>
                    </div>
                  </div>
                </div>

                <div
                  v-else-if="form.paymentMethod === 'mandiri'"
                  class="details-content"
                >
                  <div class="bank-card mandiri-theme">
                    <div class="bank-header">
                      <span>BANK MANDIRI</span><span>🏦</span>
                    </div>
                    <div class="bank-body">
                      <p class="rek-label">Nomor Rekening</p>
                      <h2 class="rek-number">098 765 4321</h2>
                      <p class="rek-name">a.n Yayasan Meong Indonesia</p>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <div class="right-column">
          <div class="section-box sticky-box">
            <h3 class="section-title">3. Data Donatur</h3>

            <div class="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                v-model="form.name"
                placeholder="Nama Lengkap"
                class="input-style"
                :disabled="form.isAnonymous"
                required
              />
            </div>

            <div class="form-group">
              <label>Email / WhatsApp (Opsional)</label>
              <input
                type="text"
                v-model="form.email"
                placeholder="Contoh: 0812xxx atau email@mail.com"
                class="input-style"
              />
            </div>

            <div class="form-group">
              <label>Pesan Dukungan</label>
              <textarea
                v-model="form.message"
                placeholder="Tulis doa untuk anabul..."
                rows="3"
                class="input-style"
              ></textarea>
            </div>

            <div class="toggle-box">
              <label class="switch-label">
                <input type="checkbox" v-model="form.isAnonymous" />
                <span class="slider round"></span>
              </label>
              <span class="toggle-text">Sembunyikan nama (Hamba Allah)</span>
            </div>

            <hr class="divider" />

            <h3 class="section-title mt-4">4. Bukti Pembayaran</h3>
            <div class="upload-area">
              <div v-if="form.proofImage" class="image-preview-box">
                <img
                  :src="form.proofImage"
                  alt="Bukti Bayar"
                  class="preview-img"
                />
                <button @click="removeImage" type="button" class="btn-remove">
                  Ganti Gambar
                </button>
              </div>

              <div v-else class="upload-placeholder">
                <input
                  type="file"
                  id="proof"
                  @change="handleFileUpload"
                  accept="image/*"
                  class="hidden-input"
                />
                <label for="proof" class="upload-label">
                  <span class="upload-icon">📤</span>
                  <span>Upload Bukti Transfer</span>
                  <small>Format: JPG/PNG (Max 2MB)</small>
                </label>
              </div>
            </div>

            <div class="form-action-container">
              <button
                type="submit"
                class="btn-donate-now"
                :disabled="isLoading"
              >
                <span class="btn-content">
                  <span v-if="isLoading">Memproses...</span>
                  <span v-else>
                    Konfirmasi Donasi <br />
                    <strong v-if="finalAmount > 0" class="nominal-display"
                      >Rp {{ formatPrice(finalAmount) }}</strong
                    >
                  </span>
                </span>
                <span class="arrow-icon">➜</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, reactive, computed, onMounted } from "vue";
import { store } from "../store.js";

const route = useRoute();
const isLoading = ref(false);
const isSuccess = ref(false);

// Pilihan nominal
const presets = [10000, 25000, 50000, 100000, 250000, 500000];
const selectedNominal = ref(50000);
const customAmount = ref("");

const form = reactive({
  name: "",
  email: "",
  message: "",
  paymentMethod: "qris",
  isAnonymous: false,
  proofImage: null, // Untuk menyimpan string Base64
});

onMounted(() => {
  if (store.value.isLoggedIn && store.value.user) {
    form.name = store.value.user.name;
    form.email = store.value.user.email;
  }
});

const finalAmount = computed(() => {
  if (selectedNominal.value === "custom") {
    return parseInt(customAmount.value) || 0;
  }
  return selectedNominal.value;
});

const formatPrice = (value) => new Intl.NumberFormat("id-ID").format(value);

// Fungsi Upload Gambar ke Base64
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar (Max 2MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      form.proofImage = e.target.result; // Simpan sebagai Base64 string
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  form.proofImage = null;
};

const submitDonation = async () => {
  if (finalAmount.value < 10000) {
    alert("Mohon maaf, minimal donasi adalah Rp 10.000 🙏");
    return;
  }

  // Validasi Bukti Bayar (Opsional, tapi disarankan wajib jika transfer manual)
  if (!form.proofImage && form.paymentMethod !== "qris") {
    // Jika pakai QRIS mungkin otomatis (di real app), tapi kalau transfer bank butuh bukti
    // Di sini kita buat opsional saja atau warning
    if (
      !confirm(
        "Apakah Anda yakin sudah transfer? Sebaiknya lampirkan bukti pembayaran."
      )
    )
      return;
  }

  isLoading.value = true;

  const donationData = {
    amount: finalAmount.value,
    paymentMethod: form.paymentMethod,
    message: form.message,
    proofImage: form.proofImage, // Kirim gambar ke backend
    campaignId: route.params.id || 1,
    donorId: store.value.isLoggedIn ? store.value.user.id : null,
  };

  try {
    const response = await fetch("http://localhost:3000/donations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(store.value.token && {
          Authorization: `Bearer ${store.value.token}`,
        }),
      },
      body: JSON.stringify(donationData),
    });

    const result = await response.json();

    if (response.ok) {
      isSuccess.value = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
      form.message = "";
      form.proofImage = null;
      if (!store.value.isLoggedIn) {
        form.name = "";
        form.email = "";
      }
    } else {
      alert(result.message || "Gagal donasi");
    }
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan koneksi");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.donation-page {
  background-color: #f6f4ee;
  min-height: 100vh;
  padding-bottom: 4rem;
  font-family: "Nunito", sans-serif;
}

/* --- ALERT SUKSES --- */
.success-alert {
  position: fixed;
  top: 20px;
  left: 0;
  width: 100%;
  z-index: 2000;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
}
.alert-content {
  background-color: #4caf50;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
}
.icon-check {
  background: white;
  color: #4caf50;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 1rem;
}

/* --- LAYOUT GRID (DESKTOP & MOBILE) --- */
.container.main-content {
  max-width: 1100px; /* Lebar desktop */
  margin: -2rem auto 0;
  position: relative;
  z-index: 10;
  padding: 0 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1.8fr 1.2fr; /* Kiri lebih lebar sedikit */
  gap: 2.5rem; /* Jarak antar kolom */
  align-items: start;
}

/* --- RESPONSIVE (HP) --- */
@media (max-width: 900px) {
  .form-grid {
    grid-template-columns: 1fr; /* Jadi 1 kolom di HP */
    gap: 1.5rem;
  }
}

/* --- CARD STYLING --- */
.section-box {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;
  border: 1px solid #f0f0f0;
}

.section-box.sticky-box {
  position: sticky;
  top: 100px; /* Agar card kanan ngikut pas scroll di desktop */
}

.section-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.8rem;
}

/* --- NOMINAL --- */
.nominal-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
@media (max-width: 600px) {
  .nominal-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.nominal-card {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: 0.2s;
  font-weight: 700;
  color: #4a5568;
}
.nominal-card:hover {
  border-color: #a9c47f;
  background: #f9fff5;
}
.nominal-card.active {
  border-color: #a9c47f;
  background: #a9c47f;
  color: white;
  box-shadow: 0 4px 10px rgba(169, 196, 127, 0.4);
}
.nominal-card input {
  display: none;
}
.check-mark {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
  color: #a9c47f;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Custom Input */
.custom-input-box {
  margin-top: 1rem;
  position: relative;
}
.currency-label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  color: #4c6a4c;
}
.input-clean {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  outline: none;
}
.input-clean:focus {
  border-color: #a9c47f;
}

/* --- PAYMENT METHODS --- */
.payment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}
.payment-item.active {
  border-color: #a9c47f;
  background-color: #f9fff5;
}
.payment-item input {
  display: none;
}
.payment-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #2d3748;
}
.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e0;
  border-radius: 50%;
  position: relative;
}
.payment-item.active .radio-circle {
  border-color: #a9c47f;
}
.payment-item.active .radio-circle::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: #a9c47f;
  border-radius: 50%;
}

/* --- INFO REKENING / QRIS --- */
.payment-details-box {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px dashed #cbd5e0;
}
.qris-img {
  justify-content: center;
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
  border: 1px solid #eee;
  margin: 1rem 0;
}
.center-content {
  text-align: center;
}
.bank-card {
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
}
.bca-theme {
  background: linear-gradient(135deg, #005b9f, #004070);
}
.mandiri-theme {
  background: linear-gradient(135deg, #003d79, #f39c12);
}
.bank-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  opacity: 0.9;
  margin-bottom: 1rem;
}
.rek-number {
  font-size: 1.6rem;
  font-family: monospace;
  letter-spacing: 1px;
  margin-bottom: 0.2rem;
}
.rek-name {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* --- FORM INPUTS (KANAN) --- */
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.4rem;
  display: block;
}
.input-style {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-family: inherit;
}
.input-style:focus {
  border-color: #a9c47f;
  outline: none;
  box-shadow: 0 0 0 3px rgba(169, 196, 127, 0.1);
}

/* Switch */
.toggle-box {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.5rem;
  cursor: pointer;
}
.switch-label {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}
.switch-label input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  transition: 0.4s;
  border-radius: 34px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #a9c47f;
}
input:checked + .slider:before {
  transform: translateX(18px);
}
.toggle-text {
  font-size: 0.9rem;
  color: #4a5568;
}

/* --- UPLOAD AREA --- */
.upload-area {
  margin-bottom: 1.5rem;
}
.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border: 2px dashed #cbd5e0;
  border-radius: 10px;
  cursor: pointer;
  background: #f9fafb;
  transition: 0.2s;
}
.upload-label:hover {
  border-color: #a9c47f;
  background: #f0fff4;
}
.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.hidden-input {
  display: none;
}
.image-preview-box {
  text-align: center;
}
.preview-img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 0.5rem;
}
.btn-remove {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
}

/* --- BUTTON DONASI --- */
.form-action-container {
  margin-top: 2rem;
}
.btn-donate-now {
  width: 100%;
  background-color: #33888c;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;
  box-shadow: 0 4px 15px rgba(51, 136, 140, 0.3);
}
.btn-donate-now:hover {
  background-color: #2b7578;
  transform: translateY(-2px);
}
.btn-donate-now:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
  box-shadow: none;
}
.btn-content {
  text-align: left;
  line-height: 1.2;
}
.nominal-display {
  display: block;
  font-size: 1.3rem;
  color: #fff;
  margin-top: 2px;
}

@media (max-width: 480px) {
  .section-box.sticky-box {
    position: static;
  }
  .btn-donate-now {
    padding: 0.8rem 1.2rem;
  }
  .arrow-icon {
    display: none;
  }
  .nominal-display {
    font-size: 1.1rem;
  }
}
</style>
