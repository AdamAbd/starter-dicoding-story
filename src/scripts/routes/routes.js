import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import CreatePage from '../pages/create/create-page';
import SettingPage from '../pages/setting/setting-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/create': new CreatePage(),
  '/setting': new SettingPage(),
};

export default routes;
