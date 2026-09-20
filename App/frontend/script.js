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
const autopilotModal = document.getElementById('autopilotModal');
const routeMapModal = document.getElementById('routeMapModal');
const driverArrivalModal = document.getElementById('driverArrivalModal');
const tripScreen = document.getElementById('tripScreen');
const closeModal = document.getElementById('closeModal');
const closeWarning = document.getElementById('closeWarning');
const closeRouteMap = document.getElementById('closeRouteMap');
const autopilotStartButton = document.getElementById('autopilotStartButton');
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
let robotArrivalSeconds = 180;
let robotArrivalTimerId = null;

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

function openAutopilotModal() {
  autopilotModal.classList.remove('hidden');
  autopilotModal.setAttribute('aria-hidden', 'false');
  initAutopilotModel();
}

function closeAutopilotModal() {
  autopilotModal.classList.add('hidden');
  autopilotModal.setAttribute('aria-hidden', 'true');
}

function updateRobotWaitText() {
  const minutes = Math.floor(robotArrivalSeconds / 60);
  const seconds = robotArrivalSeconds % 60;
  driverStatusText.textContent = `Бесплатное ожидание - ${minutes}:${String(seconds).padStart(2, '0')}`;
}

function startRobotCountdown() {
  clearInterval(robotArrivalTimerId);
  robotArrivalSeconds = 180;
  updateRobotWaitText();

  robotArrivalTimerId = setInterval(() => {
    if (robotArrivalSeconds <= 0) {
      clearInterval(robotArrivalTimerId);
      driverStatusText.textContent = 'Бесплатное ожидание - 0:00';
      return;
    }

    robotArrivalSeconds -= 1;
    updateRobotWaitText();
  }, 1000);
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

function openAutopilotArrivalFlow() {
  closeAutopilotModal();
  driverArrivalModal.classList.remove('hidden');
  driverArrivalModal.setAttribute('aria-hidden', 'false');

  driverStatusTitle.textContent = 'Робот приехал';
  driverStatusText.textContent = 'Бесплатное ожидание - 3:00';
  driverArrivalActions.innerHTML = '';

  const robotInfo = document.createElement('div');
  robotInfo.className = 'driver-profile';
  robotInfo.innerHTML = `
    <img src="images/robot.png" alt="Робот" />
    <div class="driver-meta">
      <strong>Робот</strong>
      <span>Частное лИИцо</span>
    </div>
  `;

  const existingProfile = document.querySelector('.driver-profile');
  if (existingProfile) {
    existingProfile.replaceWith(robotInfo);
  } else {
    driverArrivalModal.querySelector('.driver-card').appendChild(robotInfo);
  }

  startRobotCountdown();
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
autopilotStartButton.addEventListener('click', openAutopilotArrivalFlow);

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

  closeOrderModal();
  openAutopilotModal();

  try {
    const response = await fetch('http://localhost:8000/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Ошибка API');
    }
  } catch (error) {
    console.error(error);
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

function applyDarkCarStyle(object) {
  object.traverse((child) => {
    if (!child.isMesh || !child.geometry) {
      return;
    }

    const materialList = Array.isArray(child.material) ? child.material : [child.material];
    materialList.forEach((material) => {
      if (!material || !material.color) {
        return;
      }

      material.color.multiplyScalar(0.45);
      material.color.offsetHSL(0, 0, -0.08);
      material.flatShading = true;

      if (material.emissive) {
        material.emissive = new THREE.Color(0x111111);
      }
    });

    if (materialList.length === 1 && materialList[0]) {
      child.material = materialList[0];
    } else {
      child.material = materialList.filter(Boolean);
    }

    if (child.geometry) {
      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(child.geometry, 14),
        new THREE.LineBasicMaterial({
          color: 0x9aa8b8,
          transparent: true,
          opacity: 0.9,
        }),
      );
      outline.renderOrder = 2;
      child.add(outline);
    }
  });
}

function initAutopilotModel() {
  const container = document.getElementById('carModelContainer');
  if (!container || typeof THREE === 'undefined' || !THREE.OBJLoader || !THREE.MTLLoader) {
    return;
  }

  if (container.dataset.initialized === 'true') {
    return;
  }

  container.dataset.initialized = 'true';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f9fb);

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
  camera.position.set(0, 1.8, 18);

  const ambient = new THREE.AmbientLight(0xffffff, 1.6);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(8, 10, 14);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xaec6ff, 0.7);
  fillLight.position.set(-10, 6, -8);
  scene.add(fillLight);

  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  let rotationX = 0.5;
  let rotationY = -0.8;
  let scale = 1;
  let isDragging = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.load(
    'model/model.mtl',
    (materials) => {
      materials.preload();

      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        'model/model.obj',
        (object) => {
          object.rotation.x = -Math.PI / 2;
          object.rotation.z = Math.PI * 0.04;

          applyDarkCarStyle(object);

          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          object.position.sub(center);

          const size = box.getSize(new THREE.Vector3());
          const maxSize = Math.max(size.x, size.y, size.z) || 1;
          object.scale.setScalar(9 / maxSize);

          modelGroup.add(object);
          modelGroup.rotation.x = rotationX;
          modelGroup.rotation.y = rotationY;
          modelGroup.scale.setScalar(scale);
        },
        undefined,
        () => {
          console.error('Не удалось загрузить OBJ-модель автомобиля.');
        },
      );
    },
    undefined,
    () => {
      console.error('Не удалось загрузить MTL-файл модели автомобиля.');
    },
  );

  const resizeRenderer = () => {
    const width = container.clientWidth || 280;
    const height = container.clientHeight || 220;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const animate = () => {
    if (!isDragging) {
      rotationY += 0.006;
      modelGroup.rotation.y = rotationY;
    }
    modelGroup.rotation.x = rotationX;
    modelGroup.rotation.y = rotationY;
    modelGroup.scale.setScalar(scale);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  const onPointerDown = (event) => {
    isDragging = true;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    container.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;

    rotationY += deltaX * 0.01;
    rotationX += deltaY * 0.01;
    rotationX = Math.max(-1.2, Math.min(1.2, rotationX));

    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  const onWheel = (event) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1;
    scale = Math.min(2.5, Math.max(0.5, scale + direction * 0.12));
  };

  const onTouchMove = (event) => {
    if (event.touches.length === 2) {
      const [a, b] = [event.touches[0], event.touches[1]];
      const dx = a.clientX - b.clientX;
      const dy = a.clientY - b.clientY;
      const distance = Math.hypot(dx, dy);
      if (!onTouchMove.lastDistance) {
        onTouchMove.lastDistance = distance;
        return;
      }
      const delta = (distance - onTouchMove.lastDistance) * 0.01;
      scale = Math.min(2.5, Math.max(0.5, scale + delta));
      onTouchMove.lastDistance = distance;
    }
  };

  onTouchMove.lastDistance = 0;

  container.addEventListener('pointerdown', onPointerDown);
  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerup', onPointerUp);
  container.addEventListener('pointerleave', onPointerUp);
  container.addEventListener('wheel', onWheel, { passive: false });
  container.addEventListener('touchmove', onTouchMove, { passive: false });
  container.addEventListener('touchend', () => {
    onTouchMove.lastDistance = 0;
  });

  window.addEventListener('resize', resizeRenderer);
  resizeRenderer();
  animate();
}

renderTariffs();
updatePrice();
updateTemperature();
syncAddressPreview();
