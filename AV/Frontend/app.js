const STORAGE_PREFIX = 'horizon_';
const welcomeScreen = document.querySelector('#welcome-screen');
const dashboard = document.querySelector('#dashboard');
const startButton = document.querySelector('#start-button');
const sosModal = document.querySelector('#sos-modal');
const temperature = document.querySelector('#temperature');
const playButton = document.querySelector('#play-button');
const driverThoughtsToggle = document.getElementById('driver-thoughts-toggle');
let currentTemperature = 21;
let isPlaying = false;
let bridgeSocket = null;

function resolveLocalNetworkHost() {
  const hostname = window.location.hostname;
  if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && hostname !== '::1') {
    return hostname;
  }
  return 'localhost';
}

function getBridgeUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${resolveLocalNetworkHost()}:8000/horizon`;
}

function sendBridgeState(key, value) {
  if (!bridgeSocket || bridgeSocket.readyState !== WebSocket.OPEN) return;
  bridgeSocket.send(JSON.stringify({ type: 'state', key, value }));
}

function applyBridgeState(key, value) {
  if (!key) return;
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('horizon-sync', { detail: { key } }));
}

function connectBridge() {
  if (!('WebSocket' in window)) return;
  if (bridgeSocket && (bridgeSocket.readyState === WebSocket.OPEN || bridgeSocket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  bridgeSocket = new WebSocket(getBridgeUrl());
  bridgeSocket.addEventListener('open', () => {
    bridgeSocket.send(JSON.stringify({ type: 'hello', source: 'av' }));
  });
  bridgeSocket.addEventListener('message', (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (!payload || payload.type !== 'state' || !payload.key) return;
      applyBridgeState(payload.key, payload.value);
    } catch (_error) {
      // ignore malformed packets
    }
  });
  bridgeSocket.addEventListener('close', () => {
    setTimeout(connectBridge, 1500);
  });
}

function readStorage(key, fallback = null) {
  try {
    const value = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return value === null ? fallback : JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('horizon-sync', { detail: { key } }));
  sendBridgeState(key, value);
}

function showDashboard() {
  welcomeScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
}

function updateRideBanner() {
  const rideRequest = readStorage('rideRequest', null);
  const customerFound = readStorage('customerFound', false);
  const tripStarted = readStorage('tripStarted', false);
  const tripEnded = readStorage('tripEnded', false);
  const banner = document.getElementById('ride-status-banner');
  if (!banner) return;

  if (tripStarted) {
    banner.textContent = 'Поездка активна • маршрут синхронизирован';
    banner.classList.remove('hidden');
    return;
  }

  if (tripEnded) {
    banner.textContent = 'Поездка завершена • безопасная остановка';
    banner.classList.remove('hidden');
    return;
  }

  if (customerFound) {
    banner.textContent = 'Клиент рядом • подтвердите начало поездки';
    banner.classList.remove('hidden');
    return;
  }

  if (rideRequest) {
    banner.textContent = 'Запрос на поездку принят • ищем свободный автомобиль';
    banner.classList.remove('hidden');
    return;
  }

  banner.classList.add('hidden');
}

function syncDriverThoughtsState() {
  if (!driverThoughtsToggle) return;
  const enabled = readStorage('driverThoughtsEnabled', false);
  driverThoughtsToggle.dataset.enabled = String(enabled);
  driverThoughtsToggle.innerHTML = `<span class="app-icon">◌</span><span>${enabled ? 'Выключить мысли водителя' : 'Включить мысли водителя'}</span>`;
}

function syncTripSettings() {
  const settings = readStorage('tripSettings', { temperature: 21, music: 'FM 104.5' });
  if (settings.temperature !== undefined) {
    currentTemperature = Number(settings.temperature);
    const temperatureNode = document.querySelector('#temperature');
    if (temperatureNode) temperatureNode.textContent = `${currentTemperature}°`;
  }
}

function syncFromStorage() {
  const rideRequest = readStorage('rideRequest', null);
  const customerFound = readStorage('customerFound', false);
  const tripStarted = readStorage('tripStarted', false);
  const tripEnded = readStorage('tripEnded', false);

  if (rideRequest || customerFound || tripStarted || tripEnded) {
    showDashboard();
  }

  syncTripSettings();
  syncDriverThoughtsState();
  updateRideBanner();
}

startButton.addEventListener('click', () => {
  welcomeScreen.classList.add('leaving');
  window.setTimeout(() => {
    showDashboard();
    dashboard.classList.add('arriving');
  }, 500);
});

document.querySelector('#temp-down').addEventListener('click', () => setTemperature(-1));
document.querySelector('#temp-up').addEventListener('click', () => setTemperature(1));
function setTemperature(delta) {
  currentTemperature = Math.min(28, Math.max(16, currentTemperature + delta));
  temperature.textContent = `${currentTemperature}°`;
  writeStorage('tripSettings', { temperature: currentTemperature, music: readStorage('tripSettings', { music: 'FM 104.5' }).music || 'FM 104.5' });
}

document.querySelector('#seat-slider').addEventListener('input', (event) => {
  document.querySelector('#seat-value').value = `${event.target.value}%`;
});

document.querySelector('#volume-slider').addEventListener('input', (event) => {
  document.querySelector('#volume-value').value = `${event.target.value}%`;
});

document.querySelectorAll('.mode').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.mode').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

document.querySelectorAll('.preset').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.textContent === '+') return;
    document.querySelectorAll('.preset').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

playButton.addEventListener('click', () => {
  isPlaying = !isPlaying;
  playButton.textContent = isPlaying ? 'Ⅱ' : '▶';
});

function openSupport() {
  document.querySelector('#sos-status').textContent = '';
  document.querySelector('#confirm-sos').textContent = 'Связаться с оператором';
  sosModal.classList.remove('hidden');
}

document.querySelector('#top-sos-button').addEventListener('click', openSupport);
document.querySelector('#close-modal').addEventListener('click', () => sosModal.classList.add('hidden'));
document.querySelector('#confirm-sos').addEventListener('click', (event) => {
  const confirmButton = event.currentTarget;
  confirmButton.textContent = 'Соединение...';
  window.setTimeout(() => {
    confirmButton.textContent = 'Поддержка подключена';
    document.querySelector('#sos-status').textContent = 'Оператор скоро ответит на вызов.';
  }, 700);
});

document.querySelector('#end-trip').addEventListener('click', () => {
  document.querySelector('#sos-status').textContent = 'Поездка завершается. Автомобиль ищет безопасное место для остановки.';
});

document.querySelectorAll('.app-button').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('.app-button').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');
  const panel = document.querySelector(`.${button.dataset.app}-card`);
  if (panel && panel.classList.contains('app-panel')) {
    document.querySelectorAll('.app-panel').forEach((item) => item.classList.remove('app-panel-visible'));
    panel.classList.add('app-panel-visible');
  }
}));

const statusBanner = document.createElement('div');
statusBanner.id = 'ride-status-banner';
statusBanner.className = 'ride-status-banner hidden';
const targetNode = document.querySelector('.dashboard-grid');
if (targetNode) {
  targetNode.insertBefore(statusBanner, targetNode.firstChild);
}

window.addEventListener('storage', (event) => {
  if (event.key && event.key.startsWith(STORAGE_PREFIX)) {
    syncFromStorage();
  }
});
window.addEventListener('horizon-sync', (event) => {
  const key = event.detail?.key;
  if (!key) return;
  if (key.startsWith('ride') || key === 'tripStarted' || key === 'tripEnded' || key === 'customerFound' || key === 'driverThoughtsEnabled' || key === 'tripSettings') {
    syncFromStorage();
  }
});

driverThoughtsToggle?.addEventListener('click', () => {
  const enabled = !readStorage('driverThoughtsEnabled', false);
  writeStorage('driverThoughtsEnabled', enabled);
  syncDriverThoughtsState();
});

function updateClock() {
  const now = new Date();
  document.querySelector('#current-time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
connectBridge();
updateClock();
window.setInterval(updateClock, 30000);
syncFromStorage();
