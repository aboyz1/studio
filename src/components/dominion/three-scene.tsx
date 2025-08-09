'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useToast } from '@/hooks/use-toast';

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
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 1,
};

const Territory = ({ position, q, r, s, onSelect, selected }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);
    
    const color = useMemo(() => {
        if (selected) return '#29ABE2'; // Primary color for selected
        if (hovered) return '#0077B6'; // A slightly different blue for hover
        return '#3E5E7A'; // Default neutral color
    }, [selected, hovered]);

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
            <meshStandardMaterial color={color} metalness={0.5} roughness={0.1} />
        </mesh>
    );
};

const HexGrid = ({ onSelectTerritory }) => {
    const [selectedTerritory, setSelectedTerritory] = useState(null);
    const { toast } = useToast();

    const handleSelect = (q, r, s) => {
        const id = `${q},${r},${s}`;
        setSelectedTerritory(id);
        onSelectTerritory({ q, r, s });
        toast({
            title: "Territory Selected",
            description: `You have selected sector at coordinates: Q:${q}, R:${r}, S:${s}.`,
        });
    };
    
    const hexes = useMemo(() => {
        const hexArray = [];
        const mapRadius = 5;
        for (let q = -mapRadius; q <= mapRadius; q++) {
            const r1 = Math.max(-mapRadius, -q - mapRadius);
            const r2 = Math.min(mapRadius, -q + mapRadius);
            for (let r = r1; r <= r2; r++) {
                const s = -q - r;
                const x = 1.732 * q + 0.866 * r; // sqrt(3) ~= 1.732
                const y = 1.5 * r;
                hexArray.push({
                    q, r, s,
                    position: new THREE.Vector3(x, y, 0),
                });
            }
        }
        return hexArray;
    }, []);

    return (
        <group>
            {hexes.map(({ q, r, s, position }) => (
                <Territory
                    key={`${q},${r},${s}`}
                    position={position}
                    q={q} r={r} s={s}
                    selected={selectedTerritory === `${q},${r},${s}`}
                    onSelect={() => handleSelect(q, r, s)}
                />
            ))}
        </group>
    );
};

const SceneContent = () => {
    const handleTerritorySelect = (coords) => {
        // This is where you would update global state, e.g., show info in a UI panel
        console.log('Selected territory:', coords);
    };

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[5, 10, 7]}
                intensity={1.5}
                castShadow
            />
            <pointLight position={[-5, -10, -5]} intensity={0.8} color="#29ABE2" />
            
            <Stars radius={200} depth={50} count={10000} factor={6} saturation={0} fade speed={1.5} />
            
            <group position={[0, -2, 0]} rotation={[0, 0, 0]}>
                <HexGrid onSelectTerritory={handleTerritorySelect} />
            </group>

            <Text
                position={[0, 4, -5]}
                fontSize={1}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="/fonts/SpaceGrotesk-Bold.woff"
            >
                Dominion 3D
            </Text>

            <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={50}
                maxPolarAngle={Math.PI / 2.2}
            />
        </>
    );
}

const ThreeScene = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-0">
      <Canvas
        camera={{ position: [0, 15, 20], fov: 50 }}
        shadows
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
