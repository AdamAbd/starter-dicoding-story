import RegisterPresenter from './register-presenter';
import { checkUnauthenticatedRouteOnly } from '../../../utils/auth';

class RegisterPage {
  async render() {
    return `
      <main>
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
              
              <button type="submit" class="btn btn-auth">Daftar</button>
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

    const registerForm = document.getElementById('registerForm');
    const presenter = new RegisterPresenter({
      registerForm,
    });

    presenter.init();
  }
}

export default RegisterPage;
