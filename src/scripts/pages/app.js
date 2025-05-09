import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { transitionHelper } from '../utils/index';

class App {
  #content = null;

  constructor({ content }) {
    this.#content = content;
  }

  async renderPage() {
    const url = getActiveRoute();
    const pageInitializer = routes[url];
    const page = pageInitializer ? pageInitializer() : null;

    if (!page) return;

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      },
    });

    transition.ready.catch(console.error);

    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
    });
  }
}

export default App;
