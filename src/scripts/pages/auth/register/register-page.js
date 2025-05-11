import Swal from 'sweetalert2';

import RegisterPresenter from './register-presenter';
import { checkUnauthenticatedRouteOnly } from '../../../utils/auth';

class RegisterPage {
  #presenter;

  constructor() {
    this.#presenter = new RegisterPresenter({ view: this });
  }

  async render() {
    return `
      <main id="main-content">
        <section class="auth-container">
          <div class="auth-card">
            <h2 class="auth-title">Daftar</h2>
            <p class="auth-subtitle">Buat akun untuk berbagi cerita pengalamanmu di Dicoding</p>
            
            <form id="registerForm">
              <div class="form-group">
                <label for="name">Nama</label>
                <input type="text" id="name" name="name" placeholder="Masukkan nama kamu" required>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" autocomplete="username" placeholder="Masukkan email" required>
              </div>
              
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" autocomplete="current-password" placeholder="Masukkan password" required>
              </div>
              
              <button type="submit" class="btn btn-auth" id="submitButton">Daftar</button>
            </form>
            
            <p class="auth-redirect">Sudah punya akun? <a href="#/login">Masuk sekarang</a></p>
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

    // Inisialisasi event listener
    this.#initEventListeners();
  }

  #initEventListeners() {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      };
      
      await this.#presenter.register(data);
    });
  }

  // Method untuk View
  showSubmitLoadingButton() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';
  }

  hideSubmitLoadingButton() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = false;
    submitButton.innerHTML = 'Daftar';
  }

  registerSuccessfully(message) {
    // Menggunakan Swal di View, bukan di Presenter
    Swal.fire({
      icon: 'success',
      title: 'Pendaftaran Berhasil!',
      text: message || 'Silakan login dengan akun Anda.',
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.hash = '/login';
    });
  }

  registerFailed(message) {
    // Menggunakan Swal di View, bukan di Presenter
    Swal.fire({
      icon: 'error',
      title: 'Pendaftaran Gagal',
      text: message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
    });
  }
}

export default RegisterPage;