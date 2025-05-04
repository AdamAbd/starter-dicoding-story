import '../../components/story-list';
import '../../components/story-card-loading';
import '../../../styles/home.css';
import '../../../styles/loading.css';
import HomePresenter from './home-presenter';
import { getAllStories } from '../../data/api';
import { checkAuthenticatedRouteOnly } from '../../utils/auth';

export default class HomePage {
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
    checkAuthenticatedRouteOnly();

    const storyListElement = document.querySelector('#storyList');
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading';
    loadingElement.innerHTML = '<p>Memuat cerita...</p>';
    loadingElement.style.display = 'none';
    storyListElement.after(loadingElement);

    const loadingMoreElement = document.querySelector('#loading-container');
    const observerTarget = document.querySelector('#observer-target');

    const view = {
      showLoading: () => {
        loadingElement.style.display = 'block';
      },
      hideLoading: () => {
        loadingElement.style.display = 'none';
      },
      showLoadingMore: () => {
        loadingMoreElement.classList.remove('hidden');
      },
      hideLoadingMore: () => {
        loadingMoreElement.classList.add('hidden');
      },
      showStories: (stories) => {
        storyListElement.stories = stories;
      },
      showEmptyStories: () => {
        storyListElement.stories = [];
      },
      showError: (message) => {
        console.error(message);
      },
    };

    const storyService = {
      getAllStories: (page) => getAllStories(page),
    };

    const presenter = new HomePresenter({
      view,
      storyService,
    });

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          presenter.loadMoreStories();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    intersectionObserver.observe(observerTarget);

    await presenter.getAllStories();
  }
}
