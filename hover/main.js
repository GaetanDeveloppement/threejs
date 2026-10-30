import * as THREE from "three";
import GUI from "lil-gui";

import { DragControls } from "three/addons/controls/DragControls";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { AnaglyphEffect } from "three/addons/effects/AnaglyphEffect";

import { HDRLoader } from "three/addons/loaders/HDRLoader";

// Scene

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

// State

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let oldHoveredObject = null;
let clickedObject = null;

const objects = [];
let controls, renderer, effect, envMap, dragControls, coloredSphere, baseScale;


// Init

async function init() {
  initRenderer();
  initScene();
  initControls();
  // initGrab();
  // initHelpers();
  // initGUI();
  await initEnv();

  window.onresize = onWindowResize;
  window.addEventListener("click", onClick);
  window.addEventListener("mousemove", onMouseMove);
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
  const sphereGeometry = new THREE.SphereGeometry(0.4, 64, 32);
  const sphereConfigs = [
    {
      type: "physical",
      params: { transmission: 1.0, thickness: 2.0, roughness: 0.0 },
    },
    {
      type: "standard",
      params: { metalness: 0.0, roughness: 1.0 },
    },
    {
      type: "standard",
      params: { metalness: 1.0, roughness: 0.0 },
    },
    {
      type: "standard",
      params: { metalness: 1.0, roughness: 0.5, color: 0x888888 },
    },
    {
      type: "standard",
      params: { metalness: 0.0, roughness: 0.0, color: 0xbaba0f },
    },
  ];

  sphereConfigs.forEach(({ type, params }, index) => {
    const sphere = new THREE.Mesh(sphereGeometry);

    if (type === "physical") {
      sphere.material = new THREE.MeshPhysicalMaterial(params);
    } else {
      sphere.material = new THREE.MeshStandardMaterial(params);
    }

    sphere.position.x = index - 2;
    scene.add(sphere);
    objects.push(sphere);

    if (index === 4) coloredSphere = sphere;
  });
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
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

function onClick() {
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(objects);

  objects.forEach((o) => (o.name = ""));

  if (intersects.length) {
    clickedObject = intersects[0].object;
    clickedObject.name = "active";

    const objPos = clickedObject.position;
    controls.target.set(objPos.x, objPos.y, objPos.z);
    camera.position.set(objPos.x, objPos.y, objPos.z + 1.5);
  } else {
    clickedObject = null;
    controls.target.set(0, 0, 0);
    camera.position.set(0, 0, 5);
  }
}

function onMouseMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(objects);

  const hoveredObject = intersects[0]?.object ?? null;

  if (hoveredObject !== oldHoveredObject) {
    oldHoveredObject = hoveredObject;
  }
}

// Loop

function animate(time) {
  baseScale = (Math.sin(time / 1000) + 3) / 4;

  objects.forEach((object) => {
    if (object.name === "active") {
      object.scale.setScalar(1.3);
    } else if (object === oldHoveredObject) {
      object.scale.setScalar(baseScale * 1.2);
    } else {
      object.scale.setScalar(baseScale);
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

init();
