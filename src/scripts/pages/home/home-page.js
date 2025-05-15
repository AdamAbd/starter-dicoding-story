import '../../components/story-list';
import '../../components/story-card-loading';
import '../../../styles/home.css';
import '../../../styles/loading.css';
import HomePresenter from './home-presenter';
import { getAllStories } from '../../data/api';

export default class HomePage {
  #presenter;
  #observerTarget;
  #storyListElement;
  #loadingElement;
  #loadingMoreElement;
  #intersectionObserver;

  async render() {
    return `
      <main id="main-content">
        <section class="hero">
          <div class="container">
            <h1>Berbagi Cerita Dicoding</h1>
            <p>Bagikan pengalaman belajarmu di Dicoding dengan komunitas. Inspirasi, tantangan, dan keberhasilan - semua ada di sini!</p>
          </div>
        </section>
        
        <story-list id="storyList"></story-list>
        
        <div id="loading-container" class="hidden">
          <story-card-loading></story-card-loading>
          <story-card-loading></story-card-loading>
          <story-card-loading></story-card-loading>
        </div>
        
        <div id="observer-target">Haloo</div>
        
        <a href="#/create" class="floating-btn" aria-label="Buat story baru">
          <i class="fa-solid fa-plus"></i>
        </a>
      </main>
    `;
  }

  async afterRender() {
    // Inisialisasi elemen DOM
    this.#storyListElement = document.querySelector('#storyList');
    this.#loadingElement = document.createElement('div');
    this.#loadingElement.id = 'loading';
    this.#loadingElement.innerHTML = '<p>Memuat cerita...</p>';
    this.#loadingElement.style.display = 'none';
    this.#storyListElement.after(this.#loadingElement);

    // Setup skip to content
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');
    if (skipLink && mainContent) {
      import('../../utils/index.js').then(({ setupSkipToContent }) => {
        setupSkipToContent(skipLink, mainContent);
      });
    }

    this.#loadingMoreElement = document.querySelector('#loading-container');
    this.#observerTarget = document.querySelector('#observer-target');

    // Mendefinisikan View (dalam bentuk objek yang memiliki method-method untuk UI)
    const view = {
      showLoading: () => {
        this.#loadingElement.style.display = 'block';
      },
      hideLoading: () => {
        this.#loadingElement.style.display = 'none';
      },
      showLoadingMore: () => {
        this.#loadingMoreElement.classList.remove('hidden');
      },
      hideLoadingMore: () => {
        this.#loadingMoreElement.classList.add('hidden');
      },
      showStories: (stories) => {
        this.#storyListElement.stories = stories;
      },
      showEmptyStories: () => {
        this.#storyListElement.stories = [];
      },
      showError: (message) => {
        console.error(message);
      },
    };

    // Mendefinisikan service untuk mengakses data
    const storyService = {
      getAllStories: (page) => getAllStories(page),
    };

    // Inisialisasi presenter
    this.#presenter = new HomePresenter({
      view,
      storyService,
    });

    // Setup Intersection Observer untuk infinite scroll
    this.#setupIntersectionObserver();

    // Muat cerita awal
    await this.#presenter.getAllStories();
  }

  #setupIntersectionObserver() {
    this.#intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.#presenter.loadMoreStories();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    this.#intersectionObserver.observe(this.#observerTarget);
  }
}
