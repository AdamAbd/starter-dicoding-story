import { putAccessToken } from '../../../utils/auth';
import CONFIG from '../../../config';

class LoginPresenter {
  constructor({ loginForm }) {
    this._loginForm = loginForm;
    this._loginEndpoint = `${CONFIG.BASE_URL}/login`;
  }

  init() {
    this._loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this._login();
    });
  }

  async _login() {
    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const response = await fetch(this._loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        alert(responseJson.message);
        return;
      }

      // Simpan token ke localStorage
      putAccessToken(responseJson.loginResult.token);

      // Redirect ke halaman utama
      window.location.hash = '/';
    } catch (error) {
      console.error('Login error:', error);
      alert('Terjadi kesalahan saat login. Silakan coba lagi.');
    }
  }
}

export default LoginPresenter;
