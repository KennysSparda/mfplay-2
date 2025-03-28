export default function HomeVideo(home) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  home.appendChild(renderer.domElement);

  // Create a video element
  const video = document.createElement('video');
  video.src = 'assets/logo/mfplay.mp4';
  video.autoplay = true;
  video.loop = true;
  video.preload = 'auto';
  video.muted = true;
  video.play();

  // Create a video texture
  const videoTexture = new THREE.VideoTexture(video);
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024, { format: THREE.RGBFormat });
  const cubeCamera = new THREE.CubeCamera(0.1, 1, cubeRenderTarget);
  scene.add(cubeCamera);
  // Create a TV geometry and material
  const tvGeometry = new THREE.BoxGeometry(5.9, 3.4, 0.01);
  const tvMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
  const tv = new THREE.Mesh(tvGeometry, tvMaterial);
  scene.add(tv);

  // Create the back of the TV with LEDs
  const backGeometry = new THREE.BoxGeometry(6, 3.5, 0.1);
  const backMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa, 
    metalness: 1, 
    roughness: 0, 
    envMap: cubeRenderTarget.texture
  });
  const back = new THREE.Mesh(backGeometry, backMaterial);
  back.position.z = -0.1;
  tv.add(back);

  // Create LEDs
  const ledGeometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);
  const ledMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const leds = [];
  for (let i = -1.8; i <= 1.8; i += 0.1) {
    for (let j = -1.1; j <= 1.1; j += 0.1) {
      const led = new THREE.Mesh(ledGeometry, ledMaterial);
      led.position.set(i, j, -0.01);
      back.add(led);
      leds.push(led);
    }
  }

  const particleCount = 100;
  const particles = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    // Começa do centro
    particlePositions[i * 3] = 0
    particlePositions[i * 3 + 1] = 0
    particlePositions[i * 3 + 2] = 0
  
    // Direção aleatória em 360°
    const theta = Math.random() * 2 * Math.PI
    const phi = Math.acos(2 * Math.random() - 1)
  
    const x = Math.sin(phi) * Math.cos(theta)
    const y = Math.sin(phi) * Math.sin(theta)
    const z = Math.cos(phi)
  
    const speed = Math.random() * 0.02 + 0.005
  
    particleVelocities[i * 3] = x * speed
    particleVelocities[i * 3 + 1] = y * speed
    particleVelocities[i * 3 + 2] = z * speed
  }
  

  particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particles.setAttribute('velocity', new THREE.BufferAttribute(particleVelocities, 3));
  const particleMaterial = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.02 });
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  
  // Handle mouse events
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0
  };

  home.addEventListener('mousedown', (event) => {
    isDragging = true;
    previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY
    };
  });

  home.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const deltaMove = {
        x: event.offsetX - previousMousePosition.x,
        y: event.offsetY - previousMousePosition.y
      };

      tv.rotation.y -= deltaMove.x * 0.003;
      tv.rotation.x -= deltaMove.y * 0.003;

      previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
      };
    }
  });

  home.addEventListener('mouseup', () => {
    isDragging = false;
  });

  home.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  function animate() {
    back.visible = false; // Esconde a TV antes de capturar
    cubeCamera.update(renderer, scene);
    back.visible = true; // Mostra a TV de novo
  

    
    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.geometry.attributes.velocity.array;

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (positions[i * 3 + 2] > 5) {
        positions[i * 3] = 1;
        positions[i * 3 + 1] = 1;
        positions[i * 3 + 2] = 0;
      }
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}