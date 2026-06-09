const currentUserId = 1;
const chosenRoute = [];
const routeStorageKey = 'travelCloudChosenRoute';
const guidePageSize = 12;
let guideSpots = [];
let guidePage = 1;
let currentLocation = {lat: 28.77, lng: 104.64, label: '宜宾市中心'};
let heroIndex = 0;
let guideMap;
let guideMarker;
let routeMap;
let routeDriving;
let spotMap;
let footprintMap;
let currentCulturalProducts = [];
let selectedCulturalProductId = null;

function showHero(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dots button');
    if (!slides.length) return;
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === heroIndex));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));
}

function shiftHero(step) {
    showHero(heroIndex + step);
}

setInterval(() => showHero(heroIndex + 1), 6500);

document.addEventListener('DOMContentLoaded', () => {
    initAccountBar();
    hydrateChosenRoute();
});

async function api(url, options = {}) {
    const response = await fetch(url, {
        headers: {'Content-Type': 'application/json', ...(options.headers || {})},
        ...options
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({message: '请求失败'}));
        if (response.status === 401 && url.startsWith('/api/admin')) {
            window.location.href = '/login?role=admin';
        }
        throw new Error(error.message || '请求失败');
    }
    return response.json();
}

async function loadSpots() {
    const keyword = document.querySelector('#keyword')?.value || '';
    const type = document.querySelector('#type')?.value || '';
    const sort = document.querySelector('#sort')?.value || 'distance';
    const spots = await api(`/api/spots?keyword=${encodeURIComponent(keyword)}&type=${encodeURIComponent(type)}&lat=${currentLocation.lat}&lng=${currentLocation.lng}&userId=${currentUserId}`);
    spots.sort((a, b) => sort === 'rating' ? b.rating - a.rating : sort === 'price' ? a.price - b.price : a.distanceKm - b.distanceKm);
    guideSpots = spots;
    guidePage = 1;
    renderGuideSpots();
}

function renderGuideSpots() {
    updateGuideMetrics(guideSpots);
    const grid = document.querySelector('#spotGrid');
    if (!grid) return;
    const pageCount = Math.max(1, Math.ceil(guideSpots.length / guidePageSize));
    guidePage = Math.min(Math.max(guidePage, 1), pageCount);
    const pageSpots = guideSpots.slice((guidePage - 1) * guidePageSize, guidePage * guidePageSize);
    grid.innerHTML = pageSpots.length ? pageSpots.map(spot => `
        <article class="card">
            <img src="${spot.coverImage}" alt="${spot.name}">
            <div class="card-body">
                <div class="pill-row">
                    <span class="pill gold">${spot.type}</span>
                    <span class="pill">评分 ${spot.rating}</span>
                    <span class="pill">${spot.distanceKm === 99999 ? '距离待计算' : spot.distanceKm + ' km'}</span>
                    ${spot.checkedIn ? '<span class="pill">已打卡</span>' : ''}
                </div>
                <h2>${spot.name}</h2>
                <p class="muted">${spot.address}</p>
                <div class="actions">
                    <a href="/spots/${spot.id}"><button type="button">查看详情</button></a>
                    <button class="secondary" type="button" onclick="addRouteSpot(${spot.id}, '${escapeJs(spot.name)}', ${spot.latitude}, ${spot.longitude})">加入路线</button>
                </div>
            </div>
        </article>`).join('') : `
        <div class="empty-state guide-list-empty">
            <strong>暂无匹配景点</strong>
            <span>可以换一个关键词、类型或位置再试试。</span>
        </div>`;
    renderGuidePagination(pageCount);
}

function renderGuidePagination(pageCount) {
    const pager = document.querySelector('#guidePagination');
    if (!pager) return;
    if (pageCount <= 1) {
        pager.innerHTML = '';
        return;
    }
    const buttons = Array.from({length: pageCount}, (_, index) => {
        const page = index + 1;
        return `<button class="secondary ${page === guidePage ? 'active' : ''}" type="button" onclick="changeGuidePage(${page})">${page}</button>`;
    }).join('');
    pager.innerHTML = `
        <button class="secondary" type="button" ${guidePage === 1 ? 'disabled' : ''} onclick="changeGuidePage(${guidePage - 1})">上一页</button>
        ${buttons}
        <button class="secondary" type="button" ${guidePage === pageCount ? 'disabled' : ''} onclick="changeGuidePage(${guidePage + 1})">下一页</button>
        <span class="muted">第 ${guidePage} / ${pageCount} 页，共 ${guideSpots.length} 个景点</span>`;
}

function changeGuidePage(page) {
    guidePage = page;
    renderGuideSpots();
    document.querySelector('.section-title.compact-title')?.scrollIntoView({block: 'start', behavior: 'smooth'});
}

function updateGuideMetrics(spots) {
    const total = document.querySelector('#guideSpotTotal');
    const rating = document.querySelector('#guideAverageRating');
    const weather = document.querySelector('#guideWeatherTrend');
    if (total) total.textContent = spots.length;
    if (rating) {
        const average = spots.length
            ? spots.reduce((sum, spot) => sum + Number(spot.rating || 0), 0) / spots.length
            : 0;
        rating.textContent = spots.length ? average.toFixed(1) : '--';
    }
    if (weather) weather.textContent = spots.length ? '3天' : '--';
}

function hasBaiduMap() {
    return typeof BMap !== 'undefined';
}

function toBaiduPoint(lat, lng) {
    return new BMap.Point(Number(lng), Number(lat));
}

function pointFromPlace(place) {
    return toBaiduPoint(place.latitude ?? place.lat, place.longitude ?? place.lng);
}

function setMapFallback(selector, text) {
    const box = document.querySelector(selector);
    if (box) box.textContent = text;
}

function fitMapViewport(map, points, fallbackPoint, zoom = 13) {
    if (!map || !hasBaiduMap()) return;
    const validPoints = points.filter(Boolean);
    if (validPoints.length > 1) {
        map.setViewport(validPoints);
        return;
    }
    map.centerAndZoom(validPoints[0] || fallbackPoint, zoom);
}

function addNamedMarker(map, point, labelText) {
    const marker = new BMap.Marker(point);
    marker.setLabel(new BMap.Label(labelText, {offset: new BMap.Size(18, -10)}));
    map.addOverlay(marker);
    return marker;
}

function initGuideMap() {
    const mapBox = document.querySelector('#guideMap');
    if (mapBox && hasBaiduMap()) {
        guideMap = new BMap.Map('guideMap');
        updateGuideMap(currentLocation);
    } else if (mapBox) {
        mapBox.textContent = '百度地图暂未启用：请在百度控制台为 AK 添加当前域名白名单后再打开地图。';
    }
    loadSpots();
}

function updateGuideMap(location) {
    if (!guideMap || !hasBaiduMap()) return;
    const point = toBaiduPoint(location.lat, location.lng);
    guideMap.clearOverlays();
    guideMap.centerAndZoom(point, 13);
    guideMap.enableScrollWheelZoom(true);
    guideMarker = new BMap.Marker(point);
    guideMap.addOverlay(guideMarker);
    const label = new BMap.Label(location.label || '当前位置', {offset: new BMap.Size(18, -10)});
    guideMarker.setLabel(label);
}

function locateByBaidu() {
    if (!hasBaiduMap()) {
        document.querySelector('#locationText').textContent = '百度地图暂未启用，请先在百度控制台配置 AK 的 Referer 白名单。';
        return;
    }
    const geolocation = new BMap.Geolocation();
    document.querySelector('#locationName').textContent = '正在百度定位...';
    document.querySelector('#locationText').textContent = '正在获取当前位置，请允许浏览器定位权限';
    geolocation.getCurrentPosition(function (result) {
        if (this.getStatus() !== BMAP_STATUS_SUCCESS || !result.point) {
            document.querySelector('#locationName').textContent = currentLocation.label;
            document.querySelector('#locationText').textContent = '百度定位失败，可使用预设位置或自定义坐标';
            alert('百度定位失败，请检查浏览器定位权限或 AK 配置');
            return;
        }
        currentLocation = {
            lat: result.point.lat,
            lng: result.point.lng,
            label: result.address && result.address.city ? result.address.city : '百度定位位置'
        };
        const preset = document.querySelector('#locationPreset');
        if (preset) preset.value = 'custom';
        document.querySelectorAll('.custom-location').forEach(item => item.classList.add('visible'));
        document.querySelector('#customLat').value = currentLocation.lat.toFixed(6);
        document.querySelector('#customLng').value = currentLocation.lng.toFixed(6);
        document.querySelector('#locationName').textContent = currentLocation.label;
        document.querySelector('#locationText').textContent = `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)} · 百度定位成功，已重新计算全国景点距离`;
        updateGuideMap(currentLocation);
        loadSpots();
    }, {enableHighAccuracy: true});
}

function chooseLocation() {
    const select = document.querySelector('#locationPreset');
    const customControls = document.querySelectorAll('.custom-location');
    if (!select) return;
    if (select.value === 'custom') {
        customControls.forEach(item => item.classList.add('visible'));
        document.querySelector('#locationName').textContent = '自定义坐标';
        document.querySelector('#locationText').textContent = '输入经纬度后点击应用';
        return;
    }
    customControls.forEach(item => item.classList.remove('visible'));
    const [lat, lng, label] = select.value.split(',');
    currentLocation = {lat: Number(lat), lng: Number(lng), label};
    document.querySelector('#locationName').textContent = label;
    document.querySelector('#locationText').textContent = `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)} · 已重新计算全国景点距离`;
    updateGuideMap(currentLocation);
    loadSpots();
}

function applyCustomLocation() {
    const lat = Number(document.querySelector('#customLat').value);
    const lng = Number(document.querySelector('#customLng').value);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        alert('请输入有效的经纬度');
        return;
    }
    currentLocation = {lat, lng, label: '自定义坐标'};
    document.querySelector('#locationName').textContent = '自定义坐标';
    document.querySelector('#locationText').textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)} · 已重新计算全国景点距离`;
    updateGuideMap(currentLocation);
    loadSpots();
}

function clearFilters() {
    const keyword = document.querySelector('#keyword');
    const type = document.querySelector('#type');
    const sort = document.querySelector('#sort');
    if (keyword) keyword.value = '';
    if (type) type.value = '';
    if (sort) sort.value = 'distance';
    loadSpots();
}

function addRouteSpot(id, name, lat, lng) {
    if (chosenRoute.find(item => item.id === id)) {
        renderRouteChosen();
        return;
    }
    if (chosenRoute.length >= 5) {
        alert('最多选择5个景点');
        return;
    }
    chosenRoute.push({id, name, lat: Number(lat), lng: Number(lng)});
    saveChosenRoute();
    renderRouteChosen();
}

function addRouteSpotFromButton(button) {
    addRouteSpot(
        Number(button.dataset.id),
        button.dataset.name,
        button.dataset.lat,
        button.dataset.lng
    );
}

function removeRouteSpot(id) {
    const index = chosenRoute.findIndex(item => item.id === Number(id));
    if (index >= 0) {
        chosenRoute.splice(index, 1);
    }
    document.querySelectorAll(`.route-choice input[value="${id}"]`).forEach(input => {
        input.checked = false;
    });
    saveChosenRoute();
    renderRouteChosen();
}

function clearRoute() {
    chosenRoute.length = 0;
    saveChosenRoute();
    renderRouteChosen();
    const result = document.querySelector('#routeResult');
    if (result) {
        result.className = 'route-result empty-state';
        result.innerHTML = '<strong>路线结果将在这里显示</strong><span>选择2-5个景点后点击智能排序，系统会生成推荐顺序、总距离、预计耗时和分段路程。</span>';
    }
    resetRouteMap();
}

function clearRoutePage() {
    clearRoute();
    document.querySelectorAll('.route-choice input').forEach(input => {
        input.checked = false;
    });
}

function toggleRouteSpot(input) {
    const id = Number(input.value);
    const name = input.dataset.name;
    if (input.checked) {
        if (chosenRoute.length >= 5) {
            input.checked = false;
            alert('最多选择5个景点');
            return;
        }
        addRouteSpot(id, name, input.dataset.lat, input.dataset.lng);
        return;
    }
    const index = chosenRoute.findIndex(item => item.id === id);
    if (index >= 0) {
        chosenRoute.splice(index, 1);
    }
    renderRouteChosen();
}

function renderRouteChosen() {
    const box = document.querySelector('#routeChosen');
    if (box) {
        box.innerHTML = chosenRoute.map(item => `<span class="pill">${item.name}</span>`).join('');
    }
    renderGuideRouteChosen();
    if (routeMap && chosenRoute.length) {
        showRouteMarkers(chosenRoute);
    }
}

function saveChosenRoute() {
    localStorage.setItem(routeStorageKey, JSON.stringify(chosenRoute));
}

function hydrateChosenRoute() {
    if (chosenRoute.length) return;
    const saved = JSON.parse(localStorage.getItem(routeStorageKey) || '[]');
    saved
        .filter(item => item && item.id && item.name)
        .slice(0, 5)
        .forEach(item => chosenRoute.push({
            id: Number(item.id),
            name: item.name,
            lat: Number(item.lat),
            lng: Number(item.lng)
        }));
    document.querySelectorAll('.route-choice input').forEach(input => {
        input.checked = chosenRoute.some(item => item.id === Number(input.value));
    });
    renderRouteChosen();
}

function renderGuideRouteChosen() {
    const box = document.querySelector('#guideRouteChosen');
    const count = document.querySelector('#guideRouteCount');
    if (!box) return;
    if (count) count.textContent = `${chosenRoute.length} / 5`;
    if (!chosenRoute.length) {
        box.innerHTML = `
            <div class="empty-state guide-empty-state">
                <strong>暂无已选景点</strong>
                <span>点击景点卡片里的“加入路线”后会显示在这里。</span>
            </div>`;
        return;
    }
    box.innerHTML = chosenRoute.map((item, index) => `
        <div class="guide-selected-item">
            <span>${index + 1}</span>
            <strong>${item.name}</strong>
            <button class="secondary" type="button" onclick="removeRouteSpot(${item.id})">移除</button>
        </div>`).join('');
}

function initRouteMap() {
    const mapBox = document.querySelector('#baiduRouteMap');
    if (!mapBox) return;
    if (!hasBaiduMap()) {
        mapBox.textContent = '百度地图暂未启用：请在百度控制台为 AK 添加当前域名白名单后再打开路线图。';
        return;
    }
    routeMap = new BMap.Map('baiduRouteMap');
    routeMap.centerAndZoom(toBaiduPoint(28.77, 104.64), 11);
    routeMap.enableScrollWheelZoom(true);
}

function resetRouteMap() {
    if (!routeMap) return;
    routeMap.clearOverlays();
    routeMap.centerAndZoom(toBaiduPoint(28.77, 104.64), 11);
}

function drawBaiduRoute(orderedSpots) {
    if (!routeMap || !hasBaiduMap() || orderedSpots.length < 2) return;
    routeMap.clearOverlays();
    const points = orderedSpots.map(spot => pointFromPlace(spot));
    routeDriving = new BMap.DrivingRoute(routeMap, {
        renderOptions: {map: routeMap, autoViewport: true},
        policy: typeof BMAP_DRIVING_POLICY_LEAST_TIME === 'undefined' ? undefined : BMAP_DRIVING_POLICY_LEAST_TIME,
        onSearchComplete: function (results) {
            if (routeDriving.getStatus() !== BMAP_STATUS_SUCCESS) {
                showRouteMarkers(orderedSpots);
            }
        }
    });
    routeDriving.search(points[0], points[points.length - 1], {waypoints: points.slice(1, -1)});
}

function showRouteMarkers(orderedSpots) {
    if (!routeMap || !hasBaiduMap()) return;
    routeMap.clearOverlays();
    const viewport = [];
    orderedSpots.forEach((spot, index) => {
        const point = pointFromPlace(spot);
        viewport.push(point);
        const marker = new BMap.Marker(point);
        marker.setLabel(new BMap.Label(`${index + 1}. ${spot.name}`, {offset: new BMap.Size(18, -10)}));
        routeMap.addOverlay(marker);
    });
    routeMap.setViewport(viewport);
}

function buildBaiduRouteUrl(orderedSpots) {
    const start = orderedSpots[0];
    const end = orderedSpots[orderedSpots.length - 1];
    const waypoints = orderedSpots.slice(1, -1)
        .map(spot => `${spot.latitude},${spot.longitude}`)
        .join('|');
    const params = new URLSearchParams({
        origin: `${start.latitude},${start.longitude}`,
        destination: `${end.latitude},${end.longitude}`,
        mode: 'driving',
        region: '宜宾',
        output: 'html',
        coord_type: 'bd09ll'
    });
    if (waypoints) params.set('waypoints', waypoints);
    return `https://api.map.baidu.com/direction?${params.toString()}`;
}

async function planRoute() {
    if (chosenRoute.length < 2) {
        alert('请至少选择2个景点');
        return;
    }
    const result = await api('/api/routes/plan', {
        method: 'POST',
        body: JSON.stringify({spotIds: chosenRoute.map(item => item.id), mode: 'driving'})
    });
    drawBaiduRoute(result.orderedSpots);
    const segmentCards = result.segments.map((segment, index) => {
        const from = result.orderedSpots.find(spot => spot.id === segment.fromSpotId);
        const to = result.orderedSpots.find(spot => spot.id === segment.toSpotId);
        return `
            <div class="segment-card">
                <span class="segment-index">${index + 1}</span>
                <div>
                    <strong>${from.name} → ${to.name}</strong>
                    <small>${segment.distanceKm} km · 约 ${segment.minutes} 分钟</small>
                </div>
            </div>`;
    }).join('');
    const stepItems = result.orderedSpots.map((spot, index) => `
        <div class="route-step">
            <span>${index + 1}</span>
            <strong>${spot.name}</strong>
        </div>`).join('');
    const baiduRouteUrl = buildBaiduRouteUrl(result.orderedSpots);
    const resultBox = document.querySelector('#routeResult');
    resultBox.className = 'route-result result-ready';
    resultBox.innerHTML = `
        <div class="route-summary">
            <div><strong>${result.totalDistanceKm}</strong><span>总距离 km</span></div>
            <div><strong>${result.totalMinutes}</strong><span>预计分钟</span></div>
            <div><strong>${result.orderedSpots.length}</strong><span>游览景点</span></div>
        </div>
        <div class="route-steps">${stepItems}</div>
        <p class="muted">百度地图会优先绘制驾车路线；下方距离与耗时为后端排序估算，地图路线可用于实际导航参考。</p>
        <div class="actions" style="margin-bottom:16px">
            <a href="${baiduRouteUrl}" target="_blank"><button class="secondary" type="button">打开百度地图导航</button></a>
        </div>
        <h3>分段路程</h3>
        <div class="segment-list">${segmentCards}</div>`;
}

function detailContext() {
    const main = document.querySelector('main[data-spot-id]');
    return {
        spotId: Number(main.dataset.spotId),
        name: main.dataset.spotName || 'Scenic spot',
        lat: main.dataset.lat,
        lng: main.dataset.lng
    };
}

async function initSpotMap() {
    const mapBox = document.querySelector('#spotFacilityMap');
    if (!mapBox) return;
    if (!hasBaiduMap()) {
        setMapFallback('#spotFacilityMap', '百度地图暂未启用：请在百度控制台为 AK 添加当前域名白名单后再查看周边设施地图。');
        const {lat, lng} = detailContext();
        await loadNearbyFacilities(lat, lng);
        return;
    }
    const {name, lat, lng} = detailContext();
    const center = toBaiduPoint(lat, lng);
    spotMap = new BMap.Map('spotFacilityMap');
    spotMap.centerAndZoom(center, 15);
    spotMap.enableScrollWheelZoom(true);
    addNamedMarker(spotMap, center, name);
    await loadNearbyFacilities(lat, lng);
}

async function loadNearbyFacilities(lat, lng) {
    const list = document.querySelector('#facilityList');
    const facilities = await api(`/api/facilities?lat=${lat}&lng=${lng}&radiusKm=8`).catch(() => []);
    if (list) {
        list.innerHTML = facilities.length
            ? facilities.map(item => `<div class="list-item"><strong>${item.name}</strong><br><span class="muted">${item.type} · ${item.distanceKm ?? '-'} km · ${item.rating}分</span></div>`).join('')
            : '<p class="muted">No nearby facilities found.</p>';
    }
    if (!spotMap || !hasBaiduMap()) return;
    const points = [toBaiduPoint(lat, lng)];
    facilities.forEach(item => {
        const point = pointFromPlace(item);
        points.push(point);
        addNamedMarker(spotMap, point, `${item.type}: ${item.name}`);
    });
    fitMapViewport(spotMap, points, toBaiduPoint(lat, lng), 15);
}

async function initSpotDetail() {
    const {spotId} = detailContext();
    document.querySelector('#visitDate').valueAsDate = new Date();
    await initSpotMap();
    await loadCulturalProducts();
    const crowd = await api(`/api/spots/${spotId}/crowd-index`);
    document.querySelector('#crowd').innerHTML = `当前人流：<strong class="status-${crowd.color}">${crowd.level}</strong>，${crowd.currentCount}/${crowd.maxCapacity}`;
    const weather = await api(`/api/spots/${spotId}/weather`);
    renderWeatherPanel(weather);
    await loadReviews();
}

async function loadCulturalProducts() {
    const host = document.querySelector('#culturalProducts');
    if (!host) return;
    const {spotId} = detailContext();
    currentCulturalProducts = await api(`/api/spots/${spotId}/products`).catch(() => []);
    if (!currentCulturalProducts.length) {
        host.innerHTML = '<p class="muted">暂无文创商品。</p>';
        return;
    }
    selectedCulturalProductId = selectedCulturalProductId || currentCulturalProducts[0].id;
    host.innerHTML = currentCulturalProducts.map(product => culturalProductCard(product, true)).join('');
}

function culturalProductCard(product, selectable) {
    const checked = selectedCulturalProductId === product.id ? 'checked' : '';
    const choose = selectable ? `
        <label class="shop-choice">
            <input type="radio" name="culturalProduct" value="${product.id}" ${checked} onchange="selectCulturalProduct(${product.id})">
            <span>选择</span>
        </label>` : '';
    return `
        <article class="cultural-product-card">
            <img src="${product.imageUrl}" alt="${escapeHtml(product.name)}">
            <div>
                <div class="pill-row">
                    <span class="pill gold">${escapeHtml(product.category || '文创')}</span>
                    <span class="pill">库存 ${product.stock ?? 0}</span>
                </div>
                <strong>${escapeHtml(product.name)}</strong>
                <p>${escapeHtml(product.description || '')}</p>
                <div class="shop-buy-row">
                    <span class="shop-price">¥${Number(product.price || 0).toFixed(2)}</span>
                    ${choose}
                </div>
            </div>
        </article>`;
}

function selectCulturalProduct(id) {
    selectedCulturalProductId = id;
}

async function submitCulturalOrder() {
    if (!selectedCulturalProductId) {
        alert('请先选择一件文创商品');
        return;
    }
    const resultBox = document.querySelector('#shopOrderResult');
    const body = {
        productId: selectedCulturalProductId,
        quantity: 1,
        receiverName: document.querySelector('#shopReceiverName').value.trim(),
        receiverPhone: document.querySelector('#shopReceiverPhone').value.trim(),
        shippingAddress: document.querySelector('#shopAddress').value.trim()
    };
    try {
        const result = await api(`/api/cultural-orders?userId=${currentUserId}`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        resultBox.textContent = `下单成功：${result.orderNo}，合计 ¥${Number(result.totalAmount || 0).toFixed(2)}`;
        await loadCulturalProducts();
    } catch (error) {
        resultBox.textContent = error.message || '下单失败';
    }
}

function summarizeSpotWeather(items) {
    const rows = Array.isArray(items) ? items : [];
    if (!rows.length) return '天气概览';
    if (rows.some(item => (item.condition || '').includes('雨'))) return '有降雨风险';
    if (rows.some(item => (item.condition || '').includes('晴'))) return '晴好可游';
    return '天气平稳';
}

function weatherSymbol(icon) {
    return {
        rain: '☔',
        cloud: '☁',
        mist: '〰',
        sun: '☀',
        now: '◉'
    }[icon] || '☀';
}

function renderWeatherPanel(items) {
    const host = document.querySelector('#weather');
    if (!host) return;
    const rows = Array.isArray(items) ? items : [];
    const current = rows[0] || {};
    const days = rows.slice(1, 4);
    host.className = 'weather-panel';
    host.innerHTML = `
        <div class="weather-snapshot">
            <div class="weather-core">
                <div>
                    <span class="weather-tag">${summarizeSpotWeather(rows)}</span>
                    <strong>${current.temperature || '--'}</strong>
                    <p>${current.condition || '--'}</p>
                </div>
                <div class="weather-icon">${weatherSymbol(current.icon)}</div>
            </div>
            <div class="weather-advice">${current.advice || '天气数据加载中，请稍后查看。'}</div>
        </div>
        <div class="weather-days">
            ${days.map(item => `
                <article class="weather-day">
                    <span>${item.period || item.date || '--'}</span>
                    <strong>${item.temperature || '--'}</strong>
                    <p>${item.condition || '--'}</p>
                    <small>${item.wind || '--'} · ${item.rainfall || '--'}</small>
                </article>
            `).join('')}
        </div>
    `;
}

async function checkIn() {
    const {spotId, lat, lng} = detailContext();
    try {
        const result = await api(`/api/spots/${spotId}/check-ins?userId=${currentUserId}&lat=${lat}&lng=${lng}`, {method: 'POST'});
        alert(`打卡成功，累计 ${result.totalCheckedIn} 个景点`);
    } catch (error) {
        alert(error.message);
    }
}

async function playTts() {
    const {spotId} = detailContext();
    const result = await api(`/api/spots/${spotId}/tts`);
    const audio = document.querySelector('#audio');
    audio.src = result.audioUrl;
    audio.style.display = 'block';
    alert('演示模式返回TTS缓存URL；接入云厂商后这里播放MP3。');
}

function navigateSpot() {
    const {lat, lng} = detailContext();
    window.open(`https://api.map.baidu.com/marker?location=${lat},${lng}&title=景点位置&content=旅图云景点导航&output=html`, '_blank');
}

async function reserve() {
    const {spotId} = detailContext();
    const body = {
        spotId,
        visitDate: document.querySelector('#visitDate').value,
        timeSlot: document.querySelector('#timeSlot').value,
        people: Number(document.querySelector('#people').value)
    };
    const result = await api(`/api/reservations?userId=${currentUserId}`, {method: 'POST', body: JSON.stringify(body)});
    document.querySelector('#reservationResult').textContent = `预约成功，核销码：${result.qrCode}`;
    await initSpotDetail();
}

let replyingReviewId = null;

function startReply(reviewId, content) {
    replyingReviewId = reviewId;
    const input = document.querySelector('#reviewContent');
    if (input) {
        input.focus();
        input.placeholder = `回复这条评论：${content.slice(0, 24)}`;
    }
}

async function submitReview() {
    const {spotId} = detailContext();
    const reviewInput = document.querySelector('#reviewContent');
    const content = reviewInput.value.trim();
    if (!content) {
        alert('请先写下评论内容');
        reviewInput.focus();
        return;
    }
    try {
        await api(`/api/community/reviews?userId=${currentUserId}`, {
            method: 'POST',
            body: JSON.stringify({
                spotId,
                score: Number(document.querySelector('#reviewScore').value),
                content,
                parentId: replyingReviewId
            })
        });
    } catch (error) {
        alert(error.message || '评论发布失败');
        return;
    }
    if (reviewInput) {
        reviewInput.value = '';
        reviewInput.placeholder = '写下你的游玩体验';
    }
    replyingReviewId = null;
    await loadReviews();
}

async function loadReviews() {
    const {spotId} = detailContext();
    let reviews = [];
    try {
        reviews = await api(`/api/community/spots/${spotId}/reviews`);
    } catch (error) {
        document.querySelector('#reviews').innerHTML = `<p class="muted">评论加载失败：${escapeHtml(error.message)}</p>`;
        return;
    }
    const roots = reviews.filter(review => !review.parentId);
    const repliesByParent = reviews.reduce((acc, review) => {
        if (review.parentId) {
            acc[review.parentId] = acc[review.parentId] || [];
            acc[review.parentId].push(review);
        }
        return acc;
    }, {});
    const html = roots.length ? roots.map(review => `
        <div class="review-thread">
            <div class="review-card">
                <div class="review-head">
                    <strong>${review.score}分</strong>
                    <span class="muted">${review.createdAt} · ${review.likes}赞 · ${review.replyCount || 0}回复</span>
                </div>
                <p>${escapeHtml(review.content)}</p>
                <div class="actions">
                    <button class="secondary" type="button" onclick="likeReview(${review.id})">点赞</button>
                    <button class="secondary" type="button" onclick="startReply(${review.id}, '${escapeJs(review.content)}')">回复</button>
                </div>
            </div>
            <div class="reply-list">
                ${(repliesByParent[review.id] || []).map(reply => `
                    <div class="reply-card">
                        <div class="review-head">
                            <strong>回复</strong>
                            <span class="muted">${reply.createdAt} · ${reply.likes}赞</span>
                        </div>
                        <p>${escapeHtml(reply.content)}</p>
                        <div class="actions">
                            <button class="secondary" type="button" onclick="likeReview(${reply.id})">点赞</button>
                            <button class="secondary" type="button" onclick="startReply(${review.id}, '${escapeJs(reply.content)}')">再回复</button>
                        </div>
                    </div>`).join('')}
            </div>
        </div>`).join('') : '<p class="muted">还没有评论。</p>';
    document.querySelector('#reviews').innerHTML = html;
}

async function likeReview(id) {
    try {
        await api(`/api/community/reviews/${id}/like`, {method: 'POST'});
    } catch (error) {
        alert(error.message || '点赞失败');
        return;
    }
    await loadReviews();
}

function askSuggestedQuestion(question) {
    const input = document.querySelector('#aiQuestion');
    if (input) input.value = question;
    askSpotAssistant();
}

async function askSpotAssistant() {
    const input = document.querySelector('#aiQuestion');
    const messages = document.querySelector('#aiMessages');
    if (!input || !messages) return;
    const question = input.value.trim();
    if (!question) {
        alert('请输入想问的问题');
        return;
    }
    const {spotId} = detailContext();
    messages.insertAdjacentHTML('beforeend', `<div class="ai-message user">${escapeHtml(question)}</div>`);
    input.value = '';
    const loading = document.createElement('div');
    loading.className = 'ai-message assistant';
    loading.textContent = '正在结合景点知识库分析...';
    messages.appendChild(loading);
    messages.scrollTop = messages.scrollHeight;
    try {
        const result = await api(`/api/spots/${spotId}/assistant`, {
            method: 'POST',
            body: JSON.stringify({question})
        });
        loading.innerHTML = `
            <div>${escapeHtml(result.answer).replace(/\n/g, '<br>')}</div>
            ${renderAssistantProducts(result.productRecommendations || [])}
            <div class="ai-links">
                <strong>联网搜索参考：</strong>
                ${result.webSearchSuggestions.map((link, index) => `<a href="${link}" target="_blank">参考 ${index + 1}</a>`).join('')}
            </div>`;
    } catch (error) {
        loading.textContent = error.message;
    }
    messages.scrollTop = messages.scrollHeight;
}

function renderAssistantProducts(products) {
    if (!products.length) return '';
    return `
        <div class="ai-product-recommendations">
            <strong>文创推荐</strong>
            ${products.map(product => `
                <button class="ai-product-chip" type="button" onclick="focusCulturalProduct(${product.id})">
                    ${escapeHtml(product.name)} · ¥${Number(product.price || 0).toFixed(2)}
                </button>
            `).join('')}
        </div>`;
}

function focusCulturalProduct(id) {
    selectedCulturalProductId = id;
    document.querySelectorAll('input[name="culturalProduct"]').forEach(input => {
        input.checked = Number(input.value) === id;
    });
    document.querySelector('.cultural-shop-panel')?.scrollIntoView({behavior: 'smooth', block: 'start'});
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeJs(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');
}

function initFootprintMap(footprints) {
    const mapId = document.querySelector('#footprintMapLive') ? 'footprintMapLive' : 'footprintMap';
    const mapBox = document.querySelector(`#${mapId}`);
    if (!mapBox) return;
    const spots = footprints.checkedInSpots || [];
    if (!hasBaiduMap()) {
        mapBox.textContent = '百度地图暂未启用：配置 AK 的 Referer 白名单后可查看足迹地图。';
        return;
    }
    footprintMap = new BMap.Map(mapId);
    const defaultPoint = toBaiduPoint(28.77, 104.64);
    footprintMap.enableScrollWheelZoom(true);
    if (!spots.length) {
        footprintMap.centerAndZoom(defaultPoint, 11);
        return;
    }
    const points = spots.map(spot => pointFromPlace(spot));
    spots.forEach((spot, index) => addNamedMarker(footprintMap, points[index], `${index + 1}. ${spot.name}`));
    if (points.length > 1) {
        footprintMap.addOverlay(new BMap.Polyline(points, {
            strokeColor: '#2f8df5',
            strokeWeight: 4,
            strokeOpacity: 0.72
        }));
    }
    fitMapViewport(footprintMap, points, defaultPoint, 11);
}

async function initProfile() {
    const footprints = await api(`/api/users/${currentUserId}/footprints`);
    const legacyMap = document.querySelector('#footprintMap');
    if (legacyMap && document.querySelector('#footprintMapLive')) {
        legacyMap.style.display = 'none';
    }
    initFootprintMap(footprints);
    const footprintTotal = document.querySelector('#footprintTotal');
    const badgeTotal = document.querySelector('#badgeTotal');
    if (footprintTotal) footprintTotal.textContent = footprints.total;
    if (badgeTotal) badgeTotal.textContent = footprints.badges.length;
    const reviewStats = await api(`/api/community/users/${currentUserId}/review-stats`).catch(() => ({likeTotal: 0}));
    const totalLikes = reviewStats.likeTotal || 0;
    const likeNode = document.querySelector('#likeTotal');
    if (likeNode) likeNode.textContent = totalLikes;
    document.querySelector('#badges').innerHTML = footprints.badges.length
        ? footprints.badges.map(badge => `<span class="pill gold">${badge}</span>`).join('')
        : '<span class="muted">继续打卡解锁勋章</span>';
    const reservations = await api(`/api/reservations/mine?userId=${currentUserId}`);
    document.querySelector('#reservations').innerHTML = reservations.map(item => `
        <div class="list-item">景点ID ${item.spotId}<br><span class="muted">${item.visitDate} ${item.timeSlot} · ${item.status}<br>${item.qrCode}</span></div>`).join('') || '<p class="muted">暂无预约。</p>';
    await loadSubmissions();
}

async function submitSpot(event) {
    if (event) event.preventDefault();
    const message = document.querySelector('#submitSpotMessage');
    if (message) {
        message.textContent = '';
        message.classList.remove('error', 'success');
    }
    const photoUrls = (document.querySelector('#subPhotos')?.value || '')
        .split(/\n|,/)
        .map(item => item.trim())
        .filter(Boolean);
    try {
        await api(`/api/community/submissions?userId=${currentUserId}`, {
            method: 'POST',
            body: JSON.stringify({
                name: document.querySelector('#subName').value.trim(),
                type: document.querySelector('#subType').value.trim(),
                address: document.querySelector('#subAddress').value.trim(),
                latitude: document.querySelector('#subLat').value,
                longitude: document.querySelector('#subLng').value,
                photoUrls,
                description: document.querySelector('#subDescription').value.trim(),
                reason: document.querySelector('#subReason').value.trim()
            })
        });
        if (message) {
            message.textContent = '提交成功，已进入平台审核。';
            message.classList.add('success');
        }
        const form = document.querySelector('.submit-form');
        if (form) form.reset();
    } catch (error) {
        if (message) {
            message.textContent = error.message || '提交失败';
            message.classList.add('error');
        } else {
            alert(error.message || '提交失败');
        }
    }
    await loadSubmissions().catch(() => {});
}

async function loadSubmissions() {
    const submissions = await api(`/api/community/submissions/mine?userId=${currentUserId}`);
    document.querySelector('#submissions').innerHTML = submissions.map(item => `
        <div class="list-item"><strong>${item.name}</strong><br><span class="muted">${item.status} · ${item.address}</span></div>`).join('');
}

async function initAdmin() {
    const session = await api('/api/admin/auth/status');
    if (!session.loggedIn) {
        window.location.href = '/admin/login';
        return;
    }
    const sessionInfo = document.querySelector('#adminSessionInfo');
    if (sessionInfo) sessionInfo.textContent = `当前管理员：${session.username || 'admin'}`;
    const spots = await api('/api/admin/spots');
    const spotTotal = document.querySelector('#adminSpotTotal');
    if (spotTotal) spotTotal.textContent = spots.length;
    document.querySelector('#adminSpots').innerHTML = spots.map(spot => `<div class="list-item"><strong>${spot.name}</strong><br><span class="muted">${spot.type} · ${spot.rating}分 · 最大承载 ${spot.maxCapacity}</span></div>`).join('');
    const facilities = await api('/api/admin/facilities');
    const facilityTotal = document.querySelector('#adminFacilityTotal');
    if (facilityTotal) facilityTotal.textContent = facilities.length;
    document.querySelector('#adminFacilities').innerHTML = facilities.map(item => `<div class="list-item"><strong>${item.name}</strong><br><span class="muted">${item.type} · ${item.rating}分 · ${item.address}</span></div>`).join('');
    const submissionBox = document.querySelector('#adminSubmissions');
    if (submissionBox) {
        const submissions = await api('/api/admin/submissions');
        submissionBox.innerHTML = submissions.length ? submissions.map(item => `
            <div class="list-item">
                <strong>${escapeHtml(item.name)}</strong>
                <div class="muted">${escapeHtml(item.type)} · ${escapeHtml(item.status)} · ${escapeHtml(item.address)}</div>
                <p>${escapeHtml(item.description || '暂无描述')}</p>
                <p><strong>推荐理由：</strong>${escapeHtml(item.reason || '暂无')}</p>
                <span class="pill">${(item.photoUrls || []).length} 张照片</span>
                ${item.status === 'PENDING' ? `<button class="secondary" type="button" onclick="approveSubmission(${item.id})">通过审核</button>` : ''}
            </div>`).join('') : '<p class="muted">暂无用户申报。</p>';
    }
}

async function approveSubmission(id) {
    await api(`/api/admin/submissions/${id}/approve`, {method: 'POST'});
    await initAdmin();
}

async function adminLogin(event) {
    event.preventDefault();
    const message = document.querySelector('#adminLoginMessage');
    if (message) {
        message.textContent = '';
        message.classList.remove('error', 'success');
    }
    try {
        await api('/api/admin/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: document.querySelector('#adminUsername').value.trim(),
                password: document.querySelector('#adminPassword').value
            })
        });
        if (message) {
            message.textContent = '登录成功，正在进入后台...';
            message.classList.add('success');
        }
        window.location.href = '/admin';
    } catch (error) {
        if (message) {
            message.textContent = error.message || '登录失败';
            message.classList.add('error');
        } else {
            alert(error.message || '登录失败');
        }
    }
}

async function adminLogout() {
    await api('/api/admin/auth/logout', {method: 'POST'});
    window.location.href = '/login?role=admin';
}

function selectedLoginRole() {
    return document.querySelector('input[name="loginRole"]:checked')?.value || 'user';
}

function syncLoginRole() {
    const role = selectedLoginRole();
    const username = document.querySelector('#loginUsername');
    const password = document.querySelector('#loginPassword');
    const button = document.querySelector('#loginSubmitButton');
    if (!username || !password || !button) return;
    username.value = role === 'admin' ? 'admin' : 'demo';
    password.placeholder = role === 'admin' ? '默认密码 admin123' : '默认密码 demo123';
    button.textContent = role === 'admin' ? '登录管理员后台' : '登录个人中心';
}

function initLoginPage() {
    const role = new URLSearchParams(window.location.search).get('role') === 'admin' ? 'admin' : 'user';
    const radio = document.querySelector(`input[name="loginRole"][value="${role}"]`);
    if (radio) radio.checked = true;
    syncLoginRole();
}

async function loginByRole(event) {
    event.preventDefault();
    const role = selectedLoginRole();
    const message = document.querySelector('#loginMessage');
    if (message) {
        message.textContent = '';
        message.classList.remove('error', 'success');
    }
    try {
        await api(role === 'admin' ? '/api/admin/auth/login' : '/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username: document.querySelector('#loginUsername').value.trim(),
                password: document.querySelector('#loginPassword').value
            })
        });
        if (message) {
            message.textContent = role === 'admin' ? '登录成功，正在进入后台...' : '登录成功，正在进入个人中心...';
            message.classList.add('success');
        }
        window.location.href = role === 'admin' ? '/admin' : '/me';
    } catch (error) {
        if (message) {
            message.textContent = error.message || '登录失败';
            message.classList.add('error');
        } else {
            alert(error.message || '登录失败');
        }
    }
}

async function initAccountBar() {
    const bars = document.querySelectorAll('[data-account-bar]');
    if (!bars.length) return;
    let admin = {loggedIn: false};
    let user = {loggedIn: false};
    try {
        admin = await api('/api/admin/auth/status');
    } catch (error) {
        admin = {loggedIn: false};
    }
    if (!admin.loggedIn) {
        try {
            user = await api('/api/auth/status');
        } catch (error) {
            user = {loggedIn: false};
        }
    }
    bars.forEach(bar => {
        const avatar = bar.querySelector('[data-account-avatar]');
        const name = bar.querySelector('[data-account-name]');
        const hint = bar.querySelector('[data-account-hint]');
        const action = bar.querySelector('[data-account-action]');
        if (admin.loggedIn) {
            if (avatar) avatar.textContent = '管';
            if (name) name.textContent = `管理员 ${admin.username || 'admin'}`;
            if (hint) hint.textContent = '已进入运营身份';
            if (action) {
                action.textContent = '后台';
                action.href = '/admin';
            }
            return;
        }
        if (user.loggedIn) {
            if (avatar) avatar.textContent = '游';
            if (name) name.textContent = `游客 ${user.username || 'demo'}`;
            if (hint) hint.textContent = '足迹与预约已同步';
            if (action) {
                action.textContent = '个人中心';
                action.href = '/me';
            }
            return;
        }
        if (avatar) avatar.textContent = '游';
        if (name) name.textContent = '游客模式';
        if (hint) hint.textContent = '免登录浏览景点';
        if (action) {
            action.textContent = '登录';
            action.href = '/login';
        }
    });
}
function baiduGeoStatusText(status) {
    const map = {
        2: '位置结果不可用（网络或服务异常）',
        3: '定位超时',
        4: '浏览器拒绝定位权限',
        5: '定位请求参数无效',
        6: '浏览器策略阻止定位',
        7: '定位服务不可用',
        8: '定位结果解析超时'
    };
    return map[status] || '未知错误';
}

function applyResolvedLocation(location, sourceText) {
    currentLocation = location;
    const preset = document.querySelector('#locationPreset');
    if (preset) preset.value = 'custom';
    document.querySelectorAll('.custom-location').forEach(item => item.classList.add('visible'));
    document.querySelector('#customLat').value = currentLocation.lat.toFixed(6);
    document.querySelector('#customLng').value = currentLocation.lng.toFixed(6);
    document.querySelector('#locationName').textContent = currentLocation.label;
    document.querySelector('#locationText').textContent = `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)} · ${sourceText}`;
    updateGuideMap(currentLocation);
    loadSpots();
}

function locateByBrowserFallback() {
    if (!navigator.geolocation) {
        return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
        applyResolvedLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: '浏览器定位'
        }, '浏览器定位成功');
    });
}

function locateByBaidu() {
    if (!hasBaiduMap()) {
        document.querySelector('#locationText').textContent = '百度地图暂未启用，请先在百度控制台配置 AK 的 Referer 白名单。';
        locateByBrowserFallback();
        return;
    }
    const geolocation = new BMap.Geolocation();
    document.querySelector('#locationName').textContent = '正在百度定位...';
    document.querySelector('#locationText').textContent = '正在获取当前位置，请允许浏览器定位权限';
    geolocation.getCurrentPosition(function (result) {
        if (this.getStatus() !== BMAP_STATUS_SUCCESS || !result.point) {
            const status = this.getStatus();
            const reason = baiduGeoStatusText(status);
            document.querySelector('#locationName').textContent = currentLocation.label;
            document.querySelector('#locationText').textContent = `百度定位失败（status=${status}: ${reason}），可使用预设位置或自定义坐标`;
            alert(`百度定位失败（status=${status}: ${reason}）。请检查浏览器定位权限、AK 与 Referer 白名单。`);
            locateByBrowserFallback();
            return;
        }
        applyResolvedLocation({
            lat: result.point.lat,
            lng: result.point.lng,
            label: result.address && result.address.city ? result.address.city : '百度定位位置'
        }, '百度定位成功，已重新计算全国景点距离');
    }, {enableHighAccuracy: true});
}
