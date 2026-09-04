require('dotenv').config();

async function checkModelsManual() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ API Key tidak ditemukan di .env");
    return;
  }

  console.log("🔍 Sedang mengecek daftar model ke server Google...");
  
  try {
    // Kita tembak langsung endpoint Google (bukan lewat library)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      console.error("\n❌ Gagal! Pesan Error dari Google:");
      console.error(data.error.message);
      return;
    }

    if (!data.models) {
      console.log("\n⚠️ Tidak ada model yang ditemukan. Akun ini mungkin belum aktif sepenuhnya.");
      return;
    }

    console.log("\n✅ SUKSES! Berikut model yang BISA kamu pakai:");
    
    // Filter hanya model 'generateContent' (yang bisa buat chat)
    const availableModels = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name.replace("models/", ""));

    availableModels.forEach(name => console.log(`- ${name}`));

    console.log("\n👉 SARAN PERBAIKAN:");
    if (availableModels.includes("gemini-1.5-flash")) {
      console.log(`Ubah index.js baris 'model' menjadi: "gemini-1.5-flash"`);
    } else if (availableModels.length > 0) {
      console.log(`Ubah index.js baris 'model' menjadi: "${availableModels[0]}"`);
    } else {
      console.log("Model tidak tersedia. Coba buat API Key baru di Project Google Cloud yang berbeda.");
    }

  } catch (error) {
    console.error("\n❌ Error Koneksi:", error.message);
  }
}

checkModelsManual();