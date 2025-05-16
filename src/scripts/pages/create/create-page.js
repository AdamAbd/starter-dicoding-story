import Swal from 'sweetalert2';

import CreatePresenter from './create-presenter';
import { addStory, addStoryAsGuest } from '../../data/api';
import { checkAuthenticatedRouteOnly } from '../../utils/auth';
import '../../../styles/create.css';

class CreatePage {
  #presenter;
  #createStoryForm;
  #photoInput;
  #photoPreview;
  #previewImage;
  #photoPlaceholder;
  #selectPhotoButton;
  #takePictureButton;
  #photoError;
  #description;
  #descriptionError;
  #mapElement;
  #locationText;
  #resetLocation;
  #submitButton;
  #submitAsGuestButton;
  #cameraModal;
  #closeCameraModal;
  #cameraPreview;
  #captureButton;
  #map;
  #marker;
  #mediaStream;

  async render() {
    return `
      <main id="main-content">
        <section class="create-container">
          <div class="create-card">
            <h2 class="create-title">Buat Story</h2>
            <p class="create-subtitle">Bagikan pengalaman belajarmu di Dicoding dengan komunitas</p>
            
            <form id="createStoryForm">
              <!-- Photo Upload Section -->
              <div class="form-group">
                <label for="photo">Foto</label>
                <div class="photo-preview" id="photoPreview">
                  <span id="photoPlaceholder">Pilih foto atau ambil dari kamera</span>
                  <img id="previewImage" style="display: none;" alt="Preview foto yang akan diunggah">
                </div>
                
                <div class="photo-actions">
                  <button type="button" class="btn" id="selectPhotoButton">
                    <i class="fa-solid fa-image"></i> Pilih Foto
                  </button>
                  <button type="button" class="btn" id="takePictureButton">
                    <i class="fa-solid fa-camera"></i> Ambil Foto
                  </button>
                </div>
                <input type="file" id="photoInput" accept="image/*" style="display: none;">
                <div id="photoError" class="form-error" style="display: none;"></div>
              </div>
              
              <div class="form-group">
                <label for="description">Deskripsi</label>
                <textarea id="description" name="description" rows="4" placeholder="Ceritakan pengalamanmu..." required minlength="10"></textarea>
                <div id="descriptionError" class="form-error" style="display: none;"></div>
              </div>
              
              <div class="form-group map-container">
                <label for="map">Lokasi</label>
                <div id="map"></div>
                <div class="location-info">
                  <span id="locationText">Belum ada lokasi dipilih</span>
                  <span class="location-reset" id="resetLocation">Reset Lokasi</span>
                </div>
              </div>
              
              <div class="submit-actions">
                <button type="submit" class="btn btn-send" id="submitButton">
                  <i class="fa-solid fa-paper-plane"></i> Kirim Story
                </button>
                <button type="button" class="btn btn-guest" id="submitAsGuestButton">
                  <i class="fa-solid fa-user-secret"></i> Kirim Sebagai Tamu
                </button>
              </div>
            </form>
            
            <div id="cameraModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000;">
              <div style="position: relative; width: 100%; max-width: 600px; margin: 50px auto; background: white; padding: 20px; border-radius: 10px;">
                <button id="closeCameraModal" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">
                  <i class="fa-solid fa-times"></i>
                </button>
                <h3 style="margin-bottom: 15px;">Ambil Foto</h3>
                <video id="cameraPreview" style="width: 100%; height: 300px; background: #000; margin-bottom: 15px;" autoplay></video>
                <div style="display: flex; justify-content: center;">
                  <button id="captureButton" class="btn">
                    <i class="fa-solid fa-camera"></i> Ambil Foto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    checkAuthenticatedRouteOnly(this);

    // Setup skip to content
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');
    if (skipLink && mainContent) {
      import('../../utils/index.js').then(({ setupSkipToContent }) => {
        setupSkipToContent(skipLink, mainContent);
      });
    }

    // Inisialisasi elemen-elemen DOM
    this.#initElements();

    // Inisialisasi view dan storyService
    const view = this.#createView();
    const storyService = this.#createStoryService();

    // Inisialisasi presenter
    this.#presenter = new CreatePresenter({
      view,
      storyService,
    });

    // Setup event listeners
    this.#setupEventListeners();

    // Inisialisasi map
    this.#initMap();
  }

  #initElements() {
    this.#createStoryForm = document.getElementById('createStoryForm');
    this.#photoInput = document.getElementById('photoInput');
    this.#photoPreview = document.getElementById('photoPreview');
    this.#previewImage = document.getElementById('previewImage');
    this.#photoPlaceholder = document.getElementById('photoPlaceholder');
    this.#selectPhotoButton = document.getElementById('selectPhotoButton');
    this.#takePictureButton = document.getElementById('takePictureButton');
    this.#photoError = document.getElementById('photoError');
    this.#description = document.getElementById('description');
    this.#descriptionError = document.getElementById('descriptionError');
    this.#mapElement = document.getElementById('map');
    this.#locationText = document.getElementById('locationText');
    this.#resetLocation = document.getElementById('resetLocation');
    this.#submitButton = document.getElementById('submitButton');
    this.#submitAsGuestButton = document.getElementById('submitAsGuestButton');
    this.#cameraModal = document.getElementById('cameraModal');
    this.#closeCameraModal = document.getElementById('closeCameraModal');
    this.#cameraPreview = document.getElementById('cameraPreview');
    this.#captureButton = document.getElementById('captureButton');
  }

  #createView() {
    return {
      showPhotoError: (message) => {
        this.#photoError.textContent = message;
        this.#photoError.style.display = 'block';
      },
      hidePhotoError: () => {
        this.#photoError.style.display = 'none';
      },
      showDescriptionError: (message) => {
        this.#descriptionError.textContent = message;
        this.#descriptionError.style.display = 'block';
      },
      hideDescriptionError: () => {
        this.#descriptionError.style.display = 'none';
      },
      previewPhoto: (dataUrl) => {
        this.#previewImage.src = dataUrl;
        this.#previewImage.style.display = 'block';
        this.#photoPlaceholder.style.display = 'none';
        this.#photoPreview.classList.add('has-image');
      },
      getDescriptionValue: () => this.#description.value,
      updateLocationText: (text) => {
        this.#locationText.textContent = text;
      },
      setLoading: (isLoading) => {
        if (isLoading) {
          this.#submitButton.disabled = true;
          this.#submitButton.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
          this.#submitAsGuestButton.disabled = true;
          this.#submitAsGuestButton.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        } else {
          this.#submitButton.disabled = false;
          this.#submitButton.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Kirim Story';
          this.#submitAsGuestButton.disabled = false;
          this.#submitAsGuestButton.innerHTML =
            '<i class="fa-solid fa-user-secret"></i> Kirim Sebagai Tamu';
        }
      },
      showSuccessMessage: (message, asGuest) => {
        Swal.fire({
          title: 'Berhasil!',
          text: message,
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          window.location.hash = '/';
        });
      },
      showErrorMessage: (message) => {
        Swal.fire({
          title: 'Gagal!',
          text: message,
          icon: 'error',
          confirmButtonText: 'Coba Lagi',
        });
      },
      openCameraModal: () => {
        this.#cameraModal.style.display = 'block';
      },
      closeCameraModal: () => {
        this.#cameraModal.style.display = 'none';
      },
    };
  }

  #createStoryService() {
    return {
      addStory: (formData) => addStory(formData),
      addStoryAsGuest: (formData) => addStoryAsGuest(formData),
    };
  }

  #setupEventListeners() {
    // Setup event listener untuk form
    this.#createStoryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.#presenter.validateAndSubmit(false);
    });

    // Setup event listener untuk tombol upload foto
    this.#selectPhotoButton.addEventListener('click', () => {
      this.#photoInput.click();
    });

    // Setup event listener untuk input foto
    this.#photoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        this.#presenter.validateAndPreviewPhoto(file);
      }
    });

    // Setup event listener untuk tombol ambil foto
    this.#takePictureButton.addEventListener('click', () => {
      this.#openCamera();
    });

    // Setup event listener untuk tombol tutup modal kamera
    this.#closeCameraModal.addEventListener('click', () => {
      this.#closeCamera();
    });

    // Setup event listener untuk tombol ambil foto dari kamera
    this.#captureButton.addEventListener('click', () => {
      this.#capturePhoto();
    });

    // Setup event listener untuk tombol reset lokasi
    this.#resetLocation.addEventListener('click', () => {
      this.#resetMapLocation();
    });

    // Setup event listener untuk tombol kirim sebagai tamu
    this.#submitAsGuestButton.addEventListener('click', () => {
      this.#presenter.validateAndSubmit(true);
    });

    // Setup event listener untuk input deskripsi
    this.#description.addEventListener('input', () => {
      this.#presenter.validateDescription();
    });
  }

  #initMap() {
    this.#map = L.map(this.#mapElement).setView([-6.2088, 106.8456], 13);

    L.tileLayer(
      'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=tnaKD7R2xm5uJ0elB52w',
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }
    ).addTo(this.#map);

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

    L.control.layers(baseMaps).addTo(this.#map);

    this.#map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this.#updateMarker(lat, lng);
      this.#presenter.setSelectedLocation(lat, lng);
    });

    setTimeout(() => {
      this.#map.invalidateSize();
    }, 100);
  }

  #updateMarker(lat, lng) {
    if (this.#marker) {
      this.#map.removeLayer(this.#marker);
    }

    this.#marker = L.marker([lat, lng]).addTo(this.#map);
    this.#marker.bindPopup('Lokasi cerita Anda').openPopup();

    this.#locationText.textContent = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  }

  #resetMapLocation() {
    if (this.#marker) {
      this.#map.removeLayer(this.#marker);
      this.#marker = null;
    }

    this.#locationText.textContent = 'Belum ada lokasi dipilih';
    this.#presenter.resetSelectedLocation();
  }

  #openCamera() {
    this.#cameraModal.style.display = 'block';

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        this.#mediaStream = stream;
        this.#cameraPreview.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
        alert(
          'Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.'
        );
        this.#closeCamera();
      });
  }

  #closeCamera() {
    this.#cameraModal.style.display = 'none';

    if (this.#mediaStream) {
      this.#mediaStream.getTracks().forEach((track) => track.stop());
      this.#mediaStream = null;
    }
  }

  #capturePhoto() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = this.#cameraPreview;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], 'camera-photo.jpg', {
          type: 'image/jpeg',
        });

        this.#presenter.validateAndPreviewPhoto(file);

        this.#closeCamera();
      },
      'image/jpeg',
      0.8
    );
  }
}

export default CreatePage;
