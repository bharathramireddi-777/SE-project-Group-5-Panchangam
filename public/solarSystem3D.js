/**
 * Realistic 3D Solar System Engine (Accretion Disc & Golden Planetary Ring Plane)
 * Recreated precisely to match the user's reference image:
 * - Radiant incandescent golden Sun with corona light shafts
 * - Expansive, tilted, multi-grooved luminous golden orbital ring disc
 * - Realistic shadow/light terminators on revolving planets
 * - Ambient starfield, nebula glow, and shooting star streak
 */

// Procedural Shaders & Textures
function createGoldenDiscTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Concentric golden ring grooves (matching the reference image)
  const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.08, 'rgba(255, 200, 80, 0.15)');
  grad.addColorStop(0.18, 'rgba(255, 180, 50, 0.85)');
  grad.addColorStop(0.25, 'rgba(180, 100, 20, 0.3)');
  grad.addColorStop(0.32, 'rgba(255, 215, 90, 0.95)');
  grad.addColorStop(0.40, 'rgba(210, 140, 40, 0.4)');
  grad.addColorStop(0.48, 'rgba(255, 230, 130, 0.9)');
  grad.addColorStop(0.55, 'rgba(160, 90, 20, 0.2)');
  grad.addColorStop(0.65, 'rgba(255, 195, 70, 0.85)');
  grad.addColorStop(0.74, 'rgba(180, 110, 30, 0.35)');
  grad.addColorStop(0.82, 'rgba(255, 220, 100, 0.8)');
  grad.addColorStop(0.92, 'rgba(200, 130, 40, 0.3)');
  grad.addColorStop(0.98, 'rgba(255, 190, 60, 0.6)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add fine granular noise for realistic dust particles
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 220, 0.4)' : 'rgba(255, 120, 0, 0.3)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createSunGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 240, 180, 0.95)');
  grad.addColorStop(0.45, 'rgba(255, 160, 30, 0.6)');
  grad.addColorStop(0.7, 'rgba(255, 90, 0, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  return new THREE.CanvasTexture(canvas);
}

function createPlanetTexture(baseHex, craterHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = craterHex;
  for (let i = 0; i < 45; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = 8 + Math.random() * 25;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

// 3D Solar System Instance
function init3DSolarSystem(containerId, onSelectPlanet) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene & Camera matching the reference angle
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 5000);
  
  // Set cinematic perspective matching the uploaded image (tilted view looking towards Sun)
  camera.position.set(-140, 180, 420);

  // WebGL Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.6;
  container.appendChild(renderer.domElement);

  // OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 1600;
  controls.minDistance = 40;
  controls.target.set(0, 0, 0);

  // 1. STARFIELD & COSMIC DUST
  const starGeo = new THREE.BufferGeometry();
  const starCount = 4200;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    const rad = 1400 + Math.random() * 800;
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    starPos[i] = rad * Math.sin(phi) * Math.cos(theta);
    starPos[i + 1] = rad * Math.sin(phi) * Math.sin(theta);
    starPos[i + 2] = rad * Math.cos(phi);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.8,
    transparent: true,
    opacity: 0.85
  });
  const starfield = new THREE.Points(starGeo, starMat);
  scene.add(starfield);

  // 2. SHOOTING STAR (Comet streak in bottom left, as seen in image)
  const cometGeo = new THREE.BufferGeometry();
  const cometPoints = [
    new THREE.Vector3(-380, -90, 180),
    new THREE.Vector3(-260, -40, 240)
  ];
  cometGeo.setFromPoints(cometPoints);
  const cometMat = new THREE.LineBasicMaterial({
    color: 0xa5f3fc,
    transparent: true,
    opacity: 0.75,
    linewidth: 2
  });
  const comet = new THREE.Line(cometGeo, cometMat);
  scene.add(comet);

  // 3. CENTRAL INCANDESCENT SUN (సూర్యుడు)
  const sunGeo = new THREE.SphereGeometry(32, 64, 64);
  const sunMat = new THREE.MeshBasicMaterial({
    color: 0xfff3d6,
  });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  // Sun Corona Flare Sprite (blinding golden halo like the image)
  const spriteMat = new THREE.SpriteMaterial({
    map: createSunGlowTexture(),
    color: 0xffaa00,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.95
  });
  const sunSprite = new THREE.Sprite(spriteMat);
  sunSprite.scale.set(220, 220, 1);
  scene.add(sunSprite);

  // Sun Core Point Light
  const sunLight = new THREE.PointLight(0xffedd5, 3.8, 2500, 0.25);
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0x181824, 0.4);
  scene.add(ambientLight);

  // 4. GOLDEN ACCRETION / ORBITAL RING PLANE (Matching the uploaded image)
  // Tilted at a dramatic angle
  const RING_INNER = 55;
  const RING_OUTER = 520;
  const discGeo = new THREE.RingGeometry(RING_INNER, RING_OUTER, 128);
  const discMat = new THREE.MeshBasicMaterial({
    map: createGoldenDiscTexture(),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const goldenDisc = new THREE.Mesh(discGeo, discMat);
  goldenDisc.rotation.x = Math.PI / 2.35; // Dramatic tilt
  goldenDisc.rotation.y = -Math.PI / 8;
  scene.add(goldenDisc);

  // Fine particle cloud around the golden ring plane
  const ringParticleCount = 2000;
  const ringParticleGeo = new THREE.BufferGeometry();
  const ringParticlePos = new Float32Array(ringParticleCount * 3);
  for (let i = 0; i < ringParticleCount; i++) {
    const r = RING_INNER + Math.random() * (RING_OUTER - RING_INNER);
    const theta = Math.random() * Math.PI * 2;
    ringParticlePos[i * 3] = r * Math.cos(theta);
    ringParticlePos[i * 3 + 1] = (Math.random() - 0.5) * 8; // slight thickness
    ringParticlePos[i * 3 + 2] = r * Math.sin(theta);
  }
  ringParticleGeo.setAttribute('position', new THREE.BufferAttribute(ringParticlePos, 3));
  const ringParticleMat = new THREE.PointsMaterial({
    color: 0xffd580,
    size: 2.2,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const ringDust = new THREE.Points(ringParticleGeo, ringParticleMat);
  ringDust.rotation.copy(goldenDisc.rotation);
  scene.add(ringDust);

  // 5. REVOLVING PLANETS ON THE GOLDEN ORBITAL DISC
  const planetsConfig = [
    { name: "Mercury", telugu: "బుధ గ్రహం", radius: 5.5, orbitDist: 85, speed: 0.016, baseColor: "#a3a3a3", craterColor: "#525252", info: "సూర్యునికి అత్యంత సమీప బుధుడు. విద్యాబుద్ధులు, వాక్చాతుర్యానికి కారకుడు." },
    { name: "Venus", telugu: "శుక్ర గ్రహం", radius: 8.5, orbitDist: 130, speed: 0.012, baseColor: "#fef08a", craterColor: "#ca8a04", info: "అత్యంత ప్రకాశవంతమైన శుక్రుడు. కళలు, సౌందర్యం మరియు సమృద్ధికి అధిపతి." },
    { name: "Earth", telugu: "భూమి & చంద్రుడు", radius: 10.5, orbitDist: 185, speed: 0.009, baseColor: "#38bdf8", craterColor: "#15803d", hasMoon: true, info: "మన భూమి. చంద్రుని గమనం ఆధారంగా తిథి, నక్షత్ర పంచాంగం లెక్కించబడుతుంది." },
    { name: "Mars", telugu: "కుజ గ్రహం", radius: 7.2, orbitDist: 245, speed: 0.007, baseColor: "#ea580c", craterColor: "#9a3412", info: "అంగారకుడు / కుజుడు. అపారమైన ధైర్య సాహసాలు, సేనాధిపత్యం, శక్తికి ప్రతీక." },
    { name: "Jupiter", telugu: "గురు గ్రహం (బృహస్పతి)", radius: 22.0, orbitDist: 325, speed: 0.004, baseColor: "#fbbf24", craterColor: "#b45309", info: "మహా గురుడు. దైవానుగ్రహం, ఉన్నత జ్ఞానం, పుత్రసంతానం, సమస్త శుభాలకు కారకుడు." },
    { name: "Saturn", telugu: "శని గ్రహం (వలయాలు)", radius: 17.5, orbitDist: 415, speed: 0.0028, baseColor: "#eab308", craterColor: "#854d0e", info: "సౌర కుటుంబంలో అద్భుత వలయాలు గల శని భగవానుడు. న్యాయాధిపతి, కర్మఫల ప్రదాత." },
    { name: "Uranus", telugu: "అరుణ / ఇంద్ర గ్రహం", radius: 11.5, orbitDist: 485, speed: 0.0019, baseColor: "#67e8f9", craterColor: "#0284c7", info: "మంచు తుఫానుల నీలి-ఆకుపచ్చని సుదూర గ్రహం." }
  ];

  const planetNodes = [];
  let moonMesh = null;
  let earthNodeRef = null;

  planetsConfig.forEach(p => {
    const geo = new THREE.SphereGeometry(p.radius, 48, 48);
    const mat = new THREE.MeshStandardMaterial({
      map: createPlanetTexture(p.baseColor, p.craterColor),
      roughness: 0.75,
      metalness: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = p;
    scene.add(mesh);

    if (p.hasMoon) {
      earthNodeRef = mesh;
      const moonGeo = new THREE.SphereGeometry(2.8, 24, 24);
      const moonMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
      moonMesh = new THREE.Mesh(moonGeo, moonMat);
      scene.add(moonMesh);
    }

    planetNodes.push({
      mesh,
      data: p,
      angle: Math.random() * Math.PI * 2
    });
  });

  // Raycasting for planet clicks
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerDown(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetNodes.map(pn => pn.mesh));

    if (intersects.length > 0) {
      const selected = intersects[0].object.userData;
      if (typeof onSelectPlanet === 'function') {
        onSelectPlanet(selected);
      }
    }
  }
  renderer.domElement.addEventListener('pointerdown', onPointerDown);

  function onWindowResize() {
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  }
  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  let isRunning = true;
  let moonAngle = 0;

  function animate() {
    if (!isRunning) return;
    requestAnimationFrame(animate);

    // Subtle sun pulsation
    const time = Date.now() * 0.0015;
    const pulseScale = 1 + 0.03 * Math.sin(time);
    sunSprite.scale.set(220 * pulseScale, 220 * pulseScale, 1);

    // Rotate golden ring disc slowly
    goldenDisc.rotation.z += 0.0008;
    ringDust.rotation.z += 0.0008;

    // Orbit planets along the tilted disc plane
    planetNodes.forEach(pn => {
      pn.angle += pn.data.speed * 0.55;
      
      // Calculate coordinates on the tilted golden plane
      const r = pn.data.orbitDist;
      // Coordinates in local disc plane:
      const localX = Math.cos(pn.angle) * r;
      const localY = Math.sin(pn.angle) * r;

      // Transform by goldenDisc rotation
      const vec = new THREE.Vector3(localX, localY, 0);
      vec.applyEuler(goldenDisc.rotation);

      pn.mesh.position.copy(vec);
      pn.mesh.rotation.y += 0.01;
    });

    // Orbit Moon around Earth
    if (moonMesh && earthNodeRef) {
      moonAngle += 0.035;
      const mDist = 18;
      moonMesh.position.set(
        earthNodeRef.position.x + Math.cos(moonAngle) * mDist,
        earthNodeRef.position.y + Math.sin(moonAngle) * 6,
        earthNodeRef.position.z + Math.sin(moonAngle) * mDist
      );
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  return {
    destroy: () => {
      isRunning = false;
      window.removeEventListener('resize', onWindowResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    },
    focusPlanet: (planetName) => {
      const found = planetNodes.find(pn => pn.data.name.toLowerCase().includes(planetName.toLowerCase()));
      if (found) {
        controls.target.copy(found.mesh.position);
        camera.position.set(
          found.mesh.position.x + found.data.radius * 3.5,
          found.mesh.position.y + found.data.radius * 2.5,
          found.mesh.position.z + found.data.radius * 4.5
        );
      }
    },
    resetView: () => {
      controls.target.set(0, 0, 0);
      camera.position.set(-140, 180, 420);
    }
  };
}
