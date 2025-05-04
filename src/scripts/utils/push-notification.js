/**
 * Mengonversi string VAPID public key base64 URL-safe menjadi Uint8Array.
 * @param {string} base64String - String VAPID public key base64 URL-safe.
 * @returns {Uint8Array} - Array byte dari VAPID public key.
 */
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
