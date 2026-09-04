<template>
  <div class="about-page-clean">
    
    <section class="hero-clean">
      <div class="container">
        <div class="hero-text-wrapper">
          <h4 class="eyebrow">SIAPA KAMI</h4>
          <h1>Kejelasan, Konsistensi & <br> <span class="highlight">Satu Hati untuk Kucing.</span></h1>
          <p class="hero-desc">
            Meong.id bukan sekadar aplikasi. Kami adalah ekosistem digital yang dirancang 
            untuk mengubah niat baik menjadi aksi nyata penyelamatan.
          </p>
        </div>
      </div>
      <div class="abstract-shape shape-1"></div>
      <div class="abstract-shape shape-2"></div>
    </section>

    <section class="story-section">
      <div class="container">
        <div class="story-grid">
          <div class="story-left">
            <h2>Cerita Kami</h2>
            <div class="line-accent"></div>
          </div>
          <div class="story-right">
            <p>
              Kami memulai dengan satu pertanyaan sederhana: <em>"Mengapa menyelamatkan nyawa harus begitu rumit?"</em>
              Kami melihat banyak orang ingin mengadopsi atau menolong kucing, tetapi terhalang oleh informasi yang tidak jelas dan proses yang berbelit.
            </p>
            <p>
              Meong.id lahir untuk menghapus hambatan itu. Kami menggabungkan <strong>teknologi canggih</strong> dengan <strong>empati mendalam</strong>. 
              Hasilnya adalah platform yang tidak hanya fungsional, tapi juga menyentuh hati. Setiap baris kode yang kami tulis didedikasikan untuk satu tujuan: 
              memastikan setiap kucing mendapatkan rumah yang penuh cinta.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">🤝</div>
            <h3>Unity (Kesatuan)</h3>
            <p>Kolaborasi antara pelapor, adopter, dan shelter dalam satu platform terintegrasi.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">💡</div>
            <h3>Clarity (Kejelasan)</h3>
            <p>Informasi transparan tentang kondisi kesehatan dan status setiap hewan.</p>
          </div>
          <div class="value-card">
            <div class="value-icon">❤️</div>
            <h3>Empathy (Empati)</h3>
            <p>Teknologi yang dibangun dengan hati, memprioritaskan kesejahteraan makhluk hidup.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="team-section">
      <div class="container">
        <div class="section-header-center">
          <h2>Para Arsitek Digital</h2>
          <p>Bertemu dengan otak di balik sistem Meong.id</p>
        </div>

        <div class="team-grid">
          <div v-for="(member, index) in team" :key="index" class="tech-card-3d">
            <div class="card-content">
              
              <div class="card-top">
                <div class="avatar-ring">
                  <img :src="member.image" :alt="member.name">
                </div>
                <div class="identity">
                  <h3>{{ member.name }}</h3>
                  <span class="role-tag">{{ member.role }}</span>
                </div>
              </div>

              <div class="card-bio">
                <p>{{ member.bio }}</p>
              </div>

              <hr class="card-divider">

              <div class="tech-stack">
                <span class="stack-label">Tech Mastery:</span>
                <div class="stack-icons">
                  <div 
                    v-for="(tech, tIndex) in member.techStack" 
                    :key="tIndex" 
                    class="tech-badge"
                    :title="tech.name"
                  >
                    {{ tech.icon }} <span class="tooltip">{{ tech.name }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const team = ref([
  {
    name: "Naufal Rizki",
    role: "Lead Architect",
    image: "https://ui-avatars.com/api/?name=Naufal+Rizki&background=4C6A4C&color=fff&size=128",
    bio: "Merancang struktur database yang skalabel dan memastikan performa backend secepat kilat.",
    techStack: [
      { name: "Node.js", icon: "🟩" },
      { name: "Fastify", icon: "⚡" },
      { name: "MySQL", icon: "🐬" },
      { name: "System Design", icon: "📐" }
    ]
  },
  {
    name: "Niha April",
    role: "Backend Engineer",
    image: "https://ui-avatars.com/api/?name=Niha+April&background=A9C47F&color=fff&size=128",
    bio: "Pawang API dan keamanan data. Memastikan setiap request donasi dan adopsi aman terkendali.",
    techStack: [
      { name: "JavaScript", icon: "📜" },
      { name: "Prisma ORM", icon: "💎" },
      { name: "REST API", icon: "🔗" },
      { name: "Auth Security", icon: "🔒" }
    ]
  },
  {
    name: "Rifa Danindra",
    role: "Frontend Wizard",
    bio: "Menerjemahkan desain menjadi kode interaktif. Ahli dalam membuat UI yang responsif dan mulus.",
    image: "https://ui-avatars.com/api/?name=Rifa+Danindra&background=8EAB65&color=fff&size=128",
    bioShort: "Ahli interaksi pengguna.",
    techStack: [
      { name: "Vue.js 3", icon: "🟢" },
      { name: "CSS3", icon: "🎨" },
      { name: "Vite", icon: "⚡" },
      { name: "Responsive", icon: "📱" }
    ]
  },
  {
    name: "Julia Rahmawati",
    role: "UX & Community",
    image: "https://ui-avatars.com/api/?name=Julia+Rahma&background=FFB74D&color=fff&size=128",
    bio: "Menjembatani kebutuhan user dengan teknologi. Memastikan pengalaman pengguna yang intuitif.",
    techStack: [
      { name: "Figma", icon: "🎨" },
      { name: "User Flow", icon: "🗺️" },
      { name: "Content", icon: "✍️" },
      { name: "Community", icon: "💬" }
    ]
  }
])
</script>

<style scoped>
/* --- GLOBAL SETTINGS FOR THIS PAGE --- */
.about-page-clean {
  background-color: #FFFFFF; /* Eterna style: White background dominant */
  color: #333;
  font-family: 'Nunito', sans-serif;
  padding-bottom: 5rem;
  overflow-x: hidden;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
}

/* --- 1. HERO SECTION --- */
.hero-clean {
  position: relative;
  padding: 6rem 0 4rem;
  background: #F6F4EE; /* Cream lembut sebagai header */
  overflow: hidden;

}

.hero-text-wrapper {
  max-width: 800px;
  position: relative;
  z-index: 2;
}

.eyebrow {
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: #A9C47F;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.hero-clean h1 {
  font-size: 3.5rem;
  line-height: 1.1;
  color: #2d3436;
  font-weight: 900;
  margin-bottom: 1.5rem;
}

.highlight {
  color: #4C6A4C;
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 15px;
  background-color: rgba(169, 196, 127, 0.3); /* Highlight stabilo hijau */
  z-index: -1;
}

.hero-desc {
  font-size: 1.25rem;
  color: #636e72;
  line-height: 1.6;
  max-width: 600px;
}

/* Dekorasi Abstrak */
.abstract-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  z-index: 1;
}
.shape-1 {
  width: 300px; height: 300px;
  background: rgba(76, 106, 76, 0.1);
  top: -50px; right: -50px;
}
.shape-2 {
  width: 200px; height: 200px;
  background: rgba(169, 196, 127, 0.2);
  bottom: 20px; left: 10%;
}

/* --- 2. STORY SECTION --- */
.story-section {
  padding: 5rem 0;
}
.story-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
}
.story-left h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3436;
}
.line-accent {
  width: 60px;
  height: 4px;
  background-color: #A9C47F;
  margin-top: 1rem;
}
.story-right p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin-bottom: 1.5rem;
}

/* --- 3. CORE VALUES --- */
.values-section {
  padding: 3rem 0 6rem;
  background: linear-gradient(to bottom, #ffffff, #f9f9f9);
}
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
.value-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 1px solid #eee;
  transition: all 0.3s ease;
}
.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border-color: #A9C47F;
}
.value-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.value-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #2d3436;
}
.value-card p {
  color: #636e72;
  font-size: 0.95rem;
}

/* --- 4. TEAM SECTION (3D CARDS) --- */
.team-section {
  padding: 4rem 0;
  background-color: #fff;
}
.section-header-center {
  text-align: center;
  margin-bottom: 3rem;
}
.section-header-center h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #2d3436;
}
.section-header-center p {
  color: #636e72;
  font-size: 1.1rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* KARTU 3D TECH */
.tech-card-3d {
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #f0f0f0;
  box-shadow: 0 5px 15px rgba(0,0,0,0.03);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.tech-card-3d:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(76, 106, 76, 0.15);
  border-color: #A9C47F;
}

/* Header Kartu */
.card-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.avatar-ring {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #A9C47F, #4C6A4C); /* Ring warna brand */
}
.avatar-ring img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid white;
  object-fit: cover;
}
.identity h3 {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
  color: #2d3436;
}
.role-tag {
  font-size: 0.75rem;
  background: #F6F4EE;
  color: #4C6A4C;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Bio */
.card-bio p {
  font-size: 0.95rem;
  color: #636e72;
  line-height: 1.6;
  min-height: 60px; /* Agar tinggi kartu seragam */
}

.card-divider {
  border: 0;
  border-top: 1px dashed #eee;
  margin: 1.5rem 0;
}

/* Tech Stack */
.stack-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: #b2bec3;
  margin-bottom: 0.8rem;
  text-transform: uppercase;
}
.stack-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}
.tech-badge {
  background: #f9f9f9;
  border: 1px solid #eee;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: help;
  position: relative;
  transition: 0.2s;
}
.tech-badge:hover {
  background: #A9C47F;
  color: white;
  border-color: #A9C47F;
}

/* Tooltip Sederhana */
.tech-badge .tooltip {
  visibility: hidden;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  transition: 0.2s;
  margin-bottom: 5px;
}
.tech-badge:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-clean h1 { font-size: 2.5rem; }
  .story-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .team-grid { grid-template-columns: 1fr; }
}
</style>