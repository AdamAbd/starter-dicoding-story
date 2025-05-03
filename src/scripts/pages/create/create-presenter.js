import { addStory, addStoryAsGuest } from '../../data/api';
import CONFIG from '../../config';

class CreatePresenter {
  constructor({
    createStoryForm,
    photoInput,
    photoPreview,
    previewImage,
    photoPlaceholder,
    selectPhotoButton,
    takePictureButton,
    photoError,
    description,
    descriptionError,
    mapElement,
    locationText,
    resetLocation,
    submitButton,
    submitAsGuestButton,
    cameraModal,
    closeCameraModal,
    cameraPreview,
    captureButton,
  }) {
    this.createStoryForm = createStoryForm;
    this.photoInput = photoInput;
    this.photoPreview = photoPreview;
    this.previewImage = previewImage;
    this.photoPlaceholder = photoPlaceholder;
    this.selectPhotoButton = selectPhotoButton;
    this.takePictureButton = takePictureButton;
    this.photoError = photoError;
    this.description = description;
    this.descriptionError = descriptionError;
    this.mapElement = mapElement;
    this.locationText = locationText;
    this.resetLocation = resetLocation;
    this.submitButton = submitButton;
    this.submitAsGuestButton = submitAsGuestButton;
    this.cameraModal = cameraModal;
    this.closeCameraModal = closeCameraModal;
    this.cameraPreview = cameraPreview;
    this.captureButton = captureButton;

    // State
    this.selectedPhoto = null;
    this.selectedLocation = null;
    this.map = null;
    this.marker = null;
    this.mediaStream = null;
  }

  init() {
    this._initMap();
    this._initEventListeners();
  }

  _initMap() {
    // Inisialisasi peta Leaflet
    this.map = L.map(this.mapElement).setView([-6.2088, 106.8456], 13); // Default: Jakarta

    // Tambahkan tile layer dari MapTiler dengan API key
    L.tileLayer(
      'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=tnaKD7R2xm5uJ0elB52w',
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }
    ).addTo(this.map);

    // Tambahkan layer control dengan beberapa opsi layer
    const baseMaps = {
      Streets: L.tileLayer(
        'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=tnaKD7R2xm5uJ0elB52w',
        {
          attribution:
            '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }
      ),
      Satellite: L.tileLayer(
        'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=tnaKD7R2xm5uJ0elB52w',
        {
          attribution:
            '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }
      ),
    };

    L.control.layers(baseMaps).addTo(this.map);

    // Tambahkan event listener untuk klik pada peta
    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this._updateMarker(lat, lng);
    });

    // Resize peta setelah dirender
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  _updateMarker(lat, lng) {
    // Hapus marker sebelumnya jika ada
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Tambahkan marker baru
    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.marker.bindPopup('Lokasi cerita Anda').openPopup();

    // Simpan lokasi yang dipilih
    this.selectedLocation = { lat, lng };

    // Update teks lokasi
    this.locationText.textContent = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  }

  _resetLocation() {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }

    this.selectedLocation = null;
    this.locationText.textContent = 'Belum ada lokasi dipilih';
  }

  _initEventListeners() {
    // Event untuk memilih foto dari file
    this.selectPhotoButton.addEventListener('click', () => {
      this.photoInput.click();
    });

    this.photoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        this._validateAndPreviewPhoto(file);
      }
    });

    // Event untuk mengambil foto dari kamera
    this.takePictureButton.addEventListener('click', () => {
      this._openCamera();
    });

    this.closeCameraModal.addEventListener('click', () => {
      this._closeCamera();
    });

    this.captureButton.addEventListener('click', () => {
      this._capturePhoto();
    });

    // Event untuk reset lokasi
    this.resetLocation.addEventListener('click', () => {
      this._resetLocation();
    });

    // Event untuk submit form
    this.createStoryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this._validateAndSubmit(false);
    });

    // Event untuk submit sebagai tamu
    this.submitAsGuestButton.addEventListener('click', () => {
      this._validateAndSubmit(true);
    });

    // Validasi deskripsi saat input
    this.description.addEventListener('input', () => {
      this._validateDescription();
    });
  }

  _validateAndPreviewPhoto(file) {
    // Validasi tipe file
    if (!file.type.match('image.*')) {
      this._showPhotoError('File harus berupa gambar (JPG, PNG, GIF)');
      return;
    }

    // Validasi ukuran file (max 1MB)
    if (file.size > 1024 * 1024) {
      this._showPhotoError('Ukuran gambar maksimal 1MB');
      return;
    }

    // Preview foto
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewImage.src = e.target.result;
      this.previewImage.style.display = 'block';
      this.photoPlaceholder.style.display = 'none';
      this.photoPreview.classList.add('has-image');
      this.selectedPhoto = file;
      this.photoError.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  _showPhotoError(message) {
    this.photoError.textContent = message;
    this.photoError.style.display = 'block';
    this.selectedPhoto = null;
  }

  _validateDescription() {
    const minLength = 10;
    if (this.description.value.length < minLength) {
      this.descriptionError.textContent = `Deskripsi minimal ${minLength} karakter`;
      this.descriptionError.style.display = 'block';
      return false;
    } else {
      this.descriptionError.style.display = 'none';
      return true;
    }
  }

  _openCamera() {
    // Buka modal kamera
    this.cameraModal.style.display = 'block';

    // Akses kamera
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.mediaStream = stream;
        this.cameraPreview.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
        alert(
          'Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.'
        );
        this._closeCamera();
      });
  }

  _closeCamera() {
    // Tutup modal kamera
    this.cameraModal.style.display = 'none';

    // Hentikan stream kamera jika ada
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  _capturePhoto() {
    // Ambil foto dari kamera
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = this.cameraPreview;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Konversi ke blob
    canvas.toBlob(
      (blob) => {
        // Buat file dari blob
        const file = new File([blob], 'camera-photo.jpg', {
          type: 'image/jpeg',
        });

        // Validasi dan preview foto
        this._validateAndPreviewPhoto(file);

        // Tutup kamera
        this._closeCamera();
      },
      'image/jpeg',
      0.8
    );
  }

  async _validateAndSubmit(asGuest) {
    // Validasi foto
    if (!this.selectedPhoto) {
      this._showPhotoError('Silakan pilih foto terlebih dahulu');
      return;
    }

    // Validasi deskripsi
    if (!this._validateDescription()) {
      return;
    }

    // Persiapkan data untuk dikirim
    const formData = {
      photo: this.selectedPhoto,
      description: this.description.value,
    };

    // Tambahkan lokasi jika ada
    if (this.selectedLocation) {
      formData.lat = this.selectedLocation.lat;
      formData.lon = this.selectedLocation.lng;
    }

    try {
      // Disable tombol submit
      this.submitButton.disabled = true;
      this.submitAsGuestButton.disabled = true;

      // Kirim data ke API berdasarkan mode (user atau guest)
      let response;
      if (asGuest) {
        response = await addStoryAsGuest(formData);
        alert('Story berhasil ditambahkan sebagai tamu!');
      } else {
        response = await addStory(formData);
        alert('Story berhasil ditambahkan!');
      }

      // Redirect ke halaman home
      window.location.hash = '/';
    } catch (error) {
      console.error('Error submitting story:', error);
      alert(`Gagal menambahkan story: ${error.message}`);
    } finally {
      // Enable kembali tombol submit
      this.submitButton.disabled = false;
      this.submitAsGuestButton.disabled = false;
    }
  }
}

export default CreatePresenter;
