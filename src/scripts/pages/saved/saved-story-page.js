import '../../../styles/loading.css';
import SavedStoryPresenter from './saved-story-presenter';
import Database from '../../data/database';

class SavedStoryPage {
  constructor() {
    this._emptyMessage = document.createElement('div');
    this._emptyMessage.classList.add('empty-state');
    this._emptyMessage.innerHTML = `
      <i class="fa-solid fa-bookmark fa-3x"></i>
      <p>Belum ada cerita tersimpan</p>
    `;
  }
  
  async render() {
    return `
      <main id="main-content">
        <section class="saved-stories-section">
          <h2 class="page-title">Cerita Tersimpan</h2>
          <div id="saved-stories-container" class="saved-stories-container"></div>
        </section>
      </main>
    `;
  }
  
  async afterRender() {
    this._presenter = new SavedStoryPresenter({
      view: this,
    });
  }

  showStories(stories) {
    const container = document.getElementById('saved-stories-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (stories.length === 0) {
      container.appendChild(this._emptyMessage);
      return;
    }
    
    stories.forEach((story) => {
      const storyCard = document.createElement('story-card');
      storyCard.story = story;
      container.appendChild(storyCard);
    });
  }

  showLoading() {
    const container = document.getElementById('saved-stories-container');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Memuat cerita tersimpan...</div>';
  }

  showError(message) {
    const container = document.getElementById('saved-stories-container');
    if (!container) return;
    
    container.innerHTML = `<div class="error">${message}</div>`;
  }
}

export default SavedStoryPage;