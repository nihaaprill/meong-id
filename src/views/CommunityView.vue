<template>
    <main>
        <section class="page-header">
            <div class="container">
                <h1>Komunitas Pecinta Kucing</h1>
                <p>Berbagi pengalaman, tips, dan terhubung dengan sesama pecinta kucing</p>
                
                <div class="community-header-buttons">
                    <div class="dropdown">
                        <button class="btn btn-primary btn-fulldrop" @click="showCategoryDropdown = !showCategoryDropdown">
                            {{ selectedCategory }}
                        </button>
                        <transition name="fade">
                            <div class="dropdown-menu" v-if="showCategoryDropdown">
                                <a href="#" @click.prevent="selectCategory('Semua Kategori')">Semua Kategori</a>
                                <a href="#" @click.prevent="selectCategory('Kesehatan')">Kesehatan</a>
                                <a href="#" @click.prevent="selectCategory('Perawatan')">Perawatan</a>
                                <a href="#" @click.prevent="selectCategory('Nutrisi')">Nutrisi</a>
                                <a href="#" @click.prevent="selectCategory('Adopsi')">Adopsi</a>
                                <a href="#" @click.prevent="selectCategory('Perilaku')">Perilaku</a>
                                <a href="#" @click.prevent="selectCategory('Tips & Trik')">Tips & Trik</a>
                            </div>
                        </transition>
                    </div>
                    <button @click="openCreateModal" class="btn btn-primary btn-fulldrop">Post</button>
                </div>
            </div>
        </section>

        <section class="community-section">
            <div class="container">
                <div class="community-layout">
                    <div v-if="filteredPosts.length === 0" class="empty-state">
                        <p>Belum ada postingan di kategori ini. Jadilah yang pertama!</p>
                    </div>

                    <div class="posts-container">
                        <div class="post-card" v-for="(post, index) in filteredPosts" :key="index">
                            
                            <div class="post-header">
                               <div class="post-user">
                                    <div class="user-avatar">
                                        <img v-if="post.avatar" :src="post.avatar" :alt="post.user" class="avatar-image" />
                                        <span v-else>{{ post.user.charAt(0).toUpperCase() }}</span>
                                    </div>
                                    
                                    <div class="user-info">
                                            <h4>{{ post.user }}</h4>
                                        <p class="post-time">{{getRelativeTime(post.tanggal)}}</p>
                                    </div>
                                </div>
                                
                                <div class="post-header-right">
                                    <div class="post-category-badge" :class="categoryClass(post.kategori)">
                                        {{ post.kategori }}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="post-content">
                                <div class="text-content">
                                    <h3>{{ post.judul }}</h3>
                                    <p>{{ post.isi }}</p>
                                </div>
                                <div v-if="post.foto" class="post-image-container">
                                    <img :src="post.foto" :alt="post.judul" class="post-image" />
                                </div>
                            </div>
                            
                            <div class="post-footer">
                                <div class="footer-left">
                                    <span class="post-stat post-stat-clickable" @click="toggleComments(index)">
                                        💬 {{ countTotalComments(post) }} Komentar
                                    </span>
                                    <span class="post-stat post-stat-clickable like-area" @click="toggleLike(index)">
                                        <span :class="['heart-icon', { liked: post.disukai }]">❤️</span>
                                        {{ post.suka }} suka
                                        <transition name="pop-heart">
                                            <span v-if="post.showHeart" class="heart-pop">❤️</span>
                                        </transition>
                                    </span>
                                    <span class="post-stat post-stat-clickable share-area" @click="sharePost(post)">
                                        <span class="share-icon">📤</span>Bagikan
                                    </span>
                                </div>
                                <div v-if="currentUserId === post.authorId" class="footer-right">
                                    <button @click="openEditModal(post)" class="btn-icon edit" title="Edit">✏️</button>
                                    <button @click="confirmDeleteAction('post', post.id)" class="btn-icon delete">🗑️</button>
                                </div>
                            </div>

                            <div class="comments-section" v-if="activeCommentId === post.id">
                                <div class="comment-input-wrapper">
                                    <input v-model="newCommentText" type="text" placeholder="Tulis komentar..." class="comment-input"
                                        @keyup.enter="addComment(post.id)" />
                                    <button @click="addComment(post.id)" class="btn-send" :disabled="!newCommentText.trim()">
                                        ➤
                                    </button>
                                </div>
                            
                                <div class="comment-list">
                                    <div class="comment-thread" v-for="(comment, cIndex) in post.comments" :key="cIndex">
                                        
                                        <div class="comment-item parent-item">
                                            <div class="comment-user-avatar">
                                                <img v-if="comment.avatar" :src="comment.avatar" class="avatar-image" />
                                                <span v-else>{{ comment.user.charAt(0).toUpperCase() }}</span>
                                            </div>

                                            <div class="comment-content-wrapper">
                                                <div class="comment-header">
                                                    <span class="username">{{ comment.user }}</span>
                                                    <span class="comment-date">{{getRelativeTime(comment.tanggal)}}</span>
                                                </div>
                                                <div class="comment-body">
                                                    <p>{{ comment.text }}</p>
                                                </div>
                                                <div class="reply-toggle-row" v-if="comment.replies && comment.replies.length > 0">
                                                    <button class="btn-toggle-replies" @click="toggleReplies(comment.id)">
                                                        <span v-if="expandedRepliesId === comment.id">Sembunyikan Balasan</span>
                                                        <span v-else>Lihat {{ comment.replies.length }} Balasan</span>
                                                    </button>
                                                </div>
                                                <div class="comment-actions-row">
                                                    <button class="btn-reply" @click="toggleReplyForm(comment.id)">Balas</button>
                                                    <button v-if="currentUserId === comment.userId"  @click="confirmDeleteAction('comment', comment.id)" class="btn-delete-comment">Hapus</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="activeReplyId === comment.id" class="reply-input-area">
                                            <input v-model="replyText" type="text" :placeholder="'Balas ' + comment.user + '...'" class="reply-input"
                                                @keyup.enter="replyComment(post.id, comment.id)" />
                                            <button @click="replyComment(post.id, comment.id)" class="btn-send-reply" :disabled="!replyText.trim()">Kirim</button>
                                        </div>

                                        <div class="replies-container" v-if="comment.replies && comment.replies.length > 0 && expandedRepliesId === comment.id">
                                            <div class="comment-item reply-item" v-for="(reply, rIndex) in comment.replies" :key="rIndex">
                                                <div class="comment-user-avatar sm">
                                                    <img v-if="reply.avatar" :src="reply.avatar" class="avatar-image" />
                                                    <span v-else>{{ reply.user.charAt(0).toUpperCase() }}</span>
                                                </div>
                                                <div class="comment-content-wrapper">
                                                    <div class="comment-header">
                                                        <span class="username">{{ reply.user }}</span>
                                                        <span class="comment-date">{{getRelativeTime(reply.tanggal) }}</span>
                                                    </div>
                                                    <div class="comment-body">
                                                        <p>
                                                            <span class="reply-to-user">@{{ comment.user }}</span>{{ reply.text }}
                                                        </p>
                                                    </div>
                                                    <div class="comment-actions-row reply-action-row">
                                                        <button class="btn-reply" @click="toggleReplyForm(reply.id)">Balas</button>
                                                        <button v-if="currentUserId === reply.userId" @click="confirmDeleteAction('comment', reply.id)" class="btn-delete-comment">Hapus</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div v-if="showPopup" class="popup">
            <div class="popup__content">
                <div class="form">
                    <h2>{{ isEditing ? 'Edit Postingan' : 'Buat Post Baru' }}</h2>
                    
                    <div class="form-group">
                        <label>Kategori</label>
                        <select v-model="newPost.kategori">
                            <option value="" disabled selected>Pilih Kategori</option>
                            <option value="Kesehatan">Kesehatan</option>
                            <option value="Perawatan">Perawatan</option>
                            <option value="Nutrisi">Nutrisi</option>
                            <option value="Adopsi">Adopsi</option>
                            <option value="Perilaku">Perilaku</option>
                            <option value="Tips & Trik">Tips & Trik</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Judul Post</label>
                        <input type="text" v-model="newPost.judul" placeholder="Judul..." />
                    </div>
                    <div class="form-group">
                        <label>Isi Post</label>
                        <textarea v-model="newPost.isi" rows="5" placeholder="Isi..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Upload Foto</label>
                        <input type="file" @change="handleFileUpload" accept="image/*" />
                        <div v-if="newPost.foto" class="new-post-preview mt-2">
                            <img :src="newPost.foto" style="max-height: 100px; border-radius: 5px; margin-top:5px;">
                            <small v-if="isEditing" style="display:block; color:#666">(Biarkan kosong jika tidak ingin ganti foto)</small>
                            <button @click="newPost.foto = null" class="btn-remove-foto">Hapus Foto</button>
                        </div>
                    </div>
                    
                    <div class="modal-buttons">
                        <button class="btn-posting" @click="submitPost" :disabled="!newPost.judul || !newPost.isi || !newPost.kategori">
                            {{ isEditing ? 'Simpan Perubahan' : 'Posting' }}
                        </button>
                        <button class="btn-batal" @click="closePopup">Batal</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showDeleteModal" class="popup delete-overlay">
            <div class="popup__content delete-modal">
                <div class="delete-icon">⚠️</div>
                <h3>Hapus {{ deleteType === 'post' ? 'Postingan' : 'Komentar' }}?</h3>
                <p>Apakah kamu yakin ingin menghapus ini? Tindakan ini tidak dapat dibatalkan.</p>
                
                <div class="modal-buttons delete-buttons">
                    <button class="btn-danger" @click="executeDelete">Ya, Hapus</button>
                    <button class="btn-batal" @click="closeDeleteModal">Batal</button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
// (Bagian script tidak perlu diubah, karena ia menggunakan variabel yang sama dengan template)
const API_URL = 'http://localhost:3000';

export default {
    name: "CommunityView",
    data() {
        return {
            showPopup: false,
            showDeleteModal: false,
            
            showCategoryDropdown: false, 

            deleteType: null,
            deleteTargetId: null,
            selectedCategory: "Semua Kategori",
            
            activeCommentId: null, 
            activeReplyId: null,

            // meniympan ID komentar yang sedang membuka balasan
            expandedRepliesId: null,
            
            isEditing: false,
            editingPostId: null,

            newPost: { kategori: "", judul: "", isi: "", foto: null },
            newCommentText: "", 
            replyText: "", 
            posts: [],
            currentUserId: null,
        };
    },
    computed: {
        filteredPosts() {
            if (this.selectedCategory === "Semua Kategori") return this.posts;
            return this.posts.filter(p => p.kategori === this.selectedCategory);
        }
    },
    methods: {
        // --- UTILITIES ---
        getRelativeTime(dateString) {
            if (!dateString) return "";

            // Konversi string tanggal mentah dari backend menjadi objek Date
            const now = new Date();
            const past = new Date(dateString);
            if (isNaN(past.getTime())) return dateString;

            const diffInSeconds = Math.floor((now - past) / 1000);

            const MINUTE = 60;
            const HOUR = 60 * MINUTE;
            const DAY = 24 * HOUR;
            const YEAR = 365 * DAY;

            const TWO_WEEKS_IN_SECONDS = 14 * DAY; // 14 hari

            // 🔥 KONDISI BARU: JIKA LEBIH DARI 2 MINGGU (14 HARI)
            if (diffInSeconds > TWO_WEEKS_IN_SECONDS) {
                // Tampilkan tanggal penuh (misalnya: "12 April 2025")
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return past.toLocaleDateString('id-ID', options);
            }

            // --- Logika Waktu Relatif (JIKA KURANG DARI 2 MINGGU) ---

            if (diffInSeconds < 30) return "Baru saja";
            if (diffInSeconds < MINUTE) return `${diffInSeconds} detik yang lalu`;
            if (diffInSeconds < HOUR) return `${Math.floor(diffInSeconds / MINUTE)} menit yang lalu`;
            if (diffInSeconds < DAY) {
                const diffInHours = Math.floor(diffInSeconds / HOUR);
                return `${diffInHours} jam yang lalu`;
            }

            // 1. Kondisi Bulan/Hari (sampai 14 hari)
            if (diffInSeconds < YEAR) {
                const diffInDays = Math.floor(diffInSeconds / DAY);

                // Kondisi 14 hari sudah ditangani di atas, tapi kita tetap perlu logika hari/bulan jika ada yang terlewat
                if (diffInDays >= 30) {
                     return `${Math.floor(diffInDays / 30)} bulan yang lalu`;
                }
                return `${diffInDays} hari yang lalu`;
            }

            // 2. Kondisi Tahun (Untuk berjaga-jaga jika ada yang lebih dari setahun tapi kurang dari batas awal)
            const diffInYears = Math.floor(diffInSeconds / YEAR);

            if (diffInYears === 1) {
                return "1 tahun yang lalu";
            }

            return `${diffInYears} tahun yang lalu`;
        },

        categoryClass(kategori) {
            const map = { 
                "Kesehatan": "badge-kesehatan", 
                "Perawatan": "badge-perawatan", 
                "Nutrisi": "badge-nutrisi", 
                "Adopsi": "badge-adopsi", 
                "Perilaku": "badge-perilaku", 
                "Tips & Trik": "badge-tips" 
            };
            return map[kategori] || "";
        },

        selectCategory(cat) { 
            this.selectedCategory = cat; 
            this.showCategoryDropdown = false; 
        },
        
        // --- POST ACTIONS (CRUD) ---
        async fetchPosts() {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            
                const response = await fetch(`${API_URL}/posts`, {
                    method: 'GET',
                    headers: headers
                });

                if (!response.ok) throw new Error('Gagal fetch posts');
                this.posts = await response.json();
                
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        },

        openCreateModal() {
            this.isEditing = false;
            this.newPost = { kategori: "", judul: "", isi: "", foto: null };
            this.showPopup = true;
        },

        openEditModal(post) {
            this.isEditing = true;
            this.editingPostId = post.id;
            this.newPost = {
                kategori: post.kategori,
                judul: post.judul,
                isi: post.isi,
                foto: post.foto 
            };
            this.showPopup = true;
        },

        closePopup() {
            this.showPopup = false;
            this.isEditing = false;
            this.editingPostId = null;
            this.newPost = { kategori: "", judul: "", isi: "", foto: null };
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => { this.newPost.foto = e.target.result; };
                reader.readAsDataURL(file); 
            }
        },

        async submitPost() {
            if (!this.newPost.judul || !this.newPost.isi || !this.newPost.kategori) return alert("Lengkapi data!");
            const token = localStorage.getItem('token');
            if (!token) return alert("Login dulu!");

            try {
                let url = `${API_URL}/posts`;
                let method = 'POST';

                if (this.isEditing) {
                    url = `${API_URL}/posts/${this.editingPostId}`;
                    method = 'PUT';
                }

                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(this.newPost)
                });
                
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Gagal menyimpan postingan');
                
                this.closePopup(); 
                this.fetchPosts();
            } catch (e) { 
                alert("Gagal: " + e.message); 
            }
        },

        // --- LIKES & COMMENTS ---
        async toggleLike(index) {
            const post = this.posts[index];
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Login dulu untuk menyukai postingan! ❤️");
                return;
            }
        
            const oldStatus = post.disukai;
            const oldCount = post.suka;
        
            post.disukai = !oldStatus;
            post.suka = post.disukai ? oldCount + 1 : oldCount - 1;
            if(post.disukai) {
                post.showHeart = true;
                setTimeout(() => (post.showHeart = false), 600);
            }
        
            try {
                const res = await fetch(`${API_URL}/posts/${post.id}/like`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            
                if (!res.ok) throw new Error('Gagal like');
            } catch (error) {
                console.error(error);
                post.disukai = oldStatus;
                post.suka = oldCount;
                alert("Gagal memproses like (Cek koneksi)");
            }
        },

        toggleComments(index) { 
            const postId = this.posts[index].id;
            this.activeCommentId = (this.activeCommentId === postId) ? null : postId;
        },

        countTotalComments(post) {
            let total = post.comments.length;
            if (post.comments) {
                post.comments.forEach(c => { if(c.replies) total += c.replies.length; });
            }
            return total;
        },

        async addComment(postId) {
             const token = localStorage.getItem('token');
             if (!token) return alert("Login dulu!");
             
             if (!this.newCommentText.trim()) return;

             try {
                const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ text: this.newCommentText, parentId: null })
                });

                if(res.ok) {
                    this.newCommentText = ""; 
                    this.fetchPosts();
                }
             } catch(e) { console.error(e); }
        },

        toggleReplies(commentId) {
            // Jika ID yang diklik sama dengan yang sedang terbuka, tutup (set jadi null)
            if (this.expandedRepliesId === commentId) {
                this.expandedRepliesId = null;
            } else {
                // Jika berbeda, buka balasan untuk ID yang baru
                this.expandedRepliesId = commentId;
            }
        },

        toggleReplyForm(id) { 
            this.activeReplyId = this.activeReplyId === id ? null : id; 
        },
        
        async replyComment(postId, parentId) {
             const token = localStorage.getItem('token');
             if (!token) return alert("Login dulu!");
             
             if (!this.replyText.trim()) return;

             try {
                const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ text: this.replyText, parentId: parentId })
                });

                if(res.ok) {
                    this.replyText = ""; 
                    this.activeReplyId = null; 
                    this.fetchPosts();
                }
             } catch(e) { console.error(e); }
        },

        // --- DELETE & SHARE ---
        confirmDeleteAction(type, id) {
            this.deleteType = type;   
            this.deleteTargetId = id; 
            this.showDeleteModal = true; 
        },

        closeDeleteModal() {
            this.showDeleteModal = false;
            this.deleteType = null;
            this.deleteTargetId = null;
        },

        async executeDelete() {
            if (!this.deleteType || !this.deleteTargetId) return;

            const token = localStorage.getItem('token');
            const url = this.deleteType === 'post' 
                ? `${API_URL}/posts/${this.deleteTargetId}`
                : `${API_URL}/comments/${this.deleteTargetId}`;
            
            try {
                const res = await fetch(url, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    this.fetchPosts();
                } else {
                    alert("Gagal menghapus.");
                }
            } catch (e) {
                alert("Error jaringan");
            } finally {
                this.closeDeleteModal(); 
            }
        },

        async sharePost(post) {
            const shareData = {
                title: `Postingan dari ${post.user}`,
                text: `🐱 *${post.judul}* \n\n"${post.isi}"\n\nOleh: ${post.user} di Meong.id`,
                url: window.location.href 
            };
        
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    const textToCopy = `${shareData.text}\n${shareData.url}`;
                    await navigator.clipboard.writeText(textToCopy);
                    alert("Tautan dan isi postingan berhasil disalin! Siap dipaste ke WA/Medsos.");
                }
            } catch (err) {
                console.error("Error sharing:", err);
            }
        },
    },

    mounted() {
        this.fetchPosts();
        const userStr = localStorage.getItem('user');
        if(userStr) { try { this.currentUserId = JSON.parse(userStr).id; } catch(e){} }
    }
};
</script>

<style scoped>
/* (Bagian style tidak diubah) */
.community-header-buttons { 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    gap: 1rem; 
    margin-top: 0.5rem; 
}

.community-header-buttons .btn { 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    gap: 0.5rem; 
    padding: 0.6rem 1.8rem; 
    height: 45px; 
    line-height: 1; 
    font-weight: 600; 
    border-radius: 25px; 
    color: var(--white); 
    border: none; 
    cursor: pointer; 
    transition: all 0.3s; 
}

.dropdown { 
    position: relative; 
}

.dropdown-menu { 
    position: absolute; 
    top: 110%; 
    left: 0; 
    background-color: var(--white); 
    border: 1px solid var(--light-gray); 
    border-radius: 8px; 
    box-shadow: var(--shadow); 
    padding: 0.5rem 0; 
    min-width: 180px; 
    z-index: 10; 
}

.dropdown-menu a { 
    display: block; 
    padding: 0.5rem 1rem; 
    color: var(--text-black); 
    text-decoration: none; 
    transition: background 0.2s; 
}

.dropdown-menu a:hover { 
    background-color: var(--light-cream); 
}

.community-section { 
    text-align: left; 
    align-items: flex-start; 
}

.community-layout { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
}

.post-card { 
    position: relative; 
    border-radius: 15px; 
    padding: 1.5rem; 
    margin-bottom: 20px; 
    box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
    border: 1px solid #eee; 
}

.post-header {
    display: flex;
    justify-content: space-between; 
    align-items: flex-start;
    margin-bottom: 15px;
}

.post-user { 
    display: flex; 
    align-items: center; 
    margin-bottom: 15px;
} 

.post-header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--soft-orange); /* Warna default */
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(35, 74, 45);
    font-weight: bold;
    font-size: 1.2rem;
    overflow: hidden; /* Penting agar gambar tidak keluar dari lingkaran */
    flex-shrink: 0;
}

.user-info {
    margin-left: 10px;
}

.user-info a, .comment-header a {
    text-decoration: none; /* Hilangkan garis bawah default */
    color: var(--text-black); /* Warna teks untuk nama user */
    font-weight: bold;
    transition: color 0.2s;
    /* Tambahan di sini: pastikan h4 tidak memiliki margin berlebih */
    display: block; 
}

.user-info h4 {
    margin: 0;
    font-size: 1rem;
}

.user-info p {
    margin: 0;
    font-size: 0.8rem;
    color: #888;
}

/* Gaya untuk Link Profil (Nama User) */
.user-info a, .comment-content a {
    text-decoration: none; /* Hilangkan garis bawah default */
    color: var(--dark-navy); /* Warna teks untuk nama user */
    font-weight: bold;
    transition: color 0.2s;
}

.user-info a:hover, .comment-content a:hover {
    color: var(--soft-green); /* Efek hover */
}

.comment-content-wrapper .reply-to-user {
    font-weight: 600; /* Tebalkan nama target */
    color: var(--color-primary, #007bff); /* Beri warna (misalnya biru) */
    margin-right: 5px; /* Beri jarak antara @username dan teks balasan */
    /* Opsional: Membuatnya terlihat seperti link */
    cursor: pointer; 
}

.avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Pastikan gambar mengisi kotak */
}

.post-category-badge {
    position: static; 
    display: inline-block;
    font-weight: 600;
    font-size: 0.85rem;
    padding: 0.3rem 0.8rem;
    border-radius: 10px;
    color: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    text-transform: capitalize;
}

.post-options {
    display: flex;
    gap: 10px;
    margin-top: 5px;
}

.post-content { 
    display: flex; 
    gap: 20px; 
    margin-bottom: 15px; 
    align-items: flex-start; 
    flex-wrap: wrap; 
}

.text-content { 
    flex: 2; 
    min-width: 250px; 
}

.text-content p { 
    text-align: justify; 
    margin-top: 10px; 
}

.post-image-container { 
    flex: 1; 
    min-width: 200px; 
    max-width: 300px; 
    max-height: 300px; 
    overflow: hidden; 
    border-radius: 8px; 
}

.post-image { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
}

.post-footer {
    display: flex;
    justify-content: space-between; 
    align-items: center;
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px solid #f0f0f0; 
}

.footer-left { display: flex; align-items: center; gap: 15px; }
.footer-right { display: flex; gap: 10px; }

.post-stat-clickable { 
    cursor: pointer; 
    margin-right: 15px; 
    font-weight: 600; 
}

.post-stat {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--soft-green);
    font-weight: 600;
    font-size: 0.9rem;
}

.heart-icon {
  font-size: 1.1rem;
  transition: transform 0.2s ease, color 0.2s ease;
  margin-right: 6px;
  font-style: normal; 
}

.heart-icon.liked { 
  color: red; 
  transform: scale(1.3); 
}

.share-area {
    margin-left: 15px; 
    transition: transform 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.share-icon { font-size: 1.1rem; }
.share-area:hover { color: #3498db; transform: scale(1.1); }


.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 5px;
    opacity: 0.7;
    transition: 0.2s;
    border-radius: 5px;
}

.btn-icon:hover {
    opacity: 1;
    background-color: rgba(0,0,0,0.05);
    transform: scale(1.1);
}

.btn-icon.delete:hover {
    color: red;
    background-color: rgba(255, 0, 0, 0.1);
}

.btn-icon.edit:hover {
    color: #3498db;
    background-color: rgba(52, 152, 219, 0.1);
}

.badge-kesehatan { background-color: #54ff9b; color: white; }
.badge-perawatan { background-color: #3498db; color: white; }
.badge-nutrisi { background-color: #e67e22; color: white; }
.badge-perilaku { background-color: #9b59b6; color: white; }
.badge-adopsi { background-color: #e84393; color: white; }
.badge-tips { background-color: #f1c40f; color: #333; }

.comments-section { padding-top: 15px; }

.comment-input-wrapper {
    display: flex;
    gap: 10px;
    margin-bottom: 20px; 
    padding: 10px 0;
}

.comment-input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 25px;
    background-color: #f0f2f5;
    outline: none;
    font-size: 0.95rem;
}

.btn-send {
    background: var(--soft-green);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
}

.btn-send:hover {
    background-color: #27ae60;
}

.comment-list {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.comment-thread {
    display: flex;
    flex-direction: column;
}

.comment-item {
    display: flex;
    gap: 12px;
    align-items: flex-start; 
    position: relative;
}

.comment-user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: var(--soft-orange);
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(86, 128, 104);
    font-size: 0.9rem;
    overflow: hidden;
    flex-shrink: 0;
}

.comment-user-avatar.sm {
    width: 25px;
    height: 25px;
    font-size: 0.8rem;
}

.comment-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* PERBAIKAN: Untuk memberi jarak di kanan */
    margin-right: 55px; 
}

.comment-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 2px;
}

.comment-header .username {
    font-weight: 700;
    font-size: 0.9rem;
    color: #050505;
}

.comment-header .comment-date {
    font-size: 0.75rem;
    color: #65676b;
}

.comment-body p {
    margin: 0;
    font-size: 0.9rem;
    color: #050505;
    line-height: 1.4;
    text-align: justify; 
}

.comment-actions-row {
    display: flex;
    gap: 15px;
    margin-top: 4px;
}

.btn-reply, .btn-delete-comment {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    color: #65676b;
}

.btn-reply:hover {
    color: var(--soft-green);
    text-decoration: underline;
}

.btn-delete-comment:hover {
    color: #e74c3c;
}

.replies-container {
    margin-top: 10px;
    padding-left: 48px; 
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.replies-container .comment-content-wrapper {
    margin-right: 55px; /* Jarak kanan untuk balasan */
}


.reply-input-area {
    margin-top: 8px;
    margin-left: 48px; 
    display: flex;
    gap: 8px;
}

.reply-input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 0.85rem;
    outline: none;
}

.btn-send-reply {
    background-color: var(--soft-green);
    color: white;
    border: none;
    padding: 0 12px;
    border-radius: 15px;
    font-size: 0.8rem;
    cursor: pointer;
}

/* CommunityView.vue: Tambahkan style untuk tombol toggle */

.reply-toggle-row {
    margin-top: 5px;
    margin-left: 5px; /* Sedikit indentasi agar sejajar dengan aksi */
}

.btn-toggle-replies {
    background: none;
    border: none;
    color: var(--text-color-secondary, #7f8c8d); /* Warna abu-abu */
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    text-decoration: underline; /* Agar terlihat seperti link/aksi */
    text-underline-offset: 2px;
}

.popup {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 35px;       
    z-index: 1000;
}

.popup__content {
    background: white;
    padding: 50px;
    border-radius: 15px;
    width: 700px;
    max-height: 90vh;
    overflow-y: auto;
}

.form-group { 
    margin-bottom: 15px; 
    display: flex; 
    flex-direction: column; 
    gap: 5px; 
}

.form-group input, .form-group select, .form-group textarea { 
    padding: 10px; 
    border: 1px solid #ddd; 
    border-radius: 5px; 
}

.modal-buttons { 
    display: flex; 
    justify-content: space-between; 
    margin-top: 20px; 
}

.btn-posting { 
    background-color: var(--soft-green); 
    color: white; 
    padding: 10px 20px; 
    border: none; 
    border-radius: 5px; 
    cursor: pointer; 
}

.btn-batal { 
    background-color: #ccc; 
    color: #333; 
    padding: 10px 20px; 
    border: none; 
    border-radius: 5px; 
    cursor: pointer; 
}

.delete-modal {
    text-align: center;
    width: 400px;
    padding: 30px 20px;
}

.delete-icon { font-size: 3rem; margin-bottom: 10px; }
.delete-buttons { display: flex; justify-content: center; gap: 15px; }

.btn-danger {
    background-color: #e74c3c;
    color: white;
    padding: 10px 25px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}

.btn-danger:hover { background-color: #c0392b; }

.heart-pop {
  position: absolute;
  top: 9px;
  left: 35px;
  font-size: 1rem;
  color: #e74c3c;
  animation: pop-up 0.6s ease forwards;
}

@keyframes pop-up {
  0% { opacity: 0; transform: scale(0.3) translateY(0); }
  50% { opacity: 1; transform: scale(1.5) translateY(-10px); }
  100% { opacity: 0; transform: scale(0.8) translateY(-25px); }
}
</style>