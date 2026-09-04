<template>
  <div class="image-upload-container">
    <label class="label">{{ label }}</label>
    
    <div class="upload-wrapper">
      <div class="image-preview">
        <img :src="previewUrl || defaultImage" alt="Preview" class="avatar-img">
      </div>

      <div class="upload-controls">
        <label :for="id" class="btn-upload">
          📸 Ganti Foto
        </label>
        <input 
          type="file" 
          :id="id" 
          @change="handleFileChange" 
          accept="image/*" 
          class="hidden-input"
        >
        <p class="hint">Format: JPG, PNG (Max 2MB)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  id: { type: String, default: 'file-upload' },
  label: { type: String, default: 'Foto Profil' },
  modelValue: { type: String, default: '' }, // URL Preview
  defaultImage: { type: String, default: 'https://via.placeholder.com/150' }
})

// Tambahkan emit 'change' untuk kirim file asli
const emit = defineEmits(['update:modelValue', 'change'])

const previewUrl = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  previewUrl.value = newValue
})

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 1. Buat Preview Lokal (Base64) untuk tampilan UI
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
      emit('update:modelValue', e.target.result)
    }
    reader.readAsDataURL(file)

    // 2. PENTING: Kirim File Asli ke Parent untuk di-upload ke Server
    emit('change', file)
  }
}
</script>

<style scoped>
.image-upload-container {
  margin-bottom: 1.5rem;
}
.label {
  font-weight: 600;
  color: #444;
  margin-bottom: 0.5rem;
  display: block;
}
.upload-wrapper {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.image-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #A9C47F;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hidden-input {
  display: none;
}
.btn-upload {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #fff;
  border: 1px solid #A9C47F;
  color: #A9C47F;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: 0.2s;
}
.btn-upload:hover {
  background-color: #A9C47F;
  color: white;
}
.hint {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.3rem;
}
</style>