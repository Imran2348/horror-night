let camera, scene, renderer, player;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.6;

  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(1, 5, 1);
  scene.add(light);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(100, 10, 1),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  wall.position.z = -50;
  wall.position.y = 5;
  scene.add(wall);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'w') moveForward = true;
    if (e.key === 's') moveBackward = true;
    if (e.key === 'a') moveLeft = true;
    if (e.key === 'd') moveRight = true;
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'w') moveForward = false;
    if (e.key === 's') moveBackward = false;
    if (e.key === 'a') moveLeft = false;
    if (e.key === 'd') moveRight = false;
  });

  setupJoystick();
}

function animate() {
  requestAnimationFrame(animate);

  const speed = 0.1;
  if (moveForward) camera.position.z -= speed;
  if (moveBackward) camera.position.z += speed;
  if (moveLeft) camera.position.x -= speed;
  if (moveRight) camera.position.x += speed;

  renderer.render(scene, camera);
}

function setupJoystick() {
  const joystick = document.getElementById('joystick');
  let active = false;
  let startX, startY;

  joystick.addEventListener('touchstart', (e) => {
    active = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  joystick.addEventListener('touchmove', (e) => {
    if (!active) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    moveForward = dy < -10;
    moveBackward = dy > 10;
    moveLeft = dx < -10;
    moveRight = dx > 10;
  });

  joystick.addEventListener('touchend', () => {
    moveForward = moveBackward = moveLeft = moveRight = false;
    active = false;
  });
}
