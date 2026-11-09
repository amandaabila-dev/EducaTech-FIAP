const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
export const SESSION_STORAGE_KEY = 'educatech.sessao';

function readSession() {
  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getToken() {
  return readSession()?.token || null;
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o back-end está no ar.');
  }

  if (response.status === 204) return null;

  const body = await response.json().catch(() => null);

  if (response.status === 401 && path !== '/login') {
    clearSession();
    window.dispatchEvent(new Event('educatech:unauthorized'));
  }

  if (!response.ok) {
    throw new Error(body?.error || `Erro ${response.status} ao comunicar com a API.`);
  }

  return body;
}

export function login(email, senha) {
  return request('/login', { method: 'POST', body: JSON.stringify({ email, senha }) });
}

export function listPosts() {
  return request('/posts');
}

export function searchPosts(term) {
  return request(`/posts/search?q=${encodeURIComponent(term)}`);
}

export function getPost(id) {
  return request(`/posts/${id}`);
}

export function createPost(post) {
  return request('/posts', { method: 'POST', body: JSON.stringify(post) });
}

export function updatePost(id, post) {
  return request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(post) });
}

export function deletePost(id) {
  return request(`/posts/${id}`, { method: 'DELETE' });
}
