// Jeu Horror Night - FPS simple dans école hantée

let camera, scene, renderer, controls;
let objects = [];
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let velocity = new THREE.Vector3();
let prevTime = performance.now();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
  camera.position.y = 10;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Controls FPS
  controls = new THREE.PointerLockControls(camera, document.body);
  document.body.addEventListener('click', () => {
    controls.lock();
  });

  scene.add(controls.getObject());

  // Sol
  const floorGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
  const floorMaterial = new THREE.MeshBasicMaterial({color: 0x222222});
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = - Math.PI / 2;
  scene.add(floor);

  // Murs école (simple carré)
  const wallMaterial = new THREE.MeshBasicMaterial({color: 0x444444, wireframe: true});
  const wallGeometry = new THREE.BoxGeometry(200, 40, 2);

  const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall1.position.set(0, 20, -100);
  scene.add(wall1);
  objects.push(wall1);

  const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall2.position.set(0, 20, 100);
  scene.add(wall2);
  objects.push(wall2);

  const wall3 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall3.rotation.y = Math.PI / 2;
  wall3.position.set(-100, 20, 0);
  scene.add(wall3);
  objects.push(wall3);

  const wall4 = new THREE.Mesh(wallGeometry, wallMaterial);
  wall4.rotation.y = Math.PI / 2;
  wall4.position.set(100, 20, 0);
  scene.add(wall4);
  objects.push(wall4);

  // Lumière
  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);

  // Event clavier
  const onKeyDown = function(event) {
    switch(event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;
    }
  };

  const onKeyUp = function(event) {
    switch(event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked === true) {
    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    const speed = 400.0;

    if (moveForward) velocity.z -= speed * delta;
    if (moveBackward) velocity.z += speed * delta;
    if (moveLeft) velocity.x -= speed * delta;
    if (moveRight) velocity.x += speed * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    prevTime = time;
  }

  renderer.render(scene, camera);
}
