'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ArchitectureViewerProps {
  modelUrl?: string;
  projectName: string;
}

export const ArchitectureViewer: React.FC<ArchitectureViewerProps> = ({ projectName }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Setup Three.js scene, camera, renderer
    const width = mount.clientWidth || 800;
    const height = 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaf9f5);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 3, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Architectural Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0x111111, 0xdddddd);
    scene.add(gridHelper);

    // Architectural Massing Model Placeholder
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.1
    });

    const baseGeo = new THREE.BoxGeometry(2.4, 0.6, 1.8);
    const baseMesh = new THREE.Mesh(baseGeo, material);
    baseMesh.position.y = 0.3;
    group.add(baseMesh);

    const upperGeo = new THREE.BoxGeometry(1.6, 0.8, 1.4);
    const upperMesh = new THREE.Mesh(upperGeo, material);
    upperMesh.position.set(-0.2, 1.0, 0);
    group.add(upperMesh);

    scene.add(group);
    setIsLoading(false);

    let animationFrameId: number;
    const animate = () => {
      group.rotation.y += 0.003;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="viewer-container" style={{ position: 'relative', width: '100%', margin: '40px 0', border: '1px solid var(--line)' }}>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em' }}>
          ARCHITECTURAL 3D MASSING — {projectName.toUpperCase()}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
          INTERACTIVE WEBGL MODEL
        </span>
      </div>
      {isLoading && (
        <div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: '12px' }}>
          INITIALIZING 3D SPATIAL MODEL...
        </div>
      )}
      <div ref={mountRef} style={{ width: '100%', height: '450px' }} />
    </div>
  );
};
