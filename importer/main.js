import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader";

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
renderer.setSize(viewport.width, viewport.height);
document.body.appendChild(renderer.domElement);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
);

const material = new THREE.MeshNormalMaterial();

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load("models/model.glb", (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
    }
  });

  scene.add(gltf.scene);
  renderer.render(scene, camera);
});

camera.position.z = 5;

onresize = () => {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;

  camera.aspect = viewport.width / viewport.height;
  camera.updateProjectionMatrix();

  renderer.setSize(viewport.width, viewport.height);
  renderer.render(scene, camera);
};

renderer.render(scene, camera);
