
'use client';

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Billboard, Text, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import TerritoryInfoPanel from './territory-info-panel';

// --- Configuration ---
const FACTIONS = {
    UNCLAIMED: { name: 'Unclaimed', color: new THREE.Color('#555555'), emissive: new THREE.Color('#333333') },
    CYGNUS: { name: 'The Cygnus Syndicate', color: new THREE.Color('#29ABE2'), emissive: new THREE.Color('#0077B6') },
    ORION: { name: 'Orion Arm Collective', color: new THREE.Color('#FBBF24'), emissive: new THREE.Color('#B45309') },
};

const resources = ['Crystalline Dilithium', 'Neutronium Alloy', 'Exotic Gases', 'Bio-polymers', 'Quantum Processors'];
const systemPrefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
const systemSuffixes = ['Prime', 'Centauri', 'Minor', 'Major', 'Proxima', 'Cygnus', 'Orionis', 'Reticuli'];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const noise2D = createNoise2D(Math.random);

// --- Child Components ---

const WarpingShips = () => {
    const ships = useMemo(() => Array.from({ length: 10 }, () => ({
        id: Math.random(),
        position: new THREE.Vector3((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 100),
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5).multiplyScalar(0.2),
        ref: React.createRef<THREE.Mesh>(),
    })), []);

    useFrame((state, delta) => {
        ships.forEach(ship => {
            if (ship.ref.current) {
                ship.position.add(ship.velocity);
                ship.ref.current.position.copy(ship.position);
                ship.ref.current.lookAt(ship.position.clone().add(ship.velocity));

                const opacity = Math.sin(state.clock.elapsedTime * Math.random() * 0.5) * 0.5 + 0.5;
                (ship.ref.current.material as THREE.MeshBasicMaterial).opacity = opacity;

                if (ship.position.length() > 60) {
                     ship.position.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 100);
                     ship.velocity.set((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5).multiplyScalar(0.2);
                }
            }
        })
    });

    return (
        <group>
            {ships.map(ship => (
                 <mesh key={ship.id} ref={ship.ref} position={ship.position}>
                    <coneGeometry args={[0.2, 1, 4]} />
                    <meshBasicMaterial color="white" transparent opacity={0} />
                </mesh>
            ))}
        </group>
    )
}

const MissionHotspot = ({ position }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (ref.current) {
            const time = clock.getElapsedTime();
            ref.current.position.y = position[1] + 1 + Math.sin(time * 2) * 0.2;
            ref.current.rotation.y = time * 0.5;
        }
    });
    return (
        <mesh ref={ref} position={position}>
            <coneGeometry args={[0.3, 0.6, 6]} />
            <meshStandardMaterial color="red" emissive="red" emissiveIntensity={3} />
        </mesh>
    );
};

const FactionBase = ({ position, color }) => {
    const ref = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.y = clock.getElapsedTime() * 0.1;
        }
    });
    return (
        <group ref={ref} position={position}>
            <mesh>
                <cylinderGeometry args={[0, 0.8, 1.5, 6]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe />
            </mesh>
            <mesh position={[0, 0.75, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
            </mesh>
        </group>
    );
};

const HexTile = ({ position, terrainHeight, data, onSelect, isSelected }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [isHovered, setHover] = useState(false);
    const yPos = terrainHeight / 2;

    useFrame((state, delta) => {
        if (meshRef.current) {
            const targetY = yPos + (isSelected ? 0.5 : 0);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 8);
        }
    });

    const hexShape = useMemo(() => {
        const shape = new THREE.Shape();
        const size = 1;
        shape.moveTo(size * Math.cos(0), size * Math.sin(0));
        for (let i = 1; i <= 6; i++) {
            shape.lineTo(size * Math.cos(i * Math.PI / 3), size * Math.sin(i * Math.PI / 3));
        }
        return shape;
    }, []);

    const extrudeSettings = useMemo(() => ({
        steps: 1,
        depth: terrainHeight,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 1,
    }), [terrainHeight]);

    return (
        <group
            position={[position.x, 0, position.z]}
            onPointerEnter={(e) => (e.stopPropagation(), setHover(true))}
            onPointerLeave={() => setHover(false)}
            onClick={(e) => (e.stopPropagation(), onSelect())}
        >
            <mesh ref={meshRef} rotation-x={-Math.PI / 2}>
                <extrudeGeometry args={[hexShape, extrudeSettings]} />
                <meshStandardMaterial
                    color={data.faction.color}
                    emissive={data.faction.emissive}
                    metalness={0.3}
                    roughness={0.6}
                    transparent
                    opacity={0.8}
                />
                <Edges scale={1} threshold={15} color={isHovered || isSelected ? 'white' : data.faction.color} />
            </mesh>
        </group>
    );
};


const HexGrid = ({ onSelectTerritory }) => {
    const [selectedId, setSelectedId] = useState(null);
    const mapRadius = 12;

    const territories = useMemo(() => {
        const tiles = [];
        for (let q = -mapRadius; q <= mapRadius; q++) {
            const r1 = Math.max(-mapRadius, -q - mapRadius);
            const r2 = Math.min(mapRadius, -q + mapRadius);
            for (let r = r1; r <= r2; r++) {
                const s = -q - r;
                let faction = FACTIONS.UNCLAIMED;
                if (q > 3 && Math.random() > 0.3) faction = FACTIONS.CYGNUS;
                else if (q < -3 && Math.random() > 0.3) faction = FACTIONS.ORION;
                
                tiles.push({
                    id: `${q},${r},${s}`,
                    q, r, s,
                    name: `${getRandom(systemPrefixes)} ${getRandom(systemSuffixes)}`,
                    population: `${getRandomInt(50, 500)}M`,
                    resource: getRandom(resources),
                    defense: `${getRandomInt(20, 95)}%`,
                    faction: faction,
                    hasMission: Math.random() > 0.95,
                    isBase: (q === 8 && r === 0) ? FACTIONS.CYGNUS.name : (q === -8 && r === 0) ? FACTIONS.ORION.name : null,
                });
            }
        }
        return tiles;
    }, []);

    const handleSelect = (territory) => {
        setSelectedId(territory.id);
        onSelectTerritory(territory);
    };

    return (
        <group>
            {territories.map((data) => {
                const x = 1.732 * (data.q + data.r / 2);
                const z = 1.5 * data.r;
                const pos = new THREE.Vector3(x, 0, z);
                const terrainHeight = 0.2 + Math.pow(noise2D(x / 15, z / 15), 2) * 2;
                
                return (
                    <group key={data.id}>
                        <HexTile
                            position={pos}
                            terrainHeight={terrainHeight}
                            data={data}
                            isSelected={selectedId === data.id}
                            onSelect={() => handleSelect(data)}
                        />
                        {data.hasMission && <MissionHotspot position={[pos.x, terrainHeight, pos.z]} />}
                        {data.isBase === FACTIONS.CYGNUS.name && <FactionBase position={[pos.x, terrainHeight, pos.z]} color={FACTIONS.CYGNUS.color} />}
                        {data.isBase === FACTIONS.ORION.name && <FactionBase position={[pos.x, terrainHeight, pos.z]} color={FACTIONS.ORION.color} />}
                    </group>
                );
            })}
        </group>
    );
};

// --- Main Scene Component ---
const SceneContent = ({ setSelectedTerritory }) => {
    return (
        <>
            <fog attach="fog" args={['#050508', 60, 120]} />
            <Stars radius={200} depth={50} count={10000} factor={6} saturation={0} fade speed={1.5} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            <pointLight position={[40, 5, 0]} color={FACTIONS.CYGNUS.color} intensity={150} distance={100} />
            <pointLight position={[-40, 5, 0]} color={FACTIONS.ORION.color} intensity={150} distance={100} />

            <Suspense fallback={null}>
                <Text
                    position={[0, 15, -30]}
                    fontSize={6}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.1}
                    outlineColor="#000000"
                >
                    SECTOR MAP
                </Text>
            </Suspense>

            <group position={[0, -0.5, 0]}>
                <HexGrid onSelectTerritory={setSelectedTerritory} />
            </group>
            
            <WarpingShips />

            <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={10}
                maxDistance={80}
                panSpeed={0.7}
                maxPolarAngle={Math.PI / 2.2}
            />
        </>
    );
}

const ThreeScene = () => {
    const [selectedTerritory, setSelectedTerritory] = useState(null);

    return (
        <div className="absolute top-0 left-0 w-full h-full">
            <Canvas
                camera={{ position: [0, 45, 45], fov: 50 }}
                shadows
                gl={{ antialias: true }}
            >
                <Suspense fallback={null}>
                    <SceneContent setSelectedTerritory={setSelectedTerritory} />
                </Suspense>
            </Canvas>
            <TerritoryInfoPanel territory={selectedTerritory} onClose={() => setSelectedTerritory(null)} />
        </div>
    );
};

export default ThreeScene;
