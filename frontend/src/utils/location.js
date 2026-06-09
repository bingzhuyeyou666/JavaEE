/* ========================================
   星涌 定位工具
   ======================================== */

import { readStorageJson, writeStorageJson, readSessionFlag, sessionLocatedKey, nearbyLocationKey } from './api';

export const defaultLocation = { lat: 28.77, lng: 104.64, label: '默认中心' };

export const blockedPresetLocations = [
  { lat: 28.77, lng: 104.64, label: '' },
  { lat: 31.2304, lng: 121.4737, label: '' }
];

export function readLocationState(key, fallback) {
  const value = readStorageJson(key, fallback);
  if (!value || typeof value !== 'object') return fallback;
  const lat = Number(value.lat);
  const lng = Number(value.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return fallback;
  return { lat, lng, label: value.label || fallback.label };
}

export function saveLocationState(key, location) {
  writeStorageJson(key, location);
}

export function isBlockedPresetLocation(location) {
  if (!location) return false;
  const label = String(location.label || '');
  return blockedPresetLocations.some((preset) => {
    const samePoint =
      Math.abs(Number(location.lat) - preset.lat) < 0.0002 &&
      Math.abs(Number(location.lng) - preset.lng) < 0.0002;
    return samePoint || (preset.label && label.includes(preset.label));
  });
}

export function useNearbyLocation() {
  const { useMemo } = require('react');
  return useMemo(() => {
    if (!readSessionFlag(sessionLocatedKey)) return null;
    const saved = readStorageJson(nearbyLocationKey, null);
    const location = saved
      ? readLocationState(nearbyLocationKey, { lat: 0, lng: 0, label: '当前位置' })
      : null;
    return isBlockedPresetLocation(location) ? null : location;
  }, []);
}

export function locateByBrowser(onSuccess, onStatus) {
  if (!navigator.geolocation) {
    onStatus?.('浏览器不支持定位，请手动选择城市。');
    return;
  }
  onStatus?.('正在获取当前位置，请允许浏览器定位权限。');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        label: '当前位置'
      });
      onStatus?.('定位成功，已按当前位置刷新结果。');
    },
    () => onStatus?.('定位失败，请检查浏览器定位权限，或手动选择城市。'),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}
