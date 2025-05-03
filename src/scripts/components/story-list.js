import './story-card';

class StoryList extends HTMLElement {
  constructor() {
    super();
    this._stories = [];
  }

  /**
   * @param {Array} stories - Array berisi data cerita
   */
  set stories(stories) {
    this._stories = stories;
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="stories-container">
        <div class="container">
          <div class="stories-header">
            <h2>Story Terbaru</h2>
            <div class="stories-filter">
              <button class="filter-btn active"><i class="fa-solid fa-clock"></i> Terbaru</button>
              <button class="filter-btn"><i class="fa-solid fa-fire"></i> Populer</button>
              <button class="filter-btn"><i class="fa-solid fa-location-dot"></i> Lokasi</button>
            </div>
          </div>
          
          <div class="stories-grid" id="storiesGrid">
            ${this._stories.length ? '' : '<p>Tidak ada cerita yang tersedia.</p>'}
          </div>
        </div>
      </div>
    `;

    const storiesGrid = this.querySelector('#storiesGrid');
    
    // Render setiap story card
    this._stories.forEach(story => {
      const storyCard = document.createElement('story-card');
      storyCard.story = story;
      storiesGrid.appendChild(storyCard);
    });

    // Tambahkan event listener untuk filter button
    const filterButtons = this.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Hapus kelas active dari semua button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Tambahkan kelas active ke button yang diklik
        button.classList.add('active');
        // Implementasi filter akan ditambahkan nanti
      });
    });
  }
}

customElements.define('story-list', StoryList);

export default StoryList;