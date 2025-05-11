export default class AboutPage {
  async render() {
    return `
      <main id="main-content">
        <section class="container">
          <h1>About Page</h1>
        </section>
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
