import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    // this.#drawerButton.addEventListener('click', () => {
    //   this.#navigationDrawer.classList.toggle('open');
    // });

    document.body.addEventListener('click', (event) => {
      // if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
      //   this.#navigationDrawer.classList.remove('open');
      // }
      // this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
      //   if (link.contains(event.target)) {
      //     this.#navigationDrawer.classList.remove('open');
      //   }
      // })
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    // Menggunakan View Transition API untuk transisi halaman yang halus
    if (document.startViewTransition) {
      // Gunakan View Transition API jika didukung browser
      const transition = document.startViewTransition(async () => {
        // Perbarui DOM di dalam callback transisi
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });

      // Menunggu transisi selesai (opsional)
      await transition.finished;
    } else {
      // Fallback untuk browser yang tidak mendukung View Transition API
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }
  }
}

export default App;
