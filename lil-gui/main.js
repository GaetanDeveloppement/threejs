import * as THREE from "three";
import GUI from "lil-gui";

const gui = new GUI();
const params = {
  color: "#0afffa",
  x: 0,
  y: 0,
  z: 0,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x00ffff,
});

gui.addColor(params, "color").onChange(() => {
  boxMaterial.color.set(params.color);
  renderer.render(scene, camera);
});

const cube = new THREE.Mesh(boxGeometry, boxMaterial);

const folder = gui.addFolder("Position");
folder.add(params, "x", -10, 10).onChange(() => {
  cube.position.x = params.x;
});
folder.add(params, "y", -10, 10).onChange(() => {
  cube.position.y = params.y;
});
folder.add(params, "z", -10, 10).onChange(() => {
  cube.position.z = params.z;
});
folder.onChange(() => renderer.render(scene, camera));

cube.castShadow = true;

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff00ff,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;

scene.add(cube, plane);

camera.position.set(1, 2, 4);
camera.lookAt(cube.position);

const ambLight = new THREE.AmbientLight(0xffffff, 1);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);

dirLight.position.set(0, 5, 0);
dirLight.target.position.set(-5, 0, 2);
dirLight.castShadow = true;
scene.add(ambLight, dirLight, dirLight.target);

renderer.render(scene, camera);
