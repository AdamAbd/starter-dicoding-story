import { loginUser } from '../../../data/api';
import { putAccessToken } from '../../../utils/auth';

export default class LoginPresenter {
  #view;
  #authModel;
  #model;

  constructor({ view }) {
    this.#view = view;
    this.#authModel = {
      putAccessToken,
    };
    this.#model = {
      login: async (data) => {
        const response = await loginUser(data);
        return {
          ok: true,
          data: {
            accessToken: response.token,
          },
          message: 'Login berhasil',
        };
      },
    };
  }

  async login({ email, password }) {
    this.#view.showSubmitLoadingButton();
    
    try {
      const response = await this.#model.login({ email, password });
      
      if (!response.ok) {
        console.error('login: response:', response);
        this.#view.loginFailed(response.message);
        return;
      }
      
      this.#authModel.putAccessToken(response.data.accessToken);
      this.#view.loginSuccessfully(response.message, response.data);
    } catch (error) {
      console.error('login: error:', error);
      this.#view.loginFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}