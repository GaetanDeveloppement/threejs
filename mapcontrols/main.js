import * as THREE from "three";
import GUI from "lil-gui";

import { DragControls } from "three/addons/controls/DragControls";
import { MapControls } from "three/addons/controls/MapControls.js";
import { AnaglyphEffect } from "three/addons/effects/AnaglyphEffect";

import { HDRLoader } from "three/addons/loaders/HDRLoader";

// Scene

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 200, -200);

// State

const objects = [];
let controls, renderer, effect, envMap, dragControls, coloredSpheres;

let scrollProgress = 1;
let panOffsetZ = 0;
let prevTargetZ = 0;

// Init

async function init() {
  initRenderer();
  initScene();
  initControls();
  // initGrab();
  initHelpers();
  // initGUI();
  await initEnv();

  window.onresize = onWindowResize;
  window.addEventListener("click", onClick);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("wheel", onWheel, { passive: true });
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setAnimationLoop(animate);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setPixelRatio(2);
  document.body.appendChild(renderer.domElement);

  effect = new AnaglyphEffect(renderer);
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.toneMapping = THREE.ACESFilmicToneMapping;
  effect.planeDistance = 4;
}

function initScene() {
  const geometry = new THREE.BoxGeometry();
  geometry.translate(0, 0.5, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
  });

  const mesh = new THREE.InstancedMesh(geometry, material, 500);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < 500; i++) {
    dummy.position.x = Math.random() * 1600 - 800;
    dummy.position.y = 0;
    dummy.position.z = Math.random() * 1600 - 800;
    dummy.scale.x = 20;
    dummy.scale.y = Math.random() * 80 + 10;
    dummy.scale.z = 20;

    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);

    scene.add(mesh);
  }
}

function initControls() {
  controls = new MapControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enableRotate = false;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;
}

function initGrab() {
  dragControls = new DragControls(objects, camera, renderer.domElement);

  dragControls.addEventListener("hoveron", (event) => {
    event.object.scale.set(1.1, 1.1, 1.1);
  });
  dragControls.addEventListener("hoveroff", (event) => {
    event.object.scale.set(1, 1, 1);
  });

  dragControls.addEventListener("drag", (event) => {
    event.object.scale.set(1.2, 1.2, 1.2);
    controls.enabled = false;
  });
  dragControls.addEventListener("dragend", (event) => {
    event.object.scale.set(1, 1, 1);
    controls.enabled = true;
  });
}

function initHelpers() {
  const gridHelper = new THREE.GridHelper(10, 20);
  const axesHelper = new THREE.AxesHelper(5);
  gridHelper.position.y = -0.5;
  scene.add(gridHelper, axesHelper);
}

function initGUI() {
  const gui = new GUI();
  const params = {
    color: "#baba0f",
    scale: 1,
  };

  gui.addColor(params, "color").onChange(() => {
    coloredSphere.material.color.set(params.color);
  });

  gui.add(params, "scale", 0.5, 2).onChange(() => {
    objects.forEach((obj) => obj.scale.setScalar(params.scale));
  });
}

async function initEnv() {
  const hdrLoader = new HDRLoader();
  envMap = await hdrLoader.loadAsync("textures/pergola_walkway_2k.hdr");
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envMap;
  scene.background = envMap;
}

// Events

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick() {}

function onMouseMove(event) {}

function onWheel(event) {
  scrollProgress += event.deltaY * 0.001;
  scrollProgress = Math.max(0, Math.min(1, scrollProgress));
}

// Loop

function animate() {
  controls.update();

  const offset = 100;

  panOffsetZ += controls.target.z - prevTargetZ;
  controls.target.z = panOffsetZ + scrollProgress * -200 + offset;
  prevTargetZ = controls.target.z;

  const min = 200;
  const max = 600;
  const distance = min + scrollProgress * (max - min);
  const direction = camera.position.clone().sub(controls.target).normalize();
  camera.position.copy(controls.target).addScaledVector(direction, distance);

  renderer.render(scene, camera);
}

init();
