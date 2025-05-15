import Swal from 'sweetalert2';

import LoginPresenter from './login-presenter';
import { checkUnauthenticatedRouteOnly } from '../../../utils/auth';

class LoginPage {
  #presenter;

  constructor() {
    this.#presenter = new LoginPresenter({ view: this });
  }

  async render() {
    return `
      <main id="main-content">
        <section class="auth-container">
          <div class="auth-card">
            <h2 class="auth-title">Masuk</h2>
            <p class="auth-subtitle">Masuk untuk berbagi cerita pengalamanmu di Dicoding</p>
            
            <form id="loginForm">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" autocomplete="email" placeholder="Masukkan email" required>
              </div>
              
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" autocomplete="current-password" placeholder="Masukkan password" required>
              </div>
              
              <button type="submit" class="btn btn-auth" id="submitButton">Masuk</button>
            </form>
            
            <p class="auth-redirect">Belum punya akun? <a href="#/register">Daftar sekarang</a></p>
          </div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    // Cek apakah user sudah login
    checkUnauthenticatedRouteOnly(this);

    // Setup skip to content
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');
    if (skipLink && mainContent) {
      import('../../../utils/index.js').then(({ setupSkipToContent }) => {
        setupSkipToContent(skipLink, mainContent);
      });
    }

    this.#initEventListeners();
  }

  #initEventListeners() {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      };

      await this.#presenter.login(data);
    });
  }

  showSubmitLoadingButton() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
  }

  hideSubmitLoadingButton() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = false;
    submitButton.innerHTML = 'Masuk';
  }

  loginSuccessfully(message, data) {
    Swal.fire({
      icon: 'success',
      title: 'Login Berhasil!',
      text: message || 'Anda akan diarahkan ke halaman utama.',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.hash = '/';
    });
  }

  loginFailed(message) {
    // Menggunakan Swal di View, bukan di Presenter
    Swal.fire({
      icon: 'error',
      title: 'Login Gagal',
      text: message || 'Terjadi kesalahan saat login. Silakan coba lagi.',
    });
  }
}

export default LoginPage;
