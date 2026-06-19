/* ========================================
   陌路寻阡 API 工具
   ======================================== */

export const defaultUserId = 1;

export const routeKey = 'travelCloudChosenRoute';
export const themeKey = 'travelCloudTheme';
export const nearbyLocationKey = 'travelCloudNearbyLocation';
export const sessionLocatedKey = 'travelCloudSessionLocated';

export async function api(url, options = {}) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), options.timeoutMs || 12000);
  try {
    const { timeoutMs, ...fetchOptions } = options;
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: options.signal || controller.signal,
      ...fetchOptions
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '请求失败' }));
      throw new Error(error.message || '请求失败');
    }
    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('请求超时，请稍后重试。');
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

export function readStorageJson(key, fallback) {
  try {
    const raw = window.localStorage?.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

export function writeStorageJson(key, value) {
  try {
    window.localStorage?.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage 不可用时静默忽略
  }
}

export function readSessionFlag(key) {
  try {
    return window.sessionStorage?.getItem(key) === 'true';
  } catch (error) {
    return false;
  }
}

export function writeSessionFlag(key, value) {
  try {
    if (value) {
      window.sessionStorage?.setItem(key, 'true');
    } else {
      window.sessionStorage?.removeItem(key);
    }
  } catch (error) {
    // Session storage 不可用时静默忽略
  }
}

export function fetchNearbySpots(location) {
  const userId = currentUserId();
  return api(`/api/spots?keyword=&type=&lat=${location.lat}&lng=${location.lng}${userId ? `&userId=${userId}` : ''}`);
}

function currentUserId() {
  return window.travelCloudCurrentUserId || null;
}
