import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');

let scene, camera, renderer, clock, mixers = [];

startButton.onclick = () => {
  overlay.style.display = 'none';
  init();
  animate();
};

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({canvas: document.getElementById('canvas'), antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // Lumières
  const ambient = new THREE.AmbientLight(0x404040, 1.5);
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(5,10,7);
  scene.add(ambient, dir);

  // Sol
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({color: 0x111111})
  );
  ground.rotation.x = -Math.PI/2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Charger modèle 3D de l'école (fichier à mettre dans assets/models/school.glb)
  const loader = new GLTFLoader();
  loader.load('assets/models/school.glb', (gltf) => {
    scene.add(gltf.scene);
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
  renderer.render(scene, camera);
}
