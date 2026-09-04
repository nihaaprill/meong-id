import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Base URL Backend untuk gambar
const BASE_URL = 'http://localhost:3000/uploads/images';

async function main() {
  console.log('🌱 Memulai seeding database...');

  // --- 1. BERSIHKAN DATABASE ---
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.adoptionApplication.deleteMany();
  await prisma.adoptionListing.deleteMany();
  await prisma.lostCatReport.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.module.deleteMany(); // Hapus modul dulu
  await prisma.course.deleteMany(); // Baru hapus course
  await prisma.campaign.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Database dibersihkan.');

  // --- 2. SETUP USER PENTING ---
  const password = await bcrypt.hash('123456', 10);

  // Admin Utama
  const admin = await prisma.user.create({
    data: {
      email: 'admin@meong.id',
      name: 'Admin Meong',
      password: password,
      role: 'ADMIN',
      phone: '081234567890',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
    }
  });

  // User Komunitas
  const usersData = [
    { name: 'Rifa_danindra', email: 'rifa@mail.com' },
    { name: 'Niha_april', email: 'niha@mail.com' },
    { name: 'PencintaKucing', email: 'lover@mail.com' },
    { name: 'UserA', email: 'usera@mail.com' },
    { name: 'UserB', email: 'userb@mail.com' },
    { name: 'NaufalRizky_rabbani', email: 'naufal@mail.com' },
    { name: 'Maya_catmom', email: 'maya@mail.com' },
    { name: 'Putri_11', email: 'putri@mail.com' },
    { name: 'Doctor_vet', email: 'vet@mail.com' },
    { name: 'Firda_rzk', email: 'firda@mail.com' },
    { name: 'Syahrul_', email: 'syahrul@mail.com' }
  ];

  const userMap = {}; 

  for (const u of usersData) {
    const createdUser = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: password,
        role: 'USER',
        avatar: `https://ui-avatars.com/api/?name=${u.name}&background=random` 
      }
    });
    userMap[u.name] = createdUser; 
  }
  console.log('👤 Users inti berhasil dibuat.');

  // --- 3. DATA ARTIKEL ---
  await prisma.article.createMany({
    data: [
      {
        title: "Panduan Lengkap Mengadopsi Kucing",
        content: "Sebelum mengadopsi kucing, pastikan kamu sudah menyiapkan rumah yang aman dan nyaman. Beri tempat tidur hangat, wadah makan dan minum, serta pasir untuk buang air. Luangkan waktu untuk bermain dan berinteraksi setiap hari agar kucing merasa disayangi dan cepat beradaptasi.",
        image: `${BASE_URL}/artikel4.jpg`,
        source: "ASPCA (aspca.org)",
        authorId: admin.id,
        createdAt: new Date('2025-01-15')
      },
      {
        title: "Tips Dasar Merawat Kucing untuk Pemilik Baru",
        content: "Kucing membutuhkan taurin dan asam amino penting dalam makanannya untuk menjaga kesehatan mata dan jantung. Pastikan kamu menyediakan makanan bergizi, air bersih, serta tempat tidur yang nyaman. Jangan lupa grooming secara rutin agar bulu tetap bersih dan sehat.",
        image: `${BASE_URL}/artikel5.jpg`,
        source: "The Spruce Pets",
        authorId: admin.id,
        createdAt: new Date('2025-01-12')
      },
      {
        title: "Memahami Bahasa Tubuh Kucing",
        content: "Kucing memiliki cara unik untuk berkomunikasi melalui bahasa tubuh. Ekor yang tegak biasanya menandakan suasana hati bahagia, sedangkan ekor yang mengembang menunjukkan rasa takut atau kewaspadaan.",
        image: `${BASE_URL}/artikel6.jpg`,
        source: "Purina Indonesia",
        authorId: admin.id,
        createdAt: new Date('2025-01-10')
      },
      {
        title: "Memahami Kesehatan dan Kesejahteraan Kucing",
        content: "Kucing perlu pemeriksaan rutin minimal setahun sekali ke dokter hewan. Perhatikan gejala seperti kehilangan nafsu makan, muntah, atau perubahan perilaku.",
        image: `${BASE_URL}/artikel7.jpg`,
        source: "Cornell Feline Health Center",
        authorId: admin.id,
        createdAt: new Date('2025-01-08')
      },
      {
        title: "Pelatihan Positif untuk Kucing",
        content: "Kucing bisa dilatih menggunakan metode positif, seperti memberikan camilan saat mereka berperilaku baik. Hindari hukuman karena dapat membuat kucing stres.",
        image: `${BASE_URL}/artikel10.jpg`,
        source: "International Cat Care",
        authorId: admin.id,
        createdAt: new Date('2025-01-05')
      },
      {
        title: "Mengapa Mengadopsi Kucing Senior Itu Berharga",
        content: "Kucing senior cenderung lebih tenang, penyayang, dan tidak seaktif anak kucing. Mereka biasanya sudah terlatih dan mudah beradaptasi.",
        image: `${BASE_URL}/artikel11.jpg`,
        source: "Petfinder",
        authorId: admin.id,
        createdAt: new Date('2025-01-03')
      }
    ]
  });
  console.log('📚 Artikel berhasil dibuat.');

  // --- 4. DATA ADOPSI ---
  await prisma.adoptionListing.createMany({
    data: [
      {
        name: 'Hattoo',
        description: 'Matanya punya dua warna yang sangat cantik. Sangat ramah dan suka bermain.',
        race: 'Domestic Mix',
        age: '1 Tahun',
        gender: 'Jantan',
        location: 'Jakarta Selatan',
        image: `${BASE_URL}/Hatto.jpeg`,
        status: 'AVAILABLE',
        ownerId: userMap['Putri_11'].id 
      },
      {
        name: 'Abu',
        description: 'Punya Warna Abu yang elegan. Sedikit pemalu tapi sangat setia.',
        race: 'British Shorthair Mix',
        age: '2 Tahun',
        gender: 'Betina',
        location: 'Bandung',
        image: `${BASE_URL}/Abu.jpeg`,
        status: 'AVAILABLE',
        ownerId: userMap['Firda_rzk'].id
      }
    ]
  });
  console.log('🏠 Data Adopsi berhasil dibuat.');

  // --- 5. DATA KUCING HILANG ---
  await prisma.lostCatReport.createMany({
    data: [
      {
        name: 'Kuki',
        description: 'Memiliki warna abu-abu polos, kalung merah. Terakhir terlihat di taman.',
        location: 'Kemang, Jakarta Selatan',
        contact: '08123456789',
        image: `${BASE_URL}/Kuki.jpeg`,
        status: 'LOST',
        reporterId: userMap['Rifa_danindra'].id
      },
      {
        name: 'Putih',
        description: 'Memiliki mata beda warna (Odd Eye), bulu putih bersih.',
        location: 'Kemang, Jakarta Selatan',
        contact: '08987654321',
        image: `${BASE_URL}/Putih.jpeg`,
        status: 'LOST',
        reporterId: userMap['Niha_april'].id
      },
      {
        name: 'Oyen',
        description: 'Warna oranye, sedikit galak tapi penurut kalau dikasih makan.',
        location: 'Cilandak, Jakarta Selatan',
        contact: '08567891234',
        image: `${BASE_URL}/Oyen.jpeg`,
        status: 'LOST',
        reporterId: userMap['UserA'].id
      },
      {
        name: 'Miko',
        description: 'Warna hitam pekat, memakai kalung merah dengan lonceng.',
        location: 'Duren Sawit, Jakarta Timur',
        contact: '08134567890',
        image: `${BASE_URL}/Miko.jpeg`,
        status: 'LOST',
        reporterId: userMap['UserB'].id
      }
    ]
  });
  console.log('📢 Data Kucing Hilang berhasil dibuat.');

  // --- 6. CAMPAIGN (Shelter, RS, Event) ---
  await prisma.campaign.createMany({
    data: [
      {
        title: 'Pejaten Shelter',
        slug: 'shelter-pejaten',
        description: 'Rumah bagi 500+ anjing dan kucing terlantar. Kami membutuhkan biaya operasional harian.',
        target: 100000000,
        collected: 45000000,
        image: `${BASE_URL}/shelter1.jpg`,
        verified: true,
        location: 'Pejaten, Jakarta Selatan',
        contact: '0812-3456-7890',
        type: 'SHELTER',
        managerId: admin.id
      },
      {
        title: 'Rumah Kucing Bandung',
        slug: 'rumah-kucing-bandung',
        description: 'Tempat perlindungan kucing jalanan di Bandung.',
        target: 50000000,
        collected: 1200000,
        image: `${BASE_URL}/shelter2.jpg`,
        verified: true,
        location: 'Dago, Bandung',
        contact: '0898-7654-3210',
        type: 'SHELTER',
        managerId: admin.id
      },
      {
        title: 'RS Hewan Jakarta',
        slug: 'rsh-jakarta',
        description: 'Rumah Sakit Hewan dengan fasilitas UGD 24 Jam.',
        target: 0,
        collected: 5000000,
        image: `${BASE_URL}/rs1.jpg`,
        verified: true,
        location: 'Ragunan, Jakarta',
        contact: '(021) 789-1234',
        type: 'HOSPITAL',
        managerId: admin.id
      },
      {
        title: 'Program Steril Subsidi',
        slug: 'steril-gratis',
        description: 'Bantu kami mengontrol populasi kucing liar dengan steril massal.',
        target: 15000000,
        collected: 3000000,
        image: `${BASE_URL}/shelter3.jpg`,
        verified: true,
        location: 'Bogor',
        type: 'EVENT',
        managerId: admin.id
      }
    ]
  });
  console.log('🏥 Campaigns berhasil dibuat.');

  // --- 7. POSTINGAN KOMUNITAS ---
  
  // Post 1
  const post1 = await prisma.post.create({
    data: {
      title: "Kucing saya tidak mau makan",
      content: "Halo semuanya, kucing saya Luna (2 tahun) tiba-tiba tidak mau makan sejak 2 hari lalu. Dia masih minum air dan aktif bermain, tapi sama sekali tidak tertarik dengan makanannya.",
      category: "Kesehatan",
      image: `${BASE_URL}/Post1.jpg`,
      authorId: userMap['Rifa_danindra'].id,
      createdAt: new Date('2025-10-30')
    }
  });
  await prisma.comment.createMany({
    data: [
      { content: "Coba bawa ke dokter hewan, bisa jadi kucingnya lagi stress.", postId: post1.id, authorId: userMap['Niha_april'].id },
      { content: "Setuju, lebih baik segera konsultasi ke vet. Dehidrasi bisa cepat terjadi!", postId: post1.id, authorId: userMap['PencintaKucing'].id }
    ]
  });

  // Post 2
  const post2 = await prisma.post.create({
    data: {
      title: "Tips memandikan kucing yang takut air",
      content: "Kucing saya Milo sangat takut air. Setiap kali dimandikan selalu stress dan menggaruk-garuk. Adakah tips untuk memandikan kucing yang takut air?",
      category: "Perawatan",
      image: null,
      authorId: userMap['Niha_april'].id,
      createdAt: new Date('2025-09-30')
    }
  });
  await prisma.comment.createMany({
    data: [
      { content: "Mungkin bisa coba pakai kain lap basah (grooming wipes).", postId: post2.id, authorId: userMap['UserA'].id },
      { content: "Atau gunakan sampo kering (dry shampoo).", postId: post2.id, authorId: userMap['UserB'].id }
    ]
  });

  // Post 3
  const post3 = await prisma.post.create({
    data: {
      title: "Kucing saya tiba-tiba sering mengeong tengah malam",
      content: "Halo semuanya, aku mau curhat dikit nih. Kucing aku, namanya Coco (umur 1 tahun), akhir-akhir ini sering banget mengeong keras tiap tengah malam.",
      category: "Perilaku",
      image: null,
      authorId: userMap['NaufalRizky_rabbani'].id,
      createdAt: new Date('2025-04-12')
    }
  });
  await prisma.comment.create({
    data: { content: "Coba cek apakah ada birahi, biasanya kucing jantan/betina yang birahi memang lebih berisik.", postId: post3.id, authorId: userMap['Maya_catmom'].id }
  });

  // Post 4
  const post4 = await prisma.post.create({
    data: {
      title: "Kucing aku tiba-tiba jadi manja banget setelah disteril",
      content: "Hai semua pecinta kucing! Aku baru aja steril kucing betina aku minggu lalu. Setelah pulih, dia jadi manja banget.",
      category: "Perilaku",
      image: `${BASE_URL}/Post4.jpg`,
      authorId: userMap['Putri_11'].id,
      createdAt: new Date('2025-03-22')
    }
  });
  await prisma.comment.create({
    data: { content: "Sangat wajar! Steril mengurangi hormon yang membuat kucing aktif berburu.", postId: post4.id, authorId: userMap['Doctor_vet'].id }
  });

  // Post 5
  const post5 = await prisma.post.create({
    data: {
      title: "Kucing saya lesu dan tidak mau main",
      content: "Halo semuanya, aku lagi khawatir banget. Kucing aku, Neko, dari kemarin kelihatan lesu banget.",
      category: "Kesehatan",
      image: `${BASE_URL}/Post5.jpg`,
      authorId: userMap['Firda_rzk'].id,
      createdAt: new Date('2025-02-26')
    }
  });
  await prisma.comment.create({
    data: { content: "Kalau sudah ada gejala lesu dan agak hangat, sebaiknya segera bawa ke dokter hewan.", postId: post5.id, authorId: userMap['Rifa_danindra'].id }
  });

  // Post 6
  await prisma.post.create({
    data: {
      title: "Bagaimana cara menjaga pola makan kucing agar tetap sehat?",
      content: "Halo semuanya, saya ingin tahu bagaimana cara memastikan kucing saya mendapat nutrisi yang seimbang.",
      category: "Nutrisi",
      image: null,
      authorId: userMap['Syahrul_'].id,
      createdAt: new Date('2025-11-07')
    }
  });
  console.log('💬 Postingan & Komentar berhasil dibuat.');

 // --- 8. DATA KELAS ONLINE (DIPERBARUI DENGAN LINK BARU) ---
  
  // Kelas 1: Persiapan Adopsi
  await prisma.course.create({
    data: {
      title: "Panduan Awal & Adopsi Kucing",
      description: "Persiapan wajib bagi pemula sebelum memutuskan untuk memelihara kucing. Pelajari dasar-dasar perawatan dan apa saja yang harus disiapkan.",
      level: "Pemula",
      duration: "45 Menit",
      image: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=600",
      modules: {
        create: [
          { title: "Panduan Adopsi Kucing untuk Pemula", videoId: "r-gV2SpSL-M" }, // Link 2
          { title: "Tutorial Cara Merawat Kucing Pemula", videoId: "wf3VZoaR0fQ" }  // Link 6
        ]
      }
    }
  });

  // Kelas 2: Fase Kehidupan Kucing
  await prisma.course.create({
    data: {
      title: "Memahami Pertumbuhan Kucing",
      description: "Kenali siklus hidup kucing dari bayi hingga dewasa agar kamu bisa memberikan perawatan yang tepat di setiap usianya.",
      level: "Menengah",
      duration: "30 Menit",
      image: "https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600",
      modules: {
        create: [
          { title: "Kisah Anak Kucing: Lahir hingga Dewasa", videoId: "FKfALOjPi6c" }, // Link 3
          { title: "Tips Merawat Anak Kucing Tanpa Induk", videoId: "70kQh4_L9_E" }   // Link 1
        ]
      }
    }
  });

  // Kelas 3: Kesehatan & Kebersihan
  await prisma.course.create({
    data: {
      title: "Kesehatan & Kebersihan Kucing",
      description: "Jaga kesehatan anabulmu dari gangguan parasit. Pelajari cara efektif membasmi kutu dan menjaga kebersihan mereka.",
      level: "Lanjutan",
      duration: "60 Menit",
      image: "https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=600",
      modules: {
        create: [
          { title: "Tips Ampuh Basmi Kutu Kucing", videoId: "mvCOUui2e5k" } // Link 5
        ]
      }
    }
  });

  console.log('🎓 Data Kelas Online berhasil diperbarui.');
  console.log('✅ SEEDING SELESAI! Database siap digunakan.');
}

// --- 9. DATA PRODUK (TOKO) ---
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Royal Canin Hair & Skin (2kg)",
        description: "Makanan kering premium untuk kesehatan bulu dan kulit kucing.",
        price: 250000,
        category: "Makanan",
        image:  `${BASE_URL}/rs1.jpg`, // Ganti dengan URL gambar asli nanti
        stock: 15
      },
      {
        name: "Kalung Kucing Anti Kutu",
        description: "Kalung stylish yang dilengkapi formula anti kutu dan jamur.",
        price: 45000,
        category: "Aksesoris",
        image:  `${BASE_URL}/rs1.jpg`, // Ganti url valid
        stock: 50
      },
      {
        name: "Pasir Kucing Wangi Kopi (10L)",
        description: "Pasir gumpal wangi kopi, menyerap bau dengan cepat.",
        price: 65000,
        category: "Perlengkapan",
        image:  `${BASE_URL}/rs1.jpg`,
        stock: 20
      }
    ]
  });
  
  console.log('🛒 Data Produk berhasil dibuat.');

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });