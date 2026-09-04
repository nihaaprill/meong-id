<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Meong.id</h3>
          <p>Meong id adalah platform digital yang didedikasikan untuk kesejahteraan kucing.
            Kami menghubungkan komunitas, memfasilitasi adopsi, dan menyediakan sumber daya tepercaya
             untuk semua pecinta kucing di Indonesia.</p>
        </div>
        <div class="footer-section">
          <h3>Menu Utama</h3>
          <ul class="footer-links">
            <li><RouterLink to="/">Beranda</RouterLink></li>
            <li><RouterLink to="/articles">Artikel</RouterLink></li>
            <li><RouterLink to="/donation">Donasi</RouterLink></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Kontak kami</h3>
          <p>Email: info@meong.id</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Meong.id — All rights reserved</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComp'
}
</script>

<style scoped>
.footer-bottom { text-align:center; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.2); }
/* Layout HP (1 kolom) */
@media (max-width: 768px) {
  .footer-content {
 
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: flex-end;
    /* gap: 2rem; */
    margin-bottom: 2rem;

  }
}

/* Style footer-bottom-mu */
.footer-bottom { 
  text-align:center; 
  padding-top:1.5rem; 
  border-top:1px solid rgba(255,255,255,0.2); 
  color: #aaa;
}
</style>
