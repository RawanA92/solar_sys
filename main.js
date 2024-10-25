import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import starsTexture from "./src/images/stars.jpg";
import sunTexture from "./src/images/sun.jpg";
import mercuryTexture from "./src/images/mercury.jpg";
import venusTexture from "./src/images/venus.jpg";
import earthTexture from "./src/images/earth.jpg";
import marsTexture from "./src/images/mars.jpg";
import jupiterTexture from "./src/images/jupiter.jpg";
import saturnTexture from "./src/images/saturn.jpg";
import saturnRingTexture from "./src/images/saturn ring.png";
import uranusTexture from "./src/images/uranus.jpg";
import uranusRingTexture from "./src/images/uranus ring.png";
import neptuneTexture from "./src/images/neptune.jpg";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const pointLight1 = new THREE.PointLight(0xffffff, 25000, 100000);
const scene = new THREE.Scene();
scene.add(pointLight1);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
  starsTexture,
]);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x7777779999);
scene.add(ambientLight);

const textureload = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(12, 25, 20);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureload.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const pointLight = new THREE.PointLight(0xffffff, 3, 500);
scene.add(pointLight);

function createPlanet(size, texture, position, ring, orbitRadius) {
  const geometry = new THREE.SphereGeometry(size, 25, 20);
  const material = new THREE.MeshStandardMaterial({
    map: textureload.load(texture),
  });
  const planet = new THREE.Mesh(geometry, material);
  const planetObj = new THREE.Object3D();
  planetObj.add(planet);
  scene.add(planetObj);
  planet.position.x = position;

  const orbitGeometry = new THREE.RingGeometry(
    orbitRadius - 0.2,
    orbitRadius + 0.2,
    64
  );
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = -Math.PI / 2;
  scene.add(orbit);

  if (ring) {
    const RingGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      30
    );
    const RingMat = new THREE.MeshStandardMaterial({
      map: textureload.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const Ring = new THREE.Mesh(RingGeo, RingMat);
    planetObj.add(Ring);
    Ring.position.x = position;
    Ring.rotation.x = -0.5 * Math.PI;
  }

  return { planet, planetObj, orbit };
}

const mercury = createPlanet(4, mercuryTexture, 20, null, 20);
const venus = createPlanet(5, venusTexture, 40, null, 40);
const earth = createPlanet(5.56, earthTexture, 60, null, 60);
const mars = createPlanet(5, marsTexture, 80, null, 80);
const jupiter = createPlanet(6, jupiterTexture, 100, null, 100);
const saturn = createPlanet(
  8,
  saturnTexture,
  150,
  {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture,
  },
  150
);
const uranus = createPlanet(
  8.2,
  uranusTexture,
  200,
  {
    innerRadius: 10,
    outerRadius: 20,
    texture: uranusRingTexture,
  },
  200
);
const neptune = createPlanet(5, neptuneTexture, 240, null, 240);

const gui = new GUI();
const planetOptions = {
  Mercury: true,
  Venus: true,
  Earth: true,
  Mars: true,
  Jupiter: true,
  Saturn: true,
  Uranus: true,
  Neptune: true,
};

function toggleOrbit(planetData, orbitName) {
  gui.add(planetOptions, orbitName).onChange((visible) => {
    planetData.orbit.visible = visible;
  });
}

toggleOrbit(mercury, "Mercury");
toggleOrbit(venus, "Venus");
toggleOrbit(earth, "Earth");
toggleOrbit(mars, "Mars");
toggleOrbit(jupiter, "Jupiter");
toggleOrbit(saturn, "Saturn");
toggleOrbit(uranus, "Uranus");
toggleOrbit(neptune, "Neptune");

const loader = new GLTFLoader();
let spaceship;

loader.load(
  "./models/scene.gltf",
  function (gltf) {
    spaceship = gltf.scene;
    spaceship.scale.set(2, 2, 2);
    spaceship.position.set(0, 12, 0);
    scene.add(spaceship);
  },
  undefined,
  function (error) {
    console.error("Error loading the model:", error);
  }
);
const shopLoader = new GLTFLoader().setPath('../solar_sys/lol/Denvers/');
shopLoader.load('scene.gltf', function(gltf){
  scene.add(gltf.scene)
}, undefined, function(error){console.log(error)})
const moveSpeed = 0.5;
const rotateSpeed = 0.05;
const keys = {};

window.addEventListener("keydown", (event) => {
  keys[event.code] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});
function animate() {
  sun.rotateY(0.002);
  mercury.planet.rotateY(0.001);
  mercury.planetObj.rotateY(0.001);
  venus.planet.rotateY(0.0012);
  venus.planetObj.rotateY(0.0015);
  earth.planet.rotateY(0.012);
  earth.planetObj.rotateY(0.0012);
  mars.planet.rotateY(0.013);
  mars.planetObj.rotateY(0.0019);
  jupiter.planet.rotateY(0.04);
  jupiter.planetObj.rotateY(0.0023);
  saturn.planet.rotateY(0.01);
  saturn.planetObj.rotateY(0.0021);
  uranus.planet.rotateY(0.01);
  uranus.planetObj.rotateY(0.0015);
  neptune.planet.rotateY(0.01);
  neptune.planetObj.rotateY(0.001);

  if (spaceship) {
    if (keys["ArrowUp"]) {
      spaceship.translateZ(-moveSpeed);
    }
    if (keys["ArrowDown"]) {
      spaceship.translateZ(moveSpeed);
    }
    if (keys["ArrowLeft"]) {
      spaceship.rotation.y += rotateSpeed;
    }
    if (keys["ArrowRight"]) {
      spaceship.rotation.y -= rotateSpeed;
    }
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
