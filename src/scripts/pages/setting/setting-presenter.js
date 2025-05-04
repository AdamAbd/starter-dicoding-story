import Swal from 'sweetalert2';
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from '../../data/api';
import { urlBase64ToUint8Array } from '../../utils/push-notification';

const VAPID_PUBLIC_KEY =
  'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

class SettingPresenter {
  constructor({ settingForm, pushNotificationCheckbox }) {
    this.settingForm = settingForm;
    this.pushNotificationCheckbox = pushNotificationCheckbox;
  }

  async init() {
    await this._checkInitialSubscription();
    this._initEventListeners();
  }

  async _checkInitialSubscription() {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        this.pushNotificationCheckbox.checked = !!subscription;
      } else {
        this.pushNotificationCheckbox.disabled = true;
        this.pushNotificationCheckbox.title =
          'Push Notification tidak didukung di browser ini.';
      }
    } catch (error) {
      console.error('Error checking initial subscription:', error);
      this.pushNotificationCheckbox.disabled = true;
      this.pushNotificationCheckbox.title =
        'Gagal memeriksa status langganan notifikasi.';
    }
  }

  _initEventListeners() {
    this.pushNotificationCheckbox.addEventListener('change', (event) => {
      this._handleNotificationChange(event.target.checked);
    });
  }

  async _handleNotificationChange(isChecked) {
    if (isChecked) {
      await this._subscribe();
    } else {
      await this._unsubscribe();
    }
  }

  async _subscribe() {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push Notification tidak didukung.');
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        this.pushNotificationCheckbox.checked = false;
        Swal.fire(
          'Izin Ditolak',
          'Anda perlu memberikan izin notifikasi untuk mengaktifkan fitur ini.',
          'warning'
        );
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }

      await subscribePushNotification(subscription.toJSON());

      Swal.fire(
        'Berhasil!',
        'Anda berhasil berlangganan notifikasi push.',
        'success'
      );
    } catch (error) {
      console.error('Error subscribing:', error);
      this.pushNotificationCheckbox.checked = false;
      Swal.fire(
        'Gagal',
        `Gagal berlangganan notifikasi: ${error.message}`,
        'error'
      );
    }
  }

  async _unsubscribe() {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push Notification tidak didukung.');
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await unsubscribePushNotification(subscription.endpoint);
        await subscription.unsubscribe();
        Swal.fire(
          'Berhasil!',
          'Anda berhasil berhenti berlangganan notifikasi push.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      Swal.fire(
        'Gagal',
        `Gagal berhenti berlangganan notifikasi: ${error.message}`,
        'error'
      );
    }
  }
}

export default SettingPresenter;
