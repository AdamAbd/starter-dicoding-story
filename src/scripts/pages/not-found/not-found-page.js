import '../../components/app-bar';

export default class NotFoundPage {
  async render() {
    return `
      <style>
        :root {
            --primary-color: #4285F4;
            --dark-blue: #1E3A5F;
            --light-bg: #F6F8FB;
            --white: #FFFFFF;
            --red: #FF4B4B;
        }

        .container-not-found {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
        }

        .not-found-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: calc(100vh - 120px); /* Adjust based on app-bar and footer height */
            gap: 1.5rem;
        }

        .not-found-title {
            color: var(--dark-blue);
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }

        .not-found-description {
            color: #555;
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .not-found-svg {
            max-width: 200px; /* Adjusted from original 350px for better balance */
            margin: 1rem 0;
        }

        .back-home-button {
            margin-top: 1.5rem;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            background-color: var(--primary-color);
            color: var(--white);
            border: none;
            transition: background-color 0.3s ease;
        }
        .back-home-button:hover {
            background-color: var(--dark-blue);
        }

        @media (max-width: 768px) {
            .not-found-title {
                font-size: 2rem;
            }
            .not-found-svg {
                max-width: 150px;
            }
        }
      </style>
      <main id="main-content" class="container-not-found">
        <div class="not-found-content">
          <svg class="not-found-svg" width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z" fill="var(--light-bg)" stroke="var(--primary-color)" stroke-width="2"/>
              <path d="M65 80L95 110M95 80L65 110" stroke="var(--dark-blue)" stroke-width="4" stroke-linecap="round"/>
              <path d="M125 80L155 110M155 80L125 110" stroke="var(--dark-blue)" stroke-width="4" stroke-linecap="round"/>
              <path d="M60 140C90 110 110 110 140 140" stroke="var(--red)" stroke-width="4" stroke-linecap="round"/>
          </svg>
          <div>
              <h1 class="not-found-title">404 - Halaman Tidak Ditemukan</h1>
              <p class="not-found-description">
                  Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
              </p>
          </div>
          <div class="back-home">
              <a href="#/" class="back-home-button">Kembali ke Beranda</a>
          </div>
        </div>
      </main>
    `;
  }

  async afterRender() {
    // Setup skip to content
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');
    if (skipLink && mainContent) {
      import('../../utils/index.js').then(({ setupSkipToContent }) => {
        setupSkipToContent(skipLink, mainContent);
      });
    }
  }
}