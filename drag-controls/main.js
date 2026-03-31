import * as THREE from "three";
import { DragControls } from "three/addons/controls/DragControls.js";

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
});
const cube = new THREE.Mesh(geometry, material);

const cube2 = new THREE.Mesh(geometry, material);

camera.position.z = 5;
scene.add(cube, cube2);

const objects = [];

objects.push(cube, cube2);

console.log(objects);

const controls = new DragControls(objects, camera, renderer.domElement);

controls.addEventListener("hoveron", (event) => {
  event.object.scale.set(1.1, 1.1, 1.1);
});
controls.addEventListener("hoveroff", (event) => {
  event.object.scale.set(1, 1, 1);
});

controls.addEventListener("drag", (event) => {
  event.object.scale.set(1.2, 1.2, 1.2);
});
controls.addEventListener("dragend", (event) => {
  event.object.scale.set(1, 1, 1);
});

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

function animate(time) {
  cube.rotation.y = Math.PI * Math.sin(time / 1000);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
