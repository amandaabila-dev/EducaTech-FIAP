const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o back-end está no ar.');
  }

  if (response.status === 204) return null;

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error || `Erro ${response.status} ao comunicar com a API.`);
  }

  return body;
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
