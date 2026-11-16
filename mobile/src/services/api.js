import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SESSION_STORAGE_KEY = 'educatech.sessao';

const DEFAULT_API =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const BASE_URL = String(process.env.EXPO_PUBLIC_API_URL || DEFAULT_API).replace(/\/$/, '');

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export async function readSession() {
  try {
    const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export async function saveSession(session) {
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const session = await readSession();
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      `Não foi possível conectar à API em ${BASE_URL}. Confira EXPO_PUBLIC_API_URL e se o back-end está no ar.`
    );
  }

  if (response.status === 204) return null;

  const body = await response.json().catch(() => null);

  if (response.status === 401 && path !== '/login') {
    await clearSession();
    unauthorizedHandler?.();
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

export function searchPosts(termOrOptions, subject) {
  const options =
    typeof termOrOptions === 'string' || termOrOptions == null
      ? { q: termOrOptions, subject }
      : termOrOptions;

  const params = new URLSearchParams();
  if (options.q) params.set('q', options.q);
  if (options.subject) params.set('subject', options.subject);
  return request(`/posts/search?${params.toString()}`);
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

export function listTeachers(page = 1, limit = 8, subject = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (subject) params.set('subject', subject);
  return request(`/teachers?${params.toString()}`);
}

export function getTeacher(id) {
  return request(`/teachers/${id}`);
}

export function createTeacher(teacher) {
  return request('/teachers', { method: 'POST', body: JSON.stringify(teacher) });
}

export function updateTeacher(id, teacher) {
  return request(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(teacher) });
}

export function deleteTeacher(id) {
  return request(`/teachers/${id}`, { method: 'DELETE' });
}

export function listStudents(page = 1, limit = 8, subject = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (subject) params.set('subject', subject);
  return request(`/students?${params.toString()}`);
}

export function getStudent(id) {
  return request(`/students/${id}`);
}

export function createStudent(student) {
  return request('/students', { method: 'POST', body: JSON.stringify(student) });
}

export function updateStudent(id, student) {
  return request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(student) });
}

export function deleteStudent(id) {
  return request(`/students/${id}`, { method: 'DELETE' });
}
