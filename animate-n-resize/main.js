import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x0afafa,
  wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);

camera.position.z = 5;
scene.add(cube);

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

function animate(time) {
  cube.scale.x = Math.sin(time / 1000) + 2;
  cube.position.z = Math.sin(time / 1000);
  cube.rotation.y = Math.PI * Math.sin(time / 1000);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
