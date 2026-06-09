/* ========================================
   星涌 Hooks
   ======================================== */

import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';

export function usePath() {
  const normalize = () => window.location.pathname.replace(/^\/app(?=\/|$)/, '') || '/';
  const [path, setPath] = useState(normalize);
  useEffect(() => {
    const update = () => setPath(normalize());
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  return path;
}

export function useAsync(loader, deps) {
  const [state, setState] = useState({ loading: true, data: null, error: '' });
  useEffect(() => {
    let alive = true;
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    loader()
      .then((data) => alive && setState({ loading: false, data, error: '' }))
      .catch((error) => alive && setState({ loading: false, data: null, error: error.message }));
    return () => { alive = false; };
  }, deps);
  return state;
}

let baiduMapLoader;

export function useBaiduMap() {
  const [status, setStatus] = useState({ ready: Boolean(window.BMap), error: '' });
  useEffect(() => {
    if (window.BMap) {
      setStatus({ ready: true, error: '' });
      return;
    }
    let alive = true;
    if (!baiduMapLoader) {
      baiduMapLoader = api('/api/config').then((config) => new Promise((resolve, reject) => {
        if (!config.baiduMapEnabled) throw new Error('百度地图暂未启用。');
        if (!config.baiduMapAk) throw new Error('百度地图 AK 未配置。');
        if (window.BMap) { resolve(window.BMap); return; }
        window.__travelCloudBaiduReady = () => resolve(window.BMap);
        const script = document.createElement('script');
        script.dataset.baiduMap = 'true';
        script.src = `https://api.map.baidu.com/api?v=3.0&ak=${config.baiduMapAk}&callback=__travelCloudBaiduReady`;
        script.onerror = () => reject(new Error('百度地图 SDK 加载失败。'));
        document.head.appendChild(script);
      }));
    }
    baiduMapLoader
      .then(() => alive && setStatus({ ready: true, error: '' }))
      .catch((error) => alive && setStatus({ ready: false, error: error.message }));
    return () => { alive = false; };
  }, []);
  return status;
}
