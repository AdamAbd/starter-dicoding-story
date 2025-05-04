import { getAccessToken, getLogout } from '../utils/auth';

class AppBar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const isLogin = !!getAccessToken();

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
              ${
                isLogin
                  ? `
                <a href="#/setting"><i class="fa-solid fa-gear"></i> Settings</a>
                <button class="btn btn-logout" id="logoutButton">
                  <i class="fa-solid fa-sign-out-alt"></i> Keluar
                </button>
              `
                  : `
                <a href="#/login" class="btn btn-login">
                  <i class="fa-solid fa-sign-in-alt"></i> Masuk
                </a>
                <a href="#/register" class="btn btn-register">
                  <i class="fa-solid fa-user-plus"></i> Daftar
                </a>
              `
              }
            </div>
          </nav>
        </div>
      </header>
    `;

    this._initListeners();
  }

  _initListeners() {
    const menuToggle = this.querySelector('#menuToggle');
    const navLinks = this.querySelector('#navLinks');
    const logoutButton = this.querySelector('#logoutButton');

    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        navLinks.classList.toggle('active');
      });

      document.addEventListener('click', (event) => {
        if (
          !navLinks.contains(event.target) &&
          !menuToggle.contains(event.target)
        ) {
          navLinks.classList.remove('active');
        }
      });
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        getLogout();
        window.location.hash = '/login';
        window.location.reload();
      });
    }
  }
}

customElements.define('app-bar', AppBar);

export default AppBar;
