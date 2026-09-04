<template>
  <div class="ui-form-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="model"
      @input="$emit('update:modelValue', model)"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  id: String,
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  modelValue: String
})
const model = ref(props.modelValue)
watch(() => props.modelValue, v => (model.value = v))
</script>

<style scoped>
.ui-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
label {
  font-weight: 600;
}
input {
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
}
input:focus {
  border-color: #ff6b81;
}
</style>
