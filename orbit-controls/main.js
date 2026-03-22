import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const viewport = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  viewport.width / viewport.height,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.cursorStyle = "grab";
controls.autoRotate = true;
controls.autoRotateSpeed = 3;
controls.enableDamping = true;

function render() {
  renderer.render(scene, camera);
}

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x0afafa,
  wireframe: true,
});
const cube = new THREE.Mesh(geometry, material);

camera.position.z = 5;
scene.add(cube);

window.onresize = () => {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;

  camera.aspect = viewport.width / viewport.height;
  camera.updateProjectionMatrix();

  renderer.setSize(viewport.width, viewport.height);
};

function animate(time) {
  controls.update();
  render();
}

renderer.setAnimationLoop(animate);
