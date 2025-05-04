class HomePresenter {
  constructor({ view, storyService }) {
    this._view = view;
    this._storyService = storyService;
    this._stories = [];
    this._currentPage = 1;
    this._hasMoreStories = true;
    this._isLoading = false;
  }

  async getAllStories(resetPage = true) {
    if (this._isLoading) return;

    try {
      if (resetPage) {
        this._currentPage = 1;
        this._stories = [];
        this._hasMoreStories = true;
        this._view.showLoading();
      } else {
        this._view.showLoadingMore();
      }

      this._isLoading = true;
      const result = await this._storyService.getAllStories(this._currentPage);
      this._isLoading = false;

      if (resetPage) {
        this._view.hideLoading();
      } else {
        this._view.hideLoadingMore();
      }

      this._hasMoreStories = result.hasMore;

      if (result.stories.length > 0) {
        this._stories = resetPage
          ? result.stories
          : [...this._stories, ...result.stories];
        this._view.showStories(this._stories);
      } else if (resetPage) {
        this._view.showEmptyStories();
      }
    } catch (error) {
      this._isLoading = false;

      if (resetPage) {
        this._view.hideLoading();
      } else {
        this._view.hideLoadingMore();
      }

      this._view.showError(error.message);

      if (resetPage) {
        this._loadDummyData();
      }
    }
  }

  async loadMoreStories() {
    if (this._isLoading || this._hasMoreStories) return;

    this._currentPage += 1;
    await this.getAllStories(false);
  }

  _loadDummyData() {
    // Data dummy untuk keperluan development
    const dummyStories = [
      {
        id: 'story-1',
        name: 'Dimas',
        description:
          'Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Proin vitae justo ut magna condimentum fermentum.',
        photoUrl:
          'https://story-api.dicoding.dev/images/stories/photos-1641623658595_dummy-pic.png',
        createdAt: '2022-01-08T06:34:18.598Z',
        lat: -10.21,
        lon: -16.0,
      },
      {
        id: 'story-2',
        name: 'Andi',
        description:
          'Baru saja menyelesaikan kelas Flutter di Dicoding! Saya bangga bisa membuat aplikasi mobile pertama saya.',
        photoUrl:
          'https://story-api.dicoding.dev/images/stories/photos-1641623658595_dummy-pic.png',
        createdAt: '2022-04-10T13:21:18.598Z',
        lat: -6.2,
        lon: 106.816666,
      },
      {
        id: 'story-3',
        name: 'Budi',
        description:
          'Challenge Dicoding minggu ini: Membuat aplikasi Android dengan fitur peta interaktif. Berhasil menyelesaikannya tepat waktu!',
        photoUrl:
          'https://story-api.dicoding.dev/images/stories/photos-1641623658595_dummy-pic.png',
        createdAt: '2022-03-21T09:12:18.598Z',
        lat: -6.9147,
        lon: 107.6098,
      },
    ];

    this._view.showStories(dummyStories);
  }
}

export default HomePresenter;
