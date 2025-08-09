'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import TerritoryInfoPanel from './territory-info-panel';

// --- Faction and Color Configuration ---
const FACTIONS = {
    UNCLAIMED: { name: 'Unclaimed', color: '#4A5568' }, // Neutral Gray
    CYGNUS: { name: 'The Cygnus Syndicate', color: '#29ABE2' }, // Primary Blue
    ORION: { name: 'Orion Arm Collective', color: '#F59E0B' }, // Amber/Gold
};

const SELECTED_COLOR = '#90EE90'; // Accent Green

// Helper to create a hexagonal shape
const HexagonShape = () => {
    const shape = new THREE.Shape();
    const size = 1; // Hexagon radius
    shape.moveTo(size, 0);
    for (let i = 1; i <= 6; i++) {
        const angle = (i * 60 * Math.PI) / 180;
        shape.lineTo(size * Math.cos(angle), size * Math.sin(angle));
    }
    return shape;
};

const hexShape = HexagonShape();
const extrudeSettings = {
    steps: 1,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 1,
};

// --- Data Generation ---
const resources = ['Crystalline Dilithium', 'Neutronium Alloy', 'Exotic Gases', 'Bio-polymers', 'Quantum Processors'];
const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateTerritoryData = () => ({
    population: `${getRandomInt(50, 500)}M`,
    resource: getRandom(resources),
    defense: `${getRandomInt(20, 95)}%`,
});

const Territory = ({ position, onSelect, selected, faction }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    
    const targetColor = useMemo(() => {
        if (selected) return SELECTED_COLOR;
        if (hovered) return new THREE.Color(faction.color).lerp(new THREE.Color('white'), 0.3).getHexString();
        return faction.color;
    }, [selected, hovered, faction.color]);

    const targetY = selected ? position.y + 0.3 : position.y;

    useFrame((state, delta) => {
        if (meshRef.current) {
            (meshRef.current.material as THREE.MeshStandardMaterial).color.lerp(new THREE.Color(targetColor), delta * 10);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 8);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={[Math.PI / -2, 0, 0]}
            onPointerEnter={(e) => (e.stopPropagation(), setHover(true))}
            onPointerLeave={() => setHover(false)}
            onClick={(e) => (e.stopPropagation(), onSelect())}
            scale={[0.95, 0.95, 0.95]}
        >
            <extrudeGeometry args={[hexShape, extrudeSettings]} />
            <meshStandardMaterial metalness={0.8} roughness={0.2} />
        </mesh>
    );
};

const HexGrid = ({ onSelectTerritory }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const handleSelect = (hex) => {
        const id = `${hex.q},${hex.r},${hex.s}`;
        setSelectedId(id);
        onSelectTerritory(hex);
    };
    
    const hexes = useMemo(() => {
        const hexArray = [];
        const mapRadius = 10; // Increased from 7
        for (let q = -mapRadius; q <= mapRadius; q++) {
            const r1 = Math.max(-mapRadius, -q - mapRadius);
            const r2 = Math.min(mapRadius, -q + mapRadius);
            for (let r = r1; r2 >= r; r++) {
                const s = -q - r;

                let faction = FACTIONS.UNCLAIMED;
                const rand = Math.random();
                if (rand > 0.7) faction = FACTIONS.CYGNUS;
                else if (rand > 0.4) faction = FACTIONS.ORION;

                hexArray.push({
                    q, r, s, faction,
                    position: new THREE.Vector3(1.732 * q + 0.866 * r, 0, 1.5 * r),
                    ...generateTerritoryData(),
                });
            }
        }
        return hexArray;
    }, []);

    return (
        <group>
            {hexes.map((hex) => (
                <Territory
                    key={`${hex.q},${hex.r},${hex.s}`}
                    {...hex}
                    selected={selectedId === `${hex.q},${hex.r},${hex.s}`}
                    onSelect={() => handleSelect(hex)}
                />
            ))}
        </group>
    );
};

const FloatingAsteroids = () => {
    const count = 200;
    const groupRef = useRef<THREE.Group>(null);
  
    const asteroids = useMemo(() => {
      const temp = [];
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 100;
        const size = Math.random() * 0.3 + 0.1;
        const rotation = [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI];
        temp.push({ position: [x, y, z], size, rotation });
      }
      return temp;
    }, []);
  
    useFrame((state, delta) => {
      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.02;
      }
    });
  
    return (
      <group ref={groupRef}>
        {asteroids.map((asteroid, i) => (
          <mesh key={i} position={asteroid.position as [number, number, number]} rotation={asteroid.rotation as [number, number, number]}>
            <dodecahedronGeometry args={[asteroid.size, 0]} />
            <meshStandardMaterial color="#555" roughness={0.8} />
          </mesh>
        ))}
      </group>
    );
  };

const BackgroundElements = () => {
    return (
        <>
            <fog attach="fog" args={['#101015', 30, 90]} />
            <Stars radius={200} depth={50} count={10000} factor={6} saturation={0} fade speed={1.5} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 20, 5]} intensity={1.5} />
            <pointLight position={[-30, -20, -40]} intensity={2.5} color={FACTIONS.CYGNUS.color} />
            <pointLight position={[30, 20, -30]} intensity={2.0} color={FACTIONS.ORION.color} />
            <FloatingAsteroids />
        </>
    );
};


const SceneContent = ({ setSelectedTerritory }) => {
    return (
        <>
            <Suspense fallback={null}>
                <BackgroundElements />
            </Suspense>
            <group position={[0, -0.5, 0]}>
                <HexGrid onSelectTerritory={setSelectedTerritory} />
            </group>
            <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={10}
                maxDistance={60}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
                panSpeed={0.5}
            />
        </>
    );
}

const ThreeScene = () => {
  const [selectedTerritory, setSelectedTerritory] = useState(null);

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 25, 45], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <SceneContent setSelectedTerritory={setSelectedTerritory} />
      </Canvas>
      <TerritoryInfoPanel territory={selectedTerritory} onClose={() => setSelectedTerritory(null)} />
    </div>
  );
};

export default ThreeScene;
