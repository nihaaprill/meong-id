<template>
  <main class="detail-container">

    <!-- Tombol Kembali -->
    <RouterLink to="/articles" class="back-min">
      ← Kembali
    </RouterLink>

    <!-- Judul -->
    <h1 class="title">{{ article.title }}</h1>

    <!-- Meta -->
    <p class="meta">
      Ditulis oleh <strong>Tim Meong.id</strong> •
      {{ new Date(article.createdAt).toLocaleDateString("id-ID") }}
    </p>

    <div class="content-layout">
      
      <!-- KONTEN KIRI -->
      <section class="left">
        <img :src="article.image" class="article-image" />

        <p class="article-content">
          {{ article.content }}
        </p>

        <p class="source">
          <em>Sumber: {{ article.source }}</em>
        </p>
      </section>

      <!-- SIDEBAR -->
      <aside class="right">
        <h3 class="sidebar-title">Artikel Populer</h3>

        <ul class="sidebar-list">
          <li v-for="pop in popularArticles" :key="pop.id">
            <RouterLink :to="`/articles/${pop.id}`" class="sidebar-link">
              {{ pop.title }}
            </RouterLink>
          </li>
        </ul>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";

const route = useRoute();
const article = ref({});
const popularArticles = ref([]);

async function loadArticle(id) {
  const res = await fetch(`http://localhost:3000/articles/${id}`);
  article.value = await res.json();
}

onMounted(async () => {
  await loadArticle(route.params.id);

  const all = await fetch("http://localhost:3000/articles");
  popularArticles.value = await all.json();
});

// FIX pindah artikel tanpa refresh
watch(
  () => route.params.id,
  async (newId) => {
    await loadArticle(newId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
);
</script>

<style scoped>
.detail-container {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
}

/* Judul */
.title {
  font-size: 34px;
  font-weight: 700;
  margin-bottom: 10px;
}

.meta {
  color: #555;
  font-size: 15px;
  margin-bottom: 30px;
}

/* Layout */
.content-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

/* Konten kiri */
.left {
  flex: 3;
  position: relative;
  z-index: 2;
}

.article-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 25px;
}

.article-content {
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 25px;
  color: #222;
}

/* Sumber artikel */
.source {
  color: #666;
  font-size: 15px;
}

/* Sidebar */
.right {
  flex: 1;
  background: #fff;
  padding-left: 10px;
  position: sticky;
  top: 100px;
  z-index: 50;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 2px solid #eee;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-list li {
  margin-bottom: 12px;
}

.sidebar-link {
  color: #0077ff;
  text-decoration: none;
  font-size: 16px;
  line-height: 1.4;
  display: block;
  cursor: pointer;
  transition: 0.2s;
}

.sidebar-link:hover {
  text-decoration: underline;
}

/* Tombol kembali minimalis */
.back-min {
  display: inline-block;
  margin-bottom: 10px;
  color: #444;
  font-size: 14px;
  text-decoration: none;
  opacity: 0.85;
}

.back-min:hover {
  opacity: 1;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .content-layout {
    flex-direction: column;
  }
  .article-image {
    height: 240px;
  }
}
</style>
