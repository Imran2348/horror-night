// app.js

import * as THREE from 'three';

let scene, camera, renderer;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let canJump = false;

const moveSpeed = 5;
const runMultiplier = 2;
const gravity = 9.8;
const jumpSpeed = 5;

let prevTime = performance.now();

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  run: false,
  jump: false,
};

let pointerLocked = false;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.6;

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Sol
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Lumières
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);

  // Événements clavier
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // Pointer lock pour souris
  document.body.addEventListener('click', () => {
    if (!pointerLocked) {
      document.body.requestPointerLock();
    }
  });

  document.addEventListener('pointerlockchange', () => {
    pointerLocked = !!document.pointerLockElement;
  });

  // Mouvement souris
  document.addEventListener('mousemove', onMouseMove);

  // Touch pour rotation caméra (tablette)
  initTouchControls();

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function onKeyDown(event) {
  switch (event.code) {
    case 'KeyZ': keys.forward = true; break;
    case 'KeyS': keys.backward = true; break;
    case 'KeyQ': keys.left = true; break;
    case 'KeyD': keys.right = true; break;
    case 'ShiftLeft':
    case 'ShiftRight': keys.run = true; break;
    case 'Space': 
      if (canJump) {
        velocity.y = jumpSpeed;
        canJump = false;
      }
      break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case 'KeyZ': keys.forward = false; break;
    case 'KeyS': keys.backward = false; break;
    case 'KeyQ': keys.left = false; break;
    case 'KeyD': keys.right = false; break;
    case 'ShiftLeft':
    case 'ShiftRight': keys.run = false; break;
  }
}

let pitchObject = new THREE.Object3D();
let yawObject = new THREE.Object3D();
yawObject.position.y = 1.6;
yawObject.add(pitchObject);
pitchObject.add(camera);

let sensitivity = 0.002;

function onMouseMove(event) {
  if (!pointerLocked) return;
  yawObject.rotation.y -= event.movementX * sensitivity;
  pitchObject.rotation.x -= event.movementY * sensitivity;
  pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitchObject.rotation.x));
}

let touchStartX = 0;
let touchStartY = 0;
function initTouchControls() {
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length == 1) {
      touchStartX = e.touches[0].pageX;
      touchStartY = e.touches[0].pageY;
    }
  });
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length == 1) {
      let deltaX = e.touches[0].pageX - touchStartX;
      let deltaY = e.touches[0].pageY - touchStartY;
      yawObject.rotation.y -= deltaX * sensitivity;
      pitchObject.rotation.x -= deltaY * sensitivity;
      pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitchObject.rotation.x));
      touchStartX = e.touches[0].pageX;
      touchStartY = e.touches[0].pageY;
    }
  });
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;

  velocity.y -= gravity * delta; // gravité

  direction.z = Number(keys.forward) - Number(keys.backward);
  direction.x = Number(keys.right) - Number(keys.left);
  direction.normalize();

  let speed = moveSpeed;
  if (keys.run) speed *= runMultiplier;

  if (direction.length() > 0) {
    velocity.x -= direction.x * speed * delta;
    velocity.z -= direction.z * speed * delta;
  }

  yawObject.translateX(-velocity.x * delta);
  yawObject.translateZ(-velocity.z * delta);
  yawObject.position.y += velocity.y * delta;

  if (yawObject.position.y < 1.6) {
    velocity.y = 0;
    yawObject.position.y = 1.6;
    canJump = true;
  }

  renderer.render(scene, camera);
  prevTime = time;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}


