import {
  subscribePushNotification,
  unsubscribePushNotification,
} from '../../data/api';
import { urlBase64ToUint8Array } from '../../utils/push-notification';

const VAPID_PUBLIC_KEY =
  'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

export default class SettingPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async init() {
    await this._checkInitialSubscription();
  }

  async _checkInitialSubscription() {
    const swResult = await this.#view.getServiceWorkerRegistration();

    if (!swResult.supported) {
      this.#view.setPushNotificationState(
        false,
        true,
        'Push Notification tidak didukung di browser ini.'
      );
      return;
    }

    const { registration } = swResult;
    const subscriptionResult =
      await this.#view.getPushSubscription(registration);

    if (subscriptionResult.error) {
      this.#view.setPushNotificationState(
        false,
        true,
        'Gagal memeriksa status langganan notifikasi.'
      );
      console.error('Error checking subscription:', subscriptionResult.error);
      return;
    }

    const isSubscribed = !!subscriptionResult.subscription;
    this.#view.setPushNotificationState(isSubscribed);
  }

  async onNotificationChange(isChecked) {
    if (isChecked) {
      await this._subscribe();
    } else {
      await this._unsubscribe();
    }
  }

  async _subscribe() {
    // Cek dukungan service worker melalui view
    const swResult = await this.#view.getServiceWorkerRegistration();

    if (!swResult.supported) {
      this.#view.showErrorMessage('Gagal', 'Push Notification tidak didukung.');
      return;
    }

    // Minta izin notifikasi melalui view
    const permissionResult = await this.#view.requestNotificationPermission();

    if (!permissionResult.granted) {
      this.#view.setPushNotificationState(false);
      this.#view.showWarningMessage(
        'Izin Ditolak',
        'Anda perlu memberikan izin notifikasi untuk mengaktifkan fitur ini.'
      );
      return;
    }

    const { registration } = swResult;

    // Cek apakah sudah ada langganan
    const subscriptionResult =
      await this.#view.getPushSubscription(registration);
    let subscription = subscriptionResult.subscription;

    // Jika belum ada langganan, buat baru
    if (!subscription) {
      const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      const createResult = await this.#view.createPushSubscription(
        registration,
        convertedVapidKey
      );

      if (createResult.error) {
        this.#view.setPushNotificationState(false);
        this.#view.showErrorMessage(
          'Gagal',
          `Gagal berlangganan notifikasi: ${createResult.error.message}`
        );
        console.error('Error subscribing:', createResult.error);
        return;
      }

      subscription = createResult.subscription;
    }

    try {
      // Kirim langganan ke server
      await subscribePushNotification(subscription.toJSON());

      this.#view.showSuccessMessage(
        'Berhasil!',
        'Anda berhasil berlangganan notifikasi push.'
      );
    } catch (error) {
      this.#view.setPushNotificationState(false);
      this.#view.showErrorMessage(
        'Gagal',
        `Gagal berlangganan notifikasi: ${error.message}`
      );
      console.error('Error subscribing to server:', error);
    }
  }

  async _unsubscribe() {
    // Cek dukungan service worker melalui view
    const swResult = await this.#view.getServiceWorkerRegistration();

    if (!swResult.supported) {
      this.#view.showErrorMessage('Gagal', 'Push Notification tidak didukung.');
      return;
    }

    const { registration } = swResult;

    // Dapatkan langganan saat ini
    const subscriptionResult =
      await this.#view.getPushSubscription(registration);
    const subscription = subscriptionResult.subscription;

    if (subscription) {
      try {
        // Hapus langganan dari server
        await unsubscribePushNotification(subscription.endpoint);

        // Hapus langganan di browser
        const unsubResult = await this.#view.unsubscribePush(subscription);

        if (unsubResult.error) {
          throw unsubResult.error;
        }

        this.#view.showSuccessMessage(
          'Berhasil!',
          'Anda berhasil berhenti berlangganan notifikasi push.'
        );
      } catch (error) {
        this.#view.showErrorMessage(
          'Gagal',
          `Gagal berhenti berlangganan notifikasi: ${error.message}`
        );
        console.error('Error unsubscribing:', error);
      }
    }
  }
}
