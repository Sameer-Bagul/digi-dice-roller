import React, { useRef, useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { RoundedBox } from '@react-three/drei/native';
import * as THREE from 'three';

const DOT_OFFSET = 0.01;

const DICE_ROTATIONS = {
  1: [0, 0, 0],
  2: [0, -Math.PI / 2, 0],
  3: [Math.PI / 2, 0, 0],
  4: [-Math.PI / 2, 0, 0],
  5: [0, Math.PI / 2, 0],
  6: [0, Math.PI, 0],
};

const Dot: React.FC<{ size: number; position: [number, number, number]; rotation?: [number, number, number] }> = ({ size, position, rotation = [0, 0, 0] }) => (
  <mesh position={position} rotation={rotation}>
    <circleGeometry args={[size, 32]} />
    <meshStandardMaterial color="#000" roughness={0.5} metalness={0} />
  </mesh>
);

const DiceFace: React.FC<{ value: number; diceSize: number; dotSize: number; dotGap: number }> = ({ value, diceSize, dotSize, dotGap }) => {
  const dots = useMemo(() => {
    const offset = dotGap;
    const z = diceSize / 2 + DOT_OFFSET;
    
    switch (value) {
      case 1: return [[0, 0, z]];
      case 2: return [[-offset, -offset, z], [offset, offset, z]];
      case 3: return [[-offset, -offset, z], [0, 0, z], [offset, offset, z]];
      case 4: return [[-offset, -offset, z], [-offset, offset, z], [offset, -offset, z], [offset, offset, z]];
      case 5: return [[-offset, -offset, z], [-offset, offset, z], [0, 0, z], [offset, -offset, z], [offset, offset, z]];
      case 6: return [
        [-offset, -offset, z], [-offset, 0, z], [-offset, offset, z],
        [offset, -offset, z], [offset, 0, z], [offset, offset, z]
      ];
      default: return [];
    }
  }, [value, diceSize, dotGap]);

  return (
    <>
      {dots.map((pos, i) => (
        <Dot key={i} size={dotSize} position={pos as [number, number, number]} />
      ))}
    </>
  );
};

const DiceMesh: React.FC<{ value: number; diceSize: number; dotSize: number; dotGap: number; isRolling: boolean; position: [number, number, number] }> = ({ value, diceSize, dotSize, dotGap, isRolling, position }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isRolling) {
        meshRef.current.rotation.x += delta * 15;
        meshRef.current.rotation.y += delta * 12;
        meshRef.current.rotation.z += delta * 10;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      } else {
        const target = DICE_ROTATIONS[value as keyof typeof DICE_ROTATIONS] || [0,0,0];
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, target[0], 0.12);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, target[1], 0.12);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.12);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1], 0.1);
      }
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <RoundedBox args={[diceSize, diceSize, diceSize]} radius={0.15 * (diceSize/1.8)} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#fff" roughness={0.3} metalness={0.05} />
      </RoundedBox>
      <group>
        <DiceFace value={1} diceSize={diceSize} dotSize={dotSize} dotGap={dotGap} />
        <group rotation={[0, Math.PI / 2, 0]}><DiceFace value={2} diceSize={diceSize} dotSize={dotSize} dotGap={dotGap} /></group>
        <group rotation={[-Math.PI / 2, 0, 0]}><DiceFace value={3} diceSize={diceSize} dotSize={dotSize} dotGap={dotGap} /></group>
        <group rotation={[Math.PI / 2, 0, 0]}><DiceFace value={4} diceSize={diceSize} dotSize={dotSize} dotGap={dotGap} /></group>
        <group rotation={[0, -Math.PI / 2, 0]}><DiceFace value={5} diceSize={diceSize} dotSize={dotSize} dotGap={dotGap} /></group>
        <group rotation={[0, Math.PI, 0]}><DiceFace value={6} diceSize={diceSize} dotSize={dotSize} dotGap={dotGap} /></group>
      </group>
    </group>
  );
};

export const DiceBoard: React.FC<{ results: number[]; isRolling: boolean }> = ({ results, isRolling }) => {
  const { width, height } = useWindowDimensions();
  
  const scaleConfig = useMemo(() => {
    const count = results.length;
    if (count === 1) return { size: 1.2, gap: 0.35, positions: [[0, 0, 0]] };
    if (count === 2) return { size: 1.0, gap: 0.3, positions: [[-1, 0, 0], [1, 0, 0]] };
    if (count === 3) return { size: 0.8, gap: 0.25, positions: [[-0.8, 0.8, 0], [0.8, 0.8, 0], [0, -0.8, 0]] };
    return { size: 0.75, gap: 0.22, positions: [[-0.8, 0.8, 0], [0.8, 0.8, 0], [-0.8, -0.8, 0], [0.8, -0.8, 0]] };
  }, [results.length]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Canvas 
        camera={{ position: [0, 0, 12], fov: 40 }} 
        shadows
        gl={{ alpha: true, antialias: true }}
        style={styles.canvas}
      >
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.0} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#e6f4fe" />
        <pointLight position={[0, -5, 5]} intensity={0.2} />
        
        {results.map((val, idx) => (
          <DiceMesh 
            key={idx} 
            value={val} 
            diceSize={scaleConfig.size}
            dotSize={scaleConfig.size * 0.12}
            dotGap={scaleConfig.gap}
            isRolling={isRolling} 
            position={scaleConfig.positions[idx] as [number, number, number]} 
          />
        ))}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});

export default DiceBoard;
