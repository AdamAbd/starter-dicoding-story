class HomePresenter {
  constructor({ view, storyService }) {
    this._view = view;
    this._storyService = storyService;
    this._stories = [];
  }

  async getAllStories() {
    try {
      this._view.showLoading();
      this._stories = await this._storyService.getAllStories();
      this._view.hideLoading();
      
      if (this._stories.length > 0) {
        this._view.showStories(this._stories);
      } else {
        this._view.showEmptyStories();
      }
    } catch (error) {
      this._view.hideLoading();
      this._view.showError(error.message);
      
      // Tampilkan data dummy jika API error (untuk keperluan development)
      this._loadDummyData();
    }
  }

  _loadDummyData() {
    // Data dummy untuk keperluan development
    const dummyStories = [
      {
        id: 'story-1',
        name: 'Dimas',
        description: 'Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae justo ut magna condimentum fermentum.',
        photoUrl: 'https://story-api.dicoding.dev/images/stories/photos-1641623658595_dummy-pic.png',
        createdAt: '2022-01-08T06:34:18.598Z',
        lat: -10.21,
        lon: -16.00
      },
      {
        id: 'story-2',
        name: 'Andi',
        description: 'Baru saja menyelesaikan kelas Flutter di Dicoding! Saya bangga bisa membuat aplikasi mobile pertama saya.',
        photoUrl: 'https://story-api.dicoding.dev/images/stories/photos-1641623658595_dummy-pic.png',
        createdAt: '2022-04-10T13:21:18.598Z',
        lat: -6.2,
        lon: 106.816666
      },
      {
        id: 'story-3',
        name: 'Budi',
        description: 'Challenge Dicoding minggu ini: Membuat aplikasi Android dengan fitur peta interaktif. Berhasil menyelesaikannya tepat waktu!',
        photoUrl: 'https://story-api.dicoding.dev/images/stories/photos-1641623658595_dummy-pic.png',
        createdAt: '2022-03-21T09:12:18.598Z',
        lat: -6.9147,
        lon: 107.6098
      }
    ];

    this._view.showStories(dummyStories);
  }
}

export default HomePresenter;