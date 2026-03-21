import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

function helpers() {
  const gridHelper = new THREE.GridHelper(10, 20);
  const axesHelper = new THREE.AxesHelper(5);
  gridHelper.position.y = -0.5;
  scene.add(gridHelper, axesHelper);
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xfa0afa,
  wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);

helpers();

function animate(time) {
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
