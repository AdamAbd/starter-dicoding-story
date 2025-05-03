class AppFooter extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <footer>
        <div class="container">
          <div class="footer-content">
            <div class="footer-col">
              <h3>Dicoding Story</h3>
              <p>Platform berbagi cerita pengalaman belajar di Dicoding. Inspirasi, tantangan, dan keberhasilan - semua ada di sini!</p>
              <div class="social-links">
                <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="#" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
                <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
              </div>
            </div>
            <div class="footer-col">
              <h3>Navigasi</h3>
              <ul>
                <li><a href="#/">Beranda</a></li>
                <li><a href="#/explore">Jelajahi</a></li>
                <li><a href="#/saved">Tersimpan</a></li>
                <li><a href="#/profile">Profil</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h3>Bantuan</h3>
              <ul>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Kebijakan Privasi</a></li>
                <li><a href="#">Syarat & Ketentuan</a></li>
                <li><a href="#">Kontak Kami</a></li>
              </ul>
            </div>
          </div>
          <div class="copyright">
            <p>&copy; ${new Date().getFullYear()} Dicoding Story. Dibuat dengan ❤️ untuk Indonesia.</p>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('app-footer', AppFooter);

export default AppFooter;
