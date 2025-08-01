import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const overlay     = document.getElementById('overlay');
const startButton = document.getElementById('startButton');
const canvas      = document.getElementById('canvas');

let camera, scene, renderer, controls;
let move = {forward:false, backward:false, left:false, right:false};
let velocity = new THREE.Vector3();
let prevTime = performance.now();

startButton.addEventListener('click', () => {
  overlay.style.display = 'none';
  controls.lock();
});

init();
animate();

function init() {
  // Scène & Caméra
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // Sol
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  floor.rotation.x = -Math.PI/2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Lumières
  const ambient = new THREE.HemisphereLight(0x888888, 0x000000, 1.2);
  const dir     = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(5,10,7);
  dir.castShadow = true;
  scene.add(ambient, dir);

  // Charger l'école
  const loader = new GLTFLoader();
  loader.load('assets/models/school.glb', gltf => {
    const school = gltf.scene;
    school.traverse(node => {
      if (node.isMesh) {
        node.castShadow = node.receiveShadow = true;
      }
    });
    scene.add(school);
  });

  // Controls FPS
  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  // Événements clavier
  document.addEventListener('keydown', e => {
    switch(e.code){
      case 'KeyW': move.forward  = true; break;
      case 'KeyS': move.backward = true; break;
      case 'KeyA': move.left     = true; break;
      case 'KeyD': move.right    = true; break;
    }
  });
  document.addEventListener('keyup', e => {
    switch(e.code){
      case 'KeyW': move.forward  = false; break;
      case 'KeyS': move.backward = false; break;
      case 'KeyA': move.left     = false; break;
      case 'KeyD': move.right    = false; break;
    }
  });

  // Redimensionnement
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  if (controls.isLocked) {
    // Appliquer friction
    velocity.x -= velocity.x * 10 * delta;
    velocity.z -= velocity.z * 10 * delta;

    // Direction de déplacement
    const dir = new THREE.Vector3(
      (move.right  ? 1 : 0) - (move.left  ? 1 : 0),
      0,
      (move.backward ? 1 : 0) - (move.forward ? 1 : 0)
    ).normalize();

    // Vitesse
    const speed = 5;
    if (dir.length()) {
      velocity.x -= dir.x * speed * delta;
      velocity.z -= dir.z * speed * delta;
    }

    // Déplacement
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }

  renderer.render(scene, camera);
  prevTime = time;
}
