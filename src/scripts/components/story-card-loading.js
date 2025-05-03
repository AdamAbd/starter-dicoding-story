class StoryCardLoading extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="story-card loading">
        <div class="story-image">
          <div class="image-placeholder pulse"></div>
        </div>
        <div class="story-content">
          <div class="story-header">
            <div class="story-author">
              <div class="author-avatar pulse"></div>
              <div class="author-info">
                <span class="author-name pulse"></span>
                <span class="story-date pulse"></span>
              </div>
            </div>
          </div>
          <div class="story-description">
            <div class="description-line pulse"></div>
            <div class="description-line pulse"></div>
            <div class="description-line pulse short"></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('story-card-loading', StoryCardLoading);

export default StoryCardLoading;
