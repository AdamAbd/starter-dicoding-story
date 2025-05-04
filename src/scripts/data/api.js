import CONFIG from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
};

/**
 * Fungsi untuk mendapatkan daftar cerita
 * @param {number} page - Halaman yang diminta (opsional)
 * @param {number} size - Jumlah item per halaman (opsional)
 * @param {number} location - Flag untuk menyertakan lokasi (opsional)
 * @returns {Promise<Object>} - Object berisi data cerita dan informasi paginasi
 */
export async function getAllStories(page = 1, size = 12, location = 1) {
  try {
    // Token diperlukan untuk mengakses API
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const response = await fetch(
      `${ENDPOINTS.GET_STORIES}?page=${page}&size=${size}&location=${location}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return {
      stories: responseJson.listStory || [],
      page: page,
      totalPages: Math.ceil(responseJson.totalStories / size) || 1,
      hasMore: page < Math.ceil(responseJson.totalStories / size),
    };
  } catch (error) {
    console.error('Error getting stories:', error);
    throw new Error('Gagal memuat cerita. ' + error.message);
  }
}

/**
 * Fungsi untuk mendapatkan detail cerita berdasarkan ID
 * @param {string} id - ID cerita
 * @returns {Promise<Object>} - Data detail cerita
 */
export async function getStoryDetail(id) {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson.story;
  } catch (error) {
    console.error('Error getting story detail:', error);
    throw new Error('Gagal memuat detail cerita. ' + error.message);
  }
}

/**
 * Fungsi untuk menambahkan cerita baru
 * @param {Object} storyData - Data cerita yang akan ditambahkan
 * @param {File} storyData.photo - File foto cerita
 * @param {string} storyData.description - Deskripsi cerita
 * @param {number} storyData.lat - Latitude (opsional)
 * @param {number} storyData.lon - Longitude (opsional)
 * @returns {Promise<Object>} - Respons dari server
 */
export async function addStory({ photo, description, lat, lon }) {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('description', description);

    if (lat !== undefined && lon !== undefined) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const response = await fetch(ENDPOINTS.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    console.error('Error adding story:', error);
    throw new Error('Gagal menambahkan cerita. ' + error.message);
  }
}

/**
 * Fungsi untuk menambahkan cerita baru sebagai tamu
 * @param {Object} storyData - Data cerita yang akan ditambahkan
 * @param {File} storyData.photo - File foto cerita
 * @param {string} storyData.description - Deskripsi cerita
 * @param {number} storyData.lat - Latitude (opsional)
 * @param {number} storyData.lon - Longitude (opsional)
 * @returns {Promise<Object>} - Respons dari server
 */
export async function addStoryAsGuest({ photo, description, lat, lon }) {
  try {
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('description', description);

    if (lat !== undefined && lon !== undefined) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const response = await fetch(`${ENDPOINTS.ADD_STORY}/guest`, {
      method: 'POST',
      body: formData,
    });

    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    console.error('Error adding story as guest:', error);
    throw new Error('Gagal menambahkan cerita sebagai tamu. ' + error.message);
  }
}

/**
 * Fungsi untuk subscribe push notification
 * @param {Object} subscription - Data subscription dari PushManager
 * @param {string} subscription.endpoint
 * @param {Object} subscription.keys
 * @param {string} subscription.keys.p256dh
 * @param {string} subscription.keys.auth
 * @returns {Promise<Object>} - Respons dari server
 */
export async function subscribePushNotification({ endpoint, keys }) {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint,
        keys: JSON.stringify(keys),
        p256dh: keys.p256dh,
        auth: keys.auth,
      }),
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    return responseJson;
  } catch (error) {
    console.error('Error subscribing push notification:', error);
    throw new Error('Gagal subscribe push notification. ' + error.message);
  }
}

/**
 * Fungsi untuk unsubscribe push notification
 * @param {string} endpoint - Endpoint subscription yang ingin dihapus
 * @returns {Promise<Object>} - Respons dari server
 */
/**
 * Fungsi untuk melakukan login pengguna
 * @param {Object} credentials - Kredensial pengguna
 * @param {string} credentials.email - Email pengguna
 * @param {string} credentials.password - Password pengguna
 * @returns {Promise<Object>} - Respons dari server berisi token login
 */
export async function loginUser({ email, password }) {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson.loginResult;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Gagal melakukan login. ' + error.message);
  }
}

/**
 * Fungsi untuk mendaftarkan pengguna baru
 * @param {Object} userData - Data pengguna baru
 * @param {string} userData.name - Nama pengguna
 * @param {string} userData.email - Email pengguna
 * @param {string} userData.password - Password pengguna
 * @returns {Promise<Object>} - Respons dari server
 */
export async function registerUser({ name, email, password }) {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const responseJson = await response.json();

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    console.error('Register error:', error);
    throw new Error('Gagal melakukan pendaftaran. ' + error.message);
  }
}

export async function unsubscribePushNotification(endpoint) {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');
    }
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    return responseJson;
  } catch (error) {
    console.error('Error unsubscribing push notification:', error);
    throw new Error('Gagal unsubscribe push notification. ' + error.message);
  }
}
