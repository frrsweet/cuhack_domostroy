const welcomeScreen = document.querySelector('#welcome-screen');
const dashboard = document.querySelector('#dashboard');
const startButton = document.querySelector('#start-button');
const sosModal = document.querySelector('#sos-modal');
const temperature = document.querySelector('#temperature');
const playButton = document.querySelector('#play-button');
let currentTemperature = 21;
let isPlaying = false;

startButton.addEventListener('click', () => {
  welcomeScreen.classList.add('leaving');
  window.setTimeout(() => {
    welcomeScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    dashboard.classList.add('arriving');
  }, 500);
});

document.querySelector('#temp-down').addEventListener('click', () => setTemperature(-1));
document.querySelector('#temp-up').addEventListener('click', () => setTemperature(1));
function setTemperature(delta) {
  currentTemperature = Math.min(28, Math.max(16, currentTemperature + delta));
  temperature.textContent = `${currentTemperature}°`;
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

function updateClock() {
  const now = new Date();
  document.querySelector('#current-time').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
updateClock();
window.setInterval(updateClock, 30000);
