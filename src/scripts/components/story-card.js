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
   */
  set story(story) {
    this._story = story;
    this.render();
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
}

customElements.define('story-card', StoryCard);

export default StoryCard;