const tariffs = [
  { id: 1, name: 'Вместе', price: 400, image: 'images/1_type.png', autopilot: false },
  { id: 2, name: 'Эконом', price: 500, image: 'images/2_type.png', autopilot: false },
  { id: 3, name: 'Комфорт', price: 600, image: 'images/3_type.png', autopilot: false },
  { id: 4, name: 'Комфорт+++', price: 670, image: 'images/4_type.png', autopilot: false },
  { id: 5, name: 'Бизнес', price: 800, image: 'images/5_type.png', autopilot: false },
  { id: 6, name: 'Без пилота', price: 450, image: 'images/6_type.png', autopilot: true },
];

const orderButton = document.getElementById('orderButton');
const orderModal = document.getElementById('orderModal');
const warningModal = document.getElementById('warningModal');
const routeMapModal = document.getElementById('routeMapModal');
const driverArrivalModal = document.getElementById('driverArrivalModal');
const tripScreen = document.getElementById('tripScreen');
const closeModal = document.getElementById('closeModal');
const closeWarning = document.getElementById('closeWarning');
const closeRouteMap = document.getElementById('closeRouteMap');
const fromPreview = document.getElementById('fromPreview');
const toPreview = document.getElementById('toPreview');
const fromInput = document.getElementById('fromInput');
const toInput = document.getElementById('toInput');
const tariffList = document.getElementById('tariffList');
const confirmOrderButton = document.getElementById('confirmOrderButton');
const totalPrice = document.getElementById('totalPrice');
const driverStatusTitle = document.getElementById('driverStatusTitle');
const driverStatusText = document.getElementById('driverStatusText');
const driverArrivalActions = document.getElementById('driverArrivalActions');
const temperatureValue = document.getElementById('temperatureValue');
const musicToggle = document.getElementById('musicToggle');
const musicPopup = document.getElementById('musicPopup');
const musicInputPanel = document.getElementById('musicInputPanel');
const musicInputLabel = document.getElementById('musicInputLabel');
const musicInput = document.getElementById('musicInput');
const musicConfirm = document.getElementById('musicConfirm');
const musicCancel = document.getElementById('musicCancel');

let selectedTariff = tariffs[0];
let temperature = 25;
let musicChoice = 'radio';
let musicText = 'FM 104.5';

function renderTariffs() {
  tariffList.innerHTML = tariffs
    .map(
      (tariff) => `
        <article class="tariff-card ${tariff.id === selectedTariff.id ? 'selected' : ''}" data-tariff-id="${tariff.id}">
          <img src="${tariff.image}" alt="${tariff.name}" />
          <div class="tariff-name">${tariff.name}</div>
          <div class="tariff-price">${tariff.price} рублей</div>
        </article>
      `,
    )
    .join('');

  tariffList.querySelectorAll('.tariff-card').forEach((card) => {
    card.addEventListener('click', () => {
      const tariff = tariffs.find((item) => item.id === Number(card.dataset.tariffId));
      if (!tariff) return;

      selectedTariff = tariff;
      renderTariffs();
      updatePrice();
    });
  });
}

function updatePrice() {
  totalPrice.textContent = selectedTariff.price;
  confirmOrderButton.textContent = `Заказать такси - ${selectedTariff.price} рублей`;
}

function syncAddressPreview() {
  const fromAddress = fromInput.value.trim() || 'Москва, Гашека, 7';
  const toAddress = toInput.value.trim() || 'Москва, Тверская, 7';
  fromPreview.textContent = fromAddress;
  toPreview.textContent = toAddress;
}

function openModal() {
  orderModal.classList.remove('hidden');
  orderModal.setAttribute('aria-hidden', 'false');
}

function closeOrderModal() {
  orderModal.classList.add('hidden');
  orderModal.setAttribute('aria-hidden', 'true');
}

function openWarningModal() {
  warningModal.classList.remove('hidden');
  warningModal.setAttribute('aria-hidden', 'false');
}

function closeWarningModal() {
  warningModal.classList.add('hidden');
  warningModal.setAttribute('aria-hidden', 'true');
}

function openRouteMapModal() {
  routeMapModal.classList.remove('hidden');
  routeMapModal.setAttribute('aria-hidden', 'false');
}

function closeRouteMapModal() {
  routeMapModal.classList.add('hidden');
  routeMapModal.setAttribute('aria-hidden', 'true');
}

function openDriverArrivalFlow() {
  closeOrderModal();
  driverArrivalModal.classList.remove('hidden');
  driverArrivalModal.setAttribute('aria-hidden', 'false');

  driverStatusTitle.textContent = 'Водитель подъезжает';
  driverStatusText.textContent = 'ожидаемое время приезда - 5 секунд';
  driverArrivalActions.innerHTML = '';

  setTimeout(() => {
    driverStatusTitle.textContent = 'Водитель подъехал';
    driverStatusText.textContent = 'Водитель рядом';
    driverArrivalActions.innerHTML = `
      <button id="waitButton" class="driver-button neutral">Бесплатное ожидание - 10 минут</button>
      <button id="startTripButton" class="driver-button primary">Начать поездку!</button>
    `;

    document.getElementById('startTripButton').addEventListener('click', () => {
      driverArrivalModal.classList.add('hidden');
      tripScreen.classList.remove('hidden');
      tripScreen.setAttribute('aria-hidden', 'false');
    });
  }, 5000);
}

function closeTripScreen() {
  tripScreen.classList.add('hidden');
  tripScreen.setAttribute('aria-hidden', 'true');
}

function updateTemperature() {
  temperatureValue.textContent = temperature;
}

function openMusicPopup() {
  musicPopup.classList.remove('hidden');
  musicPopup.setAttribute('aria-hidden', 'false');
  musicInputPanel.classList.add('hidden');
  musicInput.value = '';
}

function closeMusicPopup() {
  musicPopup.classList.add('hidden');
  musicPopup.setAttribute('aria-hidden', 'true');
  musicInputPanel.classList.add('hidden');
  musicInput.value = '';
}

orderButton.addEventListener('click', openModal);
closeModal.addEventListener('click', closeOrderModal);
closeWarning.addEventListener('click', closeWarningModal);
closeRouteMap.addEventListener('click', closeRouteMapModal);

fromInput.addEventListener('input', syncAddressPreview);
toInput.addEventListener('input', syncAddressPreview);

document.querySelectorAll('.mini-map-button').forEach((button) => {
  button.addEventListener('click', () => openRouteMapModal());
});

confirmOrderButton.addEventListener('click', async () => {
  const payload = {
    from_address: fromInput.value.trim() || 'Москва, Гашека, 7',
    to_address: toInput.value.trim() || 'Москва, Тверская, 7',
    tariff_id: selectedTariff.id,
    route_points: JSON.stringify({
      from: fromInput.value.trim() || 'Москва, Гашека, 7',
      to: toInput.value.trim() || 'Москва, Тверская, 7',
    }),
  };

  if (!selectedTariff.autopilot) {
    openWarningModal();
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Ошибка API');
    }

    openDriverArrivalFlow();
  } catch (error) {
    console.error(error);
    openDriverArrivalFlow();
  }
});

document.querySelectorAll('.temp-button').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.tempAction;
    if (action === 'down') temperature = Math.max(16, temperature - 1);
    if (action === 'up') temperature = Math.min(30, temperature + 1);
    updateTemperature();
  });
});

musicToggle.addEventListener('click', openMusicPopup);

musicPopup.addEventListener('click', (event) => {
  if (event.target === musicPopup) {
    closeMusicPopup();
  }
});

document.querySelectorAll('.music-choice').forEach((button) => {
  button.addEventListener('click', () => {
    musicChoice = button.dataset.choice;
    musicInputPanel.classList.remove('hidden');
    if (musicChoice === 'radio') {
      musicInputLabel.textContent = 'Введите частоту';
      musicInput.placeholder = '104.5';
    } else {
      musicInputLabel.textContent = 'Введите название трека';
      musicInput.placeholder = 'Например: Night Drive';
    }
  });
});

musicConfirm.addEventListener('click', () => {
  const value = musicInput.value.trim();
  if (!value) return;

  if (musicChoice === 'radio') {
    musicText = `FM ${value}`;
  } else {
    musicText = value;
  }

  musicToggle.textContent = `Музыка: ${musicText}`;
  closeMusicPopup();
});

musicCancel.addEventListener('click', closeMusicPopup);

renderTariffs();
updatePrice();
updateTemperature();
syncAddressPreview();
