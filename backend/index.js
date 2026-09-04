// meong-id-backend/index.js
require('dotenv').config(); 

const fastify = require('fastify')({ 
  logger: true,
  bodyLimit: 30 * 1024 * 1024 // Izinkan upload sampai 30MB
});
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- KONFIGURASI AI (GEMINI) ---
// Cek apakah API Key ada. Jika tidak, beri peringatan di terminal
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ PERINGATAN: GEMINI_API_KEY belum ada di file .env!");
} else {
  console.log("✅ Gemini API Key ditemukan.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");
// Gunakan 'gemini-pro' karena lebih stabil untuk chat teks
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// 🔥 Perbaikan: Tambahkan impor untuk path dan fs
const path = require('path');
const fs = require('fs');

// --- PERBAIKAN VERCEL ---
// Cek apakah sedang di Vercel (Production) atau di Laptop (Local)
const isProduction = process.env.NODE_ENV === 'production';

// Di Vercel, kita hanya boleh tulis ke folder '/tmp'. 
// Di Laptop, tetap ke folder 'uploads/images'
const uploadDir = isProduction 
  ? '/tmp' 
  : path.join(__dirname, 'uploads', 'images');

// Gunakan try-catch agar jika gagal buat folder, aplikasi TIDAK CRASH/MATI
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Folder ${uploadDir} berhasil dibuat!`);
  }
} catch (error) {
  console.log("⚠️ Peringatan: Gagal buat folder (Wajar di Vercel Read-Only):", error.message);
}


// --- 1. SETUP & PLUGINS ---
// KODE BARU (PERBAIKAN)
// --- 1. SETUP & PLUGINS ---
fastify.register(require('@fastify/cors'), {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://meong-id.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
});

fastify.register(require('@fastify/jwt'), {
  secret: 'kunci_rahasia_meong_id_12345' // Ganti string ini saat produksi
});

// Middleware untuk proteksi rute (Cek apakah user sudah login)
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ message: 'Akses ditolak, silakan login' });
  }
});

//tambahan untuk upload file
fastify.register(require('@fastify/multipart'), {
  limits: {
    fileSize: 5 * 1024 * 1024, // Contoh batas 5MB
  }
});

//tambahan untuk akses file statis (gambar upload)
fastify.register(require('@fastify/static'), {
    root: uploadDir, // Gunakan variabel 'uploadDir' yang sudah aman tadi
    prefix: '/uploads/images', 
    decorateReply: false
});

// --- 2. RUTE AUTENTIKASI (User) ---

// Register
fastify.post('/register', async (request, reply) => {
  const { name, email, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });
    return { message: 'Registrasi berhasil', user: { id: user.id, name: user.name } };
  } catch (e) {
    console.error("Error saat registrasi:", e);
    reply.code(400).send({ message: 'Terjadi kesalahan pada database (atau Email sudah terdaftar). Cek console backend.' });
  }
});

// Login
fastify.post('/login', async (request, reply) => {
  const { email, password } = request.body;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return reply.code(401).send({ message: 'Email atau password salah' });
  }
  
  const token = fastify.jwt.sign({ id: user.id, role: user.role });
  return { 
    message: 'Login berhasil', 
    token, 
    user: { id: user.id, name: user.name, email: user.email, role: user.role } 
  };
});

// Cek Profil (Butuh Login)
fastify.get('/me', { onRequest: [fastify.authenticate] }, async (req) => {
  return await prisma.user.findUnique({ 
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, phone: true, avatar: true }
  });
});

// Update Profil (Dengan Upload Gambar)
fastify.put('/me', { onRequest: [fastify.authenticate] }, async (req, reply) => {
  const parts = req.parts();
  let avatarURL = undefined; // undefined artinya "jangan ubah kalau gak ada upload"
  const updateData = {};

  // Loop untuk memisahkan File dan Text
  for await (const part of parts) {
    if (part.type === 'file') {
      // Proses Upload File
      const ext = path.extname(part.filename);
      // Nama file unik: avatar-USERID-TIMESTAMP.jpg
      const newFilename = `avatar-${req.user.id}-${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, newFilename);
      
      await fs.promises.writeFile(filePath, await part.toBuffer());
      
      // Simpan path relatif
      avatarURL = `/uploads/images/${newFilename}`;
    } else {
      // Proses Data Teks (name, email, phone)
      updateData[part.fieldname] = part.value;
    }
  }

  // Jika ada avatar baru, masukkan ke data update
  if (avatarURL) {
    updateData.avatar = avatarURL;
  }

  // Update Database
  return await prisma.user.update({
    where: { id: req.user.id },
    data: updateData
  });
});


// --- 3. RUTE ARTIKEL (LENGKAP CRUD + UPLOAD GAMBAR) ---

// Ambil Semua Artikel (Dari Database)
fastify.get('/articles', async () => {
  return await prisma.article.findMany({
    orderBy: { createdAt: 'desc' }
  });
});


// Ambil Detail Artikel Dari Database
fastify.get('/articles/:id', async (req, reply) => {
  const id = Number(req.params.id);

  const article = await prisma.article.findUnique({
    where: { id }
  });

  if (!article) {
    return reply.code(404).send({ message: "Artikel tidak ditemukan" });
  }

  return article;
});


// --- 4. RUTE ADOPSI ---

// Ambil Daftar Kucing Tersedia
fastify.get('/adoptions', async (req) => {
  const { search, race, age, location } = req.query; // Ambil parameter query
  const where = { status: 'AVAILABLE' };


  
  // 1. Filter Search (mencari berdasarkan nama atau deskripsi)
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }


  // 2. Filter Race
  if (race) {
    where.race = race;
  }
  
  // 3. Filter Age
  if (age) {
    where.age = age;
  }

  // 4. Filter Location
  if (location) {
    where.location = location;
  }

  return await prisma.adoptionListing.findMany({
    where: where,
    orderBy: { createdAt: 'desc' },
    include: { owner: { select: { name: true, phone: true } } }
  });
});

// index.js (Tambahkan di bawah fastify.get('/adoptions', ...))

// 🔥 RUTE WAJIB: Ambil Detail Satu Listing Adopsi
fastify.get('/adoptions/:id', async (req, reply) => {
    const listingId = Number(req.params.id);

    const listing = await prisma.adoptionListing.findUnique({
        where: { id: listingId },
        include: { 
            owner: { select: { name: true, phone: true } } // Sertakan info pemilik
        }
    });

    if (!listing) {
        return reply.code(404).send({ message: 'Listing Adopsi tidak ditemukan' });
    }

    return listing;
});

// Daftarkan Kucing Baru (Butuh Login)
fastify.post('/adoptions', { onRequest: [fastify.authenticate] }, async (req, reply) => {
 // 🔥 PERUBAHAN: Gunakan req.parts() untuk mengurai multipart stream
  const parts = req.parts();
  // Cek dan simpan file gambar (jika ada)
  let imageURL = null;
  const adoptionData = {};

  // Asumsi field gambar bernama 'imageFile'
  for await (const part of parts) {
    if (part.type === 'file') {
      // Ini adalah file
      const originalFilename = part.filename;
      const ext = path.extname(originalFilename);
      const newFilename = `${Date.now()}-${req.user.id}${ext}`;
      const filePath = path.join(uploadDir, newFilename); // Gunakan variable uploadDir
      
      // Simpan file ke disk
      await fs.promises.writeFile(filePath, await part.toBuffer());
      imageURL = `/uploads/images/${newFilename}`;
      
    } else {
      // Ini adalah field data (name, description, race, dll.)
      adoptionData[part.fieldname] = part.value;
    }
  }

  // HARUS MENGGUNAKAN adoptionData
  const { name, description, race, age, gender, location } = adoptionData;

  if (!name) {
    return reply.code(400).send({ message: 'Nama kucing diperlukan.' });
  }

  return await prisma.adoptionListing.create({
    data: {
      name, description, race, age, gender, location, 
      image: imageURL, // Simpan URL gambar yang baru
      ownerId: req.user.id
    }
  });
});

// Lamar Adopsi (Butuh Login)
fastify.post('/adoptions/:id/apply', { onRequest: [fastify.authenticate] }, async (req) => {
  const { message } = req.body;
  const listingId = Number(req.params.id);

  // Cek apakah listing ada
  const listing = await prisma.adoptionListing.findUnique({ where: { id: listingId } });
  if (!listing) throw new Error('Listing tidak ditemukan');

  return await prisma.adoptionApplication.create({
    data: {
      message,
      listingId,
      applicantId: req.user.id
    }
  });
});

fastify.patch('/applications/:id/status', { onRequest: [fastify.authenticate] }, async (req, reply) => {
    const applicationId = Number(req.params.id);
    const { status } = req.body; // Status: 'APPROVED' atau 'REJECTED'

    const application = await prisma.adoptionApplication.findUnique({ 
        where: { id: applicationId },
        include: { listing: true }
    });

    if (!application) {
        return reply.code(404).send({ message: 'Lamaran tidak ditemukan.' });
    }
    
    // Cek Izin: Hanya pemilik listing yang boleh mengubah status aplikasi
    if (application.listing.ownerId !== req.user.id) {
        return reply.code(403).send({ message: 'Akses ditolak.' });
    }

    // 1. Update Status Aplikasi
    const updatedApp = await prisma.adoptionApplication.update({
        where: { id: applicationId },
        data: { status: status }
    });

    // 2. Jika DITERIMA, ubah status listing menjadi ADOPTED
    if (status === 'APPROVED') {
        await prisma.adoptionListing.update({
            where: { id: application.listingId },
            data: { status: 'ADOPTED' }
        });
    }

    return updatedApp;
});


// --- 5. RUTE LAPOR KUCING HILANG ---

// Lihat Daftar Kucing Hilang
fastify.get('/lost-cats', async (req) => {
  const { search, location } = req.query;
  const where = { status: 'LOST' };

  // 1. Filter Search (mencari berdasarkan nama atau deskripsi)
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  // 2. Filter Location
  if (location) {
    where.location = location;
  }

  return await prisma.lostCatReport.findMany({
    where: where,
    orderBy: { createdAt: 'desc' },
    include: { reporter: { select: { name: true } } }
  });
});

// Buat Laporan (Butuh Login)
fastify.post('/lost-cats', { onRequest: [fastify.authenticate] }, async (req, reply) => {
    // 🔥 Gunakan req.parts() untuk mengurai multipart stream
    const parts = req.parts(); 
    
    let imageURL = null;
    const reportData = {}; // Objek untuk menyimpan field data

    // Loop melalui setiap bagian (part) dari form
    for await (const part of parts) {
        if (part.type === 'file') {
            // Ini adalah file gambar
            const originalFilename = part.filename;
            const ext = path.extname(originalFilename);
            const newFilename = `${Date.now()}-${req.user.id}${ext}`;
            const filePath = path.join(uploadDir, newFilename); // Gunakan variable uploadDir
            
            // Simpan file ke disk
            await fs.promises.writeFile(filePath, await part.toBuffer());
            imageURL = `/uploads/images/${newFilename}`;
            
        } else {
            // Ini adalah field data (name, description, location, contact)
            reportData[part.fieldname] = part.value;
        }
    }
    
    const { name, description, location, contact, lastSeen } = reportData;

    // Pastikan data penting ada
    if (!name || !location || !contact) {
        return reply.code(400).send({ message: 'Nama, lokasi, dan kontak harus diisi.' });
    }

    return await prisma.lostCatReport.create({
        data: {
            name, description, location, contact, 
            lastSeen: lastSeen ? new Date(lastSeen) : null, // Jika ada field lastSeen
            image: imageURL,
            reporterId: req.user.id
        }
    });
});



// --- RUTE KOMUNITAS (FORUM) ---

// 1. GET POSTS (LENGKAP)
fastify.get('/posts', async (req) => {
  // Logika Manual: Cek apakah user sedang login atau tidak (Soft Auth)
  // Tujuannya agar kita tahu apakah user ini me-like postingan atau belum
  let currentUserId = null;
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = fastify.jwt.verify(token);
      currentUserId = decoded.id;
    }
  } catch (e) { } // Abaikan error jika token invalid/tidak ada (anggap guest)

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {

      author: { select: { id: true, name: true, avatar: true } }, // <-- TAMBAHKAN AVATAR
      likes: true,
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: 'asc' },
        include: {

          author: { select: { id: true, name: true, avatar: true } }, // <-- TAMBAHKAN AVATAR
          children: {
            include: {
              author: { select: { id: true, name: true, avatar: true } } // <-- TAMBAHKAN AVATAR
            },
            orderBy: { createdAt: 'asc' }
          }
        }
      }
    }
  });

  // Mapping data agar formatnya rapi untuk Frontend
  return posts.map(p => {
    // Cek apakah user yang login ada di daftar likes
    const isLikedByMe = currentUserId ? p.likes.some(l => l.userId === currentUserId) : false;

    return {
      id: p.id,
      judul: p.title,
      isi: p.content,
      kategori: p.category,
      foto: p.image,
      tanggal: p.createdAt,
      user: p.author ? p.author.name : "Anonim",
      userId: p.authorId,
      avatar: p.author ? p.author.avatar : null,
      authorId: p.authorId, // Penting untuk tombol Edit/Hapus

      // Info Like
      suka: p.likes.length,
      disukai: isLikedByMe,

      // Info Komentar & Balasan
      comments: p.comments.map(c => ({
        id: c.id,
        text: c.content,
        tanggal: c.createdAt,
        user: c.author ? c.author.name : "Anonim",
        userId: c.authorId,
        avatar: c.author ? c.author.avatar : null, // <-- TAMBAHKAN INI

        replies: c.children.map(child => ({
          id: child.id,
          text: child.content,
          tanggal: child.createdAt,
          user: child.author ? child.author.name : "Anonim",
          userId: child.authorId,
          avatar: child.author ? child.author.avatar : null, // <-- TAMBAHKAN INI
        }))
      }))
    };
  })
});

// 2. CREATE POST
fastify.post('/posts', { onRequest: [fastify.authenticate] }, async (req, reply) => {
  // ambil data dari frontend
  const { judul, isi, foto, kategori } = req.body;
  try {
    const newPost = await prisma.post.create({
      data: {
        title: judul, content: isi, image: foto, category: kategori,
        authorId: req.user.id
      }
    });
    return { message: 'Berhasil', post: newPost };
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ message: 'Gagal posting: ' + err.message });
  }
});

// 3. EDIT POST (PUT) 
fastify.put('/posts/:id', { onRequest: [fastify.authenticate] }, async (req, reply) => {
  const postId = Number(req.params.id);
  const { judul, isi, kategori, foto } = req.body;
  const userId = req.user.id;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return reply.code(404).send({ message: 'Post tidak ditemukan' });
    if (post.authorId !== userId) return reply.code(403).send({ message: 'Bukan milikmu!' });

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        title: judul, content: isi, category: kategori,
        // Update foto hanya jika user upload foto baru, jika tidak biarkan yang lama
        image: foto || post.image
      }
    });
    return { message: 'Post berhasil diupdate', post: updatedPost };
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ message: 'Gagal update post' });
  }
});

// 4. DELETE POST (HAPUS) 
fastify.delete('/posts/:id', { onRequest: [fastify.authenticate] }, async (req, reply) => {
  const postId = Number(req.params.id);
  const userId = req.user.id;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return reply.code(404).send({ message: 'Post tidak ditemukan' });
    if (post.authorId !== userId) return reply.code(403).send({ message: 'Bukan milikmu!' });

    await prisma.post.delete({ where: { id: postId } });
    return { message: 'Post berhasil dihapus' };
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ message: 'Gagal menghapus post' });
  }
});

// 5. COMMENTS ROUTES
fastify.post('/posts/:id/comments', { onRequest: [fastify.authenticate] }, async (req) => {
  const { text, parentId } = req.body;
  return await prisma.comment.create({
    data: {
      content: text, postId: Number(req.params.id), authorId: req.user.id,
      parentId: parentId ? Number(parentId) : null
    }
  });
});

fastify.delete('/comments/:id', { onRequest: [fastify.authenticate] }, async (req, reply) => {
  const commentId = Number(req.params.id);
  const userId = req.user.id;
  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return reply.code(404).send({ message: 'Komentar tidak ditemukan' });
    if (comment.authorId !== userId) return reply.code(403).send({ message: 'Dilarang hapus' });

    await prisma.comment.delete({ where: { id: commentId } });
    return { message: 'Terhapus' };
  } catch (err) { reply.code(500).send({ message: 'Gagal hapus komentar' }); }
});

// TOGGLE LIKE (Like / Unlike)
fastify.post('/posts/:id/like', { onRequest: [fastify.authenticate] }, async (req, reply) => {
  const postId = Number(req.params.id);
  const userId = req.user.id;

  try {
    // 1. Cek apakah Post ada
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return reply.code(404).send({ message: 'Post tidak ditemukan' });

    // 2. Cek apakah User sudah pernah like post ini
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId } // Kunci unik gabungan
      }
    });

    if (existingLike) {
      // JIKA SUDAH ADA -> HAPUS (UNLIKE)
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      return { message: 'Unliked', status: false }; // Status false = tidak dilike
    } else {
      // JIKA BELUM ADA -> BUAT (LIKE)
      await prisma.like.create({
        data: { postId, userId }
      });
      return { message: 'Liked', status: true }; // Status true = dilike
    }

  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ message: 'Gagal memproses like' });
  }
});





// --- RUTE CAMPAIGN (SHELTER) ---

// 1. Ambil Semua Kampanye
fastify.get('/campaigns', async () => {
  return await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' }
  });
});

// 2. Ambil Detail Kampanye (berdasarkan ID atau Slug)
fastify.get('/campaigns/:id', async (req) => {
  const id = Number(req.params.id);
  return await prisma.campaign.findUnique({
    where: { id },
    include: { 
      _count: { select: { donations: true } } // Hitung jumlah donatur
    }
  });
});

// UPDATE RUTE POST /donations
fastify.post('/donations', async (req, reply) => {
  const { amount, paymentMethod, message, donorId, campaignId } = req.body; // Ada campaignId

  // ... (validasi amount & method) ...

  try {
    // 1. Simpan Donasi
    const newDonation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        paymentMethod,
        message,
        donorId: donorId || null,
        campaignId: Number(campaignId), // Hubungkan ke kampanye
        status: 'SUCCESS' // Anggap sukses dulu buat demo
      }
    });

    // 2. Update Total Terkumpul di Kampanye
    await prisma.campaign.update({
      where: { id: Number(campaignId) },
      data: {
        collected: { increment: Number(amount) } // Tambah otomatis
      }
    });
    
    return { message: 'Donasi berhasil!', donation: newDonation };
  } catch (err) {
    // ... error handling ...
  }
});

// --- 6. RUTE KHUSUS USER (DASHBOARD) ---

// A. Ambil Daftar Adopsi Saya (termasuk yang sudah teradopsi)
fastify.get('/me/listings', { onRequest: [fastify.authenticate] }, async (req) => { // 🔥 PERBAIKAN NAMA RUTE
  return await prisma.adoptionListing.findMany({
    where: { ownerId: req.user.id },
    orderBy: { createdAt: 'desc' },
    // 🔥 PENTING: Tambahkan include applicants agar tab lamaran masuk berfungsi
    include: { 
        applicants: { 
            include: { applicant: { select: { name: true, email: true } } } 
        } 
    }
  });
});

// B. Ambil Daftar Laporan Saya (termasuk yang sudah ditemukan)
fastify.get('/me/reports', { onRequest: [fastify.authenticate] }, async (req) => {
  return await prisma.lostCatReport.findMany({
    where: { reporterId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
});

// C. Ambil Riwayat Donasi Saya
fastify.get('/me/donations', { onRequest: [fastify.authenticate] }, async (req) => {
  return await prisma.donation.findMany({
    where: { donorId: req.user.id },
    include: { campaign: { select: { title: true } } }, // Ambil judul kampanye
    orderBy: { createdAt: 'desc' }
  });
});

// D. Update Status Kucing Adopsi (Tandai Teradopsi)
fastify.patch('/adoptions/:id/status', { onRequest: [fastify.authenticate] }, async (req, reply) => {
  const id = Number(req.params.id);
  const { status } = req.body; // Kirim 'ADOPTED' atau 'AVAILABLE'
  
  // Cek apakah ini milik user yang login?
  const listing = await prisma.adoptionListing.findUnique({ where: { id } });
  if (!listing || listing.ownerId !== req.user.id) {
    return reply.code(403).send({ message: 'Akses ditolak' });
  }

  return await prisma.adoptionListing.update({
    where: { id },
    data: { status }
  });
});

// E. Update Status Kucing Hilang (Tandai Ditemukan)
fastify.patch('/lost-cats/:id/status', { onRequest: [fastify.authenticate] }, async (req, reply) => {
  const id = Number(req.params.id);
  const { status } = req.body; // Kirim 'FOUND' atau 'LOST'
  
  const report = await prisma.lostCatReport.findUnique({ where: { id } });
  if (!report || report.reporterId !== req.user.id) {
    return reply.code(403).send({ message: 'Akses ditolak' });
  }

  return await prisma.lostCatReport.update({
    where: { id },
    data: { status }
  });
});

// --- 7. FITUR CHATBOT AI (POWERED BY GOOGLE GEMINI) ---
fastify.post('/chat', async (req, reply) => {
  const { message } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return reply.code(500).send({ message: "API Key tidak ditemukan di server." });
    }

    // --- KNOWLEDGE BASE (CONTEKAN) ---
    const websiteInfo = `
      INFORMASI WEBSITE MEONG.ID:
      Meong.id adalah platform ekosistem digital untuk pecinta kucing di Indonesia.
      
      FITUR-FITUR:
      1. **Adopsi Kucing**: Mencari teman bulu baru atau mendaftarkan kucing untuk diadopsi. (Menu: Adopsi)
      2. **Lapor Kucing Hilang**: Melaporkan kucing hilang agar dibantu komunitas. Ada tombol langsung ke WhatsApp pelapor. (Menu: Lapor Kucing)
      3. **Meong Academy (Kelas Online)**: Belajar cara merawat kucing lewat video tutorial kurasi YouTube. (Menu: Kelas Online - *Hanya Member*)
      4. **Meong Shop**: Membeli kebutuhan kucing sambil berdonasi. (Menu: Shop)
      5. **RS & Shelter**: Direktori Rumah Sakit Hewan dan Shelter terdekat.
      6. **Donasi**: Menggalang dana untuk shelter dan kucing jalanan.
      7. **Komunitas**: Forum diskusi sesama pecinta kucing.
      8. **Artikel**: Tips dan trik kesehatan kucing.

      TIM PEMBUAT (DEVELOPER):
      - **Naufal Rizki Rabbani** (Project Lead & Fullstack): Arsitek utama sistem.
      - **Niha April** (Backend & Database): Spesialis API dan keamanan data.
      - **Rifa Danindra** (Frontend Logic): Ahli interaksi pengguna & fitur Adopsi.
      - **Julia Rahmawati** (UI/UX & Community): Desainer antarmuka dan manajer komunitas.
    `;

    const prompt = `
      Peran: Kamu adalah "MeongBot", Customer Service Pintar dan lucu untuk Meong.id.
      Tugas: Jawab pertanyaan user berdasarkan DATA PENGETAHUAN di bawah ini.
      
      DATA PENGETAHUAN:
      ${websiteInfo}

      Aturan Menjawab:
      1. Jawab dengan ramah, santai, dan gunakan emoji kucing 😺.
      2. Jika user tanya "Siapa yang buat website ini?", sebutkan tim developer dengan bangga.
      3. Jika user tanya fitur, jelaskan singkat dan arahkan ke menu terkait.
      4. Jika pertanyaan di luar topik kucing/website, tolak dengan sopan & bercanda.
      
      Pertanyaan User: "${message}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { reply: text };

  } catch (error) {
    console.error("❌ Error Gemini:", error);
    return { reply: "Maaf, otak saya sedang loading 😿. Coba tanya lagi nanti ya!" };
  }
});

// --- 8. RUTE KELAS ONLINE ---

// Ambil Semua Kelas
fastify.get('/courses', async () => {
  return await prisma.course.findMany({
    include: { modules: true } // Sertakan modul agar bisa dihitung jumlah videonya
  });
});

// Ambil Detail Kelas (Beserta Video)
fastify.get('/courses/:id', async (req, reply) => {
  const id = Number(req.params.id);
  const course = await prisma.course.findUnique({
    where: { id },
    include: { modules: true }
  });

  if (!course) return reply.code(404).send({ message: "Kelas tidak ditemukan" });
  return course;
});

// --- 9. RUTE E-COMMERCE (PRODUK) ---
fastify.get('/products', async () => {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
});

fastify.get('/products/:id', async (req, reply) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return reply.code(404).send({ message: "Produk tidak ditemukan" });
  return product;
});

// --- JALANKAN SERVER ---
// ... kode routing kamu di atas ...

// Export aplikasi (PENTING BUAT VERCEL)
module.exports = async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
};

// Hanya jalankan listen jika di laptop (BUKAN di Vercel)
if (require.main === module) {
  fastify.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Server running at http://localhost:3000');
  });
}