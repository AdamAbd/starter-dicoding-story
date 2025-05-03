// CSS imports
import '../styles/styles.css';
import '../styles/auth.css';
import '../styles/story-detail-dialog.css';
import '../styles/setting.css';

// Import komponen
import './components/app-bar';
import './components/story-list';
import './components/story-card';
import './components/story-detail-dialog';
import './components/app-footer';

import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
