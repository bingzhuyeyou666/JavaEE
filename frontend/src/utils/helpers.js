/* ========================================
   陌路寻景 通用工具函数
   ======================================== */

import { api } from './api';

export function cx(...names) {
  return names.filter(Boolean).join(' ');
}

export function currentUserId() {
  return window.travelCloudCurrentUserId || 1;
}

export function normalizeAppHref(href) {
  return window.location.port === '8080' && href.startsWith('/')
    ? `/app${href === '/' ? '/' : href}`
    : href;
}

export function navigateTo(href) {
  const nextHref = normalizeAppHref(href);
  window.history.pushState(null, '', nextHref);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function formatDistanceKm(distanceKm) {
  const value = Number(distanceKm);
  if (!Number.isFinite(value) || value === 99999) return '距离计算中';
  return `${new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: value >= 100 ? 0 : 1
  }).format(value)} km`;
}

export function formatTicketPrice(price) {
  const value = Number(price || 0);
  if (!Number.isFinite(value) || value <= 0) return '免费';
  return `¥${new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value)}`;
}

export function splitMediaUrls(urls) {
  if (!urls) return [];
  return String(urls).split(',').map((s) => s.trim()).filter(Boolean);
}

export function postTypeLabel(type) {
  const map = { NOTE: '笔记', DISCUSSION: '讨论', QUESTION: '问答' };
  return map[type] || type;
}

export function normalizeDateInput(date) {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d) ? d.toISOString().slice(0, 10) : '';
}

export function summarizeWeather(weatherData) {
  if (!weatherData) return { temp: '--', desc: '暂无天气数据', icon: 'cloud' };
  const list = Array.isArray(weatherData) ? weatherData : weatherData.daily || [];
  if (!list.length) return { temp: '--', desc: '暂无天气数据', icon: 'cloud' };
  const today = list[0];
  return {
    temp: today.tempMax != null ? `${today.tempMin || 0}° ~ ${today.tempMax}°` : '--',
    desc: today.textDay || today.condition || '未知',
    icon: today.iconDay || 'cloud',
    days: list.slice(0, 5)
  };
}
