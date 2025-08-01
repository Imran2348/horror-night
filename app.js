// app.js

import * as THREE from 'three';

let scene, camera, renderer;
let controls = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};
let velocity = new THREE.Vector3();

init();
animate();

function init() {
  // Création scène
  scene = new THREE.Scene();

  // Caméra
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 5); // hauteur yeux

  // Renderer
  renderer = new THREE.WebGLRenderer({canvas: document.getElementById('gameCanvas')});
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Sol
  const floorGeometry = new THREE.PlaneGeometry(20, 20);
  const floorMaterial = new THREE.MeshStandardMaterial({color: 0x222222});
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI/2;
  scene.add(floor);

  // Murs simple (couloir)
  const wallGeometry = new THREE.BoxGeometry(0.5, 3, 20);
  const wallMaterial = new THREE.MeshStandardMaterial({color: 0x444444});
  const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
  leftWall.position.set(-10, 1.5, 0);
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
  rightWall.position.set(10, 1.5, 0);
  scene.add(rightWall);

  // Un cube dans le couloir
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
  const cube = new THREE.Mesh(boxGeometry, boxMaterial);
  cube.position.set(0, 0.5, -5);
  scene.add(cube);

  // Lumière
  const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffaa00, 1, 30);
  pointLight.position.set(0, 3, 0);
  scene.add(pointLight);

  // Gestion clavier
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function onKeyDown(event) {
  switch(event.code) {
    case 'KeyZ': controls.forward = true; break;
    case 'KeyS': controls.backward = true; break;
    case 'KeyQ': controls.left = true; break;
    case 'KeyD': controls.right = true; break;
  }
}

function onKeyUp(event) {
  switch(event.code) {
    case 'KeyZ': controls.forward = false; break;
    case 'KeyS': controls.backward = false; break;
    case 'KeyQ': controls.left = false; break;
    case 'KeyD': controls.right = false; break;
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Vitesse simple
  const speed = 0.05;
  if (controls.forward) camera.position.z -= speed;
  if (controls.backward) camera.position.z += speed;
  if (controls.left) camera.position.x -= speed;
  if (controls.right) camera.position.x += speed;

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

