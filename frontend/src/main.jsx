import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Car,
  Compass,
  Headphones,
  Heart,
  House,
  Image,
  Lightbulb,
  LogIn,
  LogOut,
  Map,
  MapPin,
  MessageCircle,
  Moon,
  Navigation,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Trash2,
  UserRound,
  Users,
  Video,
  X
} from 'lucide-react';
import './styles.css';

const userId = 1;
const routeKey = 'travelCloudChosenRoute';
const themeKey = 'travelCloudTheme';
const nearbyLocationKey = 'travelCloudNearbyLocation';
const sessionLocatedKey = 'travelCloudSessionLocated';
const defaultLocation = { lat: 28.77, lng: 104.64, label: '默认中心' };
const blockedPresetLocations = [
  { lat: 28.77, lng: 104.64, label: '' },
  { lat: 31.2304, lng: 121.4737, label: '' }
];
const daylightContrastStyleId = 'daylight-contrast-guard';
const daylightContrastCss = `
html[data-theme="day"] body,
body[data-theme="day"] {
  color: #172033 !important;
}
html[data-theme="day"] .site-header,
body[data-theme="day"] .site-header {
  background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(246,250,255,.9)) !important;
}
html[data-theme="day"] .portal-nav,
html[data-theme="day"] .portal-nav a,
body[data-theme="day"] .portal-nav,
body[data-theme="day"] .portal-nav a {
  color: #263a59 !important;
}
html[data-theme="day"] .portal-nav a.active,
html[data-theme="day"] .portal-nav a:hover,
body[data-theme="day"] .portal-nav a.active,
body[data-theme="day"] .portal-nav a:hover {
  color: #0f172a !important;
}
html[data-theme="day"] .container :where(.panel,.card,.feature-entry,.product-story,.story-grid article,.trip-card,.metric,.list-item,.comment-section,.weather-day,.weather-advice,.info-grid div,.toolbar,.location-strip,.selected-item,.choice,.segment,.empty-state,.message,.review-composer,.comment-item.reply,.square-command-bar,.square-post,.media-uploader,.detail-like,.cultural-shop),
body[data-theme="day"] .container :where(.panel,.card,.feature-entry,.product-story,.story-grid article,.trip-card,.metric,.list-item,.comment-section,.weather-day,.weather-advice,.info-grid div,.toolbar,.location-strip,.selected-item,.choice,.segment,.empty-state,.message,.review-composer,.comment-item.reply,.square-command-bar,.square-post,.media-uploader,.detail-like,.cultural-shop) {
  color: #172033 !important;
  background: rgba(255,255,255,.92) !important;
  border-color: rgba(31,60,96,.18) !important;
}
html[data-theme="day"] .container :where(h1,h2,h3,h4,strong,label,.panel-title,.panel-title span,.card h2,.choice strong,.selected-item strong,.metric strong,.list-item strong,.toolbar label),
body[data-theme="day"] .container :where(h1,h2,h3,h4,strong,label,.panel-title,.panel-title span,.card h2,.choice strong,.selected-item strong,.metric strong,.list-item strong,.toolbar label) {
  color: #0f172a !important;
}
html[data-theme="day"] .container :where(p,small,.muted,.card .muted,.choice small,.metric span,.list-item p,.panel-title small),
body[data-theme="day"] .container :where(p,small,.muted,.card .muted,.choice small,.metric span,.list-item p,.panel-title small) {
  color: #526579 !important;
}
html[data-theme="day"] .container :where(button.secondary,.secondary,.icon-button.ghost,button.ghost),
body[data-theme="day"] .container :where(button.secondary,.secondary,.icon-button.ghost,button.ghost) {
  color: #17365f !important;
  background: rgba(255,255,255,.9) !important;
  border-color: rgba(31,60,96,.22) !important;
}
html[data-theme="day"] .detail-hero,
html[data-theme="day"] .detail-hero *,
html[data-theme="day"] .page-hero,
html[data-theme="day"] .page-hero *,
html[data-theme="day"] .hero-caption,
html[data-theme="day"] .hero-caption *,
html[data-theme="day"] .weather-core,
html[data-theme="day"] .weather-core *,
body[data-theme="day"] .detail-hero,
body[data-theme="day"] .detail-hero *,
body[data-theme="day"] .page-hero,
body[data-theme="day"] .page-hero *,
body[data-theme="day"] .hero-caption,
body[data-theme="day"] .hero-caption *,
body[data-theme="day"] .weather-core,
body[data-theme="day"] .weather-core * {
  color: #fffaf0 !important;
}
html[data-theme="day"] .weather-core .weather-tag,
body[data-theme="day"] .weather-core .weather-tag {
  color: #17365f !important;
  background: rgba(255,255,255,.92) !important;
}
html[data-theme="day"] .cultural-shop :where(.panel-title,.panel-title span,h2,h3,.cultural-product strong),
body[data-theme="day"] .cultural-shop :where(.panel-title,.panel-title span,h2,h3,.cultural-product strong) {
  color: #0f172a !important;
}
html[data-theme="day"] .cultural-shop :where(.muted,.cultural-product small,.cultural-product p),
body[data-theme="day"] .cultural-shop :where(.muted,.cultural-product small,.cultural-product p) {
  color: #526579 !important;
}
html[data-theme="day"] .cultural-product em,
body[data-theme="day"] .cultural-product em {
  color: #b45309 !important;
}
html[data-theme="day"] .signature-stage,
body[data-theme="day"] .signature-stage {
  color: #0f172a !important;
  background: rgba(255,255,255,.92) !important;
  border-color: rgba(35,63,103,.18) !important;
}
html[data-theme="day"] .signature-copy h2,
body[data-theme="day"] .signature-copy h2 {
  color: #0f172a !important;
}
html[data-theme="day"] .signature-copy p,
body[data-theme="day"] .signature-copy p {
  color: #526579 !important;
}
html[data-theme="day"] .constellation-board,
body[data-theme="day"] .constellation-board {
  background: rgba(241,247,255,.82) !important;
  border-color: rgba(35,63,103,.16) !important;
}
html[data-theme="day"] .constellation-point,
html[data-theme="day"] .constellation-point strong,
body[data-theme="day"] .constellation-point,
body[data-theme="day"] .constellation-point strong {
  color: #17365f !important;
}
html[data-theme="day"] .constellation-point strong,
body[data-theme="day"] .constellation-point strong {
  background: rgba(255,255,255,.82) !important;
  border-color: rgba(35,63,103,.18) !important;
}
html[data-theme="day"] .guide-command-stats span,
body[data-theme="day"] .guide-command-stats span {
  color: #526579 !important;
  background: rgba(235,243,255,.86) !important;
  border-color: rgba(35,63,103,.18) !important;
}
html[data-theme="day"] .guide-command-stats strong,
body[data-theme="day"] .guide-command-stats strong {
  color: #0f172a !important;
}
html[data-theme="day"] .locate-ui-header,
html[data-theme="day"] .explore-range-panel,
html[data-theme="day"] .guide-locate-text,
html[data-theme="day"] .locate-status-bar,
body[data-theme="day"] .locate-ui-header,
body[data-theme="day"] .explore-range-panel,
body[data-theme="day"] .guide-locate-text,
body[data-theme="day"] .locate-status-bar {
  color: #0f172a !important;
  background: rgba(255,255,255,.88) !important;
  border-color: rgba(35,63,103,.2) !important;
}
html[data-theme="day"] .locate-ui-header span,
html[data-theme="day"] .locate-status-bar span,
html[data-theme="day"] .explore-range-panel span,
body[data-theme="day"] .locate-ui-header span,
body[data-theme="day"] .locate-status-bar span,
body[data-theme="day"] .explore-range-panel span {
  color: #2563eb !important;
}
html[data-theme="day"] .locate-ui-header strong,
html[data-theme="day"] .locate-status-bar strong,
html[data-theme="day"] .explore-range-panel strong,
body[data-theme="day"] .locate-ui-header strong,
body[data-theme="day"] .locate-status-bar strong,
body[data-theme="day"] .explore-range-panel strong {
  color: #0f172a !important;
}
html[data-theme="day"] .badge-showcase,
body[data-theme="day"] .badge-showcase {
  color: #0f172a !important;
  background: rgba(255,255,255,.9) !important;
}
html[data-theme="day"] .footprint-badge-card,
body[data-theme="day"] .footprint-badge-card {
  color: #0f172a !important;
  background: rgba(246,250,255,.92) !important;
  border-color: rgba(35,63,103,.18) !important;
}
html[data-theme="day"] .badge-copy strong,
body[data-theme="day"] .badge-copy strong {
  color: #0f172a !important;
}
html[data-theme="day"] .badge-copy p,
body[data-theme="day"] .badge-copy p {
  color: #526579 !important;
}
html[data-theme="day"] .badge-copy span,
body[data-theme="day"] .badge-copy span {
  color: #17365f !important;
  background: rgba(219,234,254,.92) !important;
}
html[data-theme="day"] .footprint-badge-card.unlocked .badge-copy span,
body[data-theme="day"] .footprint-badge-card.unlocked .badge-copy span {
  color: #7c2d12 !important;
  background: #fde68a !important;
}
`;
const squareCategories = ['全部', '景点影像', '旅游拼团', '旅游心得', '注意事项', '提问求助'];
const squarePostTypes = [
  ['NOTE', '图文笔记', '像小红书一样展示图片、标签和旅行灵感'],
  ['DISCUSSION', '讨论帖', '像贴吧一样开帖交流，评论按楼层展开'],
  ['QUESTION', '问答帖', '像知乎一样提出问题，沉淀高质量回答']
];
const footprintBadgeCatalog = [
  { key: 'first', title: '初遇', subtitle: '完成第 1 个景点打卡', required: 1, image: '/app/badges/badge-first-step.png' },
  { key: 'explorer', title: '初探', subtitle: '累计打卡 3 个景点', required: 3, image: '/app/badges/badge-explorer.png' },
  { key: 'ranger', title: '行侠', subtitle: '累计打卡 10 个景点', required: 10, image: '/app/badges/badge-ranger.png' },
  { key: 'city-walker', title: '城市漫游家', subtitle: '累计打卡 20 个景点', required: 20, image: '/app/badges/badge-city-walker.png' },
  { key: 'grand-tour', title: '远行者', subtitle: '累计打卡 50 个景点', required: 50, image: '/app/badges/badge-grand-tour.png' }
];
const navItems = [
  ['/', '首页', House],
  ['/guide', '景点导览', Compass],
  ['/route', '路线规划', Navigation],
  ['/square', '旅行广场', Users],
  ['/me', '个人中心', UserRound],
  ['/submit-spot', '景点申报', Plus]
];

async function api(url, options = {}) {
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

function readSessionFlag(key) {
  try {
    return window.sessionStorage?.getItem(key) === 'true';
  } catch (error) {
    return false;
  }
}

function writeSessionFlag(key, value) {
  try {
    if (value) {
      window.sessionStorage?.setItem(key, 'true');
    } else {
      window.sessionStorage?.removeItem(key);
    }
  } catch (error) {
    // Session storage can be unavailable; the UI still falls back to explicit location actions.
  }
}

function isBlockedPresetLocation(location) {
  if (!location) return false;
  const label = String(location.label || '');
  return blockedPresetLocations.some((preset) => {
    const samePoint = Math.abs(Number(location.lat) - preset.lat) < 0.0002 && Math.abs(Number(location.lng) - preset.lng) < 0.0002;
    return samePoint || (preset.label && label.includes(preset.label));
  });
}

function cx(...names) {
  return names.filter(Boolean).join(' ');
}

function ensureDaylightContrastStyle() {
  if (document.getElementById(daylightContrastStyleId)) return;
  const style = document.createElement('style');
  style.id = daylightContrastStyleId;
  style.textContent = daylightContrastCss;
  document.head.appendChild(style);
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

function Link({ href, children, className, ...props }) {
  const browserHref = normalizeAppHref(href);
  return (
    <a
      className={className}
      href={browserHref}
      {...props}
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

function Header({ account, refreshAccount, path, theme, setTheme }) {
  const isAdmin = account.admin?.loggedIn;
  const isUser = account.user?.loggedIn;
  const label = isAdmin ? `管理员 ${account.admin.username || 'admin'}` : isUser ? `游客 ${account.user.username || 'demo'}` : '游客模式';
  const hint = isAdmin ? '运营后台已登录' : isUser ? '足迹与预约已同步' : '免登录浏览景点';
  const actionHref = isAdmin ? '/admin' : isUser ? '/me' : '/login';
  const isActive = (href) => href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <div className="brand-row">
        <Link href="/" className="brand">
          <span className="brand-mark">星</span>
          <span>
            <strong>星涌</strong>
            <small>Star Surge Map</small>
          </span>
        </Link>
        <div className="header-right">
          <p>让风景、路线、服务和故事在一张图上相遇。</p>
          <div className="theme-switch" role="group" aria-label="切换主题">
            <button className={theme === 'night' ? 'active' : ''} type="button" onClick={() => setTheme('night')} title="星夜黑">
              <Moon size={15} /> 星夜黑
            </button>
            <button className={theme === 'day' ? 'active' : ''} type="button" onClick={() => setTheme('day')} title="日光白">
              <Sun size={15} /> 日光白
            </button>
          </div>
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
        {navItems.map(([href, text, Icon]) => (
          <Link key={href} href={href} className={isActive(href) ? 'active' : ''} aria-current={isActive(href) ? 'page' : undefined}>
            <Icon size={16} />
            {text}
          </Link>
        ))}
      </nav>
    </header>
  );
}

const defaultHeroSlides = [
  { imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=95', eyebrow: '山水漫游', title: '星涌', body: '把景点发现、路线规划、预约票务、足迹打卡与智能导览收进一张清晰的旅行地图。', actionText: '进入导览', actionHref: '/guide' },
  { imageUrl: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?auto=format&fit=crop&w=2400&q=95', eyebrow: '湖光远山', title: '附近风景，即刻成行', body: '定位当前位置，筛出周边景点，提前看天气、拥挤、设施与真实评论。', actionText: '发现附近', actionHref: '/guide' },
  { imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2400&q=95', eyebrow: '轻松出行', title: '从收藏到路线，一步成行', body: '选择 2-5 个景点，生成合理游览顺序，并查看前往首站的交通方案。', actionText: '规划路线', actionHref: '/route' }
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
      <div className="hero-starwash" aria-hidden="true">
        {Array.from({ length: 32 }).map((_, index) => (
          <span
            key={index}
            style={{
              '--x': `${(index * 29) % 100}%`,
              '--y': `${(index * 47) % 100}%`,
              '--delay': `${(index % 9) * -0.28}s`
            }}
          />
        ))}
      </div>
      {heroSlides.map((slide, index) => (
        <div key={`${slide.title}-${index}`} className={cx('hero-slide', active === index && 'active')} style={{ backgroundImage: `url(${slide.imageUrl})` }}>
          <div className="hero-caption">
            <span>{slide.eyebrow}</span>
            <h1>{slide.title}</h1>
            <p>{slide.body}</p>
            <div className="hero-actions">
              <Link className="primary-link" href={slide.actionHref || '/guide'}>{slide.actionText || '进入导览'}</Link>
              <Link className="secondary hero-secondary" href="/route"><Navigation size={16} /> 规划路线</Link>
            </div>
          </div>
        </div>
      ))}
      <div className="hero-orbit-map" aria-hidden="true">
        <span className="orbit-ring ring-a" />
        <span className="orbit-ring ring-b" />
        <span className="orbit-node node-a" />
        <span className="orbit-node node-b" />
        <span className="orbit-node node-c" />
        <span className="orbit-line line-a" />
        <span className="orbit-line line-b" />
        <strong>星图导航</strong>
      </div>
      <div className="hero-quick-panel" aria-label="星涌能力概览">
        <div><strong>AI</strong><span>把灵感变成路线</span></div>
        <div><strong>实时</strong><span>天气、拥挤、设施同屏判断</span></div>
        <div><strong>星图</strong><span>发现、收藏、打卡形成旅行宇宙</span></div>
      </div>
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
      <div className="card-media">
        <img src={spot.coverImage} alt={spot.name} />
        <span className="rating-badge"><Star size={14} fill="currentColor" /> {spot.rating}</span>
      </div>
      <div className="card-body">
        <div className="pill-row">
          <span className="pill gold">{spot.type}</span>
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
        <section className="signature-stage" aria-label="星涌核心亮点">
          <div className="signature-copy">
            <span className="section-kicker">核心竞争力</span>
            <h2>不是景点列表，而是一张会行动的旅行星图</h2>
            <p>把附近发现、路线排序、天气拥挤、预约票务、足迹打卡串成同一条体验链，让用户从“想去哪”直接走到“怎么去”。</p>
          </div>
          <div className="constellation-board" aria-hidden="true">
            <span className="constellation-line c-line-a" />
            <span className="constellation-line c-line-b" />
            <span className="constellation-line c-line-c" />
            {['发现', '判断', '规划', '抵达', '沉淀'].map((label, index) => (
              <span className={`constellation-point point-${index + 1}`} key={label}>
                <i />
                <strong>{label}</strong>
              </span>
            ))}
          </div>
        </section>
        <section className="feature-grid">
          {[
            ['/guide', Compass, '景点导览', '按位置、评分和类型快速找到适合游玩的景点。'],
            ['/route', Navigation, '路线规划', '选择多个景点，生成合理顺序和分段路程。'],
            ['/square', Users, '旅行广场', '发布影像、拼团、心得和注意事项，与游客交流。'],
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
        <section className="product-story" aria-label="星涌产品能力">
          <div>
            <span className="section-kicker">从灵感到抵达</span>
            <h2>一个面向真实出行的文旅工作台</h2>
          </div>
          <div className="story-grid">
            <article><strong>01</strong><span>发现</span><p>从精选景点和附近雷达开始，快速确认值得去的地方。</p></article>
            <article><strong>02</strong><span>判断</span><p>把门票、天气、拥挤、设施、评论放在同一屏判断。</p></article>
            <article><strong>03</strong><span>成行</span><p>加入路线、智能排序、打开导航，把计划变成行动。</p></article>
          </div>
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
      {href && <Link className="more-link" href={href}>查看更多</Link>}
    </div>
  );
}

function Loading() {
  return (
    <div className="skeleton-grid" aria-label="正在加载">
      {Array.from({ length: 3 }).map((_, index) => <div className="skeleton-card" key={index} />)}
    </div>
  );
}

function useNearbyLocation() {
  return useMemo(() => {
    if (!readSessionFlag(sessionLocatedKey)) return null;
    const saved = readStorageJson(nearbyLocationKey, null);
    const location = saved ? readLocationState(nearbyLocationKey, { lat: 0, lng: 0, label: '当前位置' }) : null;
    return isBlockedPresetLocation(location) ? null : location;
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
        accuracy: position.coords.accuracy,
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

function formatDistanceKm(distanceKm) {
  const value = Number(distanceKm);
  if (!Number.isFinite(value) || value === 99999) return '距离计算中';
  return `${new Intl.NumberFormat('zh-CN', {
    maximumFractionDigits: value >= 100 ? 0 : 1
  }).format(value)} km`;
}

function formatTicketPrice(price) {
  const value = Number(price || 0);
  if (!Number.isFinite(value) || value <= 0) return '免费';
  return `¥${new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value)}`;
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
      marker.setLabel(new BMap.Label(item.name || item.label || `位置 ${index + 1}`, { offset: new BMap.Size(18, -10) }));
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
  const [location, setLocation] = useState(null);
  const [allNearbySignals, setAllNearbySignals] = useState([]);
  const [exploreRadius, setExploreRadius] = useState(20);
  const [loading, setLoading] = useState(false);
  const [readyToEnter, setReadyToEnter] = useState(false);
  const [scanBurst, setScanBurst] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [mapScale, setMapScale] = useState(1);
  const panDragRef = useRef(null);
  const suppressLocateClickRef = useRef(false);
  const suppressSignalClickRef = useRef(false);

  useEffect(() => {
    if (!readyToEnter || !location) return;
    let alive = true;
    fetchNearbySpots(location)
      .then((data) => {
        if (!alive) return;
        const list = Array.isArray(data)
          ? data
              .slice()
              .sort((a, b) => Number(a.distanceKm ?? 99999) - Number(b.distanceKm ?? 99999))
          : [];
        setAllNearbySignals(list);
      })
      .catch(() => {
        if (alive) setAllNearbySignals([]);
      });
    return () => {
      alive = false;
    };
  }, [readyToEnter, location]);

  function handleLocate() {
    if (suppressLocateClickRef.current) {
      suppressLocateClickRef.current = false;
      return;
    }
    setLoading(true);
    setScanBurst(true);
    setReadyToEnter(false);
    setAllNearbySignals([]);
    setPanOffset({ x: 0, y: 0 });
    setMapScale(1);
    locateByBrowser(
      (nextLocation) => {
        const normalized = { ...nextLocation, label: nextLocation.label || '当前位置' };
        setLocation(normalized);
        saveLocationState(nearbyLocationKey, normalized);
        writeSessionFlag(sessionLocatedKey, true);
        setReadyToEnter(true);
        setShowSuccessToast(true);
        window.setTimeout(() => setShowSuccessToast(false), 1800);
      },
      () => {}
    );
    window.setTimeout(() => setLoading(false), 1200);
    window.setTimeout(() => setScanBurst(false), 1800);
  }
  const hasLocated = readyToEnter && Boolean(location);

  const starPoints = useMemo(() => {
    let seed = 928371;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    return Array.from({ length: 560 }, (_, index) => {
      const cluster = index % 19 === 0;
      const anchorX = random() * 100;
      const anchorY = random() * 100;
      return {
        x: cluster ? anchorX + (random() - 0.5) * 1.8 : random() * 100,
        y: cluster ? anchorY + (random() - 0.5) * 1.8 : random() * 100,
        size: index % 53 === 0 ? 2.7 : index % 17 === 0 ? 1.8 : 0.7 + random() * 0.9,
        duration: 3 + random() * 4.8,
        delay: -random() * 5,
        warmth: random()
      };
    });
  }, []);

  const nearbySignals = useMemo(() => {
    return allNearbySignals
      .filter((spot) => Number(spot.distanceKm ?? 99999) <= exploreRadius)
      .slice(0, 36);
  }, [allNearbySignals, exploreRadius]);

  useEffect(() => {
    document.body.classList.add('guide-open');
    writeSessionFlag(sessionLocatedKey, false);
    return () => document.body.classList.remove('guide-open');
  }, []);

  function startPanDrag(event) {
    const fromCenterControl = event.target.closest('.center-locate-button');
    if (!hasLocated || (!fromCenterControl && event.target.closest('button, a, input, textarea, select, .signal-preview'))) return;
    panDragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      x: panOffset.x,
      y: panOffset.y,
      moved: false
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function movePanDrag(event) {
    if (!panDragRef.current) return;
    const nextX = panDragRef.current.x + event.clientX - panDragRef.current.startX;
    const nextY = panDragRef.current.y + event.clientY - panDragRef.current.startY;
    if (Math.hypot(event.clientX - panDragRef.current.startX, event.clientY - panDragRef.current.startY) > 4) {
      panDragRef.current.moved = true;
    }
    setPanOffset({
      x: Math.max(-900, Math.min(900, nextX)),
      y: Math.max(-560, Math.min(560, nextY))
    });
  }

  function endPanDrag(event) {
    if (panDragRef.current?.moved) {
      suppressSignalClickRef.current = true;
      if (event.target.closest('.center-locate-button')) {
        suppressLocateClickRef.current = true;
      }
      window.setTimeout(() => {
        suppressLocateClickRef.current = false;
        suppressSignalClickRef.current = false;
      }, 0);
    }
    panDragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  function zoomStarMap(event) {
    if (!hasLocated || event.target.closest('button, a, input, textarea, select, .signal-preview')) return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - rect.left - rect.width / 2;
    const pointerY = event.clientY - rect.top - rect.height / 2;
    const nextScale = Math.max(0.55, Math.min(3.2, mapScale * (event.deltaY < 0 ? 1.12 : 0.9)));
    const ratio = nextScale / mapScale;
    setMapScale(nextScale);
    setPanOffset((current) => ({
      x: Math.max(-1200, Math.min(1200, pointerX - (pointerX - current.x) * ratio)),
      y: Math.max(-760, Math.min(760, pointerY - (pointerY - current.y) * ratio))
    }));
  }

  const projectedSignals = useMemo(() => {
    const points = nearbySignals.map((spot, index) => {
      const distance = Number(spot.distanceKm ?? 99999);
      const distanceRatio = Number.isFinite(distance) && distance !== 99999
        ? Math.min(1, distance / Math.max(exploreRadius, 1))
        : index / Math.max(nearbySignals.length - 1, 1);
      const radius = Math.min(620, 118 + distanceRatio * 430 + (index % 4) * 18);
      const angle = index * 2.3999632297 + (index % 2 ? 0.28 : -0.18);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.62 + ((index % 3) - 1) * 18;
      const z = 0;
      return {
        ...spot,
        x,
        y,
        z,
        centerPassing: Math.hypot(x * mapScale, y * mapScale) < 96,
        visibleScale: 1,
        visibleOpacity: 1
      };
    });
    if (!points.length) return points;
    const minX = Math.min(...points.map((spot) => spot.x));
    const maxX = Math.max(...points.map((spot) => spot.x));
    const minY = Math.min(...points.map((spot) => spot.y));
    const maxY = Math.max(...points.map((spot) => spot.y));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    return points.map((spot) => {
      const x = spot.x - centerX;
      const y = spot.y - centerY;
      return {
        ...spot,
        x,
        y,
        centerPassing: Math.hypot(x * mapScale, y * mapScale) < 96
      };
    });
  }, [nearbySignals, exploreRadius, mapScale]);

  const centerOccluded = projectedSignals.some((spot) => spot.centerPassing);

  return (
    <main className="guide-landing">
      <section
        className={cx('guide-intro-stage', loading && 'scanning', scanBurst && 'bursting', hasLocated && 'located', centerOccluded && 'center-occluded')}
        onPointerDown={startPanDrag}
        onPointerMove={movePanDrag}
        onPointerUp={endPanDrag}
        onPointerCancel={endPanDrag}
        onWheel={zoomStarMap}
      >
        <div className="locate-ui-header">
          <span>星涌定位</span>
          <strong>附近景点雷达</strong>
        </div>
        <div className="explore-range-panel">
          <span>探索范围</span>
          <strong>{exploreRadius} km 内</strong>
          {location && (
            <small className="explore-location-readout">
              {Number(location.lat).toFixed(4)}, {Number(location.lng).toFixed(4)}
              {location.accuracy ? ` · 精度约 ${Math.round(location.accuracy)}m` : ''}
            </small>
          )}
          <input
            type="range"
            min="5"
            max="3000"
            step="25"
            value={exploreRadius}
            onChange={(event) => setExploreRadius(Number(event.target.value))}
            aria-label="设置探索范围"
          />
        </div>
        <div className="starfield" aria-hidden="true">
          {starPoints.map((star, index) => (
            <span
              key={index}
              className={cx('star', star.warmth > 0.86 && 'warm', star.warmth < 0.16 && 'blue')}
              style={{
                '--x': `${star.x}vw`,
                '--y': `${star.y}vh`,
                '--size': `${star.size}px`,
                '--duration': `${star.duration}s`,
                '--delay': `${star.delay}s`
              }}
            />
          ))}
        </div>
        <div className="guide-3d-scene">
          <div className="cosmic-grid" aria-hidden="true" />
          <div className="warp-tunnel" aria-hidden="true" />
          <div className="scan-core" aria-hidden="true">
            <span className="scan-ring ring-1" />
            <span className="scan-ring ring-2" />
            <span className="scan-ring ring-3" />
            <span className="scan-beam beam-a" />
            <span className="scan-beam beam-b" />
            <span className="scan-sweep" />
          </div>
          <div className="particle-stream stream-a" aria-hidden="true" />
          <div className="particle-stream stream-b" aria-hidden="true" />
          <div className="particle-stream stream-c" aria-hidden="true" />
          <div
            className="flat-star-map-plane"
            style={{
              '--pan-x': `${panOffset.x}px`,
              '--pan-y': `${panOffset.y}px`,
              '--map-scale': mapScale
            }}
          >
            <div className="guide-sphere-shell" aria-hidden="true">
              <span className="sphere-ring ring-x" />
              <span className="sphere-ring ring-y" />
              <span className="sphere-ring ring-z" />
              <span className="sphere-glow" />
            </div>
            <div className="nearby-signal-layer">
              {projectedSignals.map((spot, index) => {
                const isNearest = index === 0;
                const isFarthest = index === projectedSignals.length - 1 && index !== 0;
                return (
                  <div
                    key={spot.id || index}
                    className={cx('nearby-signal', spot.y < -70 && 'preview-below', spot.centerPassing && 'center-passing', isNearest && 'nearest', isFarthest && 'farthest')}
                    role="link"
                    tabIndex={0}
                    aria-label={`查看${spot.name}详情`}
                    onClick={(event) => {
                      if (suppressSignalClickRef.current) {
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                      }
                      navigateTo(`/spots/${spot.id}`);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        navigateTo(`/spots/${spot.id}`);
                      }
                    }}
                    style={{
                      '--x': `${spot.x}px`,
                      '--y': `${spot.y}px`,
                      '--z': `${spot.z}px`,
                      '--depth-scale': spot.visibleScale,
                      '--depth-opacity': spot.visibleOpacity,
                      '--delay': `${index * 140}ms`,
                      '--size': `${5 + (index % 3)}px`,
                      zIndex: spot.centerPassing ? 240 : 80 + index
                    }}
                  >
                    <span className="signal-billboard">
                      <span className="signal-dot" />
                      {(isNearest || isFarthest) && <span className="signal-extreme">{isNearest ? '最近' : '最远'}</span>}
                      <span className="signal-name">{spot.name}</span>
                      <span className="signal-preview">
                        <img src={spot.coverImage} alt={spot.name} />
                        <strong>{spot.name}</strong>
                        <small>{spot.type} · {formatDistanceKm(spot.distanceKm)}</small>
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
            <button className={cx('center-locate-button', loading && 'loading')} type="button" onClick={handleLocate}>
              <span className="center-locate-sphere">
                <MapPin size={18} />
                <span>{loading ? '定位中' : '探索'}</span>
              </span>
            </button>
          </div>
        </div>
        {(loading || !hasLocated) && (
          <div className="guide-locate-text">
            {loading ? '星图正在折叠，锁定你的坐标' : '点击定位，点亮附近景点星图'}
          </div>
        )}
        {showSuccessToast && <div className="locate-success-flash">定位成功，附近景点已点亮</div>}
        {hasLocated && (
          <button className="next-step-fab" type="button" onClick={() => navigateTo('/guide/nearby')}>
            下一步
          </button>
        )}
        <div className={cx('locate-status-bar', hasLocated && 'ready')}>
          <span>{loading ? '坐标校准中' : hasLocated ? '已锁定当前位置' : '等待定位授权'}</span>
          <strong>{loading ? '星涌雷达全频扫描' : hasLocated ? `${nearbySignals.length || 0} 个景点信号` : '未开始扫描'}</strong>
        </div>
      </section>
    </main>
  );
}

function Guide({ route, addRoute, removeRoute, clearRoute, useSavedLocation = false }) {
  const savedNearbyLocation = useNearbyLocation();
  const nearbyLocation = useSavedLocation ? savedNearbyLocation : null;
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('distance');
  const [location, setLocation] = useState(nearbyLocation);
  const [locationMessage, setLocationMessage] = useState('');
  const query = location ? `keyword=${encodeURIComponent(keyword)}&type=${encodeURIComponent(type)}&lat=${location.lat}&lng=${location.lng}&userId=${userId}` : '';
  const { data, loading, error } = useAsync(
    () => (location ? api(`/api/spots?${query}`) : Promise.resolve([])),
    [keyword, type, location?.lat, location?.lng]
  );
  const spots = useMemo(() => {
    const list = [...(data || [])];
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'price') list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    return list;
  }, [data, sort]);

  return (
    <main className="container guide-page">
      <section className="guide-command">
        <div className="guide-command-copy">
          <span className="section-kicker">附近探索星图</span>
          <h1>发现附近，把风景串成路线</h1>
          <p>搜索、筛选、定位和路线收集被放进同一个探索舱，适合边发现边规划。</p>
          <div className="guide-command-stats">
            <span><strong>{spots.length || '--'}</strong> 个信号</span>
            <span><strong>{route.length}</strong> 个已选</span>
            <span><strong>{location?.label || '待定位'}</strong> 当前锚点</span>
          </div>
        </div>
        <div className="guide-search-console">
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
          <div className="location-strip guide-location-strip">
            <MapPin size={18} />
            <div className="guide-location-copy">
              <strong>{location?.label || '尚未定位'}</strong>
              <span>{location ? `${Number(location.lat).toFixed(4)}, ${Number(location.lng).toFixed(4)}` : '点击定位后开始附近探索'}</span>
            </div>
            <button className="secondary guide-locate-action" onClick={() => navigateTo('/guide/locate')}>
              <MapPin size={16} />
              定位
            </button>
          </div>
        </div>
      </section>
      <div className="layout guide-layout">
        <section className="guide-results">
          <div className="guide-results-title">
            <span>DISCOVERY FEED</span>
            <strong>{sort === 'distance' ? '距离优先' : sort === 'rating' ? '评分优先' : '票价优先'}</strong>
          </div>
          {locationMessage && <div className="message">{locationMessage}</div>}
          {error && <div className="message error">{error}</div>}
          {!location ? (
            <div className="empty-state search-empty guide-await-explore">
              <strong className="await-explore-word" aria-label="待探索">待探索</strong>
              <span>尚未定位，暂时无法确定附近景点。</span>
            </div>
          ) : loading ? <Loading /> : spots.length ? (
            <section className="grid guide-card-cloud">{spots.map((spot) => <SpotCard key={spot.id} spot={spot} addRoute={addRoute} />)}</section>
          ) : (
            <div className="empty-state search-empty">
              <strong>没有找到匹配景点</strong>
              <span>换个关键词，或清空筛选查看附近全部景点。</span>
            </div>
          )}
        </section>
        <aside className="panel sticky route-capsule">
          <PanelTitle icon={Map} title="当前位置地图" />
          {location ? <BaiduMap center={location} markers={[location]} className="side-map" /> : <div className="empty-state compact">定位后显示当前位置地图</div>}
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
  if (!route.length) return <div className="empty-state compact">还没有选择景点，先从导览页加入路线。</div>;
  return (
    <div className="selected-list">
      {route.map((item, index) => (
        <div className="selected-item" key={item.id}>
          <span>{index + 1}</span>
          <strong>{item.name}</strong>
          <button className="icon-button ghost" onClick={() => removeRoute(item.id)} title="移除"><Trash2 size={16} /></button>
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
            <button className="secondary" type="button" onClick={locateOrigin}>定位</button>
          </div>
          <SelectedRoute route={route} removeRoute={removeRoute} />
          <div className="actions">
            <button onClick={plan}><Sparkles size={16} /> 智能排序</button>
            <button className="secondary" onClick={clearRoute}><Trash2 size={16} /> 清空</button>
          </div>
          {message && <div className="message">{message}</div>}
          <RouteResult result={result} origin={origin} />
        </section>
        <aside className="panel">
          <PanelTitle icon={Plus} title="可选景点" />
          <div className="choice-list">
            {(spots || []).slice(0, 12).map((spot) => (
              <button className="choice" key={spot.id} onClick={() => addRoute(spot)}>
                <img src={spot.coverImage} alt={spot.name} />
                <span>
                  <strong>{spot.name}</strong>
                  <small>{spot.type} · {spot.rating} 分</small>
                </span>
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
  const [productTick, setProductTick] = useState(0);
  const products = useAsync(() => api(`/api/spots/${id}/products`), [id, productTick]);
  const [reviewTick, setReviewTick] = useState(0);
  const reviews = useAsync(() => api(`/api/community/spots/${id}/reviews`), [id, reviewTick]);
  const [reservation, setReservation] = useState({ visitDate: new Date().toISOString().slice(0, 10), timeSlot: '09:00-12:00', people: 1 });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [orderForm, setOrderForm] = useState({ receiverName: '', receiverPhone: '', shippingAddress: '' });
  const [reviewForm, setReviewForm] = useState({ score: 5, content: '' });
  const [replyTarget, setReplyTarget] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [assistantProducts, setAssistantProducts] = useState([]);
  const [assistantMeta, setAssistantMeta] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState([
    { role: 'assistant', content: '你好，我是星涌导览助手。可以问我当前景点怎么玩、适合什么时候去、有什么文创伴手礼。', meta: '当前景点' }
  ]);
  const [assistantPosition, setAssistantPosition] = useState(null);
  const assistantDragRef = useRef(null);
  const assistantDraggedRef = useRef(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const list = products.data || [];
    if (list.length && !list.some((product) => product.id === selectedProductId)) {
      setSelectedProductId(list[0].id);
    }
  }, [products.data, selectedProductId]);
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
  async function submitCulturalOrder(event) {
    event.preventDefault();
    if (!selectedProductId) {
      setMessage('请先选择一件文创商品。');
      return;
    }
    const session = await api('/api/auth/status').catch(() => ({ loggedIn: false }));
    if (!session.loggedIn) {
      setMessage('请先登录后再购买文创商品。');
      window.setTimeout(() => navigateTo('/login'), 650);
      return;
    }
    const result = await api(`/api/cultural-orders?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify({
        productId: selectedProductId,
        quantity: 1,
        ...orderForm
      })
    });
    setMessage(`文创订单提交成功：${result.orderNo}，合计 ¥${Number(result.totalAmount || 0).toFixed(2)}。`);
    setOrderForm({ receiverName: '', receiverPhone: '', shippingAddress: '' });
    setProductTick((value) => value + 1);
  }
  async function askAssistant(nextQuestion = question) {
    const normalized = nextQuestion.trim();
    if (!normalized || assistantLoading) return;
    setAssistantLoading(true);
    setAssistantMeta('');
    try {
      const data = await api(`/api/spots/${id}/assistant`, {
        method: 'POST',
        timeoutMs: 30000,
        body: JSON.stringify({ question: normalized })
      });
      const meta = data.source === 'aliyun-bailian' ? `百炼 ${data.model || ''}`.trim() : '本地知识库';
      setAnswer(data.answer);
      setAssistantProducts(data.productRecommendations || []);
      setAssistantMeta(meta);
      setAssistantMessages((messages) => [...messages, { role: 'user', content: normalized }, { role: 'assistant', content: data.answer, meta }]);
      setQuestion('');
    } catch (error) {
      const fallbackAnswer = error.message || 'AI 助手暂时不可用，请稍后再试。';
      setAnswer(fallbackAnswer);
      setAssistantProducts([]);
      setAssistantMeta('请求失败');
      setAssistantMessages((messages) => [...messages, { role: 'user', content: normalized }, { role: 'assistant', content: fallbackAnswer, meta: '请求失败' }]);
    } finally {
      setAssistantLoading(false);
    }
  }
  function startAssistantDrag(event) {
    if (event.button !== 0) return;
    const box = event.currentTarget.closest('.floating-ai')?.getBoundingClientRect();
    if (!box) return;
    assistantDragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      x: box.left,
      y: box.top,
      moved: false
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function moveAssistantDrag(event) {
    const drag = assistantDragRef.current;
    if (!drag) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.hypot(deltaX, deltaY) > 4) {
      drag.moved = true;
      assistantDraggedRef.current = true;
    }
    const panelWidth = assistantOpen ? 420 : 88;
    const panelHeight = assistantOpen ? 620 : 88;
    setAssistantPosition({
      x: Math.max(10, Math.min(window.innerWidth - panelWidth - 10, drag.x + deltaX)),
      y: Math.max(10, Math.min(window.innerHeight - Math.min(panelHeight, window.innerHeight - 20) - 10, drag.y + deltaY))
    });
  }
  function endAssistantDrag(event) {
    if (assistantDragRef.current?.moved) {
      window.setTimeout(() => {
        assistantDraggedRef.current = false;
      }, 0);
    }
    assistantDragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
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
            <a className="button-like" target="_blank" href={`https://api.map.baidu.com/marker?location=${spot.latitude},${spot.longitude}&title=${encodeURIComponent(spot.name)}&content=${encodeURIComponent('星涌景点导航')}&output=html`} rel="noreferrer"><Car size={16} /> 百度导航</a>
          </div>
          <div className="gallery detail-gallery">{(spot.gallery || []).slice(0, 4).map((image) => <img key={image} src={image} alt={spot.name} />)}</div>
          <InfoGrid items={[['开放时间', spot.openHours], ['门票', formatTicketPrice(spot.price)], ['最佳季节', spot.bestSeason], ['咨询电话', spot.phone]]} />
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
          <section id="cultural-shop" className="cultural-shop">
            <PanelTitle icon={ShoppingBag} title="景点文创商城" meta="纪念品与伴手礼" />
            <p className="muted">挑选当前景点的文创商品，订单为课程演示支付流程。</p>
            <div className="cultural-product-grid">
              {products.loading ? <div className="empty-state compact">文创商品加载中...</div> : (products.data || []).length ? (products.data || []).map((product) => (
                <label className={cx('cultural-product', selectedProductId === product.id && 'active')} key={product.id}>
                  <input
                    type="radio"
                    name="culturalProduct"
                    checked={selectedProductId === product.id}
                    onChange={() => setSelectedProductId(product.id)}
                  />
                  <img src={product.imageUrl} alt={product.name} />
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.category} · 库存 {product.stock ?? 0}</small>
                    <em>¥{Number(product.price || 0).toFixed(2)}</em>
                    <p>{product.description}</p>
                  </span>
                </label>
              )) : <div className="empty-state compact">暂无文创商品。</div>}
            </div>
            <form className="shop-order-form" onSubmit={submitCulturalOrder}>
              <input value={orderForm.receiverName} onChange={(e) => setOrderForm({ ...orderForm, receiverName: e.target.value })} placeholder="收货人姓名" required />
              <input value={orderForm.receiverPhone} onChange={(e) => setOrderForm({ ...orderForm, receiverPhone: e.target.value })} placeholder="联系电话" required />
              <textarea value={orderForm.shippingAddress} onChange={(e) => setOrderForm({ ...orderForm, shippingAddress: e.target.value })} placeholder="收货地址" required />
              <button><ShoppingBag size={16} /> 提交文创订单</button>
            </form>
          </section>
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
              <div className="weather-icon"><WeatherSymbol icon={currentWeather.icon} /></div>
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
        </aside>
      </div>
      <div className={cx('floating-ai', assistantOpen && 'open', assistantPosition && 'dragged')} style={assistantPosition ? { left: assistantPosition.x, top: assistantPosition.y } : undefined}>
        {assistantOpen && (
          <section className="floating-ai-panel" aria-label="AI 景点助手">
            <div className="floating-ai-head" onPointerDown={startAssistantDrag} onPointerMove={moveAssistantDrag} onPointerUp={endAssistantDrag} onPointerCancel={endAssistantDrag}>
              <span className="ai-avatar-mini"><Sparkles size={18} /></span>
              <div>
                <strong>星涌 AI 导览</strong>
                <small>{spot.name}</small>
              </div>
              <button className="icon-button ghost" type="button" onClick={() => setAssistantOpen(false)} aria-label="关闭 AI 助手">
                <X size={17} />
              </button>
            </div>
            <div className="floating-ai-scroll">
              <div className="floating-ai-messages">
                {assistantMessages.map((item, index) => (
                  <div className={cx('floating-ai-message', item.role)} key={`${item.role}-${index}`}>
                    {item.meta && <small>{item.meta}</small>}
                    <p>{item.content}</p>
                  </div>
                ))}
                {assistantLoading && <div className="floating-ai-message assistant"><small>思考中</small><p>正在结合当前景点资料生成回答...</p></div>}
              </div>
              {!!assistantProducts.length && (
                <div className="ai-product-list compact">
                  <strong>AI 推荐文创</strong>
                  {assistantProducts.map((product) => (
                    <button
                      className="ai-product-button"
                      type="button"
                      key={product.id}
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setAssistantOpen(false);
                        document.getElementById('cultural-shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      <ShoppingBag size={15} /> {product.name} · ¥{Number(product.price || 0).toFixed(2)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="ai-suggestion-row">
              <button className="secondary" type="button" disabled={assistantLoading} onClick={() => askAssistant('这个景点有什么文创伴手礼可以买？')}>文创推荐</button>
              <button className="secondary" type="button" disabled={assistantLoading} onClick={() => askAssistant('第一次来这里应该怎么玩？')}>游玩建议</button>
            </div>
            <div className="ai-input">
              <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={`问 ${spot.name} 的攻略`} disabled={assistantLoading} />
              <button onClick={() => askAssistant()} disabled={assistantLoading}>
                {assistantLoading ? <RefreshCw size={16} /> : <Send size={16} />}
              </button>
            </div>
          </section>
        )}
        <button
          className="floating-ai-person"
          type="button"
          onPointerDown={startAssistantDrag}
          onPointerMove={moveAssistantDrag}
          onPointerUp={endAssistantDrag}
          onPointerCancel={endAssistantDrag}
          onClick={() => {
            if (assistantDraggedRef.current) return;
            setAssistantOpen((value) => !value);
          }}
          aria-label="打开 AI 景点助手"
        >
          <span className="ai-face">
            <span className="ai-eye left" />
            <span className="ai-eye right" />
            <span className="ai-mouth" />
          </span>
          <span className="ai-bubble-dot" />
        </button>
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

function splitMediaUrls(value) {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

function postTypeLabel(type) {
  return squarePostTypes.find(([value]) => value === type)?.[1] || '图文笔记';
}

function normalizeDateInput(value) {
  return value
    .replace(/[^\d/-]/g, '')
    .replace(/\//g, '-')
    .slice(0, 10);
}

function Square() {
  const [category, setCategory] = useState('全部');
  const [tick, setTick] = useState(0);
  const [composerOpen, setComposerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState('');
  const [form, setForm] = useState({
    postType: 'NOTE',
    category: '景点影像',
    title: '',
    content: '',
    locationName: '',
    tripDate: '',
    imageUrls: '',
    videoUrls: '',
    tags: ''
  });
  const postsState = useAsync(() => api(category === '全部' ? '/api/community/square/posts' : `/api/community/square/posts?category=${encodeURIComponent(category)}`), [category, tick]);
  const posts = postsState.data || [];
  useEffect(() => {
    if (!composerOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setComposerOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [composerOpen]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadMedia(files, type) {
    const selected = Array.from(files || []);
    if (!selected.length) return;
    setUploading(type);
    setMessage('');
    try {
      const body = new FormData();
      selected.forEach((file) => body.append('files', file));
      const response = await fetch(`/api/community/square/uploads?type=${type}`, {
        method: 'POST',
        body
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '上传失败' }));
        throw new Error(error.message || '上传失败');
      }
      const data = await response.json();
      const key = type === 'video' ? 'videoUrls' : 'imageUrls';
      setForm((current) => {
        const nextUrls = [...splitMediaUrls(current[key]), ...(data.urls || [])];
        return { ...current, [key]: nextUrls.join('\n') };
      });
      setMessage('媒体上传成功，发布时会自动附加到帖子。');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading('');
    }
  }

  async function submitPost(event) {
    event.preventDefault();
    try {
      const post = await api(`/api/community/square/posts?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          imageUrls: splitMediaUrls(form.imageUrls),
          videoUrls: splitMediaUrls(form.videoUrls),
          tags: splitMediaUrls(form.tags)
        })
      });
      setMessage('发布成功，已同步到旅行广场。');
      setForm({ postType: 'NOTE', category: '景点影像', title: '', content: '', locationName: '', tripDate: '', imageUrls: '', videoUrls: '', tags: '' });
      setComposerOpen(false);
      setTick((value) => value + 1);
      navigateTo(`/square/posts/${post.id}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="container">
      <PageHero icon={Users} title="旅行广场" body="像小红书一样晒图文，像贴吧一样开帖讨论，像知乎一样沉淀旅行问答。" />
      <div className="square-command-bar">
        <div>
          <strong>旅行社区</strong>
          <span>发现旅行灵感、拼团邀约和真实问答。</span>
        </div>
        <button type="button" onClick={() => { setMessage(''); setComposerOpen(true); }}>
          <Plus size={16} /> 发布
        </button>
      </div>
      <div className="square-shell">
        <section className="square-feed">
          <div className="square-tabs">
            {squareCategories.map((item) => (
              <button key={item} type="button" className={item === category ? 'active' : ''} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
          {postsState.loading ? <Loading /> : posts.length ? posts.map((post) => (
            <SquarePostCard
              key={post.id}
              post={post}
              onSelect={() => navigateTo(`/square/posts/${post.id}`)}
            />
          )) : <div className="empty-state compact">这个分类还没有帖子，来发布第一条。</div>}
        </section>
      </div>
      {composerOpen && (
        <div className="square-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setComposerOpen(false);
        }}>
          <section className="panel square-composer square-modal" role="dialog" aria-modal="true" aria-label="发布帖子">
            <div className="square-modal-head">
              <PanelTitle icon={Send} title="发布帖子" meta={postTypeLabel(form.postType)} />
              <button type="button" className="icon-button ghost" onClick={() => setComposerOpen(false)} aria-label="关闭发布窗口">
                <X size={18} />
              </button>
            </div>
            {message && <div className="message">{message}</div>}
            <form className="form square-post-form" onSubmit={submitPost}>
              <div className="square-type-switch wide">
                {squarePostTypes.map(([value, label, desc]) => (
                  <button
                    key={value}
                    type="button"
                    className={form.postType === value ? 'active' : ''}
                    onClick={() => update('postType', value)}
                  >
                    <strong>{label}</strong>
                    <small>{desc}</small>
                  </button>
                ))}
              </div>
              <label>类型
                <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                  {squareCategories.filter((item) => item !== '全部').map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>关联地点
                <input value={form.locationName} onChange={(e) => update('locationName', e.target.value)} placeholder="如 蜀南竹海" />
              </label>
              <label className="wide">标题
                <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="给大家一个清楚的主题" required />
              </label>
              <label className="wide">正文
                <textarea value={form.content} onChange={(e) => update('content', e.target.value)} placeholder="分享路线、费用、避坑点、集合信息或你的旅行故事" required />
              </label>
              <div className="square-meta-fields wide">
                <label>出行日期
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.tripDate}
                    onChange={(e) => update('tripDate', normalizeDateInput(e.target.value))}
                    placeholder="2026-06-01"
                    pattern="\d{4}-\d{2}-\d{2}"
                    aria-label="输入出行日期，格式为 YYYY-MM-DD"
                  />
                </label>
                <label>标签
                  <input value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="亲子游, 避坑, 周末游" />
                </label>
              </div>
              <div className="square-upload-row wide">
                <MediaUploader
                  icon={Image}
                  title="上传图片"
                  hint="支持 JPG、PNG、WebP、GIF，单张不超过 10MB"
                  accept="image/*"
                  uploading={uploading === 'image'}
                  urls={splitMediaUrls(form.imageUrls)}
                  onFiles={(files) => uploadMedia(files, 'image')}
                  onRemove={(url) => update('imageUrls', splitMediaUrls(form.imageUrls).filter((item) => item !== url).join('\n'))}
                />
                <MediaUploader
                  icon={Video}
                  title="上传视频"
                  hint="支持 MP4、WebM、MOV，单个不超过 80MB"
                  accept="video/*"
                  uploading={uploading === 'video'}
                  urls={splitMediaUrls(form.videoUrls)}
                  onFiles={(files) => uploadMedia(files, 'video')}
                  onRemove={(url) => update('videoUrls', splitMediaUrls(form.videoUrls).filter((item) => item !== url).join('\n'))}
                />
              </div>
              <div className="square-modal-actions">
                <button type="button" className="secondary" onClick={() => setComposerOpen(false)}>取消</button>
                <button><Send size={16} /> 发布到广场</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

function SquarePostCard({ post, onSelect }) {
  const time = post.createdAt ? String(post.createdAt).replace('T', ' ').slice(0, 16) : '';
  const cover = post.imageUrls?.[0];
  const isQuestion = post.postType === 'QUESTION';
  const isDiscussion = post.postType === 'DISCUSSION';
  return (
    <article className={cx('square-post', post.postType?.toLowerCase())} onClick={onSelect}>
      {cover && (
        <div className="square-cover">
          <img src={cover} alt={post.title} />
          {!!post.imageUrls?.length && post.imageUrls.length > 1 && <span>{post.imageUrls.length} 图</span>}
        </div>
      )}
      <div className="square-post-top">
        <div className="comment-avatar">{(post.authorName || '旅').slice(0, 1)}</div>
        <div>
          <strong>{post.authorName || `游客${post.userId || ''}`}</strong>
          <span>{time}</span>
        </div>
        <span className="pill gold">{postTypeLabel(post.postType)}</span>
      </div>
      <h2>{isQuestion ? `问：${post.title}` : post.title}</h2>
      <p>{post.content}</p>
      {!!post.tags?.length && <div className="square-tag-row">{post.tags.slice(0, 5).map((tag) => <span key={tag}>#{tag}</span>)}</div>}
      {(post.locationName || post.tripDate) && (
        <div className="square-meta">
          {post.locationName && <span><MapPin size={14} /> {post.locationName}</span>}
          {post.tripDate && <span><CalendarDays size={14} /> {post.tripDate}</span>}
        </div>
      )}
      {!cover && !!post.imageUrls?.length && (
        <div className="square-media-grid">
          {post.imageUrls.slice(0, 4).map((url) => <img key={url} src={url} alt={post.title} />)}
        </div>
      )}
      {!!post.videoUrls?.length && (
        <div className="square-video-list">
          {post.videoUrls.slice(0, 2).map((url) => <video key={url} src={url} controls onClick={(event) => event.stopPropagation()} />)}
        </div>
      )}
      <div className="square-actions">
        <span><Heart size={16} /> {post.likes || 0}</span>
        <span>{isQuestion ? <Lightbulb size={16} /> : <MessageCircle size={16} />} {isQuestion ? `${post.commentCount || 0} 回答` : isDiscussion ? `${post.commentCount || 0} 楼` : post.commentCount || 0}</span>
        {!!post.imageUrls?.length && <span><Image size={15} /> {post.imageUrls.length}</span>}
        {!!post.videoUrls?.length && <span><Video size={15} /> {post.videoUrls.length}</span>}
        <button type="button" className="reply-button" onClick={(event) => { event.stopPropagation(); onSelect(); }}>
          进入帖子
        </button>
      </div>
    </article>
  );
}

function SquarePostDetail({ id }) {
  const [tick, setTick] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [message, setMessage] = useState('');
  const postState = useAsync(() => api(`/api/community/square/posts/${id}`), [id, tick]);
  const commentsState = useAsync(() => api(`/api/community/square/posts/${id}/comments`), [id, tick]);
  const post = postState.data;
  const comments = commentsState.data || [];

  async function likePost() {
    try {
      await api(`/api/community/square/posts/${id}/like?userId=${userId}`, { method: 'POST' });
      setTick((value) => value + 1);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submitComment(event) {
    event.preventDefault();
    try {
      await api(`/api/community/square/posts/${id}/comments?userId=${userId}`, {
        method: 'POST',
        body: JSON.stringify({ content: commentText })
      });
      setCommentText('');
      setTick((value) => value + 1);
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (postState.loading) {
    return <main className="container"><Loading /></main>;
  }

  if (postState.error || !post) {
    return (
      <main className="container narrow">
        <div className="empty-state">帖子不存在或已被删除。</div>
        <button className="secondary" onClick={() => navigateTo('/square')}><ArrowLeft size={16} /> 返回广场</button>
      </main>
    );
  }

  const liked = (post.likedUserIds || []).includes(userId);
  const isQuestion = post.postType === 'QUESTION';
  const isDiscussion = post.postType === 'DISCUSSION';
  const time = post.createdAt ? String(post.createdAt).replace('T', ' ').slice(0, 16) : '';

  return (
    <main className="container square-detail-page">
      <button type="button" className="secondary square-back" onClick={() => navigateTo('/square')}>
        <ArrowLeft size={16} /> 返回广场
      </button>
      <article className="panel square-detail-card">
        <div className="square-detail-top">
          <div className="comment-avatar">{(post.authorName || '旅').slice(0, 1)}</div>
          <div>
            <strong>{post.authorName || `游客${post.userId || ''}`}</strong>
            <span>{time}</span>
          </div>
          <div className="pill-row">
            <span className="pill gold">{post.category}</span>
            <span className="pill">{postTypeLabel(post.postType)}</span>
          </div>
        </div>
        <h1>{isQuestion ? `问：${post.title}` : post.title}</h1>
        <p className="square-detail-content">{post.content}</p>
        {!!post.tags?.length && <div className="square-tag-row">{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>}
        {(post.locationName || post.tripDate) && (
          <div className="square-meta">
            {post.locationName && <span><MapPin size={14} /> {post.locationName}</span>}
            {post.tripDate && <span><CalendarDays size={14} /> {post.tripDate}</span>}
          </div>
        )}
        {!!post.imageUrls?.length && (
          <div className="square-detail-gallery">
            {post.imageUrls.map((url) => <img key={url} src={url} alt={post.title} />)}
          </div>
        )}
        {!!post.videoUrls?.length && (
          <div className="square-video-list">
            {post.videoUrls.map((url) => <video key={url} src={url} controls />)}
          </div>
        )}
        <div className="square-detail-actions">
          <button type="button" className={cx('heart-button detail-like', liked && 'liked')} onClick={likePost}>
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            {liked ? '已点赞' : '点赞'} {post.likes || 0}
          </button>
          <span>{isQuestion ? <Lightbulb size={16} /> : <MessageCircle size={16} />} {isQuestion ? `${post.commentCount || 0} 个回答` : isDiscussion ? `${post.commentCount || 0} 层讨论` : `${post.commentCount || 0} 条评论`}</span>
        </div>
        {message && <div className="message error">{message}</div>}
      </article>
      <section className="panel square-comment-panel">
        <PanelTitle icon={isQuestion ? Lightbulb : MessageCircle} title={isQuestion ? '回答' : '评论'} meta={`${comments.length} 条`} />
        <form className="review-composer square-detail-composer" onSubmit={submitComment}>
          <div className="comment-avatar">我</div>
          <div className="composer-main">
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder={isQuestion ? '写下你的回答' : '写下你的评论'}
              required
            />
            <div className="composer-actions">
              <span className="muted">{isQuestion ? '回答会展示在帖子下方。' : '评论会展示在帖子下方。'}</span>
              <button><Send size={16} /> 发布</button>
            </div>
          </div>
        </form>
        <div className="review-list">
          {comments.length ? comments.map((comment, index) => (
            <div className={cx('comment-item reply', isQuestion && 'answer')} key={comment.id}>
              <div className="comment-avatar small">{(comment.authorName || '游').slice(0, 1)}</div>
              <div className="comment-body">
                <div className="comment-topline">
                  <strong>{comment.authorName || `游客${comment.userId || ''}`}</strong>
                  <span>{isDiscussion ? `${index + 2} 楼 · ` : ''}{comment.createdAt ? String(comment.createdAt).replace('T', ' ').slice(0, 16) : ''}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          )) : <div className="empty-state compact">{isQuestion ? '还没有回答，来写第一条。' : '还没有评论，来写第一条。'}</div>}
        </div>
      </section>
    </main>
  );
}

function MediaUploader({ icon: Icon, title, hint, accept, uploading, urls, onFiles, onRemove }) {
  const inputId = `${title}-${accept}`;
  return (
    <div className="media-uploader">
      <div className="media-uploader-head">
        <span><Icon size={18} /> {title}</span>
        <label htmlFor={inputId}>{uploading ? '上传中...' : '选择文件'}</label>
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple
          disabled={uploading}
          onChange={(event) => {
            onFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>
      <small>{hint}</small>
      {!!urls.length && (
        <div className="media-chip-list">
          {urls.map((url) => (
            <button key={url} type="button" onClick={() => onRemove(url)} title="移除这个文件">
              {url.split('/').pop()}
              <Trash2 size={14} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function summarizeWeather(list) {
  const rows = Array.isArray(list) ? list : [];
  if (!rows.length) {
      return { label: '天气概览', text: '暂无天气数据' };
  }
      const rainCount = rows.filter((item) => (item.condition || '').includes('雨')).length;
      const sunnyCount = rows.filter((item) => (item.condition || '').includes('晴')).length;
      const label = rainCount > 0 ? '有降雨风险' : sunnyCount > 0 ? '晴好可游' : '天气平稳';
  return { label, text: rows[0]?.advice || '' };
}

function WeatherSymbol({ icon }) {
  const shape = {
    rain: 'M8 18h16M11 22h10M13 26h6M12 10c2.2-4.4 9.8-4.4 12 0 4.8.6 7.5 5.8 5.2 10H6.8C4.5 15.8 7.2 10.6 12 10Z',
    cloud: 'M7 21h20c3.5 0 5.7-3.8 3.9-6.8-1-1.8-2.8-2.9-4.7-3-2-4.8-9.4-5.6-12.4-.9-3.8.2-6.8 2.4-6.8 5.8 0 2.8 2.2 4.9 5 4.9Z',
    mist: 'M6 12h22M9 18h18M6 24h22',
    sun: 'M17 6v4M17 24v4M6 17h4M24 17h4M9.2 9.2l2.8 2.8M22 22l2.8 2.8M24.8 9.2 22 12M12 22l-2.8 2.8M17 12a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z',
    now: 'M17 8a9 9 0 1 1 0 18 9 9 0 0 1 0-18ZM17 13a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z'
  }[icon] || 'M17 6v4M17 24v4M6 17h4M24 17h4M9.2 9.2l2.8 2.8M22 22l2.8 2.8M24.8 9.2 22 12M12 22l-2.8 2.8M17 12a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z';
  return (
    <svg viewBox="0 0 34 34" role="img" aria-label="天气图标">
      <path d={shape} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Profile() {
  const footprints = useAsync(() => api(`/api/users/${userId}/footprints`), []);
  const reservations = useAsync(() => api(`/api/reservations/mine?userId=${userId}`), []);
  const culturalOrders = useAsync(() => api(`/api/cultural-orders/mine?userId=${userId}`), []);
  const submissions = useAsync(() => api(`/api/community/submissions/mine?userId=${userId}`), []);
  const checkedTotal = footprints.data?.total || 0;
  return (
    <main className="container">
      <PageHero icon={UserRound} title="个人中心" body="集中查看打卡足迹、预约记录、勋章和申报进度。" />
      <div className="dashboard">
        <Metric value={checkedTotal || '--'} label="已打卡" />
        <Metric value={footprintBadgeCatalog.filter((badge) => checkedTotal >= badge.required).length} label="勋章" />
        <Metric value={reservations.data?.length ?? '--'} label="预约" />
        <Metric value={culturalOrders.data?.length ?? '--'} label="文创订单" />
      </div>
      <FootprintBadges total={checkedTotal} />
      <section className="panel">
        <PanelTitle icon={Map} title="旅游足迹地图" />
        <BaiduMap center={defaultLocation} markers={footprints.data?.checkedInSpots || []} polyline className="footprint-map" />
      </section>
      <div className="layout">
        <ListPanel title="最近解锁" icon={BadgeCheck} items={(footprints.data?.badges || []).map((badge) => ({ title: badge, body: '继续探索解锁更多勋章' }))} empty="暂无勋章" />
        <ListPanel title="我的预约" icon={CalendarDays} items={(reservations.data || []).map((item) => ({ title: `景点 ID ${item.spotId}`, body: `${item.visitDate} ${item.timeSlot} · ${item.status}` }))} empty="暂无预约" />
      </div>
      <ListPanel
        title="我的文创订单"
        icon={ShoppingBag}
        items={(culturalOrders.data || []).map((item) => ({
          title: item.productName,
          body: `${item.orderNo} · ${item.status} · ${item.quantity} 件 · ¥${Number(item.totalAmount || 0).toFixed(2)} · ${item.shippingAddress}`
        }))}
        empty={culturalOrders.error || '暂无文创订单'}
      />
      <ListPanel title="我的申报" icon={Plus} items={(submissions.data || []).map((item) => ({ title: item.name, body: `${item.status} · ${item.address}` }))} empty="暂无申报" />
    </main>
  );
}

function FootprintBadges({ total }) {
  return (
    <section className="panel badge-showcase">
      <PanelTitle icon={BadgeCheck} title="足迹勋章" meta={`${total} / 50 景`} />
      <div className="badge-track">
        {footprintBadgeCatalog.map((badge) => {
          const unlocked = total >= badge.required;
          const progress = Math.min(100, Math.round((total / badge.required) * 100));
          return (
            <article className={cx('footprint-badge-card', unlocked && 'unlocked')} key={badge.key}>
              <div className="badge-medal">
                <img src={badge.image} alt={`${badge.title}徽章`} />
              </div>
              <div className="badge-copy">
                <span>{unlocked ? '已解锁' : `还差 ${badge.required - total} 景`}</span>
                <strong>{badge.title}</strong>
                <p>{badge.subtitle}</p>
                <div className="badge-progress" aria-label={`${badge.title}进度 ${progress}%`}>
                  <i style={{ width: `${progress}%` }} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
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
    <main className="login-stage">
      <section className="login-showcase" aria-label="星涌登录">
        <div className="login-orbit" aria-hidden="true">
          <span className="login-orbit-ring ring-one" />
          <span className="login-orbit-ring ring-two" />
          <span className="login-orbit-dot dot-one" />
          <span className="login-orbit-dot dot-two" />
          <div className="login-brand-core">
            <span className="login-brand-mark">星</span>
            <strong>星涌</strong>
            <small>把风景、路线和故事收进同一张旅行星图</small>
          </div>
        </div>
        <div className="login-feature-strip">
          <span><Compass size={16} /> 附近导览</span>
          <span><Navigation size={16} /> 智能路线</span>
          <span><Sparkles size={16} /> 足迹星图</span>
        </div>
      </section>

      <section className="login-card">
        <div className="login-card-head">
          <span className="login-head-icon">{role === 'admin' ? <ShieldCheck size={24} /> : <UserRound size={24} />}</span>
          <div>
            <h1>欢迎回来</h1>
            <p>{role === 'admin' ? '进入运营后台，管理景点与内容。' : '登录后同步预约、足迹与路线。'}</p>
          </div>
        </div>
        <div className="segmented login-role-switch" role="group" aria-label="选择登录身份">
          <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => setRole('user')}>游客</button>
          <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>管理员</button>
        </div>
        <form className="login-form" onSubmit={submit}>
          <label>
            <span>账号</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={role === 'admin' ? 'admin' : 'demo'} />
          </label>
          <label>
            <span>密码</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={role === 'admin' ? '默认密码 admin123' : '默认密码 demo123'} />
          </label>
          <button className="login-submit"><LogIn size={18} /> 登录</button>
        </form>
        <div className="login-hint">
          <span>{role === 'admin' ? '默认账号 admin' : '默认账号 demo'}</span>
          <Link href="/" className="login-home-link">返回首页</Link>
        </div>
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
  const [theme, setThemeState] = useState(() => readStorageJson(themeKey, 'night'));
  const [account, setAccount] = useState({ admin: {}, user: {} });
  function setTheme(nextTheme) {
    setThemeState(nextTheme);
    writeStorageJson(themeKey, nextTheme);
  }
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
  useEffect(() => {
    document.querySelector('.html-theme-dock')?.remove();
  }, []);
  useEffect(() => { refreshAccount(); }, []);
  useEffect(() => {
    const nextTheme = theme === 'day' ? 'day' : 'night';
    document.documentElement.dataset.theme = nextTheme;
    document.body.dataset.theme = nextTheme;
    ensureDaylightContrastStyle();
  }, [theme]);

  const props = { route, addRoute, removeRoute, clearRoute: () => saveRoute([]) };
  let page = <Home addRoute={addRoute} />;
  if (path === '/guide') page = <Guide {...props} />;
  if (path === '/guide/locate') page = <GuideLanding />;
  if (path === '/guide/nearby') page = <Guide {...props} useSavedLocation />;
  if (path === '/route') page = <RoutePage {...props} />;
  if (path === '/square') page = <Square />;
  const squarePostMatch = path.match(/^\/square\/posts\/(\d+)$/);
  if (squarePostMatch) page = <SquarePostDetail id={squarePostMatch[1]} />;
  if (path === '/me') page = <Profile />;
  if (path === '/submit-spot') page = <SubmitSpot />;
  if (path === '/login') page = <Login refreshAccount={refreshAccount} />;
  if (path === '/admin') page = <Admin />;
  const detailMatch = path.match(/^\/spots\/(\d+)$/);
  if (detailMatch) page = <SpotDetail id={detailMatch[1]} addRoute={addRoute} />;

  return (
    <>
      <Header account={account} refreshAccount={refreshAccount} path={path} theme={theme} setTheme={setTheme} />
      <div className="theme-dock" role="group" aria-label="主题切换">
        <button className={theme === 'night' ? 'active' : ''} type="button" onClick={() => setTheme('night')}>
          <Moon size={16} /> 星夜黑
        </button>
        <button className={theme === 'day' ? 'active' : ''} type="button" onClick={() => setTheme('day')}>
          <Sun size={16} /> 日光白
        </button>
      </div>
      {page}
      <footer className="footer">
        <span>星涌 · 智慧文旅综合服务平台</span>
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
