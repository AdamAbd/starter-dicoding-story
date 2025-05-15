import { registerUser } from '../../../data/api';

export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view }) {
    this.#view = view;
    this.#model = {
      register: async (data) => {
        const response = await registerUser(data);
        return {
          ok: true,
          message: 'Pendaftaran berhasil',
          data: response,
        };
      },
    };
  }

  async register({ name, email, password }) {
    this.#view.showSubmitLoadingButton();

    try {
      const response = await this.#model.register({ name, email, password });

      if (!response.ok) {
        console.error('register: response:', response);
        this.#view.registerFailed(response.message);
        return;
      }

      this.#view.registerSuccessfully(response.message);
    } catch (error) {
      console.error('register: error:', error);
      this.#view.registerFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
