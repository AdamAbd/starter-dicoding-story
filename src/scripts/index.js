import '../styles/styles.css';
import '../styles/auth.css';
import '../styles/story-detail-dialog.css';
import '../styles/setting.css';
import '../styles/saved-stories.css';

import './components/app-bar';
import './components/story-list';
import './components/story-card';
import './components/story-detail-dialog';
import './components/app-footer';

import App from './pages/app';

// Register service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.bundle.js');
      console.log('Service worker registered');
    } catch (error) {
      console.error('Failed to register service worker:', error);
    }
  }
};

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
  
  // Register service worker after app is loaded
  await registerServiceWorker();
});
