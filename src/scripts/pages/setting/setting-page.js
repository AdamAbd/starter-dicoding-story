import SettingPresenter from './setting-presenter';
import { checkAuthenticatedRouteOnly } from '../../utils/auth';
import '../../../styles/setting.css';

class SettingPage {
  #presenter = null;

  async render() {
    return `
      <main id="main-content">
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
            </form>
          </div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    checkAuthenticatedRouteOnly();
    
    // Setup skip to content
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');
    if (skipLink && mainContent) {
      import('../../utils/index.js').then(({ setupSkipToContent }) => {
        setupSkipToContent(skipLink, mainContent);
      });
    }
    
    this.#presenter = new SettingPresenter({ view: this });
    
    // Inisialisasi event listener di sisi View
    this.#initEventListeners();
    
    // Inisialisasi presenter
    await this.#presenter.init();
  }
  
  #initEventListeners() {
    const pushNotificationCheckbox = document.querySelector('#pushNotification');
    pushNotificationCheckbox.addEventListener('change', (event) => {
      this.#presenter.onNotificationChange(event.target.checked);
    });
  }
  
  // Metode-metode View untuk digunakan oleh Presenter
  setPushNotificationState(isChecked, isDisabled = false, tooltipMessage = '') {
    const checkbox = document.querySelector('#pushNotification');
    checkbox.checked = isChecked;
    checkbox.disabled = isDisabled;
    
    if (tooltipMessage) {
      checkbox.title = tooltipMessage;
    }
  }
  
  showSuccessMessage(title, message) {
    this.#showAlert(title, message, 'success');
  }
  
  showWarningMessage(title, message) {
    this.#showAlert(title, message, 'warning');
  }
  
  showErrorMessage(title, message) {
    this.#showAlert(title, message, 'error');
  }
  
  // Private method untuk menampilkan alert
  #showAlert(title, message, icon) {
    // Implementasi alert dengan Swal
    import('sweetalert2').then((module) => {
      const Swal = module.default;
      Swal.fire(title, message, icon);
    });
  }
  
  // Method untuk meminta izin notifikasi
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return { granted: false, reason: 'not-supported' };
    }
    
    const permission = await Notification.requestPermission();
    return { granted: permission === 'granted', permission };
  }
  
  // Method untuk mengakses Service Worker API
  async getServiceWorkerRegistration() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { supported: false };
    }
    
    try {
      const registration = await navigator.serviceWorker.ready;
      return { supported: true, registration };
    } catch (error) {
      return { supported: false, error };
    }
  }
  
  // Method untuk mengakses Push Manager API
  async getPushSubscription(registration) {
    try {
      const subscription = await registration.pushManager.getSubscription();
      return { subscription };
    } catch (error) {
      return { error };
    }
  }
  
  async createPushSubscription(registration, applicationServerKey) {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      return { subscription };
    } catch (error) {
      return { error };
    }
  }
  
  async unsubscribePush(subscription) {
    try {
      const result = await subscription.unsubscribe();
      return { success: result };
    } catch (error) {
      return { error };
    }
  }
}

export default SettingPage;