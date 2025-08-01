// enemy.js
import * as THREE from 'three';

export class Enemy {
  constructor(scene, x = 0, z = -10) {
    this.health = 50;
    this.speed = 1; // m/s
    this.radius = 0.5; // pour collision

    const geo = new THREE.BoxGeometry(1, 2, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x880000 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, 1, z);

    scene.add(this.mesh);
  }

  // Appeler chaque frame : avance vers la position (px, py, pz)
  update(delta, playerPos) {
    if (this.health <= 0) return;
    const dir = new THREE.Vector3().subVectors(playerPos, this.mesh.position);
    const dist = dir.length();
    if (dist > this.radius + 0.5) {
      dir.normalize();
      this.mesh.position.addScaledVector(dir, this.speed * delta);
    }
  }

  // Frapper l'ennemi (dégâts), renvoie true s'il est mort
  hit(damage = 25) {
    this.health -= damage;
    if (this.health <= 0) {
      this.mesh.material.color.set(0x333333);
      return true;
    }
    return false;
  }
}
