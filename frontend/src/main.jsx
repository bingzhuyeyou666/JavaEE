import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Car,
  CheckCircle2,
  Compass,
  Copy,
  Download,
  Edit3,
  FileText,
  Headphones,
  Heart,
  House,
  Image,
  ImagePlus,
  Lightbulb,
  LocateFixed,
  ListFilter,
  LogIn,
  LogOut,
  Map,
  MapPin,
  MessageCircle,
  Moon,
  NotebookPen,
  Navigation,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Trash2,
  UploadCloud,
  UserPlus,
  UserRound,
  Users,
  Video,
  Wand2,
  X
} from 'lucide-react';
import './styles/index.css';

const defaultUserId = 1;
const routeKey = 'travelCloudChosenRoute';
const themeKey = 'travelCloudTheme';
const nearbyLocationKey = 'travelCloudNearbyLocation';
const sessionLocatedKey = 'travelCloudSessionLocated';
const squareDraftKey = 'travelCloudSquareDraft';
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
  ['/ai-writer', '图生游记', Wand2],
  ['/me', '个人中心', UserRound],
  ['/submit-spot', '景点申报', Plus]
];

async function api(url, options = {}) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), options.timeoutMs || 12000);
  try {
    const { timeoutMs, ...fetchOptions } = options;
    const isFormData = typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;
    const headers = isFormData
      ? { ...(options.headers || {}) }
      : { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const response = await fetch(url, {
      headers,
      signal: options.signal || controller.signal,
      ...fetchOptions
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '请求失败' }));
      throw new Error(error.message || '请求失败');
    }
    if (response.status === 204) return null;
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
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

function currentUserId() {
  return window.travelCloudCurrentUserId || defaultUserId;
}

function ensureDaylightContrastStyle() {
  if (document.getElementById(daylightContrastStyleId)) return;
  const style = document.createElement('style');
  style.id = daylightContrastStyleId;
  style.textContent = daylightContrastCss;
  document.head.appendChild(style);
}

function normalizeAppHref(href) {
  return window.location.port === '8080' && href.startsWith('/') ? `/app${href === '/' ? '/' : href}` : href;
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
  const label = isAdmin ? `管理员 ${account.admin.username || 'admin'}` : isUser ? (account.user.username || 'demo') : '游客模式';
  const hint = isAdmin ? '运营后台已登录' : isUser ? '足迹与预约已同步' : '免登录浏览景点';
  const actionHref = isAdmin ? '/admin' : isUser ? '/me' : '/login';
  const isActive = (href) => href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <div className="brand-row">
        <Link href="/" className="brand">
          <span className="brand-mark">星</span>
          <span>
            <strong>陌路寻景</strong>
            <small>Molu Xunjing</small>
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
  { imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=95', eyebrow: '山水漫游', title: '陌路寻景', body: '把景点发现、路线规划、预约票务、足迹打卡与智能导览收进一张清晰的旅行地图。', actionText: '进入导览', actionHref: '/guide' },
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
    <article
      className="card spot-click-card"
      role="link"
      tabIndex={0}
      onClick={(event) => {
        if (event.target.closest('a, button, input, select, textarea')) return;
        navigateTo(`/spots/${spot.id}`);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        navigateTo(`/spots/${spot.id}`);
      }}
    >
      <div className="card-media">
        <img src={spot.coverImage} alt={spot.name} />
        <span className="rating-badge"><Star size={14} fill="currentColor" /> {spot.rating}</span>
      </div>
      <div className="card-body">
        <div className="pill-row">
          <span className="pill gold">{spot.type}</span>
          {spot.distanceKm !== undefined && spot.distanceKm !== 99999 && <span className="pill">直线约 {spot.distanceKm} km</span>}
          {spot.checkedIn && <span className="pill"><BadgeCheck size={14} /> 已打卡</span>}
        </div>
        <h2>{spot.name}</h2>
        <p className="muted">{spot.address}</p>
        <div className="actions">
          <Link className="button-like" href={`/spots/${spot.id}`}>查看详情</Link>
          {addRoute && <button className="secondary" onClick={(event) => { event.stopPropagation(); addRoute(spot); }}><Plus size={16} /> 加入路线</button>}
        </div>
      </div>
    </article>
  );
}

function Home({ addRoute }) {
  const { data: slides = [] } = useAsync(() => api('/api/home/hero'), []);
  const { data: featured = [], loading } = useAsync(() => api(`/api/home/featured-spots?lat=${defaultLocation.lat}&lng=${defaultLocation.lng}&userId=${currentUserId()}`), []);
  const featuredSpots = Array.isArray(featured) ? featured : [];
  return (
    <>
      <Hero spots={featuredSpots} slides={slides} />
      <main className="container">
        <section className="signature-stage" aria-label="陌路寻景核心亮点">
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
        <section className="product-story" aria-label="陌路寻景产品能力">
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
    const saved = readStorageJson(nearbyLocationKey, null);
    const location = saved ? readLocationState(nearbyLocationKey, { lat: 0, lng: 0, label: '当前位置' }) : null;
    return isBlockedPresetLocation(location) && location?.source !== 'explore-fallback' ? null : location;
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

function nearestVisibleRadius(spots, currentRadius) {
  const distances = (Array.isArray(spots) ? spots : [])
    .map((spot) => Number(spot.distanceKm))
    .filter((distance) => Number.isFinite(distance) && distance > 0 && distance < 99999)
    .sort((a, b) => a - b);
  if (!distances.length || distances[0] <= currentRadius) return currentRadius;
  return Math.min(1000, Math.max(currentRadius, Math.ceil(distances[0] / 25) * 25));
}

function spreadSignalLabels(points) {
  const placed = [];
  return points.map((spot, index) => {
    const nameLength = String(spot.name || '').length;
    const width = Math.min(220, Math.max(116, 42 + nameLength * 14));
    const height = 30;
    const candidates = [
      { x: 0, y: 0 },
      { x: 0, y: -34 },
      { x: 0, y: 34 },
      { x: 44, y: 0 },
      { x: -44, y: 0 },
      { x: 54, y: -32 },
      { x: -54, y: -32 },
      { x: 54, y: 32 },
      { x: -54, y: 32 },
      { x: 0, y: -68 },
      { x: 0, y: 68 }
    ];
    let selected = candidates[0];
    for (const candidate of candidates) {
      const box = {
        left: spot.x + candidate.x - 12,
        right: spot.x + candidate.x + width,
        top: spot.y + candidate.y - height / 2,
        bottom: spot.y + candidate.y + height / 2
      };
      const overlaps = placed.some((existing) => (
        box.left < existing.right
        && box.right > existing.left
        && box.top < existing.bottom
        && box.bottom > existing.top
      ));
      if (!overlaps || candidate === candidates[candidates.length - 1]) {
        selected = candidate;
        placed.push(box);
        break;
      }
    }
    return {
      ...spot,
      labelX: selected.x,
      labelY: selected.y,
      z: index * 0.01
    };
  });
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
  return api(`/api/spots?keyword=&type=&lat=${location.lat}&lng=${location.lng}&userId=${currentUserId()}`);
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
        setExploreRadius((current) => nearestVisibleRadius(list, current));
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
      (status) => {
        if (!status || (!status.includes('定位失败') && !status.includes('不支持定位'))) return;
        const fallbackLocation = { ...defaultLocation, label: '宜宾市中心', source: 'explore-fallback' };
        setLocation(fallbackLocation);
        saveLocationState(nearbyLocationKey, fallbackLocation);
        writeSessionFlag(sessionLocatedKey, true);
        setReadyToEnter(true);
        setShowSuccessToast(true);
        window.setTimeout(() => setShowSuccessToast(false), 1800);
      }
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
    const twinkleTypes = ['star', 'star twinkle-b', 'star twinkle-c', 'star twinkle-d'];
    return Array.from({ length: 560 }, (_, index) => {
      const cluster = index % 19 === 0;
      const anchorX = random() * 100;
      const anchorY = random() * 100;
      return {
        x: cluster ? anchorX + (random() - 0.5) * 1.8 : random() * 100,
        y: cluster ? anchorY + (random() - 0.5) * 1.8 : random() * 100,
        size: index % 53 === 0 ? 2.7 : index % 17 === 0 ? 1.8 : 0.7 + random() * 0.9,
        duration: 2 + random() * 7,
        delay: -random() * 8,
        warmth: random(),
        twinkleClass: twinkleTypes[Math.floor(random() * twinkleTypes.length)]
      };
    });
  }, []);

  const shootingStars = useMemo(() => {
    let seed = 462819;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    return Array.from({ length: 6 }, () => {
      // 流星起始位置：左上区域
      const x = random() * 65;
      const y = random() * 30;
      // 角度：左上到右下，20° 到 55°
      const angle = 20 + random() * 35;
      // 长度、速度、间隔随机化
      const length = 90 + random() * 150;
      const duration = 0.5 + random() * 1.5;
      const delay = random() * 10;
      return { x, y, length, angle, duration, delay };
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
    if (event.target.closest('.center-locate-button')) return;
    if (!hasLocated || event.target.closest('button, a, input, textarea, select, .signal-preview')) return;
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
      const radius = 150 + Math.sqrt(distanceRatio) * 500;
      const angle = index * 2.3999632297 - Math.PI / 8;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
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
    return spreadSignalLabels(points).map((spot) => ({
      ...spot,
      centerPassing: Math.hypot(spot.x * mapScale, spot.y * mapScale) < 96
    }));
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
          <span>陌路寻景定位</span>
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
            max="1000"
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
              className={cx(star.twinkleClass, star.warmth > 0.86 && 'warm', star.warmth < 0.16 && 'blue')}
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
        <div className="shooting-stars-layer" aria-hidden="true">
          {shootingStars.map((s, i) => (
            <span
              key={`meteor-${i}`}
              className="shooting-star"
              style={{
                '--s-x': `${s.x}%`,
                '--s-y': `${s.y}%`,
                '--s-length': `${s.length}px`,
                '--s-angle': `${s.angle}deg`,
                '--s-duration': `${s.duration}s`,
                '--s-delay': `${s.delay}s`
              }}
            />
          ))}
        </div>
        <div className="guide-3d-scene">
          <div className="cosmic-grid" aria-hidden="true" />
          <div
            className="flat-star-map-plane"
            style={{
              '--pan-x': `${panOffset.x}px`,
              '--pan-y': `${panOffset.y}px`,
              '--map-scale': mapScale
            }}
          >
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
                      '--label-x': `${spot.labelX || 0}px`,
                      '--label-y': `${spot.labelY || 0}px`,
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
          </div>
          <div
            className="guide-sphere-shell"
            aria-hidden="true"
            style={{
              '--pan-x': `${panOffset.x}px`,
              '--pan-y': `${panOffset.y}px`,
              '--map-scale': mapScale
            }}
          >
            <span className="sphere-ring ring-x" />
            <span className="sphere-ring ring-y" />
            <span className="sphere-ring ring-z" />
            <span className="sphere-glow" />
          </div>
        </div>
        {(loading || !hasLocated) && (
          <div className="guide-locate-text">
            {loading ? '正在锁定你的当前位置' : '点击定位，查看附近景点'}
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
          <strong>{loading ? '陌路寻景雷达全频扫描' : hasLocated ? `${nearbySignals.length || 0} 个景点信号` : '未开始扫描'}</strong>
        </div>
      </section>
      <button
        className={cx('center-locate-button', loading && 'loading')}
        type="button"
        style={{
          '--pan-x': `${panOffset.x}px`,
          '--pan-y': `${panOffset.y}px`,
          '--map-scale': mapScale
        }}
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onPointerMove={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleLocate();
        }}
      >
        <span className="center-locate-sphere">
          <MapPin size={18} />
          <span>{loading ? '定位中' : '探索'}</span>
        </span>
      </button>
    </main>
  );
}

function Guide({ route, addRoute, removeRoute, clearRoute, useSavedLocation = false }) {
  const savedNearbyLocation = useNearbyLocation();
  const nearbyLocation = savedNearbyLocation;
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('distance');
  const [location, setLocation] = useState(nearbyLocation);
  const [locationMessage, setLocationMessage] = useState('');
  const query = location ? `keyword=${encodeURIComponent(keyword)}&type=${encodeURIComponent(type)}&lat=${location.lat}&lng=${location.lng}&userId=${currentUserId()}` : '';
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
  function handleGuidePanelWheel(event) {
    const target = event.currentTarget;
    if (target.scrollHeight <= target.clientHeight) return;
    if (!target.classList.contains('route-capsule')) {
      event.stopPropagation();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    target.scrollTop += event.deltaY;
  }

  return (
    <main className="container guide-page">
      <section className="guide-command">
        <div className="guide-command-copy">
          <span className="section-kicker">附近景点导览</span>
          <h1>发现附近，把风景串成路线</h1>
          <p>按距离、评分和类型筛选周边景点，快速查看详情并加入路线。</p>
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
        <section className="guide-results" onWheelCapture={handleGuidePanelWheel}>
          <div className="guide-results-title">
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
        <aside className="panel sticky route-capsule" onWheelCapture={handleGuidePanelWheel}>
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
  const { data: spots = [] } = useAsync(() => api(`/api/spots?lat=${defaultLocation.lat}&lng=${defaultLocation.lng}&userId=${currentUserId()}`), []);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [origin, setOrigin] = useState(defaultLocation);
  const [mode, setMode] = useState('driving');
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
      const data = await api(`/api/routes/plan?userId=${currentUserId()}`, { method: 'POST', body: JSON.stringify({ spotIds: route.map((item) => item.id), mode }) });
      setResult(data);
      setMessage(mode === 'driving' ? '' : '已记录绿色出行积分，可在个人中心查看。');
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
          <div className="route-mode-switch" aria-label="出行方式">
            {[
              ['driving', '驾车', Car],
              ['transit', '公交', Navigation],
              ['cycling', '骑行', Compass],
              ['walking', '步行', MapPin]
            ].map(([value, label, Icon]) => (
              <button key={value} type="button" className={mode === value ? 'active' : ''} onClick={() => setMode(value)}>
                <Icon size={16} /> {label}
              </button>
            ))}
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
    { role: 'assistant', content: '我在。你想问这个景点，还是准备直接出发？', meta: '菲比' }
  ]);
  const [assistantPosition, setAssistantPosition] = useState(null);
  const assistantShellRef = useRef(null);
  const assistantPositionRef = useRef(null);
  const assistantDragRef = useRef(null);
  const assistantDraggedRef = useRef(false);
  const assistantDragClickTimerRef = useRef(null);
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
    const result = await api(`/api/spots/${id}/check-ins?userId=${currentUserId()}&lat=${spot.latitude}&lng=${spot.longitude}`, { method: 'POST' });
    setMessage(`打卡成功，累计 ${result.totalCheckedIn} 个景点。`);
  }
  async function reserveSpot(event) {
    event.preventDefault();
    const result = await api(`/api/reservations?userId=${currentUserId()}`, {
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
    const result = await api(`/api/cultural-orders?userId=${currentUserId()}`, {
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
      const meta = '菲比';
      const reply = buildAssistantReply(data.answer);
      openAssistantMapAction(reply);
      setAnswer(data.answer);
      setAssistantProducts(data.productRecommendations || []);
      setAssistantMeta(meta);
      setAssistantMessages((messages) => [...messages, { role: 'user', content: normalized }, reply]);
      setQuestion('');
    } catch (error) {
      const fallbackAnswer = error.message || '我这边刚刚没连上服务，先别急。你可以稍后再问我一次，或者换个更具体的问题试试。';
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
    const isPetHandle = event.currentTarget.classList?.contains('pet-sprite-button');
    if (!isPetHandle && event.target.closest('input, textarea, select, button, a')) return;
    const shell = assistantShellRef.current;
    const box = shell?.getBoundingClientRect();
    if (!box) return;
    if (assistantDragClickTimerRef.current) {
      window.clearTimeout(assistantDragClickTimerRef.current);
      assistantDragClickTimerRef.current = null;
    }
    assistantDragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      x: box.left,
      y: box.top,
      moved: false
    };
    shell.classList.add('dragged');
    shell.style.right = 'auto';
    shell.style.bottom = 'auto';
    shell.style.left = `${box.left}px`;
    shell.style.top = `${box.top}px`;
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
      const shell = assistantShellRef.current;
      if (shell) {
        shell.classList.add('pet-moving');
        shell.classList.toggle('pet-moving-left', deltaX < -2);
        shell.classList.toggle('pet-moving-right', deltaX >= -2);
      }
    }
    const panelBox = assistantShellRef.current?.querySelector('.pet-panel')?.getBoundingClientRect();
    const minX = assistantOpen && panelBox ? Math.max(10, panelBox.width) : 10;
    const maxX = assistantOpen && panelBox ? Math.min(window.innerWidth - 138, window.innerWidth - 20) : window.innerWidth - 138;
    const minY = assistantOpen && panelBox ? Math.max(10, panelBox.height - 94) : 10;
    const maxY = assistantOpen && panelBox ? Math.min(window.innerHeight - 142, window.innerHeight - 114) : window.innerHeight - 142;
    const nextPosition = {
      x: Math.max(minX, Math.min(maxX, drag.x + deltaX)),
      y: Math.max(minY, Math.min(maxY, drag.y + deltaY))
    };
    assistantPositionRef.current = nextPosition;
    if (assistantShellRef.current) {
      assistantShellRef.current.style.left = `${nextPosition.x}px`;
      assistantShellRef.current.style.top = `${nextPosition.y}px`;
    }
  }
  function endAssistantDrag(event) {
    assistantShellRef.current?.classList.remove('pet-moving', 'pet-moving-left', 'pet-moving-right');
    if (assistantDragRef.current?.moved) {
      if (assistantPositionRef.current) {
        setAssistantPosition(assistantPositionRef.current);
      }
      assistantDragClickTimerRef.current = window.setTimeout(() => {
        assistantDraggedRef.current = false;
        assistantDragClickTimerRef.current = null;
      }, 220);
    } else if (!assistantPosition) {
      const shell = assistantShellRef.current;
      if (shell) {
        shell.classList.remove('dragged');
        shell.style.left = '';
        shell.style.top = '';
        shell.style.right = '';
        shell.style.bottom = '';
      }
    }
    assistantDragRef.current = null;
    assistantPositionRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }
  async function submitReview(event) {
    event.preventDefault();
    await api(`/api/community/reviews?userId=${currentUserId()}`, {
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
    await api(`/api/community/reviews/${reviewId}/like?userId=${currentUserId()}`, { method: 'POST' });
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
            <a className="button-like" target="_blank" href={`https://api.map.baidu.com/marker?location=${spot.latitude},${spot.longitude}&title=${encodeURIComponent(spot.name)}&content=${encodeURIComponent('陌路寻景景点导航')}&output=html`} rel="noreferrer"><Car size={16} /> 百度导航</a>
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
    </main>
  );
}

function TravelPetAssistant({ path }) {
  const detailMatch = path.match(/^\/spots\/(\d+)$/);
  const spotId = detailMatch?.[1] || null;
  const { data: spot } = useAsync(() => (spotId ? api(`/api/spots/${spotId}`) : Promise.resolve(null)), [spotId]);
  const pageNames = {
    '/': '首页',
    '/guide': '景点导览',
    '/guide/locate': '附近定位',
    '/guide/nearby': '附近景点',
    '/route': '路线规划',
    '/square': '旅行广场',
    '/me': '个人中心',
    '/submit-spot': '景点申报',
    '/login': '登录页'
  };
  const contextName = spot?.name || pageNames[path] || '陌路寻景';
  const [question, setQuestion] = useState('');
  const [assistantProducts, setAssistantProducts] = useState([]);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState([
    { role: 'assistant', content: '我在。你直接说想做什么就好。', meta: '菲比' }
  ]);
  const [assistantPosition, setAssistantPosition] = useState(null);
  const assistantShellRef = useRef(null);
  const assistantPositionRef = useRef(null);
  const assistantDragRef = useRef(null);
  const assistantDraggedRef = useRef(false);
  const assistantDragClickTimerRef = useRef(null);
  const petScrollRef = useRef(null);
  const petInputRef = useRef(null);
  const assistantStickToBottomRef = useRef(true);

  useEffect(() => {
    setAssistantProducts([]);
    setQuestion('');
    assistantStickToBottomRef.current = true;
    setAssistantMessages([
      {
        role: 'assistant',
        content: spot ? `我正在看 ${spot.name}。你想了解它，还是准备过去？` : '我在。你直接说想做什么就好。',
        meta: '菲比'
      }
    ]);
  }, [spotId, spot?.name, path]);

  useEffect(() => {
    const scrollBox = petScrollRef.current;
    if (!assistantOpen || !scrollBox || !assistantStickToBottomRef.current) return;
    requestAnimationFrame(() => {
      scrollBox.scrollTop = scrollBox.scrollHeight;
    });
  }, [assistantMessages, assistantLoading, assistantProducts, assistantOpen]);

  function handlePetScroll(event) {
    const scrollBox = event.currentTarget;
    const distanceToBottom = scrollBox.scrollHeight - scrollBox.scrollTop - scrollBox.clientHeight;
    assistantStickToBottomRef.current = distanceToBottom < 56;
  }

  async function askAssistant(nextQuestion = question) {
    const normalized = nextQuestion.trim();
    if (!normalized || assistantLoading) return;
    const savedLocation = readAssistantLocation();
    if (needsAssistantLocation(normalized, assistantMessages) && !savedLocation) {
      requestAssistantLocation(normalized);
      return;
    }
    const payloadQuestion = buildAssistantQuestion(normalized, assistantMessages, savedLocation);
    assistantStickToBottomRef.current = true;
    setAssistantLoading(true);
    try {
      if (spotId) {
        const data = await api(`/api/spots/${spotId}/assistant`, {
          method: 'POST',
          timeoutMs: 30000,
          body: JSON.stringify({ question: payloadQuestion })
        });
        const meta = '菲比';
        const reply = buildAssistantReply(data.answer);
        openAssistantMapAction(reply);
        setAssistantProducts(data.productRecommendations || []);
        setAssistantMessages((messages) => [...messages, { role: 'user', content: normalized }, reply]);
      } else {
        const data = await api('/api/assistant', {
          method: 'POST',
          timeoutMs: 30000,
          body: JSON.stringify({ question: payloadQuestion })
        });
        const meta = '菲比';
        const reply = buildAssistantReply(data.answer);
        openAssistantMapAction(reply);
        setAssistantProducts([]);
        setAssistantMessages((messages) => [...messages, { role: 'user', content: normalized }, reply]);
      }
      setQuestion('');
    } catch (error) {
      const fallbackAnswer = error.message || '我这边刚刚没连上服务。你先把位置或目的地留给我，稍后我再帮你继续查。';
      setAssistantProducts([]);
      setAssistantMessages((messages) => [...messages, { role: 'user', content: normalized }, { role: 'assistant', content: fallbackAnswer, meta: '请求失败' }]);
    } finally {
      setAssistantLoading(false);
      window.setTimeout(() => petInputRef.current?.focus(), 0);
    }
  }

  function requestAssistantLocation(originalQuestion) {
    assistantStickToBottomRef.current = true;
    setAssistantLoading(true);
    setAssistantMessages((messages) => [
      ...messages,
      { role: 'user', content: originalQuestion },
      { role: 'assistant', content: '我需要先知道你的位置，才好查附近的内容。请允许浏览器定位，我拿到位置后继续帮你查。', meta: '菲比' }
    ]);
    locateByBrowser(
      (nextLocation) => {
        const normalizedLocation = { ...nextLocation, label: nextLocation.label || '当前位置' };
        saveLocationState(nearbyLocationKey, normalizedLocation);
        writeSessionFlag(sessionLocatedKey, true);
        const payloadQuestion = buildAssistantQuestion(originalQuestion, assistantMessages, normalizedLocation);
        continueAssistantAfterLocation(originalQuestion, payloadQuestion);
      },
      (status) => {
        if (status.includes('正在获取')) return;
        if (status.includes('成功')) return;
        setAssistantLoading(false);
        setAssistantMessages((messages) => [...messages, { role: 'assistant', content: status || '定位没有成功。你也可以直接告诉我城市或具体地点。', meta: '菲比' }]);
        window.setTimeout(() => petInputRef.current?.focus(), 0);
      }
    );
  }

  async function continueAssistantAfterLocation(originalQuestion, payloadQuestion) {
    try {
      const data = await api('/api/assistant', {
        method: 'POST',
        timeoutMs: 30000,
        body: JSON.stringify({ question: payloadQuestion })
      });
      setAssistantProducts([]);
      const reply = buildAssistantReply(data.answer);
      openAssistantMapAction(reply);
      setAssistantMessages((messages) => [...messages, reply]);
      setQuestion('');
    } catch (error) {
      const fallbackAnswer = error.message || '定位拿到了，但查询服务刚刚没接上。你可以再发一次，我继续帮你查。';
      setAssistantMessages((messages) => [...messages, { role: 'assistant', content: fallbackAnswer, meta: '请求失败' }]);
    } finally {
      setAssistantLoading(false);
      window.setTimeout(() => petInputRef.current?.focus(), 0);
    }
  }

  function startAssistantDrag(event) {
    if (event.button !== 0) return;
    const isPetHandle = event.currentTarget.classList?.contains('pet-sprite-button');
    if (!isPetHandle && event.target.closest('input, textarea, select, button, a')) return;
    const shell = assistantShellRef.current;
    const box = shell?.getBoundingClientRect();
    if (!box) return;
    if (assistantDragClickTimerRef.current) {
      window.clearTimeout(assistantDragClickTimerRef.current);
      assistantDragClickTimerRef.current = null;
    }
    assistantDragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      x: box.left,
      y: box.top,
      moved: false
    };
    shell.classList.add('dragged');
    shell.style.right = 'auto';
    shell.style.bottom = 'auto';
    shell.style.left = `${box.left}px`;
    shell.style.top = `${box.top}px`;
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
      const shell = assistantShellRef.current;
      if (shell) {
        const stepX = event.clientX - drag.lastX;
        shell.classList.add('pet-moving');
        if (Math.abs(stepX) > 1) {
          shell.classList.toggle('pet-moving-left', stepX < 0);
          shell.classList.toggle('pet-moving-right', stepX > 0);
        }
      }
    }
    drag.lastX = event.clientX;
    const shellBox = assistantShellRef.current?.getBoundingClientRect();
    const shellWidth = shellBox?.width || 128;
    const shellHeight = shellBox?.height || 132;
    const minX = 10;
    const maxX = window.innerWidth - shellWidth - 10;
    const minY = 10;
    const maxY = window.innerHeight - shellHeight - 10;
    const nextPosition = {
      x: Math.max(minX, Math.min(maxX, drag.x + deltaX)),
      y: Math.max(minY, Math.min(maxY, drag.y + deltaY))
    };
    assistantPositionRef.current = nextPosition;
    if (assistantShellRef.current) {
      assistantShellRef.current.style.left = `${nextPosition.x}px`;
      assistantShellRef.current.style.top = `${nextPosition.y}px`;
    }
  }

  function endAssistantDrag(event) {
    assistantShellRef.current?.classList.remove('pet-moving', 'pet-moving-left', 'pet-moving-right');
    if (assistantDragRef.current?.moved) {
      if (assistantPositionRef.current) {
        setAssistantPosition(assistantPositionRef.current);
      }
      assistantDragClickTimerRef.current = window.setTimeout(() => {
        assistantDraggedRef.current = false;
        assistantDragClickTimerRef.current = null;
      }, 220);
    } else if (!assistantPosition) {
      const shell = assistantShellRef.current;
      if (shell) {
        shell.classList.remove('dragged');
        shell.style.left = '';
        shell.style.top = '';
        shell.style.right = '';
        shell.style.bottom = '';
      }
    }
    assistantDragRef.current = null;
    assistantPositionRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  return (
    <div ref={assistantShellRef} className={cx('floating-ai travel-pet', assistantOpen && 'open', assistantLoading && 'thinking', assistantPosition && 'dragged')} style={assistantPosition ? { left: assistantPosition.x, top: assistantPosition.y } : undefined}>
      {assistantOpen && (
        <section className="pet-panel" aria-label="菲比导览助手" onWheel={(event) => event.stopPropagation()}>
          <div className="pet-panel-head" onPointerDown={startAssistantDrag} onPointerMove={moveAssistantDrag} onPointerUp={endAssistantDrag} onPointerCancel={endAssistantDrag}>
            <span className="pet-panel-mark" aria-hidden="true"><Sparkles size={17} /></span>
            <div>
              <strong>菲比导览助手</strong>
              <small>{assistantLoading ? '我想一下' : contextName}</small>
            </div>
            <button className="icon-button ghost pet-close" type="button" onClick={() => setAssistantOpen(false)} aria-label="收起菲比">
              <X size={17} />
            </button>
          </div>
          <div ref={petScrollRef} className="pet-scroll" onScroll={handlePetScroll}>
            <div className="pet-messages">
              {assistantMessages.map((item, index) => (
                <div className={cx('pet-message', item.role)} key={`${item.role}-${index}`}>
                  {item.meta && <small>{item.meta}</small>}
                  <p>{item.content}</p>
                  {item.actionUrl && (
                    <a className="pet-message-action" href={item.actionUrl} target="_blank" rel="noreferrer">
                      {item.actionLabel || '打开百度地图'}
                    </a>
                  )}
                </div>
              ))}
              {assistantLoading && <div className="pet-message assistant"><small>菲比在看</small><p>我正在结合你刚才说的内容整理回答...</p></div>}
            </div>
            {!!assistantProducts.length && (
              <div className="pet-product-list compact">
                <strong>菲比推荐文创</strong>
                {assistantProducts.map((product) => (
                  <button
                    className="pet-product-button"
                    type="button"
                    key={product.id}
                    onClick={() => {
                      setAssistantOpen(false);
                      if (spotId) document.getElementById('cultural-shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <ShoppingBag size={15} /> {product.name} · ¥{Number(product.price || 0).toFixed(2)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form className="pet-input" onSubmit={(event) => { event.preventDefault(); askAssistant(); }}>
            <input ref={petInputRef} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={`直接问菲比`} disabled={assistantLoading} />
            <button type="submit" disabled={assistantLoading || !question.trim()} aria-label="发送问题">
              {assistantLoading ? <RefreshCw size={16} /> : <Send size={16} />}
            </button>
          </form>
        </section>
      )}
      <button
        className="pet-sprite-button"
        type="button"
        onPointerDown={startAssistantDrag}
        onPointerMove={moveAssistantDrag}
        onPointerUp={endAssistantDrag}
        onPointerCancel={endAssistantDrag}
        onClick={() => {
          if (assistantDraggedRef.current) return;
          setAssistantOpen((value) => !value);
        }}
        aria-label={assistantOpen ? '收起菲比导览助手' : '打开菲比导览助手'}
      >
        <span className="pet-sprite-orient" aria-hidden="true">
          <span className="pet-sprite" />
        </span>
        <span className="pet-nameplate">{assistantLoading ? '想想' : '菲比'}</span>
      </button>
    </div>
  );
}

function buildAssistantReply(answer) {
  const raw = String(answer || '');
  const actionUrl = extractBaiduMapUrl(raw);
  const content = actionUrl ? cleanMapUrlFromAnswer(raw, actionUrl) : raw;
  return {
    role: 'assistant',
    content: content || '我已经帮你整理好了。',
    meta: '菲比',
    actionUrl,
    actionLabel: actionUrl ? '打开百度地图' : ''
  };
}

function extractBaiduMapUrl(text) {
  const match = String(text || '').match(/https:\/\/api\.map\.baidu\.com\/[^\s，。；;）)]+/);
  return match ? match[0] : '';
}

function cleanMapUrlFromAnswer(text, url) {
  return String(text || '')
    .split('\n')
    .filter((line) => !line.includes(url))
    .join('\n')
    .replace(/你可以打开百度导航[:：]?\s*/g, '百度地图我已经帮你打开了，下面也留了一个备用入口。')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function openAssistantMapAction(reply) {
  if (!reply?.actionUrl) return;
  window.setTimeout(() => {
    const opened = window.open(reply.actionUrl, '_blank', 'noopener,noreferrer');
    if (!opened) {
      window.location.href = reply.actionUrl;
    }
  }, 80);
}

function buildAssistantQuestion(question, messages, location) {
  const recentMessages = (messages || [])
    .slice(-6)
    .map((item) => `${item.role === 'user' ? '用户' : '菲比'}：${item.content}`)
    .join('\n');
  const locationText = location
    ? `当前定位：${location.lat},${location.lng}（${location.label || '当前位置'}）\n`
    : '';
  if (!recentMessages) return `${locationText}用户当前输入：${question}`;
  return `${locationText}最近对话：\n${recentMessages}\n\n用户当前输入：${question}`;
}

function readAssistantLocation() {
  if (!readSessionFlag(sessionLocatedKey)) return null;
  const saved = readStorageJson(nearbyLocationKey, null);
  const location = saved ? readLocationState(nearbyLocationKey, { lat: 0, lng: 0, label: '当前位置' }) : null;
  return isBlockedPresetLocation(location) || location?.source === 'explore-fallback' ? null : location;
}

function needsAssistantLocation(question, messages = []) {
  const normalized = question.trim();
  if (/^(你好|您好|嗨|hi|hello|在吗|菲比)$/i.test(normalized)) return false;
  const recentUserText = messages
    .filter((item) => item.role === 'user')
    .slice(-3)
    .map((item) => item.content)
    .join(' ');
  const needsCurrentLocation = /附近|周边|当前|我旁边|离我|身边|好吃|餐厅|吃的|景点|停车|加油站|厕所|卫生间|路线|怎么走|想去|带我去|导航到|怎么去/.test(normalized);
  const followsLocationIntent = /^(可以|可以啊|好|好的|行|走|导航|规划|川菜|火锅|小吃|餐厅)$/.test(normalized)
    && /附近|周边|好吃|餐厅|吃的|景点|路线|怎么走|规划/.test(recentUserText);
  return (needsCurrentLocation || followsLocationIntent)
    && !/天气/.test(question);
}

function CommentItem({ review, replies, onLike, onReply }) {
  const liked = (review.likedUserIds || []).includes(currentUserId());
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
              const replyLiked = (reply.likedUserIds || []).includes(currentUserId());
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

function Square({ account }) {
  const squareRootRef = useRef(null);
  const feedRef = useRef(null);
  const composerRef = useRef(null);
  const [category, setCategory] = useState('全部');
  const [tick, setTick] = useState(0);
  const [shopTick, setShopTick] = useState(0);
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
  const friendlyState = useAsync(() => api(`/api/friendly-points/profile?userId=${currentUserId()}`), [shopTick]);
  const postsState = useAsync(() => api(category === '全部' ? '/api/community/square/posts' : `/api/community/square/posts?category=${encodeURIComponent(category)}`), [category, tick]);
  const posts = postsState.data || [];
  const postsWithMedia = posts.filter((post) => post.imageUrls?.length || post.videoUrls?.length).length;
  const discussionCount = posts.filter((post) => post.postType === 'DISCUSSION' || post.postType === 'QUESTION').length;

  useEffect(() => {
    const draft = readStorageJson(squareDraftKey, null);
    if (!draft) return;
    if (!account?.user?.loggedIn) return;
    setForm((current) => ({
      ...current,
      postType: draft.postType || 'NOTE',
      category: draft.category || '景点影像',
      title: draft.title || '',
      content: draft.content || '',
      locationName: draft.locationName || '',
      tripDate: draft.tripDate || '',
      imageUrls: Array.isArray(draft.imageUrls) ? draft.imageUrls.join('\n') : '',
      videoUrls: '',
      tags: Array.isArray(draft.tags) ? draft.tags.join(', ') : (draft.tags || '')
    }));
    setComposerOpen(true);
    setMessage('已从图生游记带入标题、正文和图片，确认后即可发布。');
    try {
      window.localStorage?.removeItem(squareDraftKey);
    } catch (error) {
      // Ignore unavailable storage.
    }
  }, [account?.user?.loggedIn]);

  useEffect(() => {
    if (!squareRootRef.current) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo(
        ['.square-hero', '.square-command-bar', '.square-tabs'],
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power2.out', stagger: 0.06, clearProps: 'transform,opacity,visibility' }
      );
    }, squareRootRef.current);
    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!feedRef.current || postsState.loading) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo(
        '.square-post',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.34, ease: 'power2.out', stagger: 0.045, clearProps: 'transform,opacity,visibility' }
      );
    }, feedRef.current);
    return () => context.revert();
  }, [postsState.loading, category, tick]);

  useEffect(() => {
    if (!composerOpen || !composerRef.current) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo('.square-modal-backdrop', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: 'power1.out' });
      gsap.fromTo(
        '.square-modal',
        { autoAlpha: 0, y: 24, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }
      );
    }, composerRef.current);
    return () => context.revert();
  }, [composerOpen]);

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
      const post = await api(`/api/community/square/posts?userId=${currentUserId()}`, {
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

  function openComposer() {
    if (!account?.user?.loggedIn) {
      navigateTo('/login');
      return;
    }
    setMessage('');
    setComposerOpen(true);
  }


  async function redeemReward(rewardId) {
    try {
      await api(`/api/friendly-points/redeem?userId=${currentUserId()}&rewardId=${encodeURIComponent(rewardId)}`, { method: 'POST' });
      setMessage('兑换成功，已写入你的友好积分记录。');
      setShopTick((value) => value + 1);
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <main className="container square-page" ref={squareRootRef}>
      <section className="square-hero">
        <div className="square-hero-icon"><Users size={30} /></div>
        <div className="square-hero-copy">
          <span className="section-kicker">TRAVEL SQUARE</span>
          <h1>旅行广场</h1>
          <p>晒图文、开帖讨论、沉淀旅行问答，让真实经验更容易被看见。</p>
        </div>
        <div className="square-hero-metrics">
          <span><strong>{posts.length || '--'}</strong> 条内容</span>
          <span><strong>{postsWithMedia || '--'}</strong> 有媒体</span>
          <span><strong>{discussionCount || '--'}</strong> 讨论问答</span>
        </div>
      </section>
      <div className="square-command-bar">
        <div>
          <strong>旅行社区</strong>
          <span>{category === '全部' ? '正在浏览全部内容' : `正在浏览「${category}」`}</span>
        </div>
        <button type="button" onClick={openComposer}>
          <Plus size={16} /> 发布
        </button>
      </div>
      <div className="square-shell">
        <section className="square-feed" ref={feedRef}>
          <div className="square-tabs">
            {squareCategories.map((item) => (
              <button key={item} type="button" className={item === category ? 'active' : ''} onClick={() => setCategory(item)}>
                {item}
              </button>
            ))}
          </div>
          {postsState.loading ? <Loading /> : posts.length ? (
            <div className="square-post-grid">
              {posts.map((post) => (
                <SquarePostCard
                  key={post.id}
                  post={post}
                  onSelect={() => navigateTo(`/square/posts/${post.id}`)}
                />
              ))}
            </div>
          ) : <div className="empty-state compact">这个分类还没有帖子，来发布第一条。</div>}
        </section>
        <FriendlyPointShop data={friendlyState.data} onRedeem={redeemReward} />
      </div>
      {composerOpen && (
        <div className="square-modal-backdrop" ref={composerRef} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setComposerOpen(false);
        }}>
          <section
            className="panel square-composer square-modal"
            role="dialog"
            aria-modal="true"
            aria-label="发布帖子"
            style={{ width: 'min(860px, calc(100vw - 56px))', maxHeight: 'min(760px, calc(100vh - 64px))' }}
          >
            <div className="square-modal-head">
              <div>
                <span className="section-kicker">NEW POST</span>
                <h2>发布帖子</h2>
                <p>{postTypeLabel(form.postType)} · 把旅行现场整理成一条清楚的内容。</p>
              </div>
              <button type="button" className="icon-button ghost" onClick={() => setComposerOpen(false)} aria-label="关闭发布窗口">
                <X size={18} />
              </button>
            </div>
            {message && <div className="message">{message}</div>}
            <form className="form square-post-form" onSubmit={submitPost} style={{ gap: 14, padding: '16px 20px 20px' }}>
              <div className="square-type-switch wide" style={{ gap: 8 }}>
                {squarePostTypes.map(([value, label, desc]) => (
                  <button
                    key={value}
                    type="button"
                    className={form.postType === value ? 'active' : ''}
                    onClick={() => update('postType', value)}
                    style={{ minHeight: 54, padding: '10px 12px' }}
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
                <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="给大家一个清楚的主题" required style={{ minHeight: 42 }} />
              </label>
              <label className="wide">正文
                <textarea value={form.content} onChange={(e) => update('content', e.target.value)} placeholder="分享路线、费用、避坑点、集合信息或你的旅行故事" required style={{ minHeight: 96 }} />
              </label>
              <div className="square-meta-fields wide">
                <DatePickerField
                  label="出行日期"
                  value={form.tripDate}
                  onChange={(value) => update('tripDate', value)}
                />
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

const writerStyles = [
  { key: 'real', label: '真实游记', icon: NotebookPen },
  { key: 'xiaohongshu', label: '小红书风格', icon: Sparkles },
  { key: 'moments', label: '朋友圈随笔', icon: MessageCircle },
  { key: 'poetic', label: '诗意文艺', icon: Heart }
];

const writerLengthOptions = [
  { key: 'short', label: '短文案' },
  { key: 'standard', label: '标准' },
  { key: 'long', label: '长文攻略' }
];

function inferImageMood(files, imageInsight) {
  const names = files.map((item) => item.file?.name || '').join(' ').toLowerCase();
  const hints = [];
  if (/竹|bamboo|forest|woods|tree|山|mountain/.test(names)) hints.push('自然风光', '清凉避暑', '步道漫游');
  if (/海|lake|river|water|boat|beach|瀑|溪/.test(names)) hints.push('亲水风景', '慢节奏', '拍照友好');
  if (/food|餐|饭|茶|coffee|cafe|shop/.test(names)) hints.push('美食休憩', '小店探访', '轻松补给');
  if (/night|灯|city|street|town|古镇/.test(names)) hints.push('城市漫步', '夜景氛围', '街巷探索');
  if (/kid|child|family|亲子|family/.test(names)) hints.push('亲子友好', '轻松不赶路', '安全舒适');
  if (imageInsight?.tags?.length) hints.push(...imageInsight.tags);
  return [...new Set(hints)].slice(0, 5);
}

function readImageBitmapSource(file) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
}

async function analyzeImageContent(files) {
  const selectedFiles = files.slice(0, 4).map((item) => item.file).filter(Boolean);
  if (!selectedFiles.length) {
    return {
      scenery: '画面里保留了旅行现场的风景细节，适合作为一篇图文游记的开头。',
      tags: []
    };
  }
  const totals = { green: 0, blue: 0, warm: 0, bright: 0, dark: 0, neutral: 0, saturationTotal: 0, count: 0, wide: 0, tall: 0 };
  for (const file of selectedFiles) {
    const image = await readImageBitmapSource(file);
    const canvas = document.createElement('canvas');
    const width = 96;
    const height = Math.max(1, Math.round((image.naturalHeight || image.height) / (image.naturalWidth || image.width) * width));
    canvas.width = width;
    canvas.height = Math.min(96, height);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let green = 0;
    let blue = 0;
    let warm = 0;
    let bright = 0;
    let dark = 0;
    let neutral = 0;
    let saturationTotal = 0;
    const count = pixels.length / 4;
    for (let index = 0; index < pixels.length; index += 4) {
      const r = pixels[index];
      const g = pixels[index + 1];
      const b = pixels[index + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const light = (r + g + b) / 3;
      const saturation = max === 0 ? 0 : (max - min) / max;
      saturationTotal += saturation;
      if (g > r * 1.08 && g > b * 1.04) green += 1;
      if (b > r * 1.08 && b > g * 0.92) blue += 1;
      if (r > b * 1.12 && g > b * 0.82) warm += 1;
      if (light > 188) bright += 1;
      if (light < 78) dark += 1;
      if (saturation < 0.13) neutral += 1;
    }
    totals.green += green;
    totals.blue += blue;
    totals.warm += warm;
    totals.bright += bright;
    totals.dark += dark;
    totals.neutral += neutral;
    totals.saturationTotal += saturationTotal;
    totals.count += count;
    if ((image.naturalWidth || image.width) >= (image.naturalHeight || image.height)) totals.wide += 1;
    else totals.tall += 1;
    URL.revokeObjectURL(image.src);
  }

  const ratio = (value) => value / Math.max(1, totals.count);
  const greenRatio = ratio(totals.green);
  const blueRatio = ratio(totals.blue);
  const warmRatio = ratio(totals.warm);
  const brightRatio = ratio(totals.bright);
  const darkRatio = ratio(totals.dark);
  const neutralRatio = ratio(totals.neutral);
  const avgSaturation = totals.saturationTotal / Math.max(1, totals.count);
  const orientation = totals.tall > totals.wide ? '竖向' : '横向';
  const tags = [];
  const sceneParts = [];

  if (greenRatio > 0.26) {
    sceneParts.push('绿色占比很高，能感受到树木、草地或竹林一类的自然景观');
    tags.push('自然风光', '清凉感');
  }
  if (blueRatio > 0.22) {
    sceneParts.push('蓝色区域比较明显，像是天空、水面或远处开阔的背景');
    tags.push('开阔风景', '亲水感');
  }
  if (warmRatio > 0.3) {
    sceneParts.push('整体色调偏暖，有阳光、土地、建筑或傍晚光线带来的温度');
    tags.push('暖色氛围');
  }
  if (neutralRatio > 0.48 && avgSaturation < 0.22) {
    sceneParts.push('色彩比较克制，整体更偏安静、干净和留白');
    tags.push('安静感', '简洁构图');
  }
  if (brightRatio > 0.34) {
    sceneParts.push('光线明亮，第一眼会有比较轻松通透的观感');
    tags.push('明亮通透');
  }
  if (darkRatio > 0.3) {
    sceneParts.push('暗部较多，氛围更沉静，适合写成有故事感的旅行记录');
    tags.push('沉静氛围');
  }
  if (!sceneParts.length) {
    sceneParts.push('有清晰的旅行现场感，主体和环境都适合展开成一段风景描述');
  }

  return {
    scenery: `${selectedFiles.length}张${orientation}为主的旅行图像呈现出${sceneParts.join('；')}。`,
    tags: [...new Set(tags)].slice(0, 5)
  };
}

function buildTravelCopy({ form, files, imageInsight }) {
  const place = form.locationName.trim() || '这次旅行地';
  const dateText = form.tripDate ? `${form.tripDate} 出行` : '近期出行';
  const mood = inferImageMood(files, imageInsight);
  const moodText = mood.length ? mood.join('、') : '风景、路线、现场体验';
  const companion = normalizeTravelCompanion(form.companions);
  const noteText = form.notes.trim();
  const lengthLine = form.length === 'short' ? '短文案' : form.length === 'long' ? '长文案' : '标准文案';
  const style = writerStyles.find((item) => item.key === form.style) || writerStyles[0];
  const detailNote = noteText ? `\n${noteText}` : '';
  const titleMap = {
    real: `${place}旅行记录：慢慢走，反而更好看`,
    xiaohongshu: `${place}也太会拿捏氛围感了吧✨`,
    moments: `${place}，今晚很喜欢`,
    poetic: `${place}，光影缓缓落下`
  };
  const contentMap = {
    real: `这次去了${place}，${companion.firstSentence}${dateText}这一天没有排得太满，反而更容易把沿路的细节都看进去。${moodText}不是一下子扑过来的那种热闹，而是越走越耐看，走着走着就会想慢一点，再多停一会儿。${detailNote}

真正留下印象的，不只是某一个打卡点，而是路上的空气、光线的变化，还有身边人偶尔说的一两句话。碰到顺眼的巷子、安静的转角或者视野突然打开的地方，我都会下意识放慢脚步。这样的旅行不需要很用力，节奏舒服，回头想起来也更真实。`,
    xiaohongshu: `谁懂啊，${place}真的比想象中还要好逛${pickEmoji(['🌙', '✨', '📸'])}

不是那种一眼就结束的商业化景点，反而是越走越有感觉。${moodText}叠在一起，整个人会自然放松下来${pickEmoji(['👀', '🫶', '🌆'])}${detailNote}

${pickEmoji(['📍', '🏮', '🍃'])} 建议傍晚或者刚亮灯的时候来，氛围会特别满
${pickEmoji(['📷', '✨', '🌃'])} 随手一停都很适合记录，照片和现场都很有感觉
${pickEmoji(['🙌', '💛', '🚶'])} 如果你也喜欢慢慢逛、边走边看的城市夜晚，这里真的会让人想再来一次

#城市漫步 #旅行碎片 #夜景拍照 #烟火气 #老街氛围`,
    moments: `今晚去了${place}。

本来只是随便走走，结果越走越舍不得出来。${moodText}混在一起，整个人一下子安静了很多。${detailNote}

我其实没拍太多，更多时候是在路上慢慢看。那种不需要赶时间、不需要刻意找角度的感觉，反而最舒服。大概这就是会让我记很久的一次小出行。`,
    poetic: `${place}像一页被夜色慢慢翻开的纸。

${moodText}在光影里一层层铺开，近处有温度，远处有留白，风从其间穿过，连时间都像被放慢了。${detailNote}

行走其间，并不急着抵达什么，只是任由视线、脚步与心绪一起缓下来。于是那些旧与新、明与暗、喧声与静意，便在同一刻轻轻叠合，留下很长的余味。`
  };
  const content = applyWriterLength(contentMap[form.style] || contentMap.real, form.length, form.style);
  const tags = [...new Set([place, style.label, ...mood, '旅行记录', '图生游记'].filter(Boolean))].slice(0, 8);
  return {
    title: titleMap[form.style] || titleMap.real,
    content,
    summary: `${lengthLine} · ${style.label} · ${files.length || 0} 张图片 · ${moodText}`,
    tags: tags.join(', '),
    category: '景点影像',
    postType: 'NOTE'
  };
}

function applyWriterLength(content, length, style) {
  const paragraphs = String(content || '').split(/\n{2,}/).filter(Boolean);
  if (length === 'short') {
    if (style === 'xiaohongshu') return paragraphs.slice(0, 4).join('\n\n');
    return paragraphs.slice(0, 2).join('\n\n');
  }
  if (length === 'long') {
    if (style === 'xiaohongshu') {
      return `${content}\n\n${pickEmoji(['📌', '📝', '💡'])} 最适合留半天慢慢逛，不用赶，氛围会自己出来。`;
    }
    return `${content}\n\n回头再想，这趟行程最值的地方，还是那些没有刻意安排却刚好遇见的瞬间。`;
  }
  return content;
}

function pickEmoji(list) {
  const items = Array.isArray(list) ? list.filter(Boolean) : [];
  if (!items.length) return '';
  return items[Math.floor(Math.random() * items.length)];
}

function normalizeTravelCompanion(value) {
  const text = String(value || '').trim();
  const normalized = text.replace(/\s/g, '');
  if (!normalized) {
    return {
      firstSentence: '我觉得这里很适合慢慢走。',
      observerSentence: '这里适合慢慢游览'
    };
  }
  if (/^(自己|我自己|一个人|独自|单人|独行)$/.test(normalized)) {
    return {
      firstSentence: '我觉得这里很适合一个人慢慢走。',
      observerSentence: '这里适合独自出行'
    };
  }
  return {
    firstSentence: `我觉得这里很适合和${text}一起走。`,
    observerSentence: `这里适合${text}出行`
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function TravelWritingStudio({ account }) {
  const [form, setForm] = useState({
    style: 'real',
    length: 'standard',
    locationName: '',
    tripDate: '',
    companions: '',
    notes: ''
  });
  const [files, setFiles] = useState([]);
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('');
  const studioRef = useRef(null);
  const filesRef = useRef([]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => filesRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
  }, []);

  useEffect(() => {
    if (!studioRef.current) return undefined;
    const context = gsap.context(() => {
      gsap.fromTo(
        ['.writer-hero', '.writer-control-panel', '.writer-result-panel'],
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power2.out', stagger: 0.07, clearProps: 'transform,opacity,visibility' }
      );
    }, studioRef.current);
    return () => context.revert();
  }, []);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function pickFiles(fileList) {
    const selected = Array.from(fileList || []).filter((file) => file.type.startsWith('image/')).slice(0, 12);
    if (!selected.length) return;
    setFiles((current) => {
      const next = [
        ...current,
        ...selected.map((file) => ({
          id: `${file.name}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
          file,
          preview: URL.createObjectURL(file)
        }))
      ].slice(0, 12);
      return next;
    });
    setMessage('');
  }

  function removeFile(id) {
    setFiles((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return current.filter((item) => item.id !== id);
    });
  }

  async function generateDraft() {
    if (!files.length) {
      setMessage('请先上传本地旅行图片，再生成文案。');
      return;
    }
    setBusy('generate');
    setMessage('正在识别旅行现场并生成可发布文案...');
    try {
      const modelDraft = await requestModelTravelCopy();
      setDraft(normalizeGeneratedDraft(modelDraft));
      setMessage('已根据上传图片和你的设置生成可发布文案。');
    } catch (modelError) {
      try {
        const imageInsight = await analyzeImageContent(files);
        const nextDraft = buildTravelCopy({ form, files, imageInsight });
        setDraft(nextDraft);
        setMessage('大模型接口暂时不可用，已使用本地识别生成一版可编辑文案。');
      } catch (error) {
        const nextDraft = buildTravelCopy({ form, files, imageInsight: null });
        setDraft(nextDraft);
        setMessage('已先生成可编辑文案。你可以补充真实旅行细节后再发布。');
      }
    } finally {
      setBusy('');
    }
  }

  async function requestModelTravelCopy() {
    const body = new FormData();
    files.forEach((item) => body.append('images', item.file));
    body.append('locationName', form.locationName || '');
    body.append('tripDate', form.tripDate || '');
    body.append('companions', form.companions || '');
    body.append('style', writerStyles.find((item) => item.key === form.style)?.label || form.style);
    body.append('length', form.length || 'standard');
    body.append('notes', form.notes || '');
    const response = await fetch('/api/ai/travel-copy', { method: 'POST', body });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '文案生成服务暂时不可用' }));
      throw new Error(error.message || '文案生成服务暂时不可用');
    }
    return response.json();
  }

  function normalizeGeneratedDraft(value) {
    const tags = Array.isArray(value?.tags) ? value.tags.join(', ') : (value?.tags || '');
    const content = cleanPublishCopy(value?.content || '');
    return {
      title: value?.title || '旅行记录',
      content,
      tags,
      category: value?.category || '景点影像',
      postType: value?.postType || 'NOTE',
      summary: `${writerStyles.find((item) => item.key === form.style)?.label || '旅行文案'} · ${files.length || 0} 张图片`
    };
  }

  function cleanPublishCopy(value) {
    return String(value || '')
      .replace(/图片|照片|上传|AI|模型|生成|标签[:：]?/gi, '')
      .replace(/画面/g, '风景')
      .replace(/镜头/g, '眼前')
      .trim();
  }

  function applyDraft(key, value) {
    setDraft((current) => ({ ...(current || {}), [key]: value }));
  }

  async function copyText() {
    if (!draft) return;
    const text = `${draft.title}\n\n${draft.content}`;
    await navigator.clipboard?.writeText(text);
    setMessage('文案已复制，可以粘贴到其他应用。');
  }

  function downloadText() {
    if (!draft) return;
    const blob = new Blob([`${draft.title}\n\n${draft.content}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${draft.title || '图生游记'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage('TXT 已导出。');
  }

  function exportPdf() {
    if (!draft) return;
    const imageHtml = files.slice(0, 6).map((item) => `<img src="${item.preview}" alt="">`).join('');
    const safeTitle = escapeHtml(draft.title);
    const safeSummary = escapeHtml(draft.summary);
    const safeContent = escapeHtml(draft.content);
    const printWindow = window.open('', '_blank', 'width=920,height=720');
    if (!printWindow) {
      setMessage('浏览器拦截了 PDF 窗口，请允许弹窗后重试。');
      return;
    }
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${safeTitle}</title>
          <style>
            body{margin:0;padding:40px;font-family:"Microsoft YaHei",serif;color:#1f2933;background:#fbf7ef;}
            h1{font-size:32px;line-height:1.2;margin:0 0 12px;}
            .meta{color:#7a6a54;margin-bottom:24px;}
            .gallery{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px;}
            img{width:100%;height:220px;object-fit:cover;border-radius:10px;}
            pre{white-space:pre-wrap;font:16px/1.8 "Microsoft YaHei",serif;margin:0;}
          </style>
        </head>
        <body>
          <h1>${safeTitle}</h1>
          <div class="meta">${safeSummary}</div>
          <div class="gallery">${imageHtml}</div>
          <pre>${safeContent}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
    setMessage('已打开 PDF 打印窗口，可选择“另存为 PDF”。');
  }

  async function uploadImagesForSquare() {
    const body = new FormData();
    files.forEach((item) => body.append('files', item.file));
    const response = await fetch('/api/community/square/uploads?type=image', { method: 'POST', body });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '图片上传失败' }));
      throw new Error(error.message || '图片上传失败');
    }
    const data = await response.json();
    return data.urls || [];
  }

  async function publishToSquare() {
    if (!draft) return;
    if (!account?.user?.loggedIn) {
      navigateTo('/login');
      return;
    }
    setBusy('publish');
    setMessage('');
    try {
      const imageUrls = await uploadImagesForSquare();
      writeStorageJson(squareDraftKey, {
        postType: draft.postType || 'NOTE',
        category: draft.category || '景点影像',
        title: draft.title,
        content: draft.content,
        locationName: form.locationName,
        tripDate: form.tripDate,
        imageUrls,
        tags: String(draft.tags || '')
          .split(/[,，、\n]/)
          .map((item) => item.trim())
          .filter(Boolean)
      });
      setMessage('已带入旅行广场发布窗口。');
      navigateTo('/square');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy('');
    }
  }

  return (
    <main className="container writer-page" ref={studioRef}>
      <section className="writer-hero">
        <div>
          <span className="section-kicker">AI TRAVEL WRITER</span>
          <h1>图生游记</h1>
          <p>上传本地旅行图片，选择风格后生成可编辑文案。生成结果可以发布到旅行广场，也可以导出 PDF 或文字发到其他应用。</p>
        </div>
        <div className="writer-hero-image" aria-hidden="true">
          <img src="/app/login-shanshui-map.png" alt="" />
          <span>把走过的风景写成游记</span>
        </div>
      </section>

      {message && <div className="message writer-message">{message}</div>}

      <div className="writer-shell">
        <section className="panel writer-control-panel">
          <PanelTitle icon={ImagePlus} title="上传与生成设置" meta={`${files.length}/12 张`} />
          <label className="writer-dropzone">
            <input type="file" accept="image/*" multiple onChange={(event) => {
              pickFiles(event.target.files);
              event.target.value = '';
            }} />
            <UploadCloud size={26} />
            <strong>选择本地旅行图片</strong>
            <span>支持 JPG、PNG、WebP、GIF，建议上传 3-9 张更容易生成完整游记。</span>
          </label>
          {!!files.length && (
            <div className="writer-preview-grid">
              {files.map((item) => (
                <div className="writer-preview" key={item.id}>
                  <img src={item.preview} alt={item.file.name} />
                  <button type="button" onClick={() => removeFile(item.id)} aria-label="移除图片"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}

          <div className="writer-field-grid">
            <label>关联地点
              <input value={form.locationName} onChange={(event) => update('locationName', event.target.value)} placeholder="如 蜀南竹海" />
            </label>
            <DatePickerField
              label="出行日期"
              value={form.tripDate}
              onChange={(value) => update('tripDate', value)}
            />
            <label>同行人
              <input value={form.companions} onChange={(event) => update('companions', event.target.value)} placeholder="如 亲子、朋友、一个人" />
            </label>
            <div className="writer-length-field">
              <span>生成长度</span>
              <div className="writer-length-row" role="group" aria-label="生成长度">
                {writerLengthOptions.map((item) => (
                  <button key={item.key} type="button" className={form.length === item.key ? 'active' : ''} onClick={() => update('length', item.key)}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="writer-option-block">
            <strong>文案风格</strong>
            <div className="writer-style-grid">
              {writerStyles.map((item) => (
                <button key={item.key} type="button" className={form.style === item.key ? 'active' : ''} aria-pressed={form.style === item.key} onClick={() => update('style', item.key)}>
                  <item.icon size={26} strokeWidth={2.2} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <label>补充要求
            <textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="例如：不要太营销，强调亲子友好和避暑感；或者补充真实费用、路线、避坑点。" rows={4} />
          </label>

          <button type="button" className="writer-generate" onClick={generateDraft} disabled={busy === 'generate'}>
            <Wand2 size={17} /> {busy === 'generate' ? '分析图片中' : '生成可发布文案'}
          </button>
        </section>

        <section className="panel writer-result-panel">
          <PanelTitle icon={FileText} title="生成结果" meta={draft ? draft.summary : '等待生成'} />
          {draft ? (
            <>
              <label>标题
                <input value={draft.title} onChange={(event) => applyDraft('title', event.target.value)} />
              </label>
              <label>正文
                <textarea className="writer-content-editor" value={draft.content} onChange={(event) => applyDraft('content', event.target.value)} />
              </label>
              <label>标签
                <input value={draft.tags} onChange={(event) => applyDraft('tags', event.target.value)} />
              </label>
              <div className="writer-result-actions">
                <button type="button" onClick={publishToSquare} disabled={busy === 'publish'}>
                  <Send size={16} /> {busy === 'publish' ? '发布中' : '发布到旅行广场'}
                </button>
                <button type="button" className="secondary" onClick={exportPdf}><Download size={16} /> 导出 PDF</button>
                <button type="button" className="secondary" onClick={downloadText}><FileText size={16} /> 导出文字</button>
                <button type="button" className="secondary" onClick={copyText}><Copy size={16} /> 复制</button>
              </div>
              <p className="writer-safety-note">正文已经整理成自然分段，发布前可以按你的真实行程再微调路线、价格和营业时间等细节。</p>
            </>
          ) : (
            <div className="writer-empty">
              <Sparkles size={34} />
              <strong>上传图片并选择风格后，文案会出现在这里</strong>
              <p>生成后可继续编辑标题和正文，再导出或发布。</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DatePickerField({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('top');
  const [viewDate, setViewDate] = useState(() => value ? new Date(`${value}T00:00:00`) : new Date());
  const pickerRef = useRef(null);
  const today = new Date();
  const selected = value ? new Date(`${value}T00:00:00`) : null;

  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event) => {
      if (!pickerRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (value) setViewDate(new Date(`${value}T00:00:00`));
  }, [value]);

  useEffect(() => {
    if (!open || !pickerRef.current) return undefined;
    const updatePlacement = () => {
      const rect = pickerRef.current.getBoundingClientRect();
      const popoverHeight = 520;
      const spaceBelow = window.innerHeight - rect.bottom;
      const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;
      const wouldOverlapHeader = rect.top - popoverHeight - 8 < headerBottom + 8;
      setPlacement(wouldOverlapHeader && spaceBelow > 260 ? 'bottom' : 'top');
    };
    updatePlacement();
    window.addEventListener('resize', updatePlacement);
    window.addEventListener('scroll', updatePlacement, true);
    return () => {
      window.removeEventListener('resize', updatePlacement);
      window.removeEventListener('scroll', updatePlacement, true);
    };
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthStart = new Date(year, month, 1);
  const start = new Date(year, month, 1 - ((monthStart.getDay() + 6) % 7));
  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });

  function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function sameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function changeMonth(offset) {
    setViewDate(new Date(year, month + offset, 1));
  }

  return (
    <label className="date-picker-field" ref={pickerRef}>
      {label}
      <button
        type="button"
        className={cx('date-picker-trigger', open && 'open', value && 'has-value')}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span>{value || '选择日期'}</span>
        <CalendarDays size={18} />
      </button>
      {open && (
        <div className={cx('date-picker-popover', placement === 'bottom' && 'below')} role="dialog" aria-label="选择出行日期">
          <div className="date-picker-head">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="上个月">‹</button>
            <strong>{year}年{String(month + 1).padStart(2, '0')}月</strong>
            <button type="button" onClick={() => changeMonth(1)} aria-label="下个月">›</button>
          </div>
          <div className="date-picker-weekdays">
            {['一', '二', '三', '四', '五', '六', '日'].map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="date-picker-grid">
            {days.map((day) => {
              const dateValue = formatDate(day);
              const inMonth = day.getMonth() === month;
              return (
                <button
                  type="button"
                  key={dateValue}
                  className={cx(!inMonth && 'muted-day', sameDay(day, selected) && 'selected', sameDay(day, today) && 'today')}
                  onClick={() => {
                    onChange(dateValue);
                    setOpen(false);
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
          <div className="date-picker-foot">
            <button type="button" className="secondary" onClick={() => onChange('')}>清除</button>
            <button type="button" onClick={() => {
              onChange(formatDate(today));
              setOpen(false);
            }}>今天</button>
          </div>
        </div>
      )}
    </label>
  );
}

function FriendlyPointShop({ data, onRedeem }) {
  const rewards = data?.rewards || [];
  const records = data?.records || [];
  const balance = data?.balance ?? 0;
  return (
    <aside className="panel friendly-shop">
      <PanelTitle icon={ShoppingBag} title="积分商店" meta={`${balance} 分`} />
      <p className="friendly-shop-copy">绿色路线、低拥堵打卡和本地文创消费可获得友好积分，在这里兑换演示权益。</p>
      <div className="friendly-reward-list">
        {rewards.map((reward) => (
          <article className="friendly-reward" key={reward.id}>
            <div>
              <strong>{reward.name}</strong>
              <small>{reward.description}</small>
            </div>
            <button type="button" className="secondary" disabled={balance < reward.cost} onClick={() => onRedeem(reward.id)}>
              {reward.cost} 分
            </button>
          </article>
        ))}
      </div>
      <div className="friendly-shop-history">
        <strong>最近记录</strong>
        {records.slice(0, 3).map((record) => (
          <span key={record.id}>{record.amount >= 0 ? '+' : ''}{record.amount} · {record.title}</span>
        ))}
        {!records.length && <span>暂无积分记录</span>}
      </div>
    </aside>
  );
}

function SquarePostCard({ post, onSelect }) {
  const time = post.createdAt ? String(post.createdAt).replace('T', ' ').slice(0, 16) : '';
  const cover = post.imageUrls?.[0];
  const isQuestion = post.postType === 'QUESTION';
  const isDiscussion = post.postType === 'DISCUSSION';
  const imageCount = post.imageUrls?.length || 0;
  const videoCount = post.videoUrls?.length || 0;
  return (
    <article
      className={cx('square-post', post.postType?.toLowerCase())}
      data-type={post.postType}
      onClick={onSelect}
      style={{
        display: 'grid',
        gridTemplateColumns: cover ? 'minmax(132px, 38%) minmax(0, 1fr)' : '1fr',
        gap: '10px 16px',
        padding: 14,
        minHeight: cover ? 156 : 'auto'
      }}
    >
      {cover && (
        <div className="square-cover" style={{ gridRow: '1 / span 7', width: '100%', minHeight: 128, maxHeight: 156, margin: 0, borderRadius: 10 }}>
          <img src={cover} alt={post.title} style={{ width: '100%', height: '100%', minHeight: 128, objectFit: 'cover' }} />
          {imageCount > 1 && <span>{imageCount} 图</span>}
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
      <h2 style={{ margin: 0, fontSize: '1.25rem', lineHeight: 1.22 }}>{isQuestion ? `问：${post.title}` : post.title}</h2>
      <p style={{ margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>
      {!!post.tags?.length && <div className="square-tag-row">{post.tags.slice(0, 5).map((tag) => <span key={tag}>#{tag}</span>)}</div>}
      {(post.locationName || post.tripDate) && (
        <div className="square-meta">
          {post.locationName && <span><MapPin size={14} /> {post.locationName}</span>}
          {post.tripDate && <span><CalendarDays size={14} /> {post.tripDate}</span>}
        </div>
      )}
      {!cover && !!post.imageUrls?.length && (
        <div className="square-media-grid">
          {post.imageUrls.slice(0, 3).map((url) => <img key={url} src={url} alt={post.title} />)}
        </div>
      )}
      {!!videoCount && (
        <div className="square-media-strip" aria-label={`${videoCount} 个视频`}>
          <Video size={15} />
          <span>{videoCount} 个视频，进入帖子播放</span>
        </div>
      )}
      <div className="square-actions">
        <span><Heart size={16} /> {post.likes || 0}</span>
        <span>{isQuestion ? <Lightbulb size={16} /> : <MessageCircle size={16} />} {isQuestion ? `${post.commentCount || 0} 回答` : isDiscussion ? `${post.commentCount || 0} 楼` : post.commentCount || 0}</span>
        {!!imageCount && <span><Image size={15} /> {imageCount}</span>}
        {!!videoCount && <span><Video size={15} /> {videoCount}</span>}
        <button type="button" className="reply-button" onClick={(event) => { event.stopPropagation(); onSelect(); }}>
          进入帖子
        </button>
      </div>
    </article>
  );
}

function SquarePostDetail({ id }) {
  const [commentText, setCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);
  const [message, setMessage] = useState('');
  const [activeImage, setActiveImage] = useState(null);
  const postState = useAsync(() => api(`/api/community/square/posts/${id}`), [id]);
  const commentsState = useAsync(() => api(`/api/community/square/posts/${id}/comments`), [id]);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (postState.data) setPost(postState.data);
  }, [postState.data]);

  useEffect(() => {
    if (commentsState.data) setComments(commentsState.data);
  }, [commentsState.data]);

  useEffect(() => {
    if (!activeImage) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setActiveImage(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [activeImage]);

  async function likePost() {
    try {
      const nextPost = await api(`/api/community/square/posts/${id}/like?userId=${currentUserId()}`, { method: 'POST' });
      setPost(nextPost);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submitComment(event) {
    event.preventDefault();
    const content = commentText.trim();
    if (!content) return;
    try {
      const saved = await api(`/api/community/square/posts/${id}/comments?userId=${currentUserId()}`, {
        method: 'POST',
        body: JSON.stringify({ content, parentId: replyTarget?.rootId || null })
      });
      setCommentText('');
      setReplyTarget(null);
      setComments((current) => [...current.map((item) => (
        saved.parentId && item.id === saved.parentId
          ? { ...item, replyCount: (item.replyCount || 0) + 1 }
          : item
      )), saved]);
      setPost((current) => current ? { ...current, commentCount: (current.commentCount || 0) + 1 } : current);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function likeComment(commentId) {
    try {
      const saved = await api(`/api/community/square/comments/${commentId}/like?userId=${currentUserId()}`, { method: 'POST' });
      setComments((current) => current.map((item) => item.id === saved.id ? saved : item));
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

  const liked = (post.likedUserIds || []).includes(currentUserId());
  const isQuestion = post.postType === 'QUESTION';
  const isDiscussion = post.postType === 'DISCUSSION';
  const time = post.createdAt ? String(post.createdAt).replace('T', ' ').slice(0, 16) : '';
  const rootComments = comments.filter((comment) => !comment.parentId);
  const repliesByParent = comments.reduce((groups, comment) => {
    if (comment.parentId) {
      groups[comment.parentId] = [...(groups[comment.parentId] || []), comment];
    }
    return groups;
  }, {});

  return (
    <main className="container square-detail-page">
      <button type="button" className="secondary square-back" onClick={() => navigateTo('/square')}>
        <ArrowLeft size={16} /> 返回广场
      </button>
      <article className="panel square-detail-card">
        <div className="square-detail-layout">
          <div>
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
            <div className="square-detail-actions">
              <button type="button" className={cx('heart-button detail-like', liked && 'liked')} onClick={likePost}>
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                {liked ? '已点赞' : '点赞'} {post.likes || 0}
              </button>
              <span>{isQuestion ? <Lightbulb size={16} /> : <MessageCircle size={16} />} {isQuestion ? `${post.commentCount || 0} 个回答` : isDiscussion ? `${post.commentCount || 0} 层讨论` : `${post.commentCount || 0} 条评论`}</span>
            </div>
          </div>
          <div className="square-detail-media">
            {!!post.imageUrls?.length && (
              <div className="square-detail-gallery">
                {post.imageUrls.map((url, index) => (
                  <button key={url} type="button" className="square-image-thumb" onClick={() => setActiveImage({ url, index })}>
                    <img src={url} alt={`${post.title} 图片 ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
            {!!post.videoUrls?.length && (
              <div className="square-video-list">
                {post.videoUrls.map((url) => <video key={url} src={url} controls />)}
              </div>
            )}
          </div>
        </div>
        {message && <div className="message error">{message}</div>}
      </article>
      <section className="panel square-comment-panel">
        <PanelTitle icon={isQuestion ? Lightbulb : MessageCircle} title={isQuestion ? '回答' : '评论'} meta={`${comments.length} 条`} />
        <form className="review-composer square-detail-composer" onSubmit={submitComment}>
          <div className="comment-avatar">我</div>
          <div className="composer-main">
            {replyTarget && (
              <div className="replying-to">
                追评 @{replyTarget.name}
                <button type="button" onClick={() => setReplyTarget(null)}>取消</button>
              </div>
            )}
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder={replyTarget ? '写下你的追评' : isQuestion ? '写下你的回答' : '写下你的评论'}
              required
            />
            <div className="composer-actions">
              <span className="muted">{replyTarget ? '追评会展示在这条评论下方。' : isQuestion ? '回答会展示在帖子下方。' : '评论会展示在帖子下方。'}</span>
              <button><Send size={16} /> 发布</button>
            </div>
          </div>
        </form>
        <div className="review-list">
          {rootComments.length ? rootComments.map((comment, index) => (
            <SquareThreadComment
              key={comment.id}
              comment={comment}
              replies={repliesByParent[comment.id] || []}
              index={index}
              isDiscussion={isDiscussion}
              onLike={likeComment}
              onReply={setReplyTarget}
            />
          )) : <div className="empty-state compact">{isQuestion ? '还没有回答，来写第一条。' : '还没有评论，来写第一条。'}</div>}
        </div>
      </section>
      {activeImage && (
        <div className="square-lightbox" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setActiveImage(null);
        }}>
          <button type="button" className="icon-button ghost square-lightbox-close" onClick={() => setActiveImage(null)} aria-label="关闭图片预览">
            <X size={22} />
          </button>
          <img src={activeImage.url} alt={`${post.title} 大图 ${activeImage.index + 1}`} />
        </div>
      )}
    </main>
  );
}

function SquareThreadComment({ comment, replies, index, isDiscussion, onLike, onReply }) {
  const liked = (comment.likedUserIds || []).includes(currentUserId());
  const name = comment.authorName || `游客${comment.userId || ''}`;
  const time = comment.createdAt ? String(comment.createdAt).replace('T', ' ').slice(0, 16) : '';
  return (
    <article className="square-thread-comment">
      <div className="comment-avatar small">{name.slice(0, 1)}</div>
      <div className="comment-body">
        <div className="comment-topline">
          <strong>{name}</strong>
          <span>{isDiscussion ? `${index + 2} 楼 · ` : ''}{time}</span>
        </div>
        <p>{comment.content}</p>
        <div className="comment-tools">
          <button type="button" className={cx('heart-button', liked && 'liked')} onClick={() => onLike(comment.id)} aria-label={liked ? '取消点赞' : '点赞'}>
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            <span>{comment.likes || 0}</span>
          </button>
          <button type="button" className="reply-button" onClick={() => onReply({ rootId: comment.id, name })}>
            追评
          </button>
        </div>
        {!!replies.length && (
          <div className="square-reply-stack">
            {replies.map((reply) => {
              const replyLiked = (reply.likedUserIds || []).includes(currentUserId());
              const replyName = reply.authorName || `游客${reply.userId || ''}`;
              return (
                <div className="square-thread-comment nested" key={reply.id}>
                  <div className="comment-avatar small">{replyName.slice(0, 1)}</div>
                  <div className="comment-body">
                    <div className="comment-topline">
                      <strong>{replyName}</strong>
                      <span>{reply.createdAt ? String(reply.createdAt).replace('T', ' ').slice(0, 16) : ''}</span>
                    </div>
                    <p>{reply.content}</p>
                    <div className="comment-tools">
                      <button type="button" className={cx('heart-button', replyLiked && 'liked')} onClick={() => onLike(reply.id)} aria-label={replyLiked ? '取消点赞' : '点赞'}>
                        <Heart size={15} fill={replyLiked ? 'currentColor' : 'none'} />
                        <span>{reply.likes || 0}</span>
                      </button>
                      <button type="button" className="reply-button" onClick={() => onReply({ rootId: comment.id, name: replyName })}>
                        追评
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
  const footprints = useAsync(() => api(`/api/users/${currentUserId()}/footprints`), []);
  const reservations = useAsync(() => api(`/api/reservations/mine?userId=${currentUserId()}`), []);
  const culturalOrders = useAsync(() => api(`/api/cultural-orders/mine?userId=${currentUserId()}`), []);
  const friendlyPoints = useAsync(() => api(`/api/friendly-points/profile?userId=${currentUserId()}`), []);
  const submissions = useAsync(() => api(`/api/community/submissions/mine?userId=${currentUserId()}`), []);
  const checkedTotal = footprints.data?.total || 0;
  return (
    <main className="container">
      <PageHero icon={UserRound} title="个人中心" body="集中查看打卡足迹、预约记录、勋章和申报进度。" />
      <div className="dashboard">
        <Metric value={checkedTotal || '--'} label="已打卡" />
        <Metric value={footprintBadgeCatalog.filter((badge) => checkedTotal >= badge.required).length} label="勋章" />
        <Metric value={reservations.data?.length ?? '--'} label="预约" />
        <Metric value={culturalOrders.data?.length ?? '--'} label="文创订单" />
        <Metric value={friendlyPoints.data?.balance ?? '--'} label="友好积分" />
      </div>
      <FriendlyPointPanel data={friendlyPoints.data} />
      <FootprintBadges total={checkedTotal} />
      <section className="panel">
        <PanelTitle icon={Map} title="旅游足迹地图" />
        <BaiduMap center={defaultLocation} markers={footprints.data?.checkedInSpots || []} polyline className="footprint-map" />
      </section>
      <div className="profile-panel-grid">
        <ListPanel
          title="最近解锁"
          icon={BadgeCheck}
          className="profile-list-panel"
          items={(footprints.data?.badges || []).map((badge) => ({
            title: badge,
            body: '继续探索解锁更多勋章',
            actionText: '去景点导览',
            onAction: () => navigateTo('/guide')
          }))}
          empty="暂无勋章"
          emptyActionText="去景点导览"
          onEmptyAction={() => navigateTo('/guide')}
        />
        <ListPanel title="我的预约" icon={CalendarDays} className="profile-list-panel" items={(reservations.data || []).map((item) => ({ title: `景点 ID ${item.spotId}`, body: `${item.visitDate} ${item.timeSlot} · ${item.status}` }))} empty="暂无预约" />
      </div>
      <ListPanel
        title="我的文创订单"
        icon={ShoppingBag}
        className="profile-list-panel profile-wide-panel"
        items={(culturalOrders.data || []).map((item) => ({
          title: item.productName,
          body: `${item.orderNo} · ${item.status} · ${item.quantity} 件 · ¥${Number(item.totalAmount || 0).toFixed(2)} · ${item.shippingAddress}`
        }))}
        empty={culturalOrders.error || '暂无文创订单'}
      />
      <ListPanel
        title="我的申报"
        icon={Plus}
        className="profile-list-panel profile-submission-panel"
        items={(submissions.data || []).map((item) => ({ title: item.name, body: `${item.status} · ${item.address}` }))}
        empty="暂无申报"
        panelActionText="申报景点"
        onPanelAction={() => navigateTo('/submit-spot')}
      />
    </main>
  );
}

function FriendlyPointPanel({ data }) {
  const records = data?.records || [];
  const balance = data?.balance ?? 0;
  return (
    <section className="panel friendly-point-panel">
      <div>
        <PanelTitle icon={Sparkles} title="城市友好积分" meta={`${balance} 分`} />
        <p className="friendly-point-copy">步行、骑行、公交、低拥堵打卡和本地文创消费都会沉淀为友好积分。</p>
      </div>
      <div className="friendly-point-list">
        {records.slice(0, 4).map((record) => (
          <div className="friendly-point-item" key={record.id}>
            <span className={record.amount >= 0 ? 'gain' : 'cost'}>{record.amount >= 0 ? '+' : ''}{record.amount}</span>
            <strong>{record.title}</strong>
            <small>{record.description}</small>
          </div>
        ))}
        {!records.length && <div className="empty-state compact">还没有积分记录，先试试绿色路线或景点打卡。</div>}
      </div>
      <button type="button" className="secondary" onClick={() => navigateTo('/square')}>去积分商店</button>
    </section>
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
  const [form, setForm] = useState({
    name: '',
    type: '',
    address: '',
    latitude: '',
    longitude: '',
    openHours: '',
    price: '',
    bestSeason: '',
    phone: '',
    description: '',
    reason: ''
  });
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [products, setProducts] = useState([]);
  const [uploading, setUploading] = useState('');
  const [message, setMessage] = useState('');
  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyLocation(location) {
    setForm((current) => ({
      ...current,
      address: location.address || current.address,
      latitude: location.lat,
      longitude: location.lng
    }));
  }

  async function uploadFiles(type, files) {
    const selected = Array.from(files || []);
    if (!selected.length) return;
    setUploading(type);
    setMessage('');
    try {
      const body = new FormData();
      selected.forEach((file) => body.append('files', file));
      const result = await api(`/api/community/submissions/uploads?type=${type}`, {
        method: 'POST',
        body,
        timeoutMs: type === 'video' ? 90000 : 30000
      });
      const urls = result.urls || [];
      if (type === 'video') {
        setVideoUrls((current) => [...current, ...urls]);
      } else {
        setImageUrls((current) => [...current, ...urls]);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading('');
    }
  }

  async function submit(event) {
    event.preventDefault();
    const culturalProducts = products
      .map((product) => ({
        ...product,
        name: product.name.trim(),
        category: product.category.trim(),
        description: product.description.trim(),
        tags: product.tags.trim(),
        imageUrl: product.imageUrl.trim()
      }))
      .filter((product) => product.name);
    try {
      await api(`/api/community/submissions?userId=${currentUserId()}`, {
        method: 'POST',
        body: JSON.stringify({ ...form, price: form.price === '' ? 0 : Number(form.price), photoUrls: imageUrls, videoUrls, culturalProducts })
      });
      setMessage('提交成功，已进入平台审核。');
      setForm({ name: '', type: '', address: '', latitude: '', longitude: '', openHours: '', price: '', bestSeason: '', phone: '', description: '', reason: '' });
      setImageUrls([]);
      setVideoUrls([]);
      setProducts([]);
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <main className="container">
      <PageHero icon={Plus} title="景点申报" body="推荐你发现的好去处，平台审核后可进入景点库。" />
      <form className="panel form spot-submit-form" onSubmit={submit}>
        <div className="form-row">
          <label>景点名称<input value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
          <label>类型<input value={form.type} onChange={(e) => update('type', e.target.value)} required /></label>
        </div>
        <LocationPickerField value={form} onSelect={applyLocation} />
        <div className="form-row">
          <label>开放时间<input value={form.openHours} onChange={(e) => update('openHours', e.target.value)} placeholder="如 08:30-18:00 / 全天" /></label>
          <label>门票<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} placeholder="免费填 0，可留空" /></label>
        </div>
        <div className="form-row">
          <label>最佳季节<input value={form.bestSeason} onChange={(e) => update('bestSeason', e.target.value)} placeholder="如 春秋 / 3-5月" /></label>
          <label>咨询电话<input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="没有可留空" /></label>
        </div>
        <div className="submission-upload-row">
          <SubmissionMediaUploader
            type="image"
            icon={Image}
            title="上传图片"
            accept="image/jpeg,image/png,image/webp,image/gif"
            urls={imageUrls}
            uploading={uploading === 'image'}
            onFiles={(files) => uploadFiles('image', files)}
            onRemove={(url) => setImageUrls((current) => current.filter((item) => item !== url))}
          />
          <SubmissionMediaUploader
            type="video"
            icon={Video}
            title="上传视频"
            accept="video/mp4,video/webm,video/quicktime"
            urls={videoUrls}
            uploading={uploading === 'video'}
            onFiles={(files) => uploadFiles('video', files)}
            onRemove={(url) => setVideoUrls((current) => current.filter((item) => item !== url))}
          />
        </div>
        <label className="wide">景点描述<textarea value={form.description} onChange={(e) => update('description', e.target.value)} required /></label>
        <label className="wide">推荐理由<textarea value={form.reason} onChange={(e) => update('reason', e.target.value)} required /></label>
        <CulturalProductSubmission products={products} setProducts={setProducts} />
        <button>提交审核</button>
        {message && <div className="message">{message}</div>}
      </form>
    </main>
  );
}

const emptySubmissionProduct = {
  name: '',
  category: '',
  price: '',
  stock: '',
  imageUrl: '',
  tags: '',
  description: ''
};

function CulturalProductSubmission({ products, setProducts }) {
  function addProduct() {
    setProducts((current) => [...current, { ...emptySubmissionProduct }]);
  }

  function updateProduct(index, key, value) {
    setProducts((current) => current.map((product, itemIndex) => itemIndex === index ? { ...product, [key]: value } : product));
  }

  function removeProduct(index) {
    setProducts((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <section className="submission-products wide">
      <div className="submission-products-head">
        <div>
          <strong>文创商品</strong>
          <small>有真实商品资料才填写；没有就留空，不会自动生成。</small>
        </div>
        <button type="button" className="secondary" onClick={addProduct}><Plus size={16} /> 添加商品</button>
      </div>
      {products.map((product, index) => (
        <article className="submission-product-card" key={index}>
          <div className="submission-product-title">
            <strong>商品 {index + 1}</strong>
            <button type="button" className="icon-button ghost" onClick={() => removeProduct(index)} aria-label="删除文创商品"><Trash2 size={16} /></button>
          </div>
          <div className="form-row">
            <label>商品名称<input value={product.name} onChange={(e) => updateProduct(index, 'name', e.target.value)} placeholder="如 校区纪念冰箱贴" /></label>
            <label>分类<input value={product.category} onChange={(e) => updateProduct(index, 'category', e.target.value)} placeholder="如 纪念品 / 纸品" /></label>
          </div>
          <div className="form-row">
            <label>价格<input type="number" min="0" step="0.01" value={product.price} onChange={(e) => updateProduct(index, 'price', e.target.value)} /></label>
            <label>库存<input type="number" min="0" value={product.stock} onChange={(e) => updateProduct(index, 'stock', e.target.value)} /></label>
          </div>
          <label>商品图片地址<input value={product.imageUrl} onChange={(e) => updateProduct(index, 'imageUrl', e.target.value)} placeholder="没有图片可留空" /></label>
          <label>标签<input value={product.tags} onChange={(e) => updateProduct(index, 'tags', e.target.value)} placeholder="如 伴手礼,轻便" /></label>
          <label>商品说明<textarea value={product.description} onChange={(e) => updateProduct(index, 'description', e.target.value)} rows={3} placeholder="有说明就写，没有可留空" /></label>
        </article>
      ))}
    </section>
  );
}

function LocationPickerField({ value, onSelect }) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState(value.name || value.address || '');
  const [picked, setPicked] = useState(null);
  const [status, setStatus] = useState('');
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const mapBoxRef = useRef(null);
  const { ready, error } = useBaiduMap();

  useEffect(() => {
    if (!open || !ready || !mapBoxRef.current || !window.BMap) return undefined;
    const BMap = window.BMap;
    const startPoint = value.latitude && value.longitude
      ? new BMap.Point(Number(value.longitude), Number(value.latitude))
      : new BMap.Point(defaultLocation.lng, defaultLocation.lat);
    const map = new BMap.Map(mapBoxRef.current);
    const geocoder = new BMap.Geocoder();
    mapRef.current = map;
    geocoderRef.current = geocoder;
    map.centerAndZoom(startPoint, value.latitude ? 16 : 13);
    map.enableScrollWheelZoom(true);
    if (value.latitude && value.longitude) {
      const marker = new BMap.Marker(startPoint);
      markerRef.current = marker;
      map.addOverlay(marker);
      setPicked({ lat: value.latitude, lng: value.longitude, address: value.address });
    }
    const handleClick = (event) => selectPoint(event.point);
    map.addEventListener('click', handleClick);
    return () => {
      try {
        map.removeEventListener('click', handleClick);
        map.clearOverlays();
      } catch (ignore) {
        // Baidu SDK cleanup is best-effort.
      }
      mapRef.current = null;
      markerRef.current = null;
      geocoderRef.current = null;
      if (mapBoxRef.current) mapBoxRef.current.innerHTML = '';
    };
  }, [open, ready]);

  function selectPoint(point, fallbackAddress = '') {
    if (!point || !mapRef.current || !window.BMap) return;
    const BMap = window.BMap;
    mapRef.current.clearOverlays();
    const marker = new BMap.Marker(point);
    markerRef.current = marker;
    mapRef.current.addOverlay(marker);
    mapRef.current.panTo(point);
    setStatus('正在解析地址...');
    const commit = (address) => {
      const next = {
        lat: Number(point.lat).toFixed(6),
        lng: Number(point.lng).toFixed(6),
        address: address || fallbackAddress || `${Number(point.lat).toFixed(6)}, ${Number(point.lng).toFixed(6)}`
      };
      setPicked(next);
      setStatus('已选中位置，确认后会回填到申报表。');
    };
    if (geocoderRef.current) {
      geocoderRef.current.getLocation(point, (result) => commit(result?.address || fallbackAddress));
    } else {
      commit(fallbackAddress);
    }
  }

  function searchPlace() {
    if (!keyword.trim() || !mapRef.current || !window.BMap) return;
    const BMap = window.BMap;
    setStatus('正在搜索地点...');
    const local = new BMap.LocalSearch(mapRef.current, {
      onSearchComplete: () => {
        const results = local.getResults();
        const poi = results?.getPoi?.(0);
        if (!poi) {
          setStatus('没有找到匹配地点，可以直接在地图上点击选点。');
          return;
        }
        selectPoint(poi.point, [poi.title, poi.address].filter(Boolean).join(' · '));
      }
    });
    local.search(keyword.trim());
  }

  function confirmLocation() {
    if (!picked) {
      setStatus('请先搜索或点击地图选择一个位置。');
      return;
    }
    onSelect(picked);
    setOpen(false);
  }

  return (
    <section className="location-picker-field wide">
      <div className="location-picker-summary">
        <div>
          <span>地址</span>
          <strong>{value.address || '尚未选择位置'}</strong>
          <small>{value.latitude && value.longitude ? `${value.latitude}, ${value.longitude}` : '通过百度地图搜索或点选后自动回填'}</small>
        </div>
        <button type="button" className="secondary" onClick={() => setOpen(true)}><LocateFixed size={16} /> 百度地图定位</button>
      </div>
      {open && (
        <div className="map-picker-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="map-picker-modal" role="dialog" aria-modal="true" aria-label="百度地图选择景点位置">
            <div className="map-picker-head">
              <div>
                <h2>选择景点位置</h2>
                <p>搜索地点或直接点击地图，确认后回填地址与经纬度。</p>
              </div>
              <button type="button" className="icon-button ghost" onClick={() => setOpen(false)} aria-label="关闭地图"><X size={18} /></button>
            </div>
            <div className="map-picker-search">
              <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="输入景点名、学校、商圈或地址" />
              <button type="button" onClick={searchPlace}><Search size={16} /> 搜索</button>
            </div>
            {error ? <div className="message error">{error}</div> : <div ref={mapBoxRef} className="map-picker-canvas">{ready ? '' : '百度地图加载中...'}</div>}
            <div className="map-picker-result">
              <span>{status || '点击地图任意位置开始选择。'}</span>
              <strong>{picked?.address || '未选择'}</strong>
              {picked && <small>{picked.lat}, {picked.lng}</small>}
            </div>
            <div className="form-actions">
              <button type="button" className="secondary" onClick={() => setOpen(false)}>取消</button>
              <button type="button" onClick={confirmLocation}><MapPin size={16} /> 使用此位置</button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function SubmissionMediaUploader({ type, icon: Icon, title, accept, urls, uploading, onFiles, onRemove }) {
  const inputId = `submission-${type}-upload`;
  return (
    <section className="submission-uploader">
      <div className="submission-uploader-head">
        <span><Icon size={18} /> {title}</span>
        <label htmlFor={inputId}><UploadCloud size={16} /> {uploading ? '上传中' : '选择文件'}</label>
        <input id={inputId} type="file" accept={accept} multiple disabled={uploading} onChange={(event) => {
          onFiles(event.target.files);
          event.target.value = '';
        }} />
      </div>
      <small>{type === 'video' ? '支持 MP4、WebM、MOV，单个不超过 80MB。' : '支持 JPG、PNG、WebP、GIF，单张不超过 10MB。'}</small>
      {!!urls.length && (
        <div className="submission-media-preview">
          {urls.map((url) => (
            <div className="submission-media-item" key={url}>
              {type === 'video' ? <video src={url} controls /> : <img src={url} alt="申报媒体" />}
              <button type="button" className="icon-button ghost" onClick={() => onRemove(url)} aria-label="移除文件"><X size={15} /></button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Login({ refreshAccount }) {
  const [authMode, setAuthMode] = useState('login');
  const [adminUsername, setAdminUsername] = useState('admin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const isRegister = authMode === 'register';
  useEffect(() => {
    api('/api/config').then((config) => {
      if (config.adminUsername) setAdminUsername(config.adminUsername);
    }).catch(() => {});
  }, []);
  async function submit(event) {
    event.preventDefault();
    try {
      if (isRegister && password !== confirmPassword) {
        throw new Error('两次输入的密码不一致');
      }
      const isAdminLogin = !isRegister && username.trim() === adminUsername;
      const endpoint = isAdminLogin ? '/api/admin/auth/login' : isRegister ? '/api/auth/register' : '/api/auth/login';
      await api(endpoint, { method: 'POST', body: JSON.stringify({ username, email, password }) });
      await refreshAccount();
      const nextPath = isAdminLogin ? '/admin' : '/me';
      window.history.pushState(null, '', window.location.port === '8080' ? `/app${nextPath}` : nextPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <main className="login-stage">
      <section className="login-showcase" aria-label="陌路寻景登录">
        <div className="login-image-scene" aria-hidden="true">
          <span className="image-kenburns" />
          <span className="scene-vignette" />
          <span className="scene-mist mist-a" />
          <span className="scene-mist mist-b" />
          <span className="scene-mist mist-c" />
          <span className="scene-water water-a" />
          <span className="scene-water water-b" />
          <span className="scene-route-glow route-a" />
          <span className="scene-route-glow route-b" />
          <span className="scene-route-glow route-c" />
          <svg className="login-motion-route" viewBox="0 0 1000 560" preserveAspectRatio="none" focusable="false">
            <path className="route-ink" d="M72 318 C185 246 244 364 354 286 C475 198 542 302 644 236 C750 166 836 244 942 150" />
            <path className="route-light" d="M72 318 C185 246 244 364 354 286 C475 198 542 302 644 236 C750 166 836 244 942 150" />
            <circle className="route-traveler traveler-one" r="5">
              <animateMotion dur="10s" repeatCount="indefinite" path="M72 318 C185 246 244 364 354 286 C475 198 542 302 644 236 C750 166 836 244 942 150" />
            </circle>
            <circle className="route-traveler traveler-two" r="4">
              <animateMotion dur="14s" begin="3s" repeatCount="indefinite" path="M72 318 C185 246 244 364 354 286 C475 198 542 302 644 236 C750 166 836 244 942 150" />
            </circle>
          </svg>
        </div>
        <div className="login-scroll-seal" aria-hidden="true">
          <span>陌路</span>
          <span>寻景</span>
        </div>
        <div className="login-art-copy">
          <span>行旅画卷</span>
          <strong data-text="山水有路 远行有迹">山水有路 远行有迹</strong>
          <p>登录后继续整理你的路线、预约与足迹。</p>
        </div>
        <div className="login-art-notes" aria-hidden="true">
          <span>路线规划</span>
          <span>足迹打卡</span>
          <span>智能导览</span>
        </div>
      </section>

      <section className="login-card">
        <div className="login-card-head">
          <span className="login-head-icon">{isRegister ? <UserPlus size={26} /> : <UserRound size={26} />}</span>
          <div>
            <h1>{isRegister ? '创建账户' : '欢迎回来'}</h1>
            <p>登录后同步预约、足迹与路线。</p>
          </div>
        </div>
        <div className="segmented login-role-switch login-mode-switch" role="group" aria-label="选择账户操作">
          <button type="button" className={!isRegister ? 'active' : ''} onClick={() => setAuthMode('login')}>登录</button>
          <button type="button" className={isRegister ? 'active' : ''} onClick={() => setAuthMode('register')}>注册</button>
        </div>
        <form className="login-form" onSubmit={submit}>
          <label>
            <span>用户名</span>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={isRegister ? '你的名字' : '请输入用户名'} required />
          </label>
          {isRegister && (
            <label>
              <span>邮箱</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
            </label>
          )}
          <label>
            <span>密码</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isRegister ? '至少6位' : '请输入密码'} required />
          </label>
          {isRegister && (
            <label>
              <span>确认密码</span>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="再次输入密码" required />
            </label>
          )}
          <button className="login-submit">{isRegister ? <UserPlus size={18} /> : <LogIn size={18} />} {isRegister ? '注册' : '登录'}</button>
        </form>
        <div className="login-hint">
          <Link href="/" className="login-home-link">返回首页</Link>
        </div>
        {message && <div className="message error">{message}</div>}
      </section>
    </main>
  );
}

function Admin() {
  const [reloadKey, setReloadKey] = useState(0);
  const [activePanel, setActivePanel] = useState('submissions');
  const spots = useAsync(() => api('/api/admin/spots'), [reloadKey]);
  const facilities = useAsync(() => api('/api/admin/facilities'), [reloadKey]);
  const submissions = useAsync(() => api('/api/admin/submissions'), [reloadKey]);
  const spotList = spots.data || [];
  const submissionList = submissions.data || [];
  const pendingCount = submissionList.filter((item) => item.status === 'PENDING').length;
  const featuredCount = spotList.filter((item) => item.homeFeatured).length;
  const refreshAdmin = () => setReloadKey((key) => key + 1);

  return (
    <main className="container admin-shell">
      <section className="admin-hero">
        <div className="admin-hero-copy">
          <span className="admin-kicker"><ShieldCheck size={18} /> 运营后台</span>
          <h1>把申报、景点库和首页内容放回可控状态。</h1>
          <p>审核用户提交的新地点，编辑正式景点资料，并维护首页 Hero 轮播与精选景点。</p>
        </div>
        <button className="secondary admin-refresh" type="button" onClick={refreshAdmin}><RefreshCw size={16} /> 刷新数据</button>
      </section>

      <div className="admin-metrics">
        <Metric value={spots.loading ? '--' : spotList.length} label="正式景点" />
        <Metric value={facilities.loading ? '--' : (facilities.data || []).length} label="周边设施" />
        <Metric value={submissions.loading ? '--' : pendingCount} label="待审核申报" />
        <Metric value={spots.loading ? '--' : featuredCount} label="首页精选" />
      </div>

      <div className="admin-tabs" role="tablist" aria-label="后台管理模块">
        {[
          ['submissions', MessageCircle, '申报审核', pendingCount],
          ['spots', MapPin, '景点管理', spotList.length],
          ['home', ImagePlus, '首页内容', featuredCount]
        ].map(([key, Icon, label, count]) => (
          <button key={key} type="button" className={activePanel === key ? 'active' : ''} onClick={() => setActivePanel(key)}>
            <Icon size={18} />
            <span>{label}</span>
            <strong>{count}</strong>
          </button>
        ))}
      </div>

      {activePanel === 'submissions' && <SubmissionManager submissions={submissionList} loading={submissions.loading} onChanged={refreshAdmin} />}
      {activePanel === 'spots' && <SpotLibraryManager spots={spotList} loading={spots.loading} onChanged={refreshAdmin} />}
      {activePanel === 'home' && <HomeContentManager spots={spotList} />}
    </main>
  );
}

const emptySpotDraft = {
  name: '',
  type: '自然风光',
  address: '',
  latitude: '',
  longitude: '',
  openHours: '全天',
  phone: '',
  price: 0,
  rating: 4.6,
  maxCapacity: 2000,
  coverImage: '',
  gallery: [],
  videoUrl: '',
  description: '',
  guide: '',
  history: '',
  highlights: '',
  bestSeason: '',
  notice: '',
  approved: true,
  homeFeatured: false,
  homeFeaturedSort: 0
};

function normalizeSpotDraft(spot = {}) {
  return {
    ...emptySpotDraft,
    ...spot,
    galleryText: (spot.gallery || []).join('\n')
  };
}

function serializeSpotDraft(draft) {
  return {
    ...draft,
    latitude: draft.latitude === '' ? null : Number(draft.latitude),
    longitude: draft.longitude === '' ? null : Number(draft.longitude),
    price: draft.price === '' ? 0 : Number(draft.price),
    rating: draft.rating === '' ? 0 : Number(draft.rating),
    maxCapacity: draft.maxCapacity === '' ? 0 : Number(draft.maxCapacity),
    gallery: String(draft.galleryText || '')
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean),
    galleryText: undefined
  };
}

function SpotLibraryManager({ spots, loading, onChanged }) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const filtered = spots.filter((spot) => {
    const text = `${spot.name || ''} ${spot.type || ''} ${spot.address || ''}`.toLowerCase();
    return text.includes(query.trim().toLowerCase());
  });

  async function saveSpot(draft) {
    const payload = serializeSpotDraft(draft);
    const endpoint = payload.id ? `/api/admin/spots/${payload.id}` : '/api/admin/spots';
    await api(endpoint, { method: payload.id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
    setEditing(null);
    setMessage(payload.id ? '景点资料已更新。' : '新景点已加入景点库。');
    onChanged();
  }

  async function deleteSpot(id) {
    if (!window.confirm('确认删除这个景点？相关详情页将不再显示。')) return;
    await api(`/api/admin/spots/${id}`, { method: 'DELETE' });
    setMessage('景点已删除。');
    onChanged();
  }

  return (
    <section className="admin-workspace">
      <div className="admin-panel-main">
        <div className="admin-panel-head">
          <PanelTitle icon={MapPin} title="景点库" meta={`${filtered.length} / ${spots.length}`} />
          <button type="button" onClick={() => setEditing(normalizeSpotDraft())}><Plus size={16} /> 新增景点</button>
        </div>
        {message && <div className="message">{message}</div>}
        <div className="admin-toolbar">
          <label>
            <Search size={16} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="按名称、类型或地址搜索" />
          </label>
        </div>
        {loading ? <Loading /> : (
          <div className="admin-spot-table">
            {filtered.map((spot) => (
              <article className="admin-spot-row" key={spot.id}>
                <img src={spot.coverImage} alt={spot.name} />
                <div>
                  <strong>{spot.name}</strong>
                  <p>{spot.type} · {spot.rating} 分 · 承载 {spot.maxCapacity || '--'}</p>
                  <small>{spot.address}</small>
                </div>
                <span className={cx('status-chip', spot.approved ? 'ok' : 'muted')}>{spot.approved ? '已上架' : '未上架'}</span>
                <div className="row-actions">
                  <button className="secondary" type="button" onClick={() => setEditing(normalizeSpotDraft(spot))}><Edit3 size={15} /> 编辑</button>
                  <button className="secondary danger" type="button" onClick={() => deleteSpot(spot.id)}><Trash2 size={15} /> 删除</button>
                </div>
              </article>
            ))}
            {!filtered.length && <div className="empty-state compact">没有匹配的景点</div>}
          </div>
        )}
      </div>
      <aside className="admin-editor-panel">
        {editing ? (
          <SpotEditorForm draft={editing} setDraft={setEditing} onSave={saveSpot} onCancel={() => setEditing(null)} />
        ) : (
          <div className="admin-editor-empty">
            <SlidersHorizontal size={30} />
            <strong>选择一个景点开始编辑</strong>
            <p>可维护封面、坐标、开放时间、票价、图集和详情文案。</p>
          </div>
        )}
      </aside>
    </section>
  );
}

function SpotEditorForm({ draft, setDraft, onSave, onCancel }) {
  const [saving, setSaving] = useState(false);
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-spot-form" onSubmit={submit}>
      <PanelTitle icon={Edit3} title={draft.id ? '编辑景点' : '新增景点'} meta={draft.id ? `ID ${draft.id}` : '新记录'} />
      <label>名称<input value={draft.name || ''} onChange={(e) => update('name', e.target.value)} required /></label>
      <div className="form-row">
        <label>类型<input value={draft.type || ''} onChange={(e) => update('type', e.target.value)} /></label>
        <label>评分<input type="number" min="0" max="5" step="0.1" value={draft.rating ?? ''} onChange={(e) => update('rating', e.target.value)} /></label>
      </div>
      <label>地址<input value={draft.address || ''} onChange={(e) => update('address', e.target.value)} /></label>
      <div className="form-row">
        <label>纬度<input type="number" step="0.000001" value={draft.latitude ?? ''} onChange={(e) => update('latitude', e.target.value)} /></label>
        <label>经度<input type="number" step="0.000001" value={draft.longitude ?? ''} onChange={(e) => update('longitude', e.target.value)} /></label>
      </div>
      <div className="form-row">
        <label>票价<input type="number" min="0" step="0.01" value={draft.price ?? ''} onChange={(e) => update('price', e.target.value)} /></label>
        <label>承载量<input type="number" min="0" value={draft.maxCapacity ?? ''} onChange={(e) => update('maxCapacity', e.target.value)} /></label>
      </div>
      <label>封面图<input value={draft.coverImage || ''} onChange={(e) => update('coverImage', e.target.value)} placeholder="https://..." /></label>
      <label>图集 URL<textarea value={draft.galleryText || ''} onChange={(e) => update('galleryText', e.target.value)} placeholder="每行一个图片地址" rows={3} /></label>
      <label>描述<textarea value={draft.description || ''} onChange={(e) => update('description', e.target.value)} rows={4} /></label>
      <label>游览建议<textarea value={draft.guide || ''} onChange={(e) => update('guide', e.target.value)} rows={3} /></label>
      <div className="form-row">
        <label>开放时间<input value={draft.openHours || ''} onChange={(e) => update('openHours', e.target.value)} /></label>
        <label>最佳季节<input value={draft.bestSeason || ''} onChange={(e) => update('bestSeason', e.target.value)} /></label>
      </div>
      <label className="check-row"><input type="checkbox" checked={draft.approved !== false} onChange={(e) => update('approved', e.target.checked)} /> 上架展示</label>
      <div className="form-actions">
        <button className="secondary" type="button" onClick={onCancel}>取消</button>
        <button type="submit" disabled={saving}><CheckCircle2 size={16} /> {saving ? '保存中' : '保存景点'}</button>
      </div>
    </form>
  );
}

function SubmissionManager({ submissions, loading, onChanged }) {
  const [filter, setFilter] = useState('PENDING');
  const [remarks, setRemarks] = useState({});
  const [message, setMessage] = useState('');
  const shown = submissions.filter((item) => filter === 'ALL' || item.status === filter);

  async function audit(id, action) {
    const remark = remarks[id] || '';
    await api(`/api/admin/submissions/${id}/${action}`, {
      method: 'POST',
      body: JSON.stringify({ auditRemark: remark })
    });
    setMessage(action === 'approve' ? '申报已通过，并已生成正式景点。' : '申报已驳回。');
    onChanged();
  }

  return (
    <section className="admin-panel-main">
      <div className="admin-panel-head">
        <PanelTitle icon={MessageCircle} title="用户申报" meta={`${shown.length} 条`} />
        <div className="admin-filter">
          <ListFilter size={16} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="PENDING">待审核</option>
            <option value="APPROVED">已通过</option>
            <option value="REJECTED">已驳回</option>
            <option value="ALL">全部</option>
          </select>
        </div>
      </div>
      {message && <div className="message">{message}</div>}
      {loading ? <Loading /> : (
        <div className="submission-grid">
          {shown.map((item) => (
            <article className="submission-card" key={item.id}>
              <div className="submission-cover">
                {item.photoUrls?.[0] ? <img src={item.photoUrls[0]} alt={item.name} /> : item.videoUrls?.[0] ? <video src={item.videoUrls[0]} controls /> : <Image size={28} />}
                <span className={cx('status-chip', item.status === 'APPROVED' && 'ok', item.status === 'REJECTED' && 'danger')}>{item.status || 'PENDING'}</span>
              </div>
              <div className="submission-body">
                <strong>{item.name}</strong>
                <p>{item.type || '未分类'} · {item.address}</p>
                <small>{(item.photoUrls?.length || 0)} 张图片 · {(item.videoUrls?.length || 0)} 个视频</small>
                <small>{item.description || item.reason || '暂无补充说明'}</small>
                {item.status === 'PENDING' && (
                  <>
                    <textarea value={remarks[item.id] || ''} onChange={(e) => setRemarks((current) => ({ ...current, [item.id]: e.target.value }))} placeholder="审核备注，可选" rows={2} />
                    <div className="row-actions">
                      <button type="button" onClick={() => audit(item.id, 'approve')}><CheckCircle2 size={16} /> 通过并入库</button>
                      <button className="secondary danger" type="button" onClick={() => audit(item.id, 'reject')}><X size={16} /> 驳回</button>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
          {!shown.length && <div className="empty-state compact">当前没有申报记录</div>}
        </div>
      )}
    </section>
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
    <section className="admin-workspace single">
      <div className="admin-panel-main admin-home-manager">
      <PanelTitle icon={Sparkles} title="首页内容管理" meta="Hero 轮播 + 精选景点" />
      {message && <div className="message">{message}</div>}
      <div className="admin-section-title">
        <h3>Hero 轮播图</h3>
        <button className="secondary" type="button" onClick={addSlide}><Plus size={16} /> 新增轮播</button>
      </div>
      <div className="hero-admin-list">
        {slides.map((slide, index) => (
          <div className="hero-admin-item" key={index}>
            <div className="hero-admin-preview">
              <img src={slide.imageUrl} alt={slide.title || 'Hero'} />
              <span>#{index + 1}</span>
            </div>
            <div className="hero-admin-fields">
              <input value={slide.imageUrl || ''} onChange={(e) => updateSlide(index, 'imageUrl', e.target.value)} placeholder="高清图片 URL" />
              <div className="form-row">
                <input value={slide.eyebrow || ''} onChange={(e) => updateSlide(index, 'eyebrow', e.target.value)} placeholder="角标" />
                <input value={slide.title || ''} onChange={(e) => updateSlide(index, 'title', e.target.value)} placeholder="标题" />
              </div>
              <textarea value={slide.body || ''} onChange={(e) => updateSlide(index, 'body', e.target.value)} placeholder="描述" rows={2} />
              <div className="form-row">
                <input value={slide.actionText || ''} onChange={(e) => updateSlide(index, 'actionText', e.target.value)} placeholder="按钮文字" />
                <input value={slide.actionHref || ''} onChange={(e) => updateSlide(index, 'actionHref', e.target.value)} placeholder="按钮链接，如 /guide" />
              </div>
              <div className="row-actions">
                <label className="check-row"><input type="checkbox" checked={slide.enabled !== false} onChange={(e) => updateSlide(index, 'enabled', e.target.checked)} /> 启用</label>
                <button className="secondary danger" type="button" onClick={() => removeSlide(index)}><Trash2 size={15} /> 删除</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="admin-section-title">
        <h3>精选景点</h3>
        <small>勾选后会出现在首页推荐区</small>
      </div>
      <div className="featured-admin-grid">
        {spots.map((spot) => (
          <label className="featured-admin-item" key={spot.id}>
            <input type="checkbox" checked={featuredIds.includes(spot.id)} onChange={() => toggleFeatured(spot.id)} />
            <img src={spot.coverImage} alt={spot.name} />
            <span><strong>{spot.name}</strong><small>{spot.type} · {spot.rating} 分</small></span>
          </label>
        ))}
      </div>
      <div className="form-actions">
        <button type="button" onClick={saveHomeContent}><CheckCircle2 size={16} /> 保存首页配置</button>
      </div>
      </div>
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

function ListPanel({ title, icon: Icon, items, empty, className = '', actionText, onAction, emptyActionText, onEmptyAction, panelActionText, onPanelAction }) {
  return (
    <section className={cx('panel list-panel', className)}>
      <div className="list-panel-head">
        <PanelTitle icon={Icon} title={title} />
        {panelActionText && <button type="button" className="secondary list-panel-action" onClick={onPanelAction}>{panelActionText}</button>}
      </div>
      <div className="list">
        {items.length ? items.map((item, index) => (
          <div className="list-item profile-list-item" key={`${item.title}-${index}`}>
            <span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </span>
            {(item.actionText || actionText) && <button type="button" className="secondary list-panel-action" onClick={item.onAction || onAction}>{item.actionText || actionText}</button>}
          </div>
        )) : (
          <div className="empty-state compact profile-empty-state">
            <span>{empty}</span>
            {emptyActionText && <button type="button" className="secondary list-panel-action" onClick={onEmptyAction}>{emptyActionText}</button>}
          </div>
        )}
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
    window.travelCloudCurrentUserId = user.loggedIn && user.userId ? user.userId : defaultUserId;
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
  }, [theme]);

  const props = { route, addRoute, removeRoute, clearRoute: () => saveRoute([]) };
  let page = <Home addRoute={addRoute} />;
  if (path === '/guide') page = <Guide {...props} />;
  if (path === '/guide/locate') page = <GuideLanding />;
  if (path === '/guide/nearby') page = <Guide {...props} useSavedLocation />;
  if (path === '/route') page = <RoutePage {...props} />;
  if (path === '/square') page = <Square account={account} />;
  if (path === '/ai-writer') page = <TravelWritingStudio account={account} />;
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
      {path !== '/login' && path !== '/guide/locate' && <Header account={account} refreshAccount={refreshAccount} path={path} theme={theme} setTheme={setTheme} />}
      {page}
      {path !== '/admin' && <TravelPetAssistant path={path} />}
      {path !== '/login' && path !== '/guide/locate' && <footer className="footer">
        <span>陌路寻景 · 智慧文旅综合服务平台</span>
        <button className="icon-button ghost" onClick={async () => {
          await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
          await api('/api/admin/auth/logout', { method: 'POST' }).catch(() => {});
          refreshAccount();
        }} title="退出登录"><LogOut size={16} /></button>
      </footer>}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
