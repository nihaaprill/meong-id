

<template>
  <button
    :type="type"
    :class="['ui-btn', `ui-btn--${variant}`, { 'ui-btn--block': block }]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // primary | secondary | danger | outline
  block: { type: Boolean, default: false }
})
</script>

<style scoped>
.ui-btn {
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.ui-btn--primary {
  background: #F1EBDA;
  color: white;
}
.ui-btn--primary:hover {
  background: #0680c7;
}

.ui-btn--secondary {
  background: #f0f0f0;
  color: #333;
}
.ui-btn--secondary:hover {
  background: #ddd;
}

.ui-btn--outline {
  border: 2px solid #F1EBDA;
  background: transparent;
  color: #F1EBDA;
}
.ui-btn--outline:hover {
  background: #F1EBDA;
  color: white;
}

.ui-btn--block {
  width: 100%;
}
</style>
