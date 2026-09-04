<template>
  <div class="ui-form-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <select :id="id" v-model="model" @change="$emit('update:modelValue', model)">
      <option value="" disabled selected>{{ placeholder }}</option>
      <option v-for="(opt, i) in options" :key="i" :value="opt.value">{{ opt.text }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  id: String,
  label: String,
  placeholder: { type: String, default: 'Select option' },
  options: { type: Array, default: () => [] },
  modelValue: String
})
const model = ref(props.modelValue)
watch(() => props.modelValue, v => (model.value = v))
</script>

<style scoped>
select {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
}
select:focus {
  border-color: #ff6b81;
}
</style>
