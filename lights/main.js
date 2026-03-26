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
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x00ffff,
});

const cube = new THREE.Mesh(boxGeometry, boxMaterial);
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
