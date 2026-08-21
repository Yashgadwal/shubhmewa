"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldShow3D, setShouldShow3D] = useState<boolean | null>(null);

  // Network and hardware detection for 3D fallback
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setShouldShow3D(false);
      return;
    }

    // Check device memory (if supported)
    const nav = navigator as any;
    if (nav.deviceMemory && nav.deviceMemory < 4) {
      setShouldShow3D(false);
      return;
    }

    // Check network connection type (if supported)
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (conn) {
      if (conn.saveData || /(2g|3g)/.test(conn.effectiveType || "")) {
        setShouldShow3D(false);
        return;
      }
    }

    // Check screen width (fallback on smaller mobile viewports for performance)
    if (window.innerWidth < 768) {
      setShouldShow3D(false);
      return;
    }

    setShouldShow3D(true);
  }, []);

  useEffect(() => {
    if (!shouldShow3D || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 12;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdf8, 0.6);
    scene.add(ambientLight);

    const studioLight = new THREE.DirectionalLight(0xfff5e6, 1.5); // Warm key light
    studioLight.position.set(5, 5, 5);
    studioLight.castShadow = true;
    studioLight.shadow.mapSize.width = 1024;
    studioLight.shadow.mapSize.height = 1024;
    studioLight.shadow.bias = -0.001;
    scene.add(studioLight);

    const goldFillLight = new THREE.DirectionalLight(0xb88a44, 0.8); // Golden rim light
    goldFillLight.position.set(-5, -3, 2);
    scene.add(goldFillLight);

    // Materials
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xb88a44,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const forestGreenMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x173c2d,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.5,
    });

    const ivoryMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf7f1e8,
      metalness: 0.1,
      roughness: 0.5,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      ior: 1.5,
    });

    // Create 3D Objects representational of dry fruits & packaging
    const objects: { mesh: THREE.Group | THREE.Mesh; basePosition: THREE.Vector3; speed: number; rotSpeed: THREE.Vector3 }[] = [];

    // 1. Almond (Flat Ellipsoid)
    const almondGeo = new THREE.SphereGeometry(1, 32, 16);
    almondGeo.scale(1.5, 0.7, 0.5);
    const almondMesh = new THREE.Mesh(almondGeo, goldMaterial);
    const almondGroup = new THREE.Group().add(almondMesh);
    almondGroup.position.set(-3, 2.5, 1);
    scene.add(almondGroup);
    objects.push({
      mesh: almondGroup,
      basePosition: almondGroup.position.clone(),
      speed: 0.8,
      rotSpeed: new THREE.Vector3(0.005, 0.008, 0.002),
    });

    // 2. Cashew (Kidney shape represented by a curved torus)
    const cashewGeo = new THREE.TorusGeometry(0.8, 0.35, 16, 64, Math.PI * 1.2);
    const cashewMesh = new THREE.Mesh(cashewGeo, ivoryMaterial);
    const cashewGroup = new THREE.Group().add(cashewMesh);
    cashewGroup.position.set(3, 2, -1);
    cashewGroup.rotation.set(0.5, 0.5, 2);
    scene.add(cashewGroup);
    objects.push({
      mesh: cashewGroup,
      basePosition: cashewGroup.position.clone(),
      speed: 0.6,
      rotSpeed: new THREE.Vector3(0.003, 0.004, 0.006),
    });

    // 3. Pistachio (Half shell + green nut inside)
    const pistachioGroup = new THREE.Group();
    const shellGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 1.8, 0, Math.PI);
    const shell1 = new THREE.Mesh(shellGeo, ivoryMaterial);
    shell1.rotation.y = 0.2;
    const shell2 = new THREE.Mesh(shellGeo, ivoryMaterial);
    shell2.rotation.y = -0.2;
    shell2.scale.set(1, 1, -1);
    
    const nutGeo = new THREE.SphereGeometry(0.65, 32, 16);
    nutGeo.scale(1, 0.8, 0.8);
    const pistachioNutMat = new THREE.MeshPhysicalMaterial({
      color: 0x5a8f35, // Pistachio green
      roughness: 0.6,
    });
    const nut = new THREE.Mesh(nutGeo, pistachioNutMat);
    nut.position.set(0, 0, 0);

    pistachioGroup.add(shell1, shell2, nut);
    pistachioGroup.position.set(-2, -2.5, 0);
    scene.add(pistachioGroup);
    objects.push({
      mesh: pistachioGroup,
      basePosition: pistachioGroup.position.clone(),
      speed: 1.0,
      rotSpeed: new THREE.Vector3(0.007, 0.003, 0.004),
    });

    // 4. Gift Hamper Box (Forest green box with gold ribbon)
    const giftBoxGroup = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(2, 1.2, 2);
    const mainBox = new THREE.Mesh(boxGeo, forestGreenMaterial);
    
    const ribbonVGeo = new THREE.BoxGeometry(2.1, 1.25, 0.15);
    const ribbonHGeo = new THREE.BoxGeometry(0.15, 1.25, 2.1);
    const ribbonV = new THREE.Mesh(ribbonVGeo, goldMaterial);
    const ribbonH = new THREE.Mesh(ribbonHGeo, goldMaterial);
    
    giftBoxGroup.add(mainBox, ribbonV, ribbonH);
    giftBoxGroup.position.set(0, -0.5, 2);
    scene.add(giftBoxGroup);
    objects.push({
      mesh: giftBoxGroup,
      basePosition: giftBoxGroup.position.clone(),
      speed: 0.4,
      rotSpeed: new THREE.Vector3(0.002, 0.005, 0.001),
    });

    // 5. Walnut Half (Complex sphere mapping)
    const walnutGeo = new THREE.SphereGeometry(0.9, 16, 16);
    walnutGeo.scale(1.2, 0.9, 0.8);
    const walnutMesh = new THREE.Mesh(walnutGeo, goldMaterial);
    const walnutGroup = new THREE.Group().add(walnutMesh);
    walnutGroup.position.set(2.8, -2, 0.5);
    scene.add(walnutGroup);
    objects.push({
      mesh: walnutGroup,
      basePosition: walnutGroup.position.clone(),
      speed: 0.7,
      rotSpeed: new THREE.Vector3(0.004, 0.006, 0.008),
    });

    // 6. Glass Jar placeholder
    const jarGroup = new THREE.Group();
    const jarCyl = new THREE.CylinderGeometry(0.7, 0.7, 1.8, 32);
    const jar = new THREE.Mesh(jarCyl, glassMaterial);
    const lidGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.2, 32);
    const lid = new THREE.Mesh(lidGeo, goldMaterial);
    lid.position.y = 1.0;
    jarGroup.add(jar, lid);
    jarGroup.position.set(-3.5, 0, -2);
    scene.add(jarGroup);
    objects.push({
      mesh: jarGroup,
      basePosition: jarGroup.position.clone(),
      speed: 0.5,
      rotSpeed: new THREE.Vector3(0.001, 0.004, 0.002),
    });

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 200;
      mouseY = (e.clientY - window.innerHeight / 2) / 200;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(0, 0, 0);

      // Animate each object (float + rotate)
      objects.forEach((obj) => {
        // Floating movement
        obj.mesh.position.y = obj.basePosition.y + Math.sin(elapsedTime * obj.speed + obj.basePosition.x) * 0.25;
        obj.mesh.position.x = obj.basePosition.x + Math.cos(elapsedTime * obj.speed * 0.8 + obj.basePosition.y) * 0.15;

        // Rotation
        obj.mesh.rotation.x += obj.rotSpeed.x;
        obj.mesh.rotation.y += obj.rotSpeed.y;
        obj.mesh.rotation.z += obj.rotSpeed.z;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [shouldShow3D]);

  // Render static WebP fallback while loading, or if fallback is active
  if (shouldShow3D === false) {
    return (
      <div className="relative w-full h-full min-h-[400px] md:min-h-[550px] flex items-center justify-center overflow-hidden">
        <img
          src="/images/hero_fruits.jpg"
          alt="Premium Dry Fruits and Gift Hampers"
          className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl transition-all duration-700 ease-out"
        />
        {/* Soft luxury gold overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-green/20 via-transparent to-brand-gold/10 mix-blend-multiply" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[400px] md:min-h-[550px] relative select-none cursor-pointer"
      style={{ touchAction: "none" }}
    >
      {shouldShow3D === null && (
        <div className="absolute inset-0 bg-brand-cream-light/50 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
