import { putAccessToken } from '../../../utils/auth';
import { loginUser } from '../../../data/api'; // Impor fungsi loginUser

class LoginPresenter {
  constructor({ loginForm }) {
    this._loginForm = loginForm;
    // Hapus this._loginEndpoint karena tidak digunakan lagi
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

      // Panggil fungsi loginUser dari api.js
      const loginResult = await loginUser({ email, password });

      // Simpan token ke localStorage
      putAccessToken(loginResult.token);

      // Redirect ke halaman utama
      window.location.hash = '/';
    } catch (error) {
      console.error('Login error:', error);
      // Tampilkan pesan error dari API atau pesan default
      alert(error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.');
    }
  }
}

export default LoginPresenter;
