export default class HomePresenter {
  #view;
  #storyService;
  #stories = [];
  #currentPage = 1;
  #hasMoreStories = true;
  #isLoading = false;

  constructor({ view, storyService }) {
    this.#view = view;
    this.#storyService = storyService;
  }

  async getAllStories(resetPage = true) {
    if (this.#isLoading) return;

    try {
      if (resetPage) {
        this.#currentPage = 1;
        this.#stories = [];
        this.#hasMoreStories = true;
        this.#view.showLoading();
      } else {
        this.#view.showLoadingMore();
      }

      this.#isLoading = true;
      const result = await this.#storyService.getAllStories(this.#currentPage);
      this.#isLoading = false;

      if (resetPage) {
        this.#view.hideLoading();
      } else {
        this.#view.hideLoadingMore();
      }

      this.#hasMoreStories = result.hasMore;

      if (result.stories.length > 0) {
        this.#stories = resetPage
          ? result.stories
          : [...this.#stories, ...result.stories];
        this.#view.showStories(this.#stories);
      } else if (resetPage) {
        this.#view.showEmptyStories();
      }
    } catch (error) {
      this.#isLoading = false;

      if (resetPage) {
        this.#view.hideLoading();
      } else {
        this.#view.hideLoadingMore();
      }

      this.#view.showError(error.message);

      if (resetPage) {
        this.#loadDummyData();
      }
    }
  }

  async loadMoreStories() {
    if (this.#isLoading || !this.#hasMoreStories) return;

    this.#currentPage += 1;
    await this.getAllStories(false);
  }

  #loadDummyData() {
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

    this.#view.showStories(dummyStories);
  }
}