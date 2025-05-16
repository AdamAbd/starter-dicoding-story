class StoryCard extends HTMLElement {
  constructor() {
    super();
    this._story = null;
    this._isSaved = false;
  }

  set story(story) {
    this._story = story;
    this._checkSavedStatus();
  }
  
  async _checkSavedStatus() {
    try {
      // Lazy import to avoid circular dependency
      const Database = (await import('../data/database.js')).default;
      this._isSaved = await Database.isStorySaved(this._story.id);
    } catch (error) {
      console.error('Error checking saved status:', error);
      this._isSaved = false;
    } finally {
      this.render();
      this._initEventListeners();
    }
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
            <div class="story-actions">
              <button class="save-btn" aria-label="${this._isSaved ? 'Hapus dari tersimpan' : 'Simpan cerita'}">
                <i class="fa-${this._isSaved ? 'solid' : 'regular'} fa-bookmark"></i>
              </button>
              <button class="action-btn" aria-label="Menu opsi">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
            </div>
          </div>
          <div class="story-description">
            ${description}
          </div>
        </div>
      </div>
    `;
  }

  _initEventListeners() {
    const storyCard = this.querySelector('.story-card');
    if (storyCard && this._story) {
      storyCard.addEventListener('click', (event) => {
        // Jangan buka dialog jika yang diklik adalah tombol aksi atau tombol simpan
        if (event.target.closest('.action-btn') || event.target.closest('.save-btn')) return;

        // Cari atau buat dialog detail cerita
        let storyDetailDialog = document.querySelector('story-detail-dialog');
        if (!storyDetailDialog) {
          storyDetailDialog = document.createElement('story-detail-dialog');
          document.body.appendChild(storyDetailDialog);
        }

        storyDetailDialog.showStory(this._story.id);
      });
      
      // Tambahkan event listener untuk tombol simpan
      const saveButton = this.querySelector('.save-btn');
      if (saveButton) {
        saveButton.addEventListener('click', async (event) => {
          event.stopPropagation();
          try {
            const Database = (await import('../data/database.js')).default;
            
            if (this._isSaved) {
              // Hapus cerita dari penyimpanan
              await Database.removeStory(this._story.id);
              this._isSaved = false;
            } else {
              // Simpan cerita ke penyimpanan
              await Database.saveStory(this._story);
              this._isSaved = true;
            }
            
            // Update tampilan tombol
            this.render();
            this._initEventListeners();
          } catch (error) {
            console.error('Error toggling save status:', error);
            alert('Gagal menyimpan cerita. Silakan coba lagi.');
          }
        });
      }
    }
  }
}

customElements.define('story-card', StoryCard);
