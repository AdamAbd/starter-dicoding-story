import CONFIG, { ACCESS_TOKEN_KEY } from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
};

export async function loginUser({ email, password }) {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);

    return responseJson.loginResult;
  } catch (error) {
    throw new Error('Gagal melakukan login. ' + error.message);
  }
}

export async function registerUser({ name, email, password }) {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);

    return responseJson;
  } catch (error) {
    throw new Error('Gagal melakukan pendaftaran. ' + error.message);
  }
}

export async function getAllStories(page = 1, size = 12, location = 0) {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token)
      throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');

    const response = await fetch(
      `${ENDPOINTS.GET_STORIES}?page=${page}&size=${size}&location=${location}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);

    return {
      stories: responseJson.listStory || [],
      page,
      totalPages: Math.ceil(responseJson.totalStories / size) || 1,
      hasMore: page < Math.ceil(responseJson.totalStories / size),
    };
  } catch (error) {
    throw new Error('Gagal memuat cerita. ' + error.message);
  }
}

export async function getStoryDetail(id) {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token)
      throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');

    const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
      headers: { Authorization: `Bearer ${token}` },
    });

    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);

    return responseJson.story;
  } catch (error) {
    throw new Error('Gagal memuat detail cerita. ' + error.message);
  }
}

export async function addStory({ photo, description, lat, lon }) {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token)
      throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('description', description);
    if (lat !== undefined && lon !== undefined) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    const response = await fetch(ENDPOINTS.ADD_STORY, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);

    return responseJson;
  } catch (error) {
    throw new Error('Gagal menambahkan cerita. ' + error.message);
  }
}

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
    if (responseJson.error) throw new Error(responseJson.message);

    return responseJson;
  } catch (error) {
    throw new Error('Gagal menambahkan cerita sebagai tamu. ' + error.message);
  }
}

export async function subscribePushNotification({ endpoint, keys }) {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token)
      throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');

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
    if (responseJson.error) throw new Error(responseJson.message);

    return responseJson;
  } catch (error) {
    throw new Error('Gagal subscribe push notification. ' + error.message);
  }
}

export async function unsubscribePushNotification(endpoint) {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token)
      throw new Error('Token tidak ditemukan. Silakan login terlebih dahulu.');

    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ endpoint }),
    });

    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);

    return responseJson;
  } catch (error) {
    throw new Error('Gagal unsubscribe push notification. ' + error.message);
  }
}
