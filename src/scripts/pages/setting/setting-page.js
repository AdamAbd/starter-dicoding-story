import SettingPresenter from './setting-presenter';
import { checkAuthenticatedRouteOnly } from '../../utils/auth';
import '../../components/app-bar';
import '../../../styles/setting.css';

class SettingPage {
  async render() {
    return `
      <app-bar></app-bar>
      <main>
        <section class="setting-container">
          <div class="setting-card">
            <h2 class="setting-title">Pengaturan</h2>
            <p class="setting-subtitle">Kustomisasi pengalaman Dicoding Story Anda</p>
            
            <form id="settingForm" class="setting-form">
              <!-- Notification Settings Section -->
              <div class="setting-group">
                <h3>Notifikasi</h3>
                <div class="checkbox-container">
                  <input type="checkbox" id="pushNotification" name="pushNotification">
                  <label for="pushNotification">Aktifkan Notifikasi Push</label>
                </div>
                <p class="checkbox-description">Dapatkan pemberitahuan saat ada cerita baru dari komunitas Dicoding</p>
              </div>
              
              <button type="submit" class="btn-save" id="saveSettingButton">
                <i class="fa-solid fa-save"></i> Simpan Pengaturan
              </button>
              
              <div id="settingSuccess" class="setting-success">Pengaturan berhasil disimpan!</div>
              <div id="settingError" class="setting-error">Gagal menyimpan pengaturan. Silakan coba lagi.</div>
            </form>
          </div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    // Pastikan hanya user yang sudah login yang bisa mengakses halaman ini
    checkAuthenticatedRouteOnly();
    
    const presenter = new SettingPresenter({
      settingForm: document.querySelector('#settingForm'),
      pushNotificationCheckbox: document.querySelector('#pushNotification'),
      saveButton: document.querySelector('#saveSettingButton'),
      successMessage: document.querySelector('#settingSuccess'),
      errorMessage: document.querySelector('#settingError'),
    });

    presenter.init();
  }
}

export default SettingPage;