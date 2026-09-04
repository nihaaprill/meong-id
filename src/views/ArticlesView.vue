<template>
  <main>

    <!-- ===== HEADER HALAMAN ===== -->
    <section class="article-header">
      <h1>Artikel Kucing</h1>
      <p>Temukan berbagai tips, panduan, dan informasi penting tentang perawatan kucing.</p>
    </section>
    <!-- =========================== -->


    <section class="articles-page">

      <!-- FEATURED ARTICLE -->
      <section v-if="articles.length > 0" class="featured-article">
        <img :src="articles[0].image" class="featured-img" />

        <div class="featured-info">
          <h1 class="featured-title">{{ articles[0].title }}</h1>

          <p class="featured-date">
            {{ new Date(articles[0].createdAt).toLocaleDateString("id-ID") }}
          </p>

          <p class="featured-desc">
            {{ articles[0].content.substring(0, 150) }}...
          </p>

          <RouterLink :to="`/articles/${articles[0].id}`" class="featured-btn">
            Baca Selengkapnya →
          </RouterLink>
        </div>
      </section>


      <!-- Rekomendasi -->
      <section class="recommend-section" v-if="articles.length > 1">
        <h2>Rekomendasi untuk Anda</h2>

        <div class="recommend-grid">
          <article
            class="recommend-card"
            v-for="a in articles.slice(1)"
            :key="a.id"
          >
            <img :src="a.image" class="rec-img" />

            <div class="rec-info">
              <p class="rec-source">{{ a.source }}</p>

              <h3 class="rec-title">
                {{ a.title }}
              </h3>

              <RouterLink :to="`/articles/${a.id}`" class="rec-link">
                Baca →
              </RouterLink>
            </div>
          </article>
        </div>
      </section>

    </section>

  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const articles = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/articles");
  articles.value = await res.json();
});
</script>

<style scoped>
/* ===== HEADER HALAMAN ===== */
.article-header {
  text-align: center;
  padding: 50px 20px;
  background: #f6f5ef;
  margin-bottom: 40px;
  border-bottom: 1px solid #e4e4e4;
}

.article-header h1 {
  font-size: 42px;
  color: #3a5f3a;
  margin-bottom: 10px;
  font-weight: 700;
}

.article-header p {
  font-size: 18px;
  color: #555;
}

/* Halaman */
.articles-page {
  padding: 2rem 3rem;
  background: #fafafa;
}

/* Featured Section */
.featured-article {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.featured-img {
  width: 48%;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
}

.featured-info {
  flex: 1;
}

.featured-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: .6rem;
}

.featured-date {
  font-size: .9rem;
  color: #666;
  margin-bottom: 1rem;
}

.featured-desc {
  color: #444;
  font-size: 1rem;
  margin-bottom: 1.3rem;
}

.featured-btn {
  background: #0077ff;
  color: white;
  padding: .7rem 1.3rem;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
}

/* Rekomendasi Grid */
.recommend-section h2 {
  margin: 1rem 0;
  font-size: 1.4rem;
  font-weight: bold;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
}

.recommend-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

.rec-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.rec-info {
  padding: .9rem;
}

.rec-source {
  font-size: .75rem;
  color: #ff7a00;
  margin-bottom: .3rem;
}

.rec-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: .4rem;
}

.rec-link {
  text-decoration: none;
  color: #0077ff;
  font-weight: bold;
  font-size: .9rem;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .featured-article {
    flex-direction: column;
  }

  .featured-img {
    width: 100%;
    height: 260px;
  }

  .recommend-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .articles-page {
    padding: 1.3rem;
  }

  .recommend-grid {
    grid-template-columns: 1fr;
  }
}
</style>
