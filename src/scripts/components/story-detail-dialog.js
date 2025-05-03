import { getStoryDetail } from '../data/api';

class StoryDetailDialog extends HTMLElement {
  constructor() {
    super();
    this._story = null;
    this._map = null;
    this._marker = null;
    this._isMapInitialized = false;
  }

  connectedCallback() {
    this.render();
    this._initDialog();
  }

  disconnectedCallback() {
    if (this._map) {
      this._map.remove();
      this._map = null;
      this._isMapInitialized = false;
    }
  }

  /**
   * Menampilkan dialog dan memuat data cerita berdasarkan ID
   * @param {string} id - ID cerita yang akan ditampilkan
   */
  async showStory(id) {
    try {
      this._showLoading();
      this._dialog.showModal();

      const story = await getStoryDetail(id);
      this._story = story;
      this._renderStoryDetail();
    } catch (error) {
      this._showError(error.message);
      console.error('Error showing story detail:', error);
    }
  }

  /**
   * Menutup dialog
   */
  close() {
    if (this._dialog && this._dialog.open) {
      this._dialog.close();
    }

    // Reset map jika ada
    if (this._map) {
      this._map.remove();
      this._map = null;
      this._isMapInitialized = false;
    }
  }

  /**
   * Inisialisasi dialog dan event listener
   */
  _initDialog() {
    this._dialog = this.querySelector('dialog');

    // Tambahkan event listener untuk tombol close
    const closeButton = this.querySelector('.dialog-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.close();
      });
    }

    // Tutup dialog saat klik di luar dialog (backdrop)
    this._dialog.addEventListener('click', (event) => {
      const dialogDimensions = this._dialog.getBoundingClientRect();
      if (
        event.clientX < dialogDimensions.left ||
        event.clientX > dialogDimensions.right ||
        event.clientY < dialogDimensions.top ||
        event.clientY > dialogDimensions.bottom
      ) {
        this.close();
      }
    });
  }

  /**
   * Menampilkan loading state
   */
  _showLoading() {
    const dialogContent = this.querySelector('.dialog-content');
    if (dialogContent) {
      dialogContent.innerHTML = `
        <div class="dialog-loading">
          <div class="loading-spinner"></div>
          <p class="loading-text">Memuat detail cerita...</p>
        </div>
      `;
    }
  }

  /**
   * Menampilkan error state
   * @param {string} message - Pesan error yang akan ditampilkan
   */
  _showError(message) {
    const dialogContent = this.querySelector('.dialog-content');
    if (dialogContent) {
      dialogContent.innerHTML = `
        <div class="dialog-error">
          <div class="error-icon">
            <i class="fa-solid fa-circle-exclamation"></i>
          </div>
          <p class="error-message">${message || 'Terjadi kesalahan saat memuat detail cerita'}</p>
          <div class="error-action">
            <button class="btn" id="retry-button">
              <i class="fa-solid fa-rotate"></i> Coba Lagi
            </button>
          </div>
        </div>
      `;

      // Tambahkan event listener untuk tombol retry
      const retryButton = this.querySelector('#retry-button');
      if (retryButton && this._story && this._story.id) {
        retryButton.addEventListener('click', () => {
          this.showStory(this._story.id);
        });
      } else if (retryButton) {
        retryButton.addEventListener('click', () => {
          this.close();
        });
      }
    }
  }

  /**
   * Render detail cerita
   */
  _renderStoryDetail() {
    if (!this._story) return;

    const { name, description, photoUrl, createdAt, lat, lon } = this._story;

    const date = new Date(createdAt);
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);

    const initial = name.charAt(0).toUpperCase();
    const hasLocation = lat !== null && lon !== null;

    const dialogContent = this.querySelector('.dialog-content');
    if (dialogContent) {
      dialogContent.innerHTML = `
        <button class="dialog-close" aria-label="Tutup dialog">
          <i class="fa-solid fa-times"></i>
        </button>
        <div class="story-detail-image">
          <img src="${photoUrl}" alt="Story by ${name}" loading="lazy">
        </div>
        <div class="story-detail-info">
          <div class="story-detail-header">
            <div class="story-author-avatar">${initial}</div>
            <div class="story-author-info">
              <span class="story-author-name">${name}</span>
              <span class="story-detail-date">${formattedDate}</span>
            </div>
          </div>
          <div class="story-detail-description">
            ${description}
          </div>
          ${
            hasLocation
              ? `
            <div class="story-detail-location">
              <i class="fa-solid fa-location-dot"></i>
              <span>Lokasi ditandai pada peta</span>
            </div>
            <div id="story-map" class="story-detail-map"></div>
          `
              : ''
          }
        </div>
      `;

      // Reinisialisasi event listener untuk tombol close
      const closeButton = this.querySelector('.dialog-close');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          this.close();
        });
      }

      // Inisialisasi peta jika ada lokasi
      if (hasLocation) {
        this._initMap(lat, lon);
      }
    }
  }

  /**
   * Inisialisasi peta Leaflet
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   */
  _initMap(lat, lon) {
    // Pastikan Leaflet sudah dimuat
    if (!window.L) {
      console.error('Leaflet tidak tersedia');
      return;
    }

    // Tunggu sebentar untuk memastikan elemen peta sudah dirender
    setTimeout(() => {
      const mapElement = document.getElementById('story-map');
      if (!mapElement) return;

      // Hapus peta sebelumnya jika ada
      if (this._map) {
        this._map.remove();
        this._map = null;
      }

      // Inisialisasi peta baru
      this._map = L.map('story-map').setView([lat, lon], 13);

      // Tambahkan tile layer dari MapTiler
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this._map);

      // Tambahkan marker
      this._marker = L.marker([lat, lon]).addTo(this._map);

      // Tambahkan popup ke marker
      this._marker
        .bindPopup(
          `<b>${this._story.name}</b><br>Berbagi cerita dari lokasi ini`
        )
        .openPopup();

      // Tambahkan layer control (opsional)
      const baseMaps = {
        Streets: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }),
        Topography: L.tileLayer(
          'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          {
            attribution:
              '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
            maxZoom: 17,
          }
        ),
      };

      L.control.layers(baseMaps).addTo(this._map);

      // Perbaiki tampilan peta setelah dialog ditampilkan
      this._map.invalidateSize();

      this._isMapInitialized = true;
    }, 300);
  }

  render() {
    this.innerHTML = `
      <dialog class="story-detail-dialog">
        <div class="dialog-content">
          <!-- Content will be dynamically populated -->
        </div>
      </dialog>
    `;
  }
}

customElements.define('story-detail-dialog', StoryDetailDialog);

export default StoryDetailDialog;
