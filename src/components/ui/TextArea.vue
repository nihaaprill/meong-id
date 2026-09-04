<template>
  <div class="ui-form-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <textarea
      :id="id"
      :rows="rows"
      :placeholder="placeholder"
      v-model="model"
      @input="$emit('update:modelValue', model)"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  id: String,
  label: String,
  placeholder: String,
  rows: { type: Number, default: 4 },
  modelValue: String
})
const model = ref(props.modelValue)
watch(() => props.modelValue, v => (model.value = v))
</script>

<style scoped>
textarea {
  resize: vertical;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-family: inherit;
}
textarea:focus {
  border-color: #ff6b81;
}
</style>
