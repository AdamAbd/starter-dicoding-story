import CreatePresenter from './create-presenter';
import { checkAuthenticatedRouteOnly } from '../../utils/auth';
import '../../components/app-bar';
import '../../../styles/create.css';

class CreatePage {
  async render() {
    return `
      <app-bar></app-bar>
      <main>
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
              
              <!-- Description Section -->
              <div class="form-group">
                <label for="description">Deskripsi</label>
                <textarea id="description" name="description" rows="4" placeholder="Ceritakan pengalamanmu..." required minlength="10"></textarea>
                <div id="descriptionError" class="form-error" style="display: none;"></div>
              </div>
              
              <!-- Map Section -->
              <div class="form-group map-container">
                <label for="map">Lokasi</label>
                <div id="map"></div>
                <div class="location-info">
                  <span id="locationText">Belum ada lokasi dipilih</span>
                  <span class="location-reset" id="resetLocation">Reset Lokasi</span>
                </div>
              </div>
              
              <!-- Submit Buttons -->
              <div class="submit-actions">
                <button type="submit" class="btn btn-send" id="submitButton">
                  <i class="fa-solid fa-paper-plane"></i> Kirim Story
                </button>
                <button type="button" class="btn btn-guest" id="submitAsGuestButton">
                  <i class="fa-solid fa-user-secret"></i> Kirim Sebagai Tamu
                </button>
              </div>
            </form>
            
            <!-- Camera Modal -->
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
    // Cek apakah user sudah login
    checkAuthenticatedRouteOnly(this);
    
    // Inisialisasi presenter
    const createStoryForm = document.getElementById('createStoryForm');
    const presenter = new CreatePresenter({
      createStoryForm,
      photoInput: document.getElementById('photoInput'),
      photoPreview: document.getElementById('photoPreview'),
      previewImage: document.getElementById('previewImage'),
      photoPlaceholder: document.getElementById('photoPlaceholder'),
      selectPhotoButton: document.getElementById('selectPhotoButton'),
      takePictureButton: document.getElementById('takePictureButton'),
      photoError: document.getElementById('photoError'),
      description: document.getElementById('description'),
      descriptionError: document.getElementById('descriptionError'),
      mapElement: document.getElementById('map'),
      locationText: document.getElementById('locationText'),
      resetLocation: document.getElementById('resetLocation'),
      submitButton: document.getElementById('submitButton'),
      submitAsGuestButton: document.getElementById('submitAsGuestButton'),
      cameraModal: document.getElementById('cameraModal'),
      closeCameraModal: document.getElementById('closeCameraModal'),
      cameraPreview: document.getElementById('cameraPreview'),
      captureButton: document.getElementById('captureButton')
    });
    
    presenter.init();
  }
}

export default CreatePage;