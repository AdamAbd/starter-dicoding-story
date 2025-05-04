import Swal from 'sweetalert2';
import { addStory, addStoryAsGuest } from '../../data/api';

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

    this.selectedPhoto = null;
    this.selectedLocation = null;
    this.map = null;
    this.marker = null;
    this.mediaStream = null;
    this.isLoading = false;
  }

  init() {
    this._initMap();
    this._initEventListeners();
  }

  _initMap() {
    this.map = L.map(this.mapElement).setView([-6.2088, 106.8456], 13);

    L.tileLayer(
      'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=tnaKD7R2xm5uJ0elB52w',
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }
    ).addTo(this.map);

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

    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this._updateMarker(lat, lng);
    });

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  _updateMarker(lat, lng) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.marker.bindPopup('Lokasi cerita Anda').openPopup();

    this.selectedLocation = { lat, lng };

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
    this.selectPhotoButton.addEventListener('click', () => {
      this.photoInput.click();
    });

    this.photoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        this._validateAndPreviewPhoto(file);
      }
    });

    this.takePictureButton.addEventListener('click', () => {
      this._openCamera();
    });

    this.closeCameraModal.addEventListener('click', () => {
      this._closeCamera();
    });

    this.captureButton.addEventListener('click', () => {
      this._capturePhoto();
    });

    this.resetLocation.addEventListener('click', () => {
      this._resetLocation();
    });

    this.createStoryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this._validateAndSubmit(false);
    });

    this.submitAsGuestButton.addEventListener('click', () => {
      this._validateAndSubmit(true);
    });

    this.description.addEventListener('input', () => {
      this._validateDescription();
    });
  }

  _validateAndPreviewPhoto(file) {
    if (!file.type.match('image.*')) {
      this._showPhotoError('File harus berupa gambar (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 1024 * 1024) {
      this._showPhotoError('Ukuran gambar maksimal 1MB');
      return;
    }

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
    this.cameraModal.style.display = 'block';

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
    this.cameraModal.style.display = 'none';

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  _capturePhoto() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = this.cameraPreview;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], 'camera-photo.jpg', {
          type: 'image/jpeg',
        });

        this._validateAndPreviewPhoto(file);

        this._closeCamera();
      },
      'image/jpeg',
      0.8
    );
  }

  async _validateAndSubmit(asGuest) {
    if (!this.selectedPhoto) {
      this._showPhotoError('Silakan pilih foto terlebih dahulu');
      return;
    }

    if (!this._validateDescription()) {
      return;
    }

    const formData = {
      photo: this.selectedPhoto,
      description: this.description.value,
    };

    if (this.selectedLocation) {
      formData.lat = this.selectedLocation.lat;
      formData.lon = this.selectedLocation.lng;
    }

    this._setLoading(true);

    try {
      let response;
      if (asGuest) {
        response = await addStoryAsGuest(formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Story berhasil ditambahkan sebagai tamu!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.hash = '/';
        });
      } else {
        response = await addStory(formData);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Story berhasil ditambahkan!',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.hash = '/';
        });
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      Swal.fire({
        title: 'Gagal!',
        text: `Gagal menambahkan story: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
      });
    } finally {
      this._setLoading(false);
    }
  }

  _setLoading(isLoading) {
    this.isLoading = isLoading;
    if (isLoading) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
      this.submitAsGuestButton.disabled = true;
      this.submitAsGuestButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    } else {
      this.submitButton.disabled = false;
      this.submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Story';
      this.submitAsGuestButton.disabled = false;
      this.submitAsGuestButton.innerHTML = '<i class="fa-solid fa-user-secret"></i> Kirim Sebagai Tamu';
    }
  }
}

export default CreatePresenter;
