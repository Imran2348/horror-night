import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';

const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');

let scene, camera, renderer;

startButton.onclick = () => {
  overlay.style.display = 'none';
  init();
  animate();
};

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(5, 10, 7);
  scene.add(ambient, directional);

  // Ground
  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load('assets/textures/ground.jpg');
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(20, 20);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ map: groundTexture })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Maison
  const loader = new GLTFLoader();
  loader.load('assets/models/house.glb', (gltf) => {
    scene.add(gltf.scene);
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
