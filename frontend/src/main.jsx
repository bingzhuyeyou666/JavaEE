import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BadgeCheck,
  CalendarDays,
  Car,
  Compass,
  Headphones,
  Heart,
  LogIn,
  LogOut,
  Map,
  MapPin,
  MessageCircle,
  Navigation,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserRound
} from 'lucide-react';
import './styles.css';

const userId = 1;
const routeKey = 'travelCloudChosenRoute';
const nearbyLocationKey = 'travelCloudNearbyLocation';
const defaultLocation = { lat: 28.77, lng: 104.64, label: '宜宾市中心' };
const navItems = [
  ['/', '首页'],
  ['/guide', '景点导览'],
  ['/route', '路线规划'],
  ['/me', '个人中心'],
  ['/submit-spot', '景点申报']
];

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '璇锋眰澶辫触' }));
    throw new Error(error.message || '璇锋眰澶辫触');
  }
  return response.json();
}

function readStorageJson(key, fallback) {
  try {
    const raw = window.localStorage?.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorageJson(key, value) {
  try {
    window.localStorage?.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Storage can be unavailable in restricted browsers; keep the in-memory state.
  }
}

function readLocationState(key, fallback) {
  const value = readStorageJson(key, fallback);
  if (!value || typeof value !== 'object') return fallback;
  const lat = Number(value.lat);
  const lng = Number(value.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return fallback;
  return { lat, lng, label: value.label || fallback.label };
}

function saveLocationState(key, location) {
  writeStorageJson(key, location);
}

function cx(...names) {
  return names.filter(Boolean).join(' ');
}

function normalizeAppHref(href) {
  return window.location.port === '5173' && href.startsWith('/') ? `/app${href === '/' ? '/' : href}` : href;
}

function navigateTo(href) {
  const nextHref = normalizeAppHref(href);
  window.history.pushState(null, '', nextHref);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function usePath() {
  const normalize = () => window.location.pathname.replace(/^\/app(?=\/|$)/, '') || '/';
  const [path, setPath] = useState(normalize);
  useEffect(() => {
    const update = () => setPath(normalize());
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  return path;
}

function Link({ href, children, className }) {
  const browserHref = normalizeAppHref(href);
  return (
    <a
      className={className}
      href={browserHref}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}

function useAsync(loader, deps) {
  const [state, setState] = useState({ loading: true, data: null, error: '' });
  useEffect(() => {
    let alive = true;
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    loader()
      .then((data) => alive && setState({ loading: false, data, error: '' }))
      .catch((error) => alive && setState({ loading: false, data: null, error: error.message }));
    return () => {
      alive = false;
    };
  }, deps);
  return state;
}

function Header({ account, refreshAccount }) {
  const isAdmin = account.admin?.loggedIn;
  const isUser = account.user?.loggedIn;
  const label = isAdmin ? `管理员 ${account.admin.username || 'admin'}` : isUser ? `游客 ${account.user.username || 'demo'}` : '游客模式';
  const hint = isAdmin ? '运营后台已登录' : isUser ? '足迹与预约已同步' : '免登录浏览景点';
  const actionHref = isAdmin ? '/admin' : isUser ? '/me' : '/login';

  return (
    <header className="site-header">
      <div className="brand-row">
        <Link href="/" className="brand">
          <span className="brand-mark">旅</span>
          <span>
            <strong>旅图云</strong>
            <small>Travel Cloud Map</small>
          </span>
        </Link>
        <div className="header-right">
          <p>让风景、路线、服务和故事在一张图上相遇。</p>
          <Link href={actionHref} className="account-entry">
            <span className="avatar">{isAdmin ? <ShieldCheck size={18} /> : <UserRound size={18} />}</span>
            <span>
              <strong>{label}</strong>
              <small>{hint}</small>
            </span>
          </Link>
          {(isAdmin || isUser) && (
            <button className="icon-button ghost" onClick={refreshAccount} title="刷新登录状态">
              <RefreshCw size={18} />
            </button>
          )}
        </div>
      </div>
      <nav className="portal-nav">
        {navItems.map(([href, text]) => (
          <Link key={href} href={href}>
            {text}
          </Link>
        ))}
      </nav>
    </header>
  );
}

const defaultHeroSlides = [
  { imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=95', eyebrow: '山水漫游', title: '旅图云', body: '热门景点、路线规划、预约票务、足迹打卡与智能导览的一站式体验。', actionText: '进入导览', actionHref: '/guide' },
  { imageUrl: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=2400&q=95', eyebrow: '湖光远山', title: '发现身边的文化风景', body: '把游玩建议、实时天气、周边设施和评论攻略提前准备好。', actionText: '进入导览', actionHref: '/guide' },
  { imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=95', eyebrow: '轻松出行', title: '从收藏到路线，一键成行', body: '选择 2-5 个景点，系统自动给出合理游览顺序和分段路程。', actionText: '规划路线', actionHref: '/route' }
];

function Hero({ spots, slides = defaultHeroSlides }) {
  const heroSlides = Array.isArray(slides) && slides.length ? slides : defaultHeroSlides;
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActive((value) => (value + 1) % heroSlides.length), 6500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);
  return (
    <section className="hero">
      {heroSlides.map((slide, index) => (
        <div key={`${slide.title}-${index}`} className={cx('hero-slide', active === index && 'active')} style={{ backgroundImage: `url(${slide.imageUrl})` }}>
          <div className="hero-caption">
            <span>{slide.eyebrow}</span>
            <h1>{slide.title}</h1>
            <p>{slide.body}</p>
            <Link className="primary-link" href={slide.actionHref || '/guide'}>{slide.actionText || '进入导览'}</Link>
          </div>
        </div>
      ))}
      <div className="hero-dots">
        {heroSlides.map((slide, index) => (
          <button key={`${slide.title}-dot-${index}`} className={active === index ? 'active' : ''} onClick={() => setActive(index)} aria-label={`切换到第 ${index + 1} 张`} />
        ))}
      </div>
      {!!spots?.length && <div className="hero-glance">精选 {spots.length} 个热门景点，立即启程</div>}
    </section>
  );
}

function SpotCard({ spot, addRoute }) {
  return (
    <article className="card">
      <img src={spot.coverImage} alt={spot.name} />
      <div className="card-body">
        <div className="pill-row">
          <span className="pill gold">{spot.type}</span>
          <span className="pill"><Star size={14} /> {spot.rating}</span>
          {spot.distanceKm !== undefined && spot.distanceKm !== 99999 && <span className="pill">{spot.distanceKm} km</span>}
          {spot.checkedIn && <span className="pill"><BadgeCheck size={14} /> 已打卡</span>}
        </div>
        <h2>{spot.name}</h2>
        <p className="muted">{spot.address}</p>
        <div className="actions">
          <Link className="button-like" href={`/spots/${spot.id}`}>查看详情</Link>
          {addRoute && <button className="secondary" onClick={() => addRoute(spot)}><Plus size={16} /> 加入路线</button>}
        </div>
      </div>
    </article>
  );
}

function Home({ addRoute }) {
  const { data: slides = [] } = useAsync(() => api('/api/home/hero'), []);
  const { data: featured = [], loading } = useAsync(() => api(`/api/home/featured-spots?lat=${defaultLocation.lat}&lng=${defaultLocation.lng}&userId=${userId}`), []);
  const featuredSpots = Array.isArray(featured) ? featured : [];
  return (
    <>
      <Hero spots={featuredSpots} slides={slides} />
      <main className="container">
        <section className="feature-grid">
          {[
            ['/guide', Compass, '景点导览', '按位置、评分和类型快速找到适合游玩的景点。'],
            ['/route', Navigation, '路线规划', '选择多个景点，生成合理顺序和分段路程。'],
            ['/me', UserRound, '个人中心', '查看足迹、勋章、预约和景点申报。'],
            ['/submit-spot', Plus, '景点申报', '把你发现的非官方好去处推荐给平台审核。']
          ].map(([href, Icon, title, body]) => (
            <Link href={href} className="feature-entry" key={title}>
              <Icon size={26} />
              <strong>{title}</strong>
              <p>{body}</p>
            </Link>
          ))}
        </section>
        <SectionTitle title="精选景点" href="/guide" />
        {loading ? <Loading /> : <section className="grid">{featuredSpots.map((spot) => <SpotCard key={spot.id} spot={spot} addRoute={addRoute} />)}</section>}
      </main>
    </>
  );
}

function SectionTitle({ title, href }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {href && <Link className="more-link" href={href}>鏌ョ湅鏇村</Link>}
    </div>
  );
}

function Loading() {
  return <div className="empty-state">正在加载...</div>;
}

function useNearbyLocation() {
  return useMemo(() => {
    const saved = readStorageJson(nearbyLocationKey, null);
    return saved ? readLocationState(nearbyLocationKey, defaultLocation) : null;
  }, []);
}

function locateByBrowser(onSuccess, onStatus) {
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
        label: '当前位置'
      });
      onStatus?.('定位成功，已按当前位置刷新结果。');
    },
    () => onStatus?.('定位失败，请检查浏览器定位权限，或手动选择城市。'),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

let baiduMapLoader;

function useBaiduMap() {
  const [status, setStatus] = useState({ ready: Boolean(window.BMap), error: '' });
  useEffect(() => {
    if (window.BMap) {
      setStatus({ ready: true, error: '' });
      return;
    }
    let alive = true;
    if (!baiduMapLoader) {
      baiduMapLoader = api('/api/config').then((config) => new Promise((resolve, reject) => {
        if (!config.baiduMapEnabled) throw new Error('百度地图暂未启用，请在百度控制台启用 Web JS API 后，将 travel.map.enabled 改为 true。');
        if (!config.baiduMapAk) throw new Error('百度地图 AK 未配置。');
        if (window.BMap) {
          resolve(window.BMap);
          return;
        }
        window.__travelCloudBaiduReady = () => resolve(window.BMap);
        const script = document.createElement('script');
        script.dataset.baiduMap = 'true';
        script.src = `https://api.map.baidu.com/api?v=3.0&ak=${config.baiduMapAk}&callback=__travelCloudBaiduReady`;
        script.onerror = () => reject(new Error('百度地图 SDK 加载失败，请检查 AK 服务状态、Referer 白名单和网络。'));
        document.head.appendChild(script);
      }));
    }
    baiduMapLoader
      .then(() => alive && setStatus({ ready: true, error: '' }))
      .catch((error) => alive && setStatus({ ready: false, error: error.message }));
    return () => {
      alive = false;
    };
  }, []);
  return status;
}

function fetchNearbySpots(location) {
  return api(`/api/spots?keyword=&type=&lat=${location.lat}&lng=${location.lng}&userId=${userId}`);
}

function BaiduMap({ center = defaultLocation, markers = [], route = false, polyline = false, className = '' }) {
  const ref = React.useRef(null);
  const mapRef = React.useRef(null);
  const { ready, error } = useBaiduMap();
  useEffect(() => {
    if (!ready || !ref.current || !window.BMap) return;
    let cancelled = false;
    const BMap = window.BMap;
    const container = ref.current;
    container.innerHTML = '';
    const map = new BMap.Map(container);
    mapRef.current = map;
    const toPoint = (item) => new BMap.Point(Number(item.longitude ?? item.lng), Number(item.latitude ?? item.lat));
    const centerPoint = toPoint(center);
    map.centerAndZoom(centerPoint, markers.length > 1 ? 11 : 14);
    map.enableScrollWheelZoom(true);
    const points = (markers.length ? markers : [center]).map(toPoint).filter(Boolean);
    points.forEach((point, index) => {
      const item = markers[index] || center;
      const marker = new BMap.Marker(point);
      marker.setLabel(new BMap.Label(item.name || item.label || `浣嶇疆 ${index + 1}`, { offset: new BMap.Size(18, -10) }));
      map.addOverlay(marker);
    });
    if (route && points.length > 1) {
      const driving = new BMap.DrivingRoute(map, { renderOptions: { map, autoViewport: true } });
      window.setTimeout(() => {
        if (!cancelled && container.isConnected) {
          driving.search(points[0], points[points.length - 1], { waypoints: points.slice(1, -1) });
        }
      }, 0);
    } else {
      if (polyline && points.length > 1) {
        map.addOverlay(new BMap.Polyline(points, { strokeColor: '#2f8df5', strokeWeight: 4, strokeOpacity: 0.72 }));
      }
      if (points.length > 1) map.setViewport(points);
    }
    return () => {
      cancelled = true;
      try {
        map.clearOverlays();
      } catch (ignore) {
        // Baidu SDK has no stable destroy API; clear overlays and detach DOM safely.
      }
      if (mapRef.current === map) mapRef.current = null;
      if (container.isConnected) container.innerHTML = '';
    };
  }, [ready, center.lat, center.lng, JSON.stringify(markers), route, polyline]);

  if (error) return <div className={cx('map-box', className)}>{error}</div>;
  return <div ref={ref} className={cx('map-box baidu-map', className)}>{ready ? '' : '百度地图加载中...'}</div>;
}

function GuideLanding() {
  const storedLocation = useNearbyLocation();
  const [location, setLocation] = useState(storedLocation);
  const [spots, setSpots] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [readyToEnter, setReadyToEnter] = useState(Boolean(storedLocation));

  useEffect(() => {
    if (!readyToEnter || !location) return;
    let alive = true;
    setLoading(true);
    fetchNearbySpots(location)
      .then((data) => {
        if (!alive) return;
        const list = Array.isArray(data)
          ? data
              .slice()
              .sort((a, b) => Number(a.distanceKm ?? 99999) - Number(b.distanceKm ?? 99999))
              .slice(0, 7)
          : [];
        setSpots(list);
        setRevealedCount(0);
        setStatus(list.length ? `${list.length} 个附近景点正在逐渐浮现。` : '当前区域暂未找到足够的景点。');
      })
      .catch((error) => {
        if (alive) setStatus(error.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [readyToEnter, location]);

  useEffect(() => {
    if (!spots.length) return;
    const timer = window.setInterval(() => {
      setRevealedCount((value) => {
        if (value >= spots.length) {
          window.clearInterval(timer);
          return value;
        }
        return value + 1;
      });
    }, 240);
    return () => window.clearInterval(timer);
  }, [spots]);

  function handleLocate() {
    setLoading(true);
    setStatus('星空定位中...');
    locateByBrowser(
      (nextLocation) => {
        const normalized = { ...nextLocation, label: nextLocation.label || '当前位置' };
        setLocation(normalized);
        saveLocationState(nearbyLocationKey, normalized);
        setReadyToEnter(true);
        setStatus('位置已锁定，附近景点开始浮现。');
      },
      setStatus
    );
    window.setTimeout(() => setLoading(false), 1200);
  }

  const visibleSpots = spots.slice(0, revealedCount);
  const hasLocated = readyToEnter && Boolean(location);

  useEffect(() => {
    document.body.classList.add('guide-open');
    return () => document.body.classList.remove('guide-open');
  }, []);

  return (
    <main className="guide-landing">
      <section className="guide-intro-stage">
        <div className="starfield" aria-hidden="true">
          {Array.from({ length: 42 }).map((_, index) => (
            <span
              key={index}
              className="star"
              style={{
                left: `${(index * 17) % 100}%`,
                top: `${(index * 29) % 100}%`,
                animationDelay: `${(index % 8) * 0.22}s`
              }}
            />
          ))}
        </div>
        <div className={cx('guide-intro-copy', hasLocated && 'revealed')}>
          <span className="intro-eyebrow">定位探索</span>
          <h1>先在星空里找到你</h1>
          <p>点击中心定位按钮后，系统会以你的当前位置为圆心，把附近景点按半径从近到远依次点亮，再进入附近景点页面。</p>
        </div>
        <div className="guide-orbit" aria-hidden="true">
          {visibleSpots.map((spot, index) => {
            const angle = index * 2.45 - Math.PI / 2;
            const radius = 150 + index * 62;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (index % 3 - 1) * 58;
            const scale = 1 - index * 0.025;
            return (
              <div
                key={spot.id}
                className="orbit-spot visible"
                style={{
                  '--x': `${x}px`,
                  '--y': `${y}px`,
                  '--z': `${z}px`,
                  '--scale': scale,
                  '--delay': `${index * 120}ms`
                }}
              >
                <strong>{spot.name}</strong>
                <small>{spot.distanceKm !== undefined ? `${spot.distanceKm} km` : spot.type}</small>
              </div>
            );
          })}
        </div>
        <button className={cx('center-locate-button', loading && 'loading')} type="button" onClick={handleLocate}>
          <MapPin size={18} />
          {loading ? '正在定位' : location ? '重新定位' : '开始定位'}
        </button>
        <div className={cx('guide-radar', hasLocated && 'visible')}>
          <strong>{location?.label || '未定位'}</strong>
          <span>{status}</span>
          <small>{location ? `${Number(location.lat).toFixed(4)}, ${Number(location.lng).toFixed(4)}` : '获取当前位置后，附近景点会开始浮现。'}</small>
        </div>
        <div className={cx('guide-actions', hasLocated && 'visible')}>
          <button className="secondary" type="button" onClick={handleLocate}>重新定位</button>
          <button className="secondary" type="button" onClick={() => {
            const fallback = defaultLocation;
            setLocation(fallback);
            saveLocationState(nearbyLocationKey, fallback);
            setReadyToEnter(true);
            setStatus('已切换到默认城市，附近景点正在生成。');
          }}>默认城市</button>
        </div>
        {readyToEnter && (
          <button className="next-step-fab" type="button" onClick={() => navigateTo('/guide/nearby')}>
            下一步
          </button>
        )}
      </section>
    </main>
  );
}

function Guide({ route, addRoute, removeRoute, clearRoute }) {
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('distance');
  const [location, setLocation] = useState(defaultLocation);
  const [locationMessage, setLocationMessage] = useState('');
  const query = `keyword=${encodeURIComponent(keyword)}&type=${encodeURIComponent(type)}&lat=${location.lat}&lng=${location.lng}&userId=${userId}`;
  const { data, loading, error } = useAsync(() => api(`/api/spots?${query}`), [keyword, type, location.lat, location.lng]);
  const spots = useMemo(() => {
    const list = [...(data || [])];
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'price') list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    return list;
  }, [data, sort]);

  return (
    <main className="container">
      <PageHero icon={Compass} title="附近景点" body="已按当前位置筛出周边景点，你可以继续筛选、加入路线，或者直接去详情页看看。" />
      <div className="layout guide-layout">
        <section>
          <div className="toolbar">
            <label><Search size={16} /><input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜索景点名称" /></label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">全部类型</option>
              <option value="自然风光">自然风光</option>
              <option value="历史文化">历史文化</option>
              <option value="城市休闲">城市休闲</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="distance">距离优先</option>
              <option value="rating">评分优先</option>
              <option value="price">票价优先</option>
            </select>
            <button className="secondary" onClick={() => { setKeyword(''); setType(''); setSort('distance'); }}>清空</button>
          </div>
          <div className="location-strip">
            <MapPin size={18} />
            <strong>{location.label}</strong>
            <span>{Number(location.lat).toFixed(4)}, {Number(location.lng).toFixed(4)}</span>
            <button className="secondary" onClick={() => locateByBrowser(setLocation, setLocationMessage)}>定位</button>
            <button className="secondary" onClick={() => setLocation({ lat: 31.23, lng: 121.47, label: '上海市中心' })}>上海</button>
            <button className="secondary" onClick={() => setLocation(defaultLocation)}>宜宾</button>
          </div>
          {locationMessage && <div className="message">{locationMessage}</div>}
          {error && <div className="message error">{error}</div>}
          {loading ? <Loading /> : <section className="grid">{spots.map((spot) => <SpotCard key={spot.id} spot={spot} addRoute={addRoute} />)}</section>}
        </section>
        <aside className="panel sticky">
          <PanelTitle icon={Map} title="当前位置地图" />
          <BaiduMap center={location} markers={[location]} className="side-map" />
          <PanelTitle icon={Navigation} title="已选路线" meta={`${route.length} / 5`} />
          <SelectedRoute route={route} removeRoute={removeRoute} />
          <div className="actions fill">
            <Link className="button-like" href="/route">去规划</Link>
            <button className="secondary" onClick={clearRoute}><Trash2 size={16} /> 清空</button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SelectedRoute({ route, removeRoute }) {
  if (!route.length) return <div className="empty-state compact">杩樻病鏈夐€夋嫨鏅偣</div>;
  return (
    <div className="selected-list">
      {route.map((item, index) => (
        <div className="selected-item" key={item.id}>
          <span>{index + 1}</span>
          <strong>{item.name}</strong>
          <button className="icon-button ghost" onClick={() => removeRoute(item.id)} title="绉婚櫎"><Trash2 size={16} /></button>
        </div>
      ))}
    </div>
  );
}

function RoutePage({ route, addRoute, removeRoute, clearRoute }) {
  const { data: spots = [] } = useAsync(() => api(`/api/spots?lat=${defaultLocation.lat}&lng=${defaultLocation.lng}&userId=${userId}`), []);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [origin, setOrigin] = useState(defaultLocation);
  function locateOrigin() {
    locateByBrowser(
      (nextOrigin) => setOrigin({ ...nextOrigin, label: '当前位置' }),
      setMessage
    );
  }
  async function plan() {
    if (route.length < 2) {
      setMessage('请至少选择 2 个景点。');
      return;
    }
    setMessage('正在生成路线...');
    try {
      const data = await api('/api/routes/plan', { method: 'POST', body: JSON.stringify({ spotIds: route.map((item) => item.id), mode: 'driving' }) });
      setResult(data);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <main className="container">
      <PageHero icon={Navigation} title="路线规划" body="从已选景点中生成智能游览顺序，查看总距离、预计耗时和每段路程。" />
      <div className="layout">
        <section className="panel">
          <PanelTitle icon={Map} title="路线工作台" meta="2-5 个景点" />
          <div className="location-strip route-origin">
            <MapPin size={18} />
            <strong>出发地：{origin.label}</strong>
            <span>{Number(origin.lat).toFixed(4)}, {Number(origin.lng).toFixed(4)}</span>
            <button className="secondary" type="button" onClick={locateOrigin}>瀹氫綅</button>
            <button className="secondary" type="button" onClick={() => setOrigin({ lat: 39.9042, lng: 116.4074, label: '北京市中心' })}>北京</button>
            <button className="secondary" type="button" onClick={() => setOrigin({ lat: 31.2304, lng: 121.4737, label: '上海市中心' })}>上海</button>
            <button className="secondary" type="button" onClick={() => setOrigin(defaultLocation)}>宜宾</button>
          </div>
          <SelectedRoute route={route} removeRoute={removeRoute} />
          <div className="actions">
            <button onClick={plan}><Sparkles size={16} /> 鏅鸿兘鎺掑簭</button>
            <button className="secondary" onClick={clearRoute}><Trash2 size={16} /> 娓呯┖</button>
          </div>
          {message && <div className="message">{message}</div>}
          <RouteResult result={result} origin={origin} />
        </section>
        <aside className="panel">
          <PanelTitle icon={Plus} title="可选景点" />
          <div className="choice-list">
            {(spots || []).slice(0, 12).map((spot) => (
              <button className="choice" key={spot.id} onClick={() => addRoute(spot)}>
                <strong>{spot.name}</strong>
                <small>{spot.type} · {spot.rating} 分</small>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}

function RouteResult({ result, origin }) {
  if (!result) return <div className="empty-state route-map">路线结果会显示在这里</div>;
  const firstSpot = result.orderedSpots?.[0];
  return (
    <div className="route-result">
      <BaiduMap center={result.orderedSpots?.[0]} markers={result.orderedSpots || []} route className="route-live-map" />
      <div className="metrics">
        <Metric value={result.totalDistanceKm} label="总距离 km" />
        <Metric value={result.totalMinutes} label="预计分钟" />
        <Metric value={result.orderedSpots?.length || 0} label="游览景点" />
      </div>
      <div className="steps">
        {result.orderedSpots?.map((spot, index) => <span key={spot.id}>{index + 1}. {spot.name}</span>)}
      </div>
      <div className="segment-list">
        {result.segments?.map((segment, index) => (
          <div className="segment" key={`${segment.fromSpotId}-${segment.toSpotId}`}>
            <span>{index + 1}</span>
            <strong>{segment.distanceKm} km</strong>
            <small>约 {segment.minutes} 分钟</small>
          </div>
        ))}
      </div>
      {firstSpot && <TripOptions origin={origin} destination={firstSpot} />}
    </div>
  );
}

function TripOptions({ origin, destination }) {
  const { ready, error } = useBaiduMap();
  const mapHostRef = React.useRef(null);
  const panels = [
    {
      key: 'fast',
      title: '最快方案',
      desc: '优先耗时最短，跨城时偏向飞机或更快公共交通。',
      intercityPolicy: 'BMAP_INTERCITY_POLICY_LEAST_TIME',
      transitPolicy: 'BMAP_TRANSIT_POLICY_LEAST_TIME',
      transitTypePolicy: 'BMAP_TRANSIT_TYPE_POLICY_AIRPLANE'
    },
    {
      key: 'cheap',
      title: '最便宜方案',
      desc: '优先低价，跨城时偏向火车、大巴等成本更低组合。',
      intercityPolicy: 'BMAP_INTERCITY_POLICY_CHEAP_PRICE',
      transitPolicy: 'BMAP_TRANSIT_POLICY_RECOMMEND',
      transitTypePolicy: 'BMAP_TRANSIT_TYPE_POLICY_TRAIN'
    },
    {
      key: 'comfort',
      title: '最舒适方案',
      desc: '优先少换乘，兼顾舒适度与稳定性。',
      intercityPolicy: 'BMAP_INTERCITY_POLICY_LEAST_TIME',
      transitPolicy: 'BMAP_TRANSIT_POLICY_LEAST_TRANSFER',
      transitTypePolicy: 'BMAP_TRANSIT_TYPE_POLICY_TRAIN'
    }
  ];

  useEffect(() => {
    if (!ready || !window.BMap || !origin || !destination || !mapHostRef.current) return;
    const BMap = window.BMap;
    const start = new BMap.Point(Number(origin.lng), Number(origin.lat));
    const end = new BMap.Point(Number(destination.longitude ?? destination.lng), Number(destination.latitude ?? destination.lat));
    const transitMap = new BMap.Map(mapHostRef.current);
    transitMap.centerAndZoom(start, 10);
    const routes = [];
    panels.forEach((panel) => {
      const panelNode = document.getElementById(`trip-panel-${panel.key}`);
      if (panelNode) panelNode.innerHTML = '<div class="trip-loading">正在从百度地图获取方案...</div>';
      const transit = new BMap.TransitRoute(transitMap, {
        renderOptions: { map: transitMap, panel: `trip-panel-${panel.key}` },
        policy: window[panel.transitPolicy],
        intercityPolicy: window[panel.intercityPolicy],
        transitTypePolicy: window[panel.transitTypePolicy],
        onSearchComplete: function () {
          if (transit.getStatus() !== window.BMAP_STATUS_SUCCESS && panelNode) {
            panelNode.innerHTML = '<div class="trip-empty">百度地图暂未返回可行方案，可切换出发地或继续查看。</div>';
          }
        }
      });
      routes.push(transit);
      transit.search(start, end);
    });
    return () => {
      routes.forEach((route) => {
        try {
          route.clearResults();
        } catch (ignore) {
          // Some Baidu route objects do not expose cleanup consistently.
        }
      });
      try {
        transitMap.clearOverlays();
      } catch (ignore) {
        // Baidu SDK has no stable destroy API.
      }
      if (mapHostRef.current) mapHostRef.current.innerHTML = '';
    };
  }, [ready, origin.lat, origin.lng, destination.id]);

  if (error) return <div className="message error">{error}</div>;
  return (
    <section className="trip-options">
      <PanelTitle icon={Navigation} title="前往首站的交通方案" meta={`${origin.label} → ${destination.name}`} />
      <p className="muted">以下方案由百度地图公共交通路线规划生成，跨城时可包含飞机、火车、高铁、大巴、地铁和步行接驳。</p>
      <div ref={mapHostRef} className="trip-hidden-map" aria-hidden="true" />
      <div className="trip-grid">
        {panels.map((panel) => (
          <article className="trip-card" key={panel.key}>
            <strong>{panel.title}</strong>
            <p>{panel.desc}</p>
            <div id={`trip-panel-${panel.key}`} className="trip-panel">{ready ? '等待百度地图返回方案...' : '百度地图加载中...'}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SpotDetail({ id, addRoute }) {
  const { data: spot, loading, error } = useAsync(() => api(`/api/spots/${id}`), [id]);
  const weather = useAsync(() => api(`/api/spots/${id}/weather`), [id]);
  const crowd = useAsync(() => api(`/api/spots/${id}/crowd-index`), [id]);
  const facilities = useAsync(() => spot ? api(`/api/facilities?lat=${spot.latitude}&lng=${spot.longitude}&radiusKm=8`) : Promise.resolve([]), [spot?.id]);
  const [reviewTick, setReviewTick] = useState(0);
  const reviews = useAsync(() => api(`/api/community/spots/${id}/reviews`), [id, reviewTick]);
  const [reservation, setReservation] = useState({ visitDate: new Date().toISOString().slice(0, 10), timeSlot: '09:00-12:00', people: 1 });
  const [reviewForm, setReviewForm] = useState({ score: 5, content: '' });
  const [replyTarget, setReplyTarget] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  if (loading) return <main className="container"><Loading /></main>;
  if (error) return <main className="container"><div className="message error">{error}</div></main>;
  const spotMarker = { ...spot, lat: Number(spot.latitude), lng: Number(spot.longitude) };
  const weatherList = Array.isArray(weather.data) ? weather.data : [];
  const currentWeather = weatherList[0] || {};
  const nextWeather = weatherList.slice(1, 4);
  const weatherSummary = summarizeWeather(weatherList);
  const hasReservation = Number(spot.price) > 0;
  async function checkIn() {
    const result = await api(`/api/spots/${id}/check-ins?userId=${userId}&lat=${spot.latitude}&lng=${spot.longitude}`, { method: 'POST' });
    setMessage(`打卡成功，累计 ${result.totalCheckedIn} 个景点。`);
  }
  async function reserveSpot(event) {
    event.preventDefault();
    const result = await api(`/api/reservations?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify({ spotId: Number(id), ...reservation, people: Number(reservation.people) })
    });
    setMessage(`预约成功，核销码：${result.qrCode}`);
  }
  async function playTts() {
    const result = await api(`/api/spots/${id}/tts`);
    setMessage(`语音导览地址：${result.audioUrl}`);
  }
  async function submitReview(event) {
    event.preventDefault();
    await api(`/api/community/reviews?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify({
        spotId: Number(id),
        score: Number(reviewForm.score),
        content: reviewForm.content
      })
    });
    setReviewForm({ score: 5, content: '' });
    setReplyTarget(null);
    setReviewTick((value) => value + 1);
  }
  async function likeReview(reviewId) {
    await api(`/api/community/reviews/${reviewId}/like?userId=${userId}`, { method: 'POST' });
    setReviewTick((value) => value + 1);
  }
  const allReviews = reviews.data || [];
  const rootReviews = allReviews.filter((review) => !review.parentId);
  const repliesByParent = allReviews.reduce((result, review) => {
    if (review.parentId) {
      result[review.parentId] = result[review.parentId] || [];
      result[review.parentId].push(review);
    }
    return result;
  }, {});
  return (
    <main className="container">
      <section className="detail-hero" style={{ backgroundImage: `url(${spot.coverImage})` }}>
        <div>
          <span className="pill gold">{spot.type}</span>
          <h1>{spot.name}</h1>
          <p>{spot.address}</p>
          <button onClick={() => addRoute(spot)}><Plus size={16} /> 加入路线</button>
        </div>
      </section>
      <div className="layout">
        <section className="panel">
          <PanelTitle icon={MapPin} title="景点详情" meta={`${spot.rating} 分`} />
          <p className="lead">{spot.description}</p>
          {message && <div className="message">{message}</div>}
          <div className="actions">
            <button onClick={checkIn}><BadgeCheck size={16} /> 到达打卡</button>
            <button className="secondary" onClick={playTts}><Headphones size={16} /> 语音导览</button>
            <a className="button-like" target="_blank" href={`https://api.map.baidu.com/marker?location=${spot.latitude},${spot.longitude}&title=${encodeURIComponent(spot.name)}&content=${encodeURIComponent('旅图云景点导航')}&output=html`} rel="noreferrer"><Car size={16} /> 百度导航</a>
          </div>
          <div className="gallery">{(spot.gallery || []).slice(0, 4).map((image) => <img key={image} src={image} alt={spot.name} />)}</div>
          <InfoGrid items={[['开放时间', spot.openHours], ['门票', `¥${spot.price || 0}`], ['最佳季节', spot.bestSeason], ['咨询电话', spot.phone]]} />
          <h3>导览与历史</h3>
          <p>{spot.guide}</p>
          <p>{spot.history}</p>
          <h3>附近设施地图</h3>
          <BaiduMap center={spotMarker} markers={[spotMarker, ...(facilities.data || [])]} className="detail-map" />
          <div className="list facility-list">{(facilities.data || []).map((item) => <div className="list-item" key={item.id}><strong>{item.name}</strong><p>{item.type} · {item.distanceKm ?? '-'} km · {item.rating} 分</p></div>)}</div>
          {hasReservation && (
            <>
              <h3>预约票务</h3>
              <form className="inline-form" onSubmit={reserveSpot}>
                <input type="date" value={reservation.visitDate} onChange={(e) => setReservation({ ...reservation, visitDate: e.target.value })} />
                <select value={reservation.timeSlot} onChange={(e) => setReservation({ ...reservation, timeSlot: e.target.value })}>
                  <option>09:00-12:00</option>
                  <option>12:00-15:00</option>
                  <option>15:00-18:00</option>
                </select>
                <input type="number" min="1" max="10" value={reservation.people} onChange={(e) => setReservation({ ...reservation, people: e.target.value })} />
                <button>立即预约</button>
              </form>
            </>
          )}
          <section className="comment-section">
            <PanelTitle icon={MessageCircle} title="游客评论" meta={`${rootReviews.length} 条讨论`} />
            <form className="review-composer" onSubmit={submitReview}>
              <div className="comment-avatar">旅</div>
              <div className="composer-main">
                {replyTarget && (
                  <div className="replying-to">
                    回复 @{replyTarget.name}
                    <button type="button" onClick={() => setReplyTarget(null)}>取消</button>
                  </div>
                )}
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                  placeholder={replyTarget ? '写下你的回复' : '写下你的游玩体验'}
                  rows="3"
                  required
                />
                <div className="composer-actions">
                  <select value={reviewForm.score} onChange={(e) => setReviewForm({ ...reviewForm, score: e.target.value })}>
                    {[5, 4, 3, 2, 1].map((score) => <option key={score} value={score}>{score} 分</option>)}
                  </select>
                  <button><Send size={16} /> 发布</button>
                </div>
              </div>
            </form>
            <div className="review-list">
              {rootReviews.length ? rootReviews.map((review) => (
                <CommentItem
                  key={review.id}
                  review={review}
                  replies={repliesByParent[review.id] || []}
                  onLike={likeReview}
                  onReply={setReplyTarget}
                />
              )) : <div className="empty-state compact">还没有评论，来写第一条游玩体验。</div>}
            </div>
          </section>
        </section>
        <aside className="panel sticky">
          <PanelTitle icon={Sparkles} title="天气与拥挤" />
          <div className="weather-snapshot">
            <div className="weather-core">
              <div>
                <span className="weather-tag">{weatherSummary.label}</span>
                <strong>{currentWeather.temperature || '--'}</strong>
                <p>{currentWeather.condition || '--'}</p>
              </div>
              <div className="weather-icon">{weatherIcon(currentWeather.icon)}</div>
            </div>
            <div className="metrics single weather-metrics">
              <Metric value={crowd.data?.level || '--'} label="拥挤指数" />
              <Metric value={currentWeather.rainfall || '--'} label="降水" />
            </div>
            <div className="weather-advice">{currentWeather.advice || '天气数据加载中，请稍后查看。'}</div>
          </div>
          <div className="weather-days">
            {nextWeather.map((item) => (
              <article className="weather-day" key={`${item.date}-${item.period || item.condition}`}>
                <span>{item.period || item.date}</span>
                <strong>{item.temperature || '--'}</strong>
                <p>{item.condition || '--'}</p>
                <small>{item.wind || '--'}</small>
              </article>
            ))}
          </div>
          <div className="ai-box">
            {answer && <div className="ai-answer">{answer}</div>}
            <div className="ai-input">
              <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="闂棶鏅偣鏀荤暐" />
              <button onClick={async () => {
                if (!question.trim()) return;
                const data = await api(`/api/spots/${id}/assistant`, { method: 'POST', body: JSON.stringify({ question }) });
                setAnswer(data.answer);
                setQuestion('');
              }}><Send size={16} /></button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function CommentItem({ review, replies, onLike, onReply }) {
  const liked = (review.likedUserIds || []).includes(userId);
  const displayName = review.source === 'BAIDU_MAP' ? '百度地图游客' : `游客${review.userId || ''}`;
  const time = review.createdAt ? String(review.createdAt).replace('T', ' ').slice(0, 16) : '';
  return (
    <article className="comment-item">
      <div className={cx('comment-avatar', review.source === 'BAIDU_MAP' && 'baidu')}>{displayName.slice(0, 1)}</div>
      <div className="comment-body">
        <div className="comment-topline">
          <strong>{displayName}</strong>
          <span>{review.score} 分 · {time}</span>
        </div>
        <p>{review.content}</p>
        <div className="comment-tools">
          <button
            type="button"
            className={cx('heart-button', liked && 'liked')}
            onClick={() => onLike(review.id)}
            aria-label={liked ? '取消点赞' : '点赞'}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            <span>{review.likes || 0}</span>
          </button>
          <button type="button" className="reply-button" onClick={() => onReply({ rootId: review.id, name: displayName })}>
            回复
          </button>
        </div>
        {replies.length > 0 && (
          <div className="reply-stack">
            {replies.map((reply) => {
              const replyLiked = (reply.likedUserIds || []).includes(userId);
              const replyName = reply.source === 'BAIDU_MAP' ? '百度地图游客' : `游客${reply.userId || ''}`;
              return (
                <div className="comment-item reply" key={reply.id}>
                  <div className="comment-avatar small">{replyName.slice(0, 1)}</div>
                  <div className="comment-body">
                    <div className="comment-topline">
                      <strong>{replyName}</strong>
                      <span>{reply.createdAt ? String(reply.createdAt).replace('T', ' ').slice(0, 16) : ''}</span>
                    </div>
                    <p>{reply.content}</p>
                    <div className="comment-tools">
                      <button
                        type="button"
                        className={cx('heart-button', replyLiked && 'liked')}
                        onClick={() => onLike(reply.id)}
                        aria-label={replyLiked ? '取消点赞' : '点赞'}
                      >
                        <Heart size={16} fill={replyLiked ? 'currentColor' : 'none'} />
                        <span>{reply.likes || 0}</span>
                      </button>
                      <button type="button" className="reply-button" onClick={() => onReply({ rootId: review.id, name: replyName })}>
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

function summarizeWeather(list) {
  const rows = Array.isArray(list) ? list : [];
  if (!rows.length) {
    return { label: '澶╂皵姒傝', text: '鏆傛棤澶╂皵鏁版嵁' };
  }
      const rainCount = rows.filter((item) => (item.condition || '').includes('雨')).length;
      const sunnyCount = rows.filter((item) => (item.condition || '').includes('晴')).length;
      const label = rainCount > 0 ? '有降雨风险' : sunnyCount > 0 ? '晴好可游' : '天气平稳';
  return { label, text: rows[0]?.advice || '' };
}

function weatherIcon(icon) {
  const icons = {
    rain: '☔',
    cloud: '☁',
    mist: '〰',
    sun: '☀',
    now: '◉'
  };
  return icons[icon] || '☀';
}

function Profile() {
  const footprints = useAsync(() => api(`/api/users/${userId}/footprints`), []);
  const reservations = useAsync(() => api(`/api/reservations/mine?userId=${userId}`), []);
  const submissions = useAsync(() => api(`/api/community/submissions/mine?userId=${userId}`), []);
  return (
    <main className="container">
      <PageHero icon={UserRound} title="个人中心" body="集中查看打卡足迹、预约记录、勋章和申报进度。" />
      <div className="dashboard">
        <Metric value={footprints.data?.total ?? '--'} label="已打卡" />
        <Metric value={footprints.data?.badges?.length ?? '--'} label="勋章" />
        <Metric value={reservations.data?.length ?? '--'} label="预约" />
        <Metric value={submissions.data?.length ?? '--'} label="申报" />
      </div>
      <section className="panel">
        <PanelTitle icon={Map} title="旅游足迹地图" />
        <BaiduMap center={defaultLocation} markers={footprints.data?.checkedInSpots || []} polyline className="footprint-map" />
      </section>
      <div className="layout">
        <ListPanel title="足迹勋章" icon={BadgeCheck} items={(footprints.data?.badges || []).map((badge) => ({ title: badge, body: '继续探索解锁更多勋章' }))} empty="暂无勋章" />
        <ListPanel title="我的预约" icon={CalendarDays} items={(reservations.data || []).map((item) => ({ title: `景点 ID ${item.spotId}`, body: `${item.visitDate} ${item.timeSlot} · ${item.status}` }))} empty="暂无预约" />
      </div>
      <ListPanel title="我的申报" icon={Plus} items={(submissions.data || []).map((item) => ({ title: item.name, body: `${item.status} · ${item.address}` }))} empty="暂无申报" />
    </main>
  );
}

function SubmitSpot() {
  const [form, setForm] = useState({ name: '', type: '', address: '', latitude: '', longitude: '', description: '', reason: '', photoUrls: '' });
  const [message, setMessage] = useState('');
  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  async function submit(event) {
    event.preventDefault();
    try {
      await api(`/api/community/submissions?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify({ ...form, photoUrls: form.photoUrls.split(/\n|,/).map((item) => item.trim()).filter(Boolean) })
      });
      setMessage('提交成功，已进入平台审核。');
      setForm({ name: '', type: '', address: '', latitude: '', longitude: '', description: '', reason: '', photoUrls: '' });
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <main className="container">
      <PageHero icon={Plus} title="景点申报" body="推荐你发现的好去处，平台审核后可进入景点库。" />
      <form className="panel form" onSubmit={submit}>
        {['name:景点名称', 'type:类型', 'address:地址', 'latitude:纬度', 'longitude:经度'].map((spec) => {
          const [key, label] = spec.split(':');
          return <label key={key}>{label}<input value={form[key]} onChange={(e) => update(key, e.target.value)} required /></label>;
        })}
        <label className="wide">图片地址<textarea value={form.photoUrls} onChange={(e) => update('photoUrls', e.target.value)} placeholder="多个地址可换行或用逗号分隔" /></label>
        <label className="wide">景点描述<textarea value={form.description} onChange={(e) => update('description', e.target.value)} required /></label>
        <label className="wide">推荐理由<textarea value={form.reason} onChange={(e) => update('reason', e.target.value)} required /></label>
        <button>提交审核</button>
        {message && <div className="message">{message}</div>}
      </form>
    </main>
  );
}

function Login({ refreshAccount }) {
  const [role, setRole] = useState(new URLSearchParams(window.location.search).get('role') === 'admin' ? 'admin' : 'user');
  const [username, setUsername] = useState(role === 'admin' ? 'admin' : 'demo');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => setUsername(role === 'admin' ? 'admin' : 'demo'), [role]);
  async function submit(event) {
    event.preventDefault();
    try {
      await api(role === 'admin' ? '/api/admin/auth/login' : '/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
      await refreshAccount();
      const nextPath = role === 'admin' ? '/admin' : '/me';
      window.history.pushState(null, '', window.location.port === '5173' ? `/app${nextPath}` : nextPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <main className="container narrow">
      <section className="panel login-card">
        <PanelTitle icon={LogIn} title="登录旅图云" meta={role === 'admin' ? '管理员' : '游客'} />
        <div className="segmented">
          <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>游客</button>
          <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>管理员</button>
        </div>
        <form className="login-form" onSubmit={submit}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="账号" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={role === 'admin' ? '默认密码 admin123' : '默认密码 demo123'} />
          <button>登录</button>
        </form>
        {message && <div className="message error">{message}</div>}
      </section>
    </main>
  );
}

function Admin() {
  const spots = useAsync(() => api('/api/admin/spots'), []);
  const facilities = useAsync(() => api('/api/admin/facilities'), []);
  const submissions = useAsync(() => api('/api/admin/submissions'), []);
  async function approve(id) {
    await api(`/api/admin/submissions/${id}/approve`, { method: 'POST' });
    window.location.reload();
  }
  return (
    <main className="container">
      <PageHero icon={ShieldCheck} title="运营后台" body="管理景点、周边设施和用户申报。" />
      <div className="dashboard">
        <Metric value={spots.data?.length ?? '--'} label="景点" />
        <Metric value={facilities.data?.length ?? '--'} label="设施" />
        <Metric value={submissions.data?.length ?? '--'} label="申报" />
      </div>
      <HomeContentManager spots={spots.data || []} />
      <div className="layout">
        <ListPanel title="景点库" icon={MapPin} items={(spots.data || []).map((item) => ({ title: item.name, body: `${item.type} · ${item.rating} 分 · 承载 ${item.maxCapacity}` }))} empty="暂无景点" />
        <section className="panel">
          <PanelTitle icon={MessageCircle} title="用户申报" />
          <div className="list">
            {(submissions.data || []).map((item) => (
              <div className="list-item" key={item.id}>
                <strong>{item.name}</strong>
                <p>{item.status} · {item.address}</p>
                {item.status === 'PENDING' && <button className="secondary" onClick={() => approve(item.id)}>通过审核</button>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function HomeContentManager({ spots }) {
  const heroState = useAsync(() => api('/api/admin/home/hero'), []);
  const featuredState = useAsync(() => api('/api/admin/home/featured'), []);
  const [slides, setSlides] = useState(defaultHeroSlides.map((slide, index) => ({ ...slide, sortOrder: index + 1, enabled: true })));
  const [featuredIds, setFeaturedIds] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (heroState.data?.length) {
      setSlides(heroState.data);
    }
  }, [heroState.data]);

  useEffect(() => {
    if (featuredState.data) {
      setFeaturedIds(featuredState.data);
    }
  }, [featuredState.data]);

  function updateSlide(index, key, value) {
    setSlides((current) => current.map((slide, i) => i === index ? { ...slide, [key]: value } : slide));
  }

  function addSlide() {
    setSlides((current) => [...current, { ...defaultHeroSlides[0], sortOrder: current.length + 1, enabled: true }]);
  }

  function removeSlide(index) {
    setSlides((current) => current.filter((_, i) => i !== index));
  }

  function toggleFeatured(id) {
    setFeaturedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function saveHomeContent() {
    await api('/api/admin/home/hero', {
      method: 'PUT',
      body: JSON.stringify(slides.map((slide, index) => ({ ...slide, sortOrder: index + 1, enabled: slide.enabled !== false })))
    });
    await api('/api/admin/home/featured', {
      method: 'PUT',
      body: JSON.stringify({ spotIds: featuredIds })
    });
    setMessage('首页内容已保存，刷新首页即可看到最新配置。');
  }

  return (
    <section className="panel admin-home-manager">
      <PanelTitle icon={Sparkles} title="首页内容管理" meta="Hero + 精选景点" />
      {message && <div className="message">{message}</div>}
      <h3>Hero 轮播图</h3>
      <div className="hero-admin-list">
        {slides.map((slide, index) => (
          <div className="hero-admin-item" key={index}>
            <img src={slide.imageUrl} alt={slide.title || 'Hero'} />
            <div className="hero-admin-fields">
              <input value={slide.imageUrl || ''} onChange={(e) => updateSlide(index, 'imageUrl', e.target.value)} placeholder="高清图片 URL" />
              <input value={slide.eyebrow || ''} onChange={(e) => updateSlide(index, 'eyebrow', e.target.value)} placeholder="角标" />
              <input value={slide.title || ''} onChange={(e) => updateSlide(index, 'title', e.target.value)} placeholder="标题" />
              <input value={slide.body || ''} onChange={(e) => updateSlide(index, 'body', e.target.value)} placeholder="描述" />
              <input value={slide.actionText || ''} onChange={(e) => updateSlide(index, 'actionText', e.target.value)} placeholder="按钮文字" />
              <input value={slide.actionHref || ''} onChange={(e) => updateSlide(index, 'actionHref', e.target.value)} placeholder="按钮链接，如 /guide" />
              <label className="check-row"><input type="checkbox" checked={slide.enabled !== false} onChange={(e) => updateSlide(index, 'enabled', e.target.checked)} /> 启用</label>
              <button className="secondary" type="button" onClick={() => removeSlide(index)}>删除</button>
            </div>
          </div>
        ))}
      </div>
      <div className="actions">
        <button className="secondary" type="button" onClick={addSlide}>新增轮播</button>
      </div>
      <h3>精选景点</h3>
      <div className="featured-admin-grid">
        {spots.map((spot) => (
          <label className="featured-admin-item" key={spot.id}>
            <input type="checkbox" checked={featuredIds.includes(spot.id)} onChange={() => toggleFeatured(spot.id)} />
            <img src={spot.coverImage} alt={spot.name} />
            <span><strong>{spot.name}</strong><small>{spot.type} · {spot.rating} 分</small></span>
          </label>
        ))}
      </div>
      <button type="button" onClick={saveHomeContent}>保存首页配置</button>
    </section>
  );
}

function PageHero({ icon: Icon, title, body }) {
  return (
    <section className="page-hero">
      <Icon size={34} />
      <div>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </section>
  );
}

function PanelTitle({ icon: Icon, title, meta }) {
  return (
    <div className="panel-title">
      <span><Icon size={20} /> {title}</span>
      {meta && <small>{meta}</small>}
    </div>
  );
}

function Metric({ value, label }) {
  return <div className="metric"><strong>{value}</strong><span>{label}</span></div>;
}

function InfoGrid({ items }) {
  return <div className="info-grid">{items.map(([label, value]) => <div key={label}><strong>{label}</strong><span>{value || '--'}</span></div>)}</div>;
}

function ListPanel({ title, icon: Icon, items, empty }) {
  return (
    <section className="panel">
      <PanelTitle icon={Icon} title={title} />
      <div className="list">
        {items.length ? items.map((item, index) => <div className="list-item" key={`${item.title}-${index}`}><strong>{item.title}</strong><p>{item.body}</p></div>) : <div className="empty-state compact">{empty}</div>}
      </div>
    </section>
  );
}

function App() {
  const path = usePath();
  const [route, setRoute] = useState(() => readStorageJson(routeKey, []));
  const [account, setAccount] = useState({ admin: {}, user: {} });
  function saveRoute(next) {
    setRoute(next);
    writeStorageJson(routeKey, next);
  }
  function addRoute(spot) {
    if (route.some((item) => item.id === spot.id)) return;
    if (route.length >= 5) return alert('最多选择 5 个景点。');
    saveRoute([...route, { id: spot.id, name: spot.name, lat: Number(spot.latitude), lng: Number(spot.longitude) }]);
  }
  function removeRoute(id) {
    saveRoute(route.filter((item) => item.id !== id));
  }
  async function refreshAccount() {
    const admin = await api('/api/admin/auth/status').catch(() => ({ loggedIn: false }));
    const user = admin.loggedIn ? { loggedIn: false } : await api('/api/auth/status').catch(() => ({ loggedIn: false }));
    setAccount({ admin, user });
  }
  useEffect(() => { refreshAccount(); }, []);

  const props = { route, addRoute, removeRoute, clearRoute: () => saveRoute([]) };
  let page = <Home addRoute={addRoute} />;
  if (path === '/guide') page = <GuideLanding />;
  if (path === '/guide/nearby') page = <Guide {...props} />;
  if (path === '/route') page = <RoutePage {...props} />;
  if (path === '/me') page = <Profile />;
  if (path === '/submit-spot') page = <SubmitSpot />;
  if (path === '/login') page = <Login refreshAccount={refreshAccount} />;
  if (path === '/admin') page = <Admin />;
  const detailMatch = path.match(/^\/spots\/(\d+)$/);
  if (detailMatch) page = <SpotDetail id={detailMatch[1]} addRoute={addRoute} />;

  return (
    <>
      <Header account={account} refreshAccount={refreshAccount} />
      {page}
      <footer className="footer">
        <span>旅图云 · 智慧文旅综合服务平台</span>
        <button className="icon-button ghost" onClick={async () => {
          await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
          await api('/api/admin/auth/logout', { method: 'POST' }).catch(() => {});
          refreshAccount();
        }} title="退出登录"><LogOut size={16} /></button>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
