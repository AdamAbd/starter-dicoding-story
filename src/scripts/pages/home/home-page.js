import '../../components/app-bar';
import '../../components/story-list';
import '../../components/app-footer';
import '../../../styles/home.css';
import HomePresenter from './home-presenter';
import { getAllStories } from '../../data/api';

export default class HomePage {
  async render() {
    return `
      <app-bar></app-bar>
      <main id="main-content">
        <section class="hero">
          <div class="container">
            <h1>Berbagi Cerita Dicoding</h1>
            <p>Bagikan pengalaman belajarmu di Dicoding dengan komunitas. Inspirasi, tantangan, dan keberhasilan - semua ada di sini!</p>
            <button class="btn" id="exploreButton">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              Mulai Menjelajah
            </button>
          </div>
        </section>
        
        <story-list id="storyList"></story-list>
        
        <a href="#/create" class="floating-btn" aria-label="Buat story baru">
          <i class="fa-solid fa-plus"></i>
        </a>
      </main>
      <app-footer></app-footer>
    `;
  }

  async afterRender() {
    // Inisialisasi presenter dengan view dan service
    const storyListElement = document.querySelector('#storyList');
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading';
    loadingElement.innerHTML = '<p>Memuat cerita...</p>';
    loadingElement.style.display = 'none';
    storyListElement.after(loadingElement);
    
    // Definisikan view interface untuk presenter
    const view = {
      showLoading: () => {
        loadingElement.style.display = 'block';
      },
      hideLoading: () => {
        loadingElement.style.display = 'none';
      },
      showStories: (stories) => {
        storyListElement.stories = stories;
      },
      showEmptyStories: () => {
        storyListElement.stories = [];
      },
      showError: (message) => {
        console.error(message);
        // Bisa ditambahkan tampilan error yang lebih baik di sini
      }
    };
    
    // Inisialisasi presenter
    const storyService = {
      getAllStories: () => getAllStories()
    };
    
    const presenter = new HomePresenter({
      view,
      storyService
    });
    
    // Muat data cerita
    await presenter.getAllStories();
    
    // Event listener untuk tombol explore
    const exploreButton = document.querySelector('#exploreButton');
    if (exploreButton) {
      exploreButton.addEventListener('click', () => {
        const storyListElement = document.querySelector('#storyList');
        storyListElement.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }
}
