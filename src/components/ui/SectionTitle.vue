<template>
  <div class="section-title" :class="{ center }">
    <h2>{{ title }}</h2>
    <p v-if="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  center: { type: Boolean, default: false }
})
</script>

<style scoped>
.section-title {
  margin-bottom: 2rem;
}
.section-title.center {
  text-align: center;
}
.section-title h2 {
  font-size: 1.8rem;
  margin-bottom: 0.4rem;
}
.section-title p {
  color: #666;
  font-size: 1rem;
}
</style>
