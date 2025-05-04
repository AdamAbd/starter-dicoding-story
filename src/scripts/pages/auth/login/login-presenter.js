import Swal from 'sweetalert2';
import { putAccessToken } from '../../../utils/auth';
import { loginUser } from '../../../data/api';

class LoginPresenter {
  constructor({ loginForm }) {
    this._loginForm = loginForm;
    this._submitButton = this._loginForm.querySelector('button[type="submit"]'); // Asumsi tombol submit ada di dalam form
    this._isLoading = false;
  }

  init() {
    this._loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this._login();
    });
  }

  async _login() {
    this._setLoading(true);
    try {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const loginResult = await loginUser({ email, password });

      putAccessToken(loginResult.token);

      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: 'Anda akan diarahkan ke halaman utama.',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.hash = '/';
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.',
      });
    } finally {
      this._setLoading(false);
    }
  }

  _setLoading(isLoading) {
    this._isLoading = isLoading;
    if (this._submitButton) {
      this._submitButton.disabled = isLoading;
      this._submitButton.innerHTML = isLoading ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...' : 'Login';
    }
  }
}

export default LoginPresenter;
