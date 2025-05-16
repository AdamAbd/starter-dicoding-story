import Database from '../../data/database';

export default class SavedStoryPresenter {
  constructor({ view }) {
    this._view = view;
    this._database = Database;
    
    this._loadSavedStories();
  }

  async _loadSavedStories() {
    try {
      this._view.showLoading();
      const stories = await this._database.getAllStories();
      this._view.showStories(stories);
    } catch (error) {
      console.error('Error loading saved stories:', error);
      this._view.showError('Gagal memuat cerita tersimpan. Silakan coba lagi.');
    }
  }
}