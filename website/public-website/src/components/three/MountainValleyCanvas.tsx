import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MountainValleyCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup with gentle atmospheric fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xebf4ff, 0.007); // Light misty morning fog

    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 18, 55);
    camera.lookAt(0, 10, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Warm morning lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.9); // Warm morning ambient
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    sunLight.position.set(40, 50, 20);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const skyFill = new THREE.HemisphereLight(0x93c5fd, 0xdcfce7, 0.6); // Sky blue to valley green
    scene.add(skyFill);

    // Low-poly mountain terrain
    const terrainGeo = new THREE.PlaneGeometry(160, 120, 36, 28);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Distance from center valley (creates a lush valley in the middle)
      const distFromCenter = Math.abs(x);
      const valleyFactor = Math.pow(distFromCenter / 70, 2);

      // Multi-frequency low-poly displacement
      let y =
        Math.sin(x * 0.08) * Math.cos(z * 0.08) * 4 +
        Math.sin(x * 0.03 + z * 0.04) * 8 +
        valleyFactor * 24;

      // Flatten the river/road valley center
      if (distFromCenter < 18) {
        y = Math.min(y, 2.5);
      }

      pos.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshLambertMaterial({
      color: 0x3b82f6, // Travel blue / green valley aesthetic
      flatShading: true,
      wireframe: false,
    });

    // Custom vertex colors for valley vs snow caps
    const count = pos.count;
    const colors = new Float32Array(count * 3);
    const colorLow = new THREE.Color(0x22c55e); // Emerald valley
    const colorMid = new THREE.Color(0x3b82f6); // Alpine blue
    const colorHigh = new THREE.Color(0xf8fafc); // Crisp mountain peak

    for (let i = 0; i < count; i++) {
      const y = pos.getY(i);
      let c: THREE.Color;
      if (y < 4) {
        c = colorLow;
      } else if (y < 15) {
        c = colorMid.clone().lerp(colorLow, 0.4);
      } else {
        c = colorMid.clone().lerp(colorHigh, Math.min(1, (y - 15) / 10));
      }
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainMat.vertexColors = true;

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.set(0, -2, -10);
    scene.add(terrain);

    // Floating Low-Poly Clouds
    const cloudGroup = new THREE.Group();
    const cloudGeo = new THREE.DodecahedronGeometry(2.5, 1);
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      flatShading: true,
      transparent: true,
      opacity: 0.8,
    });

    const clouds: { mesh: THREE.Group; speed: number }[] = [];
    for (let c = 0; c < 7; c++) {
      const cluster = new THREE.Group();
      const puffCount = 4 + Math.floor(Math.random() * 4);
      for (let p = 0; p < puffCount; p++) {
        const puff = new THREE.Mesh(cloudGeo, cloudMat);
        puff.position.set(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 4
        );
        const s = 0.8 + Math.random() * 0.7;
        puff.scale.set(s, s * 0.7, s);
        cluster.add(puff);
      }
      cluster.position.set(
        -80 + Math.random() * 160,
        18 + Math.random() * 12,
        -40 + Math.random() * 60
      );
      cloudGroup.add(cluster);
      clouds.push({ mesh: cluster, speed: 0.03 + Math.random() * 0.03 });
    }
    scene.add(cloudGroup);

    // Subtle birds gliding
    const birdGroup = new THREE.Group();
    const birdGeo = new THREE.BufferGeometry();
    const birdVertices = new Float32Array([
      -0.6, 0.2, 0,
      0, 0, 0,
      0.6, 0.2, 0
    ]);
    birdGeo.setAttribute('position', new THREE.BufferAttribute(birdVertices, 3));
    const birdMat = new THREE.LineBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.6 });

    const birds: { mesh: THREE.Line; speed: number; phase: number }[] = [];
    for (let b = 0; b < 5; b++) {
      const bird = new THREE.Line(birdGeo, birdMat);
      bird.position.set(
        -30 + Math.random() * 60,
        22 + Math.random() * 8,
        -10 + Math.random() * 20
      );
      birdGroup.add(bird);
      birds.push({ mesh: bird, speed: 0.06 + Math.random() * 0.04, phase: Math.random() * Math.PI });
    }
    scene.add(birdGroup);

    // Interactive mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) / halfW;
      mouseY = (e.clientY - halfH) / halfH;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let time = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.01;

      // Move clouds gently across valley
      clouds.forEach((c) => {
        c.mesh.position.x += c.speed;
        if (c.mesh.position.x > 90) {
          c.mesh.position.x = -90;
        }
      });

      // Birds gliding
      birds.forEach((b) => {
        b.mesh.position.x += b.speed;
        b.mesh.position.y += Math.sin(time * 2 + b.phase) * 0.02;
        if (b.mesh.position.x > 60) {
          b.mesh.position.x = -60;
        }
      });

      // Gentle camera mouse sway
      targetX += (mouseX * 5 - targetX) * 0.04;
      targetY += (mouseY * 3 - targetY) * 0.04;

      camera.position.x = targetX;
      camera.position.y = 18 - targetY;
      camera.lookAt(0, 8, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      terrainGeo.dispose();
      terrainMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      birdGeo.dispose();
      birdMat.dispose();

      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-85 dark:opacity-40 transition-opacity duration-500"
      aria-hidden="true"
    />
  );
}
