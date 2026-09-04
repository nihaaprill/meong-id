# Meong.id 🐾 - Platform Kesejahteraan Kucing

Meong.id adalah aplikasi web berbasis Vue 3 yang didedikasikan untuk membangun komunitas dan menyediakan sumber daya bagi pecinta kucing di Indonesia. Misi kami adalah untuk memfasilitasi adopsi, membantu menemukan kucing hilang, menyediakan informasi tepercaya, dan menghubungkan shelter dengan para donatur.

![Build Status](https://img.shields.io/github/actions/workflow/status/USER/REPO/ci.yml?branch=main)
![Vue.js](https://img.shields.io/badge/Vue.js-3.4.0-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite)
![Lisensi](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🌟 Fitur Utama

Proyek ini memiliki serangkaian fitur yang komprehensif, dibagi menjadi dua bagian: untuk tamu (publik) dan untuk anggota (setelah login).

### 1. Fitur Publik (Sebelum Login)
* **Navbar Publik:** Navigasi sederhana yang berisi:
    * Beranda
    * Artikel
    * Donasi
    * Tentang Kami
    * Tombol Login
* **Halaman Beranda:** Halaman sambutan dengan ringkasan fitur.
* **Halaman Artikel:** Melihat daftar semua artikel.
* **Halaman Donasi (Anonim):** Menampilkan informasi rekening bank dan e-wallet untuk donasi manual.
* **Halaman Tentang Kami:** Menampilkan misi platform dan tim pengembang.
* **Alur Autentikasi:**
    * Halaman Registrasi (`/signup`)
    * Halaman Login (`/login`)
    * Halaman Lupa Password (`/forgot-password`)

### 2. Fitur Anggota (Setelah Login)
* **Layout Sidebar:** Seluruh navigasi berubah dari Navbar atas menjadi Sidebar di sebelah kiri.
* **Sidebar Interaktif:** Sidebar dapat disembunyikan (minimize) dan dibuka (expand).
* **Halaman Profil:**
    * Melihat data diri (`/profile`).
    * Tombol untuk "Edit Profil".
    * Tombol "Logout" yang mengembalikan state ke publik.
* **Halaman Edit Profil:** Form untuk memperbarui nama dan email pengguna.
* **Halaman Adopsi:**
    * Melihat daftar kucing yang siap diadopsi.
    * Membuka modal (popup) untuk mengajukan form adopsi.
    * Membuka modal untuk mendaftarkan kucing yang ingin diadopsikan.
* **Halaman Lapor Kucing:**
    * **Lapor Kucing Hilang (`/report`):** Form untuk melaporkan kucing yang hilang.
    * **Lihat Kucing Hilang (`/lost-cats`):** Galeri kucing yang sedang dicari.
* **Halaman Komunitas:**
    * Forum interaktif untuk membuat, membaca, dan mengomentari postingan.
    * Membuat postingan baru (dengan gambar) melalui modal (popup).
* **Halaman RS & Shelter:** Daftar Rumah Sakit Hewan dan Shelter, lengkap dengan filter pencarian.
* **Halaman Donasi (Member):** Form donasi interaktif yang sudah terisi data pengguna (nama & email) dan memiliki pilihan metode pembayaran.

---

## 🚀 Cara Menjalankan Proyek (Setup Lokal)

Ini adalah panduan untuk anggota tim agar dapat menjalankan proyek ini di komputer mereka.

1.  **Clone Repositori**
    Gunakan `git clone` untuk mengunduh salinan proyek dari GitHub.
    ```bash
    git clone [https://github.com/rabbaniez23/tubes_web_keren.git](https://github.com/rabbaniez23/tubes_web_keren.git)
    ```

2.  **Masuk ke Direktori Proyek**
    ```bash
    cd tubes_web_keren
    ```

3.  **Install Dependencies**
    Proyek ini menggunakan `npm`. Perintah ini akan membaca `package.json` dan menginstall semua *package* yang diperlukan (seperti Vue, Vue Router, Vite).
    ```bash
    npm install
    ```

4.  **Jalankan Server Development**
    Perintah ini akan menyalakan server lokal (Hot-Reload) menggunakan Vite.
    ```bash
    npm run dev
    ```

5.  **Buka di Browser**
    Buka browser dan kunjungi `http://localhost:5173` (atau alamat apa pun yang muncul di terminalmu).

---

## 🏛️ Arsitektur & Alur Logika Web

Memahami bagaimana aplikasi ini bekerja sangat penting untuk kolaborasi.

### 1. Titik Masuk: `main.js`

File `src/main.js` adalah "pabrik" aplikasi. Tugas utamanya adalah:
1.  Membuat aplikasi Vue (`createApp(App)`).
2.  Memberi tahu Vue untuk menggunakan `router` (`app.use(router)`).
3.  Memuat CSS global dari `src/assets/style.css`.
4.  **Mendaftarkan Komponen UI secara Global:** Semua komponen di `src/components/ui/` (seperti `Button`, `Card`, `InputField`, `SelectField`, `TextArea`, `SectionTitle`, dan `PageHeader`) didaftarkan di sini. Ini berarti kamu bisa menggunakannya di file `.vue` mana pun tanpa perlu meng-impor-nya.

### 2. "Otak" State: `store.js`

Ini adalah file terpenting untuk logika aplikasi. `src/store.js` adalah "papan pengumuman" global yang memberi tahu seluruh aplikasi apa yang sedang terjadi.

* `isLoggedIn: false`: Ini adalah saklar utama. `false` berarti pengguna adalah tamu (tampilkan Navbar). `true` berarti pengguna adalah anggota (tampilkan Sidebar).
* `user: null`: Menyimpan data pengguna (nama, email) setelah mereka login.
* `isSidebarOpen: true`: Mengontrol apakah sidebar (saat login) sedang terbuka atau tertutup.

### 3. "Bungkus" Utama: `App.vue`

File `src/App.vue` adalah komponen induk dari *seluruh* halaman. Ia membaca `store.js` dan secara dinamis:

* Menampilkan `<Navbar v-if="!store.isLoggedIn" />` ATAU `<Sidebar v-if="store.isLoggedIn" />`.
* Menampilkan `<button>` "hamburger" *hanya* jika `store.isLoggedIn` adalah `true`.
* Mengikat *class* `.sidebar-open` ke elemen `#app` berdasarkan `store.isSidebarOpen`.
* Menggeser `<main>` dan `<FooterComp>` menggunakan CSS saat sidebar buka/tutup.
* Menampilkan `<RouterView />`, yang merupakan tempat di mana semua halaman (views) akan dirender.

### 4. "Peta" Navigasi: `router/index.js`

File `src/router/index.js` adalah "Peta" atau "Daftar Isi" website. Ia memberi tahu Vue:
* Saat pengguna mengunjungi `/`, tampilkan `HomeView.vue`.
* Saat pengguna mengunjungi `/login`, tampilkan `LoginView.vue`.
* Saat pengguna mengunjungi `/articles/:id`, tampilkan `ArticleDetailView.vue`.
* Dan seterusnya untuk semua halaman.

### 5. Struktur Folder

```
/
├── public/           # Aset statis (gambar .png, .jpg) yang disalin langsung.
├── src/
│   ├── assets/       # File CSS global (style.css).
│   ├── components/   # Komponen "besar" (layout).
│   │   ├── Footer.vue
│   │   ├── Navbar.vue
│   │   └── Sidebar.vue
│   │
│   ├── components/ui/ # Komponen "kecil" yang bisa dipakai ulang (UI Kit).
│   │   ├── Button.vue
│   │   ├── Card.vue
│   │   ├── InputField.vue
│   │   ├── PageHeader.vue
│   │   ├── SectionTitle.vue
│   │   ├── SelectField.vue
│   │   └── TextArea.vue
│   │
│   ├── router/       # Peta navigasi (router).
│   │   └── index.js
│   │
│   ├── views/        # Semua halaman utama (satu halaman per file).
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── ProfilView.vue
│   │   ├── AdoptionView.vue
│   │   └── ... (dan semua halaman lainnya)
│   │
│   ├── App.vue       # Komponen induk/utama (layout global).
│   ├── main.js       # Titik masuk aplikasi (pabrik).
│   └── store.js      # "Otak" / Papan pengumuman (state global).
│
├── index.html        # File HTML tunggal.
├── package.json      # Daftar dependensi & skrip.
└── README.md         # File ini.
```

---

## 🌳 Alur Kerja Git & Kolaborasi (Sangat Penting!)

Ini adalah aturan wajib untuk tim kita agar tidak terjadi konflik dan agar Vercel (hosting) kita tetap stabil.

### Aturan Emas: JANGAN PERNAH PUSH LANGSUNG KE `main`

Branch `main` adalah kode produksi kita. Vercel secara otomatis men-deploy apa pun yang ada di `main`. Jika kamu push kode yang rusak ke `main`, website-nya akan rusak.

Kita **HARUS** menggunakan alur kerja **Feature Branch** dan **Pull Request**.

### Alur Kerja Langkah-demi-Langkah (Untuk SEMUA Fitur)

Ini adalah langkah yang harus diikuti *setiap kali* kamu ingin membuat fitur baru atau memperbaiki bug:

**1. Mulai dari `main` yang Terbaru**
Pastikan kodemu di komputer (lokal) sama dengan yang ada di GitHub.
```bash
git checkout main
git pull origin main
```

**2. Buat Branch Baru (Area Kerjamu)**
Buat "cabang" baru dari `main` untuk tempatmu bekerja. Beri nama yang jelas.

*Contoh untuk fitur baru:*
```bash
git checkout -b fitur/halaman-artikel-detail
```
*Contoh untuk memperbaiki bug:*
```bash
git checkout -b bug/sidebar-tidak-mau-tutup
```

**3. Kerjakan Kodemu & Commit**
Sekarang kamu aman bekerja di branch `fitur/halaman-artikel-detail`.
Setelah selesai mengerjakan, lakukan commit:
```bash
git add .
git commit -m "feat: membuat halaman detail artikel"
```

**4. Push Branch-mu ke GitHub**
Upload branch barumu ke repositori GitHub.
```bash
git push origin fitur/halaman-artikel-detail
```

**5. Buka Pull Request (PR)**
* Buka halaman repositori Meong.id di GitHub.
* Kamu akan melihat tombol kuning "Compare & pull request" untuk branch-mu. Klik itu.
* Beri judul (misal: "Membuat Halaman Detail Artikel") dan tulis deskripsi singkat.
* Di sebelah kanan, klik "Reviewers" dan **tag (mention) 3 anggota tim lainnya** untuk memeriksa kodemu.

**6. Review, Setujui, dan Merge**
* Tiga anggota tim lainnya akan membuka PR-mu, melihat kodemu, dan mungkin memberi komentar ("Ini sudah bagus", "Tolong perbaiki ini").
* **HANYA SETELAH** minimal satu (atau dua) orang menyetujui (Approve) PR-mu, kamu boleh menekan tombol hijau **"Merge pull request"**.

**7. Selesai!**
* Kodemu sekarang aman masuk ke `main`.
* Vercel akan mendeteksi perubahan di `main` dan otomatis men-deploy ulang website-mu.
* Kamu sekarang bisa menghapus branch-mu (ada tombolnya setelah merge) dan kembali ke Langkah 1 untuk fitur berikutnya.

---

## 📜 Skrip yang Tersedia

* **`npm run dev`**: Menjalankan server development Vite dengan Hot-Reload.
* **`npm run build`**: Meng-compile aplikasi untuk produksi. Hasilnya akan ada di folder `dist`.
* **`npm run preview`**: Menjalankan server lokal untuk melihat hasil dari folder `dist` (uji coba produksi).
