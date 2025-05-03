class SettingPresenter {
  constructor({
    settingForm,
    pushNotificationCheckbox,
    saveButton,
    successMessage,
    errorMessage,
  }) {
    this.settingForm = settingForm;
    this.pushNotificationCheckbox = pushNotificationCheckbox;
    this.saveButton = saveButton;
    this.successMessage = successMessage;
    this.errorMessage = errorMessage;

    this.PUSH_NOTIFICATION_KEY = 'dicoding_story_push_notification';
  }

  init() {
    this._loadSavedSettings();
    this._initEventListeners();
  }

  _loadSavedSettings() {
    try {
      // Ambil pengaturan notifikasi dari localStorage
      const pushNotificationEnabled = localStorage.getItem(this.PUSH_NOTIFICATION_KEY);
      
      // Jika pengaturan sudah ada, terapkan ke checkbox
      if (pushNotificationEnabled !== null) {
        this.pushNotificationCheckbox.checked = pushNotificationEnabled === 'true';
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  _initEventListeners() {
    this.settingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this._saveSettings();
    });
  }

  _saveSettings() {
    try {
      // Simpan pengaturan notifikasi ke localStorage
      localStorage.setItem(
        this.PUSH_NOTIFICATION_KEY, 
        this.pushNotificationCheckbox.checked
      );

      // Tampilkan pesan sukses
      this._showSuccessMessage();

      // Jika notifikasi diaktifkan, minta izin notifikasi
      if (this.pushNotificationCheckbox.checked) {
        this._requestNotificationPermission();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      this._showErrorMessage();
    }
  }

  _showSuccessMessage() {
    this.successMessage.style.display = 'block';
    this.errorMessage.style.display = 'none';
    
    // Sembunyikan pesan sukses setelah 3 detik
    setTimeout(() => {
      this.successMessage.style.display = 'none';
    }, 3000);
  }

  _showErrorMessage() {
    this.errorMessage.style.display = 'block';
    this.successMessage.style.display = 'none';
    
    // Sembunyikan pesan error setelah 3 detik
    setTimeout(() => {
      this.errorMessage.style.display = 'none';
    }, 3000);
  }

  _requestNotificationPermission() {
    // Periksa apakah browser mendukung notifikasi
    if ('Notification' in window) {
      // Jika izin belum diberikan, minta izin
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }
}

export default SettingPresenter;