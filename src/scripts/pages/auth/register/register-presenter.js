import Swal from 'sweetalert2';
import { registerUser } from '../../../data/api';

class RegisterPresenter {
  constructor({ registerForm }) {
    this._registerForm = registerForm;
    this._submitButton = this._registerForm.querySelector(
      'button[type="submit"]'
    );
    this._isLoading = false;
  }

  init() {
    this._registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this._register();
    });
  }

  async _register() {
    this._setLoading(true);
    try {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      await registerUser({ name, email, password });

      Swal.fire({
        icon: 'success',
        title: 'Pendaftaran Berhasil!',
        text: 'Silakan login dengan akun Anda.',
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.hash = '/login';
      });
    } catch (error) {
      console.error('Register error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Pendaftaran Gagal',
        text:
          error.message ||
          'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
      });
    } finally {
      this._setLoading(false);
    }
  }

  _setLoading(isLoading) {
    this._isLoading = isLoading;
    if (this._submitButton) {
      this._submitButton.disabled = isLoading;
      this._submitButton.innerHTML = isLoading
        ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'
        : 'Register';
    }
  }
}

export default RegisterPresenter;
