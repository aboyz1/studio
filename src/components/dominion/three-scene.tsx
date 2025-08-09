'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import TerritoryInfoPanel from './territory-info-panel';

// --- Faction and Color Configuration ---
const FACTIONS = {
    UNCLAIMED: { name: 'Unclaimed', color: '#6B7280' }, // Gray
    CYGNUS: { name: 'The Cygnus Syndicate', color: '#38BDF8' }, // Sky Blue
    ORION: { name: 'Orion Arm Collective', color: '#FBBF24' }, // Amber
};

const STAR_TYPES = {
    'Class G (Yellow Dwarf)': { color: '#FBBF24', scale: 1.0 },
    'Class K (Orange Dwarf)': { color: '#F97316', scale: 0.8 },
    'Class M (Red Dwarf)': { color: '#EF4444', scale: 0.6 },
    'Class A (White Giant)': { color: '#F0F9FF', scale: 1.5 },
    'Class B (Blue Giant)': { color: '#60A5FA', scale: 2.0 },
};

// --- Data Generation ---
const resources = ['Crystalline Dilithium', 'Neutronium Alloy', 'Exotic Gases', 'Bio-polymers', 'Quantum Processors'];
const systemPrefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
const systemSuffixes = ['Prime', 'Centauri', 'Minor', 'Major', 'Proxima', 'Cygnus', 'Orionis', 'Reticuli'];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomStarType = () => getRandom(Object.keys(STAR_TYPES));

const generateSystemData = (id: number) => {
    let faction = FACTIONS.UNCLAIMED;
    const rand = Math.random();
    if (rand > 0.7) faction = FACTIONS.CYGNUS;
    else if (rand > 0.4) faction = FACTIONS.ORION;
    
    return {
        id,
        name: `${getRandom(systemPrefixes)} ${getRandom(systemSuffixes)}`,
        population: `${getRandomInt(50, 500)}M`,
        resource: getRandom(resources),
        defense: `${getRandomInt(20, 95)}%`,
        faction,
        starType: getRandomStarType(),
    };
};

const StarSystem = ({ position, systemData, onSelect, selected }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    const [hovered, setHover] = useState(false);
    
    const starInfo = STAR_TYPES[systemData.starType];
    const color = new THREE.Color(starInfo.color);

    useFrame((state, delta) => {
        if (meshRef.current && lightRef.current) {
            const baseIntensity = hovered ? 2.5 : 1.5;
            const pulse = (Math.sin(state.clock.getElapsedTime() * 2) + 1) / 2 * 0.2 + 0.9; // 0.9 to 1.1
            lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, baseIntensity * pulse, delta * 5);
            
            const scaleTarget = selected ? starInfo.scale * 1.5 : starInfo.scale;
            meshRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), delta * 8);
        }
    });

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerEnter={(e) => (e.stopPropagation(), setHover(true))}
                onPointerLeave={() => setHover(false)}
                onClick={(e) => (e.stopPropagation(), onSelect())}
                scale={[starInfo.scale, starInfo.scale, starInfo.scale]}
            >
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial emissive={color} emissiveIntensity={2} color={color} />
            </mesh>
            <pointLight ref={lightRef} color={color} distance={20} intensity={1.5} />
             <Billboard>
                <Text
                    fontSize={0.5}
                    color="white"
                    anchorY="bottom"
                    position-y={1}
                    visible={hovered || selected}
                >
                    {systemData.name}
                </Text>
            </Billboard>
        </group>
    );
};

const GalaxyMap = ({ onSelectSystem }) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleSelect = (system) => {
        setSelectedId(system.id);
        onSelectSystem(system);
    };
    
    const systems = useMemo(() => {
        const systemArray = [];
        const numSystems = 150;
        const mapSize = 100;

        for (let i = 0; i < numSystems; i++) {
            const x = (Math.random() - 0.5) * mapSize;
            const y = (Math.random() - 0.5) * mapSize / 2; // Flatter distribution
            const z = (Math.random() - 0.5) * mapSize;
            
            // Prevent systems from clustering too close to the center
            if (new THREE.Vector3(x,y,z).length() < 10) continue;

            systemArray.push({
                position: new THREE.Vector3(x, y, z),
                ...generateSystemData(i),
            });
        }
        return systemArray;
    }, []);

    return (
        <group>
            {systems.map((system) => (
                <StarSystem
                    key={system.id}
                    position={system.position}
                    systemData={system}
                    selected={selectedId === system.id}
                    onSelect={() => handleSelect(system)}
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
        const x = (Math.random() - 0.5) * 150;
        const y = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 150;
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
            <fog attach="fog" args={['#050508', 50, 150]} />
            <Stars radius={200} depth={50} count={10000} factor={6} saturation={0} fade speed={1.5} />
            <ambientLight intensity={0.1} />
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
                <GalaxyMap onSelectSystem={setSelectedTerritory} />
            </group>
            <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={80}
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
        camera={{ position: [0, 25, 65], fov: 50 }}
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
