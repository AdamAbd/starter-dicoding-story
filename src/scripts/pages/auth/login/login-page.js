import LoginPresenter from './login-presenter';
import { checkUnauthenticatedRouteOnly } from '../../../utils/auth';

class LoginPage {
  async render() {
    return `
      <main>
        <section class="auth-container">
          <div class="auth-card">
            <h2 class="auth-title">Masuk</h2>
            <p class="auth-subtitle">Masuk untuk berbagi cerita pengalamanmu di Dicoding</p>
            
            <form id="loginForm">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Masukkan email" required>
              </div>
              
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Masukkan password" required>
              </div>
              
              <button type="submit" class="btn btn-auth">Masuk</button>
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

    const loginForm = document.getElementById('loginForm');
    const presenter = new LoginPresenter({
      loginForm,
    });

    presenter.init();
  }
}

export default LoginPage;
