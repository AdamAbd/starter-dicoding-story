export default class CreatePresenter {
  #view;
  #storyService;
  #selectedPhoto = null;
  #selectedLocation = null;
  #isLoading = false;

  constructor({ view, storyService }) {
    this.#view = view;
    this.#storyService = storyService;
  }

  validateAndPreviewPhoto(file) {
    if (!file.type.match('image.*')) {
      this.#view.showPhotoError('File harus berupa gambar (JPG, PNG, GIF)');
      return;
    }

    if (file.size > 1024 * 1024) {
      this.#view.showPhotoError('Ukuran gambar maksimal 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.#view.previewPhoto(e.target.result);
      this.#selectedPhoto = file;
      this.#view.hidePhotoError();
    };
    reader.readAsDataURL(file);
  }

  validateDescription() {
    const minLength = 10;
    const description = this.#view.getDescriptionValue();

    if (description.length < minLength) {
      this.#view.showDescriptionError(
        `Deskripsi minimal ${minLength} karakter`
      );
      return false;
    } else {
      this.#view.hideDescriptionError();
      return true;
    }
  }

  setSelectedLocation(lat, lng) {
    this.#selectedLocation = { lat, lng };
  }

  resetSelectedLocation() {
    this.#selectedLocation = null;
  }

  async validateAndSubmit(asGuest) {
    if (!this.#selectedPhoto) {
      this.#view.showPhotoError('Silakan pilih foto terlebih dahulu');
      return;
    }

    if (!this.validateDescription()) {
      return;
    }

    const formData = {
      photo: this.#selectedPhoto,
      description: this.#view.getDescriptionValue(),
    };

    if (this.#selectedLocation) {
      formData.lat = this.#selectedLocation.lat;
      formData.lon = this.#selectedLocation.lng;
    }

    this.#setLoading(true);

    try {
      let response;
      let message = asGuest
        ? 'Story berhasil ditambahkan sebagai tamu!'
        : 'Story berhasil ditambahkan!';

      if (asGuest) {
        response = await this.#storyService.addStoryAsGuest(formData);
      } else {
        response = await this.#storyService.addStory(formData);
      }

      this.#view.showSuccessMessage(message, asGuest);
    } catch (error) {
      console.error('Error submitting story:', error);
      this.#view.showErrorMessage(`Gagal menambahkan story: ${error.message}`);
    } finally {
      this.#setLoading(false);
    }
  }

  #setLoading(isLoading) {
    this.#isLoading = isLoading;
    this.#view.setLoading(isLoading);
  }
}
