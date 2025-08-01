// weapon.js

import * as THREE from 'three';

export class Weapon {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;
    this.canShoot = true;
    this.shootCooldown = 0.5; // secondes

    // Arme simple : un petit cube devant la caméra
    const geometry = new THREE.BoxGeometry(0.2, 0.1, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x555555 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0.3, -0.3, -0.8);
    this.camera.add(this.mesh);

    this.lastShotTime = 0;

    // Rayon laser (ligne)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -10)];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    this.laser = new THREE.Line(lineGeometry, lineMaterial);
    this.laser.visible = false;
    this.camera.add(this.laser);
  }

  shoot() {
    const now = performance.now() / 1000;
    if (!this.canShoot || now - this.lastShotTime < this.shootCooldown) return;

    this.lastShotTime = now;
    this.laser.visible = true;

    // Cache le laser après 100 ms
    setTimeout(() => {
      this.laser.visible = false;
    }, 100);

    // Ici tu peux ajouter la logique pour toucher un ennemi ou objet
    console.log('Bang !');
  }
}

