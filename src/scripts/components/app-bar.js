class AppBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <a href="#main-content" class="skip-link">Lewati ke konten</a>
      <header>
        <div class="container">
          <nav class="navbar">
            <a href="#/" class="brand-name">
              <i class="fa-solid fa-book-open"></i>
              <span>Dicoding Story</span>
            </a>
            <div class="menu-toggle" id="menuToggle">
              <i class="fa-solid fa-bars"></i>
            </div>
            <div class="nav-links" id="navLinks">
              <a href="#/"><i class="fa-solid fa-house"></i> Beranda</a>
              <a href="#/explore"><i class="fa-solid fa-compass"></i> Jelajahi</a>
              <a href="#/saved"><i class="fa-solid fa-bookmark"></i> Tersimpan</a>
              <a href="#/profile"><i class="fa-solid fa-user"></i> Profil</a>
            </div>
            <button class="btn" id="createStoryButton">
              <i class="fa-solid fa-plus"></i>
              Buat Story
            </button>
          </nav>
        </div>
      </header>
    `;

    this._initListeners();
  }

  _initListeners() {
    const menuToggle = this.querySelector('#menuToggle');
    const navLinks = this.querySelector('#navLinks');
    const createStoryButton = this.querySelector('#createStoryButton');

    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }

    if (createStoryButton) {
      createStoryButton.addEventListener('click', () => {
        window.location.href = '#/create';
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove('active');
      }
    });
  }
}

customElements.define('app-bar', AppBar);

export default AppBar;