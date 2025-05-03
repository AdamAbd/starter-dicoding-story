import CONFIG from '../../../config';

class RegisterPresenter {
  constructor({ registerForm }) {
    this._registerForm = registerForm;
    this._registerEndpoint = `${CONFIG.BASE_URL}/register`;
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

      const response = await fetch(this._registerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        alert(responseJson.message);
        return;
      }

      // Jika berhasil, arahkan ke halaman login
      alert('Pendaftaran berhasil! Silakan login.');
      window.location.hash = '/login';
    } catch (error) {
      console.error('Register error:', error);
      alert('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    }
  }
}

export default RegisterPresenter;
