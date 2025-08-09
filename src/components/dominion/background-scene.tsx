'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShapes = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[2, 2, -5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#29ABE2" wireframe />
      </mesh>
      <mesh position={[-3, -1, -3]}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#90EE90" wireframe />
      </mesh>
      <mesh position={[4, -2, 0]}>
        <torusKnotGeometry args={[1, 0.3, 100, 16]} />
        <meshStandardMaterial color="white" wireframe />
      </mesh>
    </group>
  );
};

const BackgroundSceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <FloatingShapes />
    </>
  );
};

const BackgroundScene = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <BackgroundSceneContent />
      </Canvas>
    </div>
  );
};

export default BackgroundScene;
