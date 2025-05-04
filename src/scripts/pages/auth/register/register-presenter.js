import { registerUser } from '../../../data/api'; // Impor fungsi registerUser

class RegisterPresenter {
  constructor({ registerForm }) {
    this._registerForm = registerForm;
    // Hapus this._registerEndpoint karena tidak digunakan lagi
  }

  init() {
    this._registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this._register();
    });
  }

  async _register() {
    try {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Panggil fungsi registerUser dari api.js
      await registerUser({ name, email, password });

      // Jika berhasil, arahkan ke halaman login
      alert('Pendaftaran berhasil! Silakan login.');
      window.location.hash = '/login';
    } catch (error) {
      console.error('Register error:', error);
      // Tampilkan pesan error dari API atau pesan default
      alert(error.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    }
  }
}

export default RegisterPresenter;
