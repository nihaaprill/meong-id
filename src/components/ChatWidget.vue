<template>
  <div class="chat-widget-container">
    
    <transition name="scale-up">
      <div v-if="isOpen" class="chat-window">
        <div class="chat-header">
          <div class="header-info">
            <div class="bot-avatar">
              <img src="/kucing.png" alt="Bot" />
            </div>
            <div class="header-text">
              <h4>MeongBot AI 🐾</h4>
              <span class="status">Online • Siap Membantu</span>
            </div>
          </div>
          <button @click="isOpen = false" class="close-btn">✕</button>
        </div>

        <div class="chat-body" ref="chatBody">
          <div v-for="(msg, i) in messages" :key="i" class="message-wrapper" :class="msg.sender">
            <div class="bubble" v-html="parseMarkdown(msg.text)"></div>
            <span class="time">{{ msg.time }}</span>
          </div>
          
          <div v-if="isTyping" class="message-wrapper bot">
            <div class="bubble typing">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        </div>

        <form @submit.prevent="sendMessage" class="chat-footer">
          <input 
            v-model="userInput" 
            type="text" 
            placeholder="Tanya tentang kucing..." 
            :disabled="isTyping || isBotWriting"
          >
          <button type="submit" class="send-btn" :disabled="!userInput || isTyping || isBotWriting">
            ➤
          </button>
        </form>
      </div>
    </transition>

    <button class="float-btn ai-btn" @click="isOpen = !isOpen" title="Tanya AI">
      <span v-if="!isOpen" class="icon">🤖</span>
      <span v-else class="icon">▼</span>
    </button>

  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { marked } from 'marked'

const isOpen = ref(false)
const userInput = ref('')
const isTyping = ref(false)      // Status Loading (Menunggu respons server)
const isBotWriting = ref(false)  // Status Mengetik (Efek huruf muncul satu-satu)
const chatBody = ref(null)

const messages = ref([
  { 
    text: "Halo! Saya MeongBot 😺. Ada yang bisa saya bantu seputar kesehatan atau perawatan kucing?", 
    sender: 'bot', 
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
  }
])

// Fungsi Parsing Markdown
const parseMarkdown = (text) => {
  return marked(text)
}

// Fungsi Auto Scroll ke Bawah
const scrollToBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
}

// Fungsi Efek Mengetik
const typeWriter = (text, messageIndex) => {
  let i = 0;
  const speed = 20; // Kecepatan mengetik (ms per huruf)
  
  function type() {
    if (i < text.length) {
      messages.value[messageIndex].text += text.charAt(i);
      i++;
      scrollToBottom(); // Scroll setiap nambah huruf
      setTimeout(type, speed);
    } else {
      isBotWriting.value = false; // Selesai mengetik
    }
  }
  type();
}

// Fungsi Kirim Pesan
const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  // 1. Tampilkan Pesan User
  const text = userInput.value;
  messages.value.push({ 
    text, 
    sender: 'user', 
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
  });
  userInput.value = '';
  scrollToBottom();

  // 2. Tampilkan Loading (...)
  isTyping.value = true;
  
  try {
    const res = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    if (!res.ok) throw new Error('Gagal');
    const data = await res.json();

    // 3. Hapus Loading, Mulai Efek Mengetik
    isTyping.value = false;
    isBotWriting.value = true;

    // Tambahkan bubble kosong untuk Bot (nanti diisi oleh typeWriter)
    messages.value.push({
      text: "",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });

    // Mulai animasi mengetik pada pesan terakhir
    typeWriter(data.reply, messages.value.length - 1);

  } catch (error) {
    isTyping.value = false;
    messages.value.push({
      text: "Maaf, koneksi ke otak saya terputus 😿. Coba lagi nanti ya!",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    scrollToBottom();
  }
}
</script>

<style scoped>
/* --- CONTAINER UTAMA --- */
.chat-widget-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  font-family: 'Nunito', sans-serif;
}

/* --- TOMBOL FLOATING --- */
.float-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: #A9C47F; /* Hijau Brand */
  color: white;
  font-size: 2rem;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}
.float-btn:hover {
  transform: scale(1.1);
  background: #8EAB65;
}

/* --- JENDELA CHAT --- */
.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 360px; /* Lebar Ideal */
  height: 400px; /* Tinggi Ideal */
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 40px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #f0f0f0;
}

/* --- HEADER --- */
.chat-header {
  background: #A9C47F;
  padding: 15px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-info { display: flex; gap: 12px; align-items: center; }
.bot-avatar { 
  background: white; width: 40px; height: 40px; 
  border-radius: 50%; padding: 2px; overflow: hidden;
}
.bot-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.header-text h4 { margin: 0; font-size: 1rem; font-weight: 700; }
.status { font-size: 0.75rem; opacity: 0.9; }
.close-btn { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; }

/* --- BODY CHAT --- */
.chat-body {
  flex: 1;
  padding: 15px;
  background-color: #F9FAFB;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
}
.message-wrapper { max-width: 85%; display: flex; flex-direction: column; }

/* Bubble Chat */
.bubble {
  padding: 10px 14px;
  border-radius: 15px;
  font-size: 0.9rem;
  line-height: 1.5;
  word-wrap: break-word;
}

/* Style Markdown */
.bubble :deep(p) { margin: 0 0 8px 0; }
.bubble :deep(p:last-child) { margin-bottom: 0; }
.bubble :deep(ul), .bubble :deep(ol) { margin: 5px 0 10px 20px; padding: 0; }
.bubble :deep(li) { margin-bottom: 4px; }
.bubble :deep(strong) { font-weight: 800; }

/* Warna Bubble */
.message-wrapper.bot { align-self: flex-start; }
.message-wrapper.bot .bubble {
  background: white; color: #333; 
  border-top-left-radius: 4px; border: 1px solid #eee; 
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
}

.message-wrapper.user { align-self: flex-end; align-items: flex-end; }
.message-wrapper.user .bubble {
  background: #A9C47F; color: white; 
  border-top-right-radius: 4px; 
  box-shadow: 0 2px 5px rgba(169, 196, 127, 0.4);
}
/* Override warna link di bubble user */
.message-wrapper.user .bubble :deep(strong) { color: #fff; text-decoration: underline; }

.time { font-size: 0.65rem; color: #aaa; margin-top: 4px; padding: 0 4px; }

/* --- FOOTER INPUT --- */
.chat-footer {
  padding: 12px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  align-items: center;
}
.chat-footer input {
  flex: 1; padding: 12px 15px; border: 1px solid #ddd; 
  border-radius: 25px; outline: none; font-size: 0.95rem; 
  background: #fdfdfd; transition: border 0.2s;
}
.chat-footer input:focus { border-color: #A9C47F; background: white; }

.send-btn {
  width: 45px; height: 45px; background: #A9C47F; color: white;
  border: none; border-radius: 50%; cursor: pointer; font-size: 1.1rem;
  display: flex; align-items: center; justify-content: center; transition: 0.2s;
}
.send-btn:hover:not(:disabled) { background: #8EAB65; transform: scale(1.05); }
.send-btn:disabled { background: #e0e0e0; cursor: not-allowed; }

/* --- ANIMASI --- */
.typing span { animation: blink 1.4s infinite both; margin: 0 2px; font-size: 1.5rem; line-height: 10px; }
.typing span:nth-child(2) { animation-delay: .2s; }
.typing span:nth-child(3) { animation-delay: .4s; }
@keyframes blink { 0% { opacity: .2; } 20% { opacity: 1; } 100% { opacity: .2; } }

.scale-up-enter-active, .scale-up-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: bottom right; }
.scale-up-enter-from, .scale-up-leave-to { opacity: 0; transform: scale(0.5) translateY(20px); }

/* --- RESPONSIVE HP --- */
@media (max-width: 480px) {
  .chat-window { width: 90vw; height: 60vh; right: 0; bottom: 80px; }
}
</style>