class StoryCard extends HTMLElement {
  constructor() {
    super();
    this._story = null;
  }

  /**
   * @param {Object} story - Data cerita yang akan ditampilkan
   * @param {string} story.id - ID cerita
   * @param {string} story.name - Nama pengguna
   * @param {string} story.description - Deskripsi cerita
   * @param {string} story.photoUrl - URL foto cerita
   * @param {string} story.createdAt - Tanggal pembuatan dalam format ISO
   */
  set story(story) {
    this._story = story;
    this.render();
    this._initEventListeners();
  }

  render() {
    if (!this._story) return;

    const { name, description, photoUrl, createdAt } = this._story;
    
    const date = new Date(createdAt);
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);

    const initial = name.charAt(0).toUpperCase();

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
        </div>
      </div>
    `;
  }

  /**
   * Inisialisasi event listener untuk kartu cerita
   */
  _initEventListeners() {
    const storyCard = this.querySelector('.story-card');
    if (storyCard && this._story) {
      storyCard.addEventListener('click', (event) => {
        // Jangan buka dialog jika yang diklik adalah tombol aksi
        if (event.target.closest('.action-btn')) return;
        
        // Cari atau buat dialog detail cerita
        let storyDetailDialog = document.querySelector('story-detail-dialog');
        if (!storyDetailDialog) {
          storyDetailDialog = document.createElement('story-detail-dialog');
          document.body.appendChild(storyDetailDialog);
        }
        
        // Tampilkan dialog dengan ID cerita
        storyDetailDialog.showStory(this._story.id);
      });
    }
  }
}

customElements.define('story-card', StoryCard);