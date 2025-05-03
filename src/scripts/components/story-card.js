class StoryCard extends HTMLElement {
  constructor() {
    super();
  }

  /**
   * @param {Object} story - Data cerita yang akan ditampilkan
   * @param {string} story.id - ID cerita
   * @param {string} story.name - Nama pengguna
   * @param {string} story.description - Deskripsi cerita
   * @param {string} story.photoUrl - URL foto cerita
   * @param {string} story.createdAt - Tanggal pembuatan dalam format ISO
   * @param {Object} story.lat - Latitude (opsional)
   * @param {Object} story.lon - Longitude (opsional)
   */
  set story(story) {
    this._story = story;
    this.render();
  }

  render() {
    if (!this._story) return;

    const { name, description, photoUrl, createdAt, lat, lon } = this._story;
    
    // Format tanggal
    const date = new Date(createdAt);
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);

    // Ambil inisial untuk avatar
    const initial = name.charAt(0).toUpperCase();

    // Tampilkan lokasi jika tersedia
    const locationDisplay = (lat && lon) 
      ? `<div class="location">
          <i class="fa-solid fa-location-dot"></i>
          <span>${lat.toFixed(2)}°, ${lon.toFixed(2)}°</span>
        </div>`
      : '';

    this.innerHTML = `
      <div class="story-card">
        <div class="story-image">
          <img src="${photoUrl}" alt="Story by ${name}" loading="lazy">
        </div>
        <div class="story-content">
          <div class="story-header">
            <div class="story-author">
              <div class="author-avatar">${initial}</div>
              <div class="author-info">
                <span class="author-name">${name}</span>
                <span class="story-date">${formattedDate}</span>
              </div>
            </div>
            <button class="action-btn" aria-label="Menu opsi">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
          </div>
          <div class="story-description">
            ${description}
          </div>
          <div class="story-footer">
            <div class="story-actions">
              <button class="action-btn" aria-label="Suka">
                <i class="fa-regular fa-heart"></i>
                <span>0</span>
              </button>
              <button class="action-btn" aria-label="Komentar">
                <i class="fa-regular fa-comment"></i>
                <span>0</span>
              </button>
              <button class="action-btn" aria-label="Simpan">
                <i class="fa-regular fa-bookmark"></i>
              </button>
            </div>
            ${locationDisplay}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('story-card', StoryCard);

export default StoryCard;