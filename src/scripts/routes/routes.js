import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from '../utils/auth';
import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import CreatePage from '../pages/create/create-page';
import SettingPage from '../pages/setting/setting-page';
import SavedStoryPage from '../pages/saved/saved-story-page';
import NotFoundPage from '../pages/not-found/not-found-page';

const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  
  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/about': () => checkAuthenticatedRoute(new AboutPage()),
  '/create': () => checkAuthenticatedRoute(new CreatePage()),
  '/setting': () => checkAuthenticatedRoute(new SettingPage()),
  '/saved': () => checkAuthenticatedRoute(new SavedStoryPage()),

  '/not-found': () => new NotFoundPage(),
};

export default routes;
