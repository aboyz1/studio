'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useToast } from '@/hooks/use-toast';

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

const Territory = ({ position, q, r, s, onSelect, selected, faction }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    
    const targetColor = useMemo(() => {
        if (selected) return SELECTED_COLOR;
        return hovered ? new THREE.Color(faction.color).lerp(new THREE.Color('white'), 0.2).getHexString() : faction.color;
    }, [selected, hovered, faction.color]);

    const targetY = selected ? position.y + 0.3 : position.y;

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Animate color
            (meshRef.current.material as THREE.MeshStandardMaterial).color.lerp(new THREE.Color(targetColor), delta * 10);
            // Animate position (for selection pop-up)
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
            <meshStandardMaterial metalness={0.7} roughness={0.3} />
        </mesh>
    );
};

const HexGrid = ({ onSelectTerritory }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSelect = (hex) => {
        const id = `${hex.q},${hex.r},${hex.s}`;
        setSelectedId(id);
        onSelectTerritory(hex);
        toast({
            title: `Sector ${hex.q}, ${hex.r}, ${hex.s}`,
            description: `Faction: ${hex.faction.name}`,
        });
    };
    
    const hexes = useMemo(() => {
        const hexArray = [];
        const mapRadius = 7;
        for (let q = -mapRadius; q <= mapRadius; q++) {
            const r1 = Math.max(-mapRadius, -q - mapRadius);
            const r2 = Math.min(mapRadius, -q + mapRadius);
            for (let r = r1; r <= r2; r++) {
                const s = -q - r;

                // Assign faction randomly
                let faction = FACTIONS.UNCLAIMED;
                const rand = Math.random();
                if (rand > 0.7) {
                    faction = FACTIONS.CYGNUS;
                } else if (rand > 0.4) {
                    faction = FACTIONS.ORION;
                }

                hexArray.push({
                    q, r, s, faction,
                    position: new THREE.Vector3(1.732 * q + 0.866 * r, 0, 1.5 * r),
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

const SceneContent = () => {
    const handleTerritorySelect = (hex) => {
        console.log('Selected territory:', hex);
    };

    return (
        <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 20, 5]} intensity={1.5} />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#29ABE2" />
            
            <fog attach="fog" args={['#171717', 30, 80]} />
            <Stars radius={200} depth={50} count={10000} factor={6} saturation={0} fade speed={1.5} />

            <group position={[0, -0.5, 0]}>
                <HexGrid onSelectTerritory={handleTerritorySelect} />
            </group>

            <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={50}
                maxPolarAngle={Math.PI / 2.1}
                minPolarAngle={Math.PI / 6}
            />
        </>
    );
}

const ThreeScene = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 20, 35], fov: 50 }}
        shadows
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
