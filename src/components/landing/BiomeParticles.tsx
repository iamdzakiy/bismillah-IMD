'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Points>(null);

  const particleData = useMemo(() => {
    const count = 3000;
    const data: {
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      color: THREE.Color;
      phase: number;
      isHidden: boolean;
    }[] = [];

    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const colorChoice = Math.random();
      let r: number, g: number, b: number;
      if (colorChoice < 0.33) {
        r = 0.1 + Math.random() * 0.2;
        g = 0.7 + Math.random() * 0.3;
        b = 0.9 + Math.random() * 0.1;
      } else if (colorChoice < 0.66) {
        r = 0.0 + Math.random() * 0.1;
        g = 0.5 + Math.random() * 0.4;
        b = 0.5 + Math.random() * 0.4;
      } else {
        r = 0.2 + Math.random() * 0.3;
        g = 0.8 + Math.random() * 0.2;
        b = 0.3 + Math.random() * 0.3;
      }

      data.push({
        position: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * radius,
          Math.sin(phi) * Math.sin(theta) * radius * 0.6,
          Math.cos(phi) * radius * 0.3
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.001
        ),
        color: new THREE.Color(r, g, b),
        phase: Math.random() * Math.PI * 2,
        isHidden: Math.random() > 0.15,
      });
    }
    return data;
  }, []);

  const posArray = useMemo(() => {
    const arr = new Float32Array(particleData.length * 3);
    particleData.forEach((p, i) => {
      arr[i * 3] = p.position.x;
      arr[i * 3 + 1] = p.position.y;
      arr[i * 3 + 2] = p.position.z;
    });
    return arr;
  }, [particleData]);

  const colArray = useMemo(() => {
    const arr = new Float32Array(particleData.length * 3);
    particleData.forEach((p, i) => {
      arr[i * 3] = p.color.r * 0.6;
      arr[i * 3 + 1] = p.color.g * 0.6;
      arr[i * 3 + 2] = p.color.b * 0.6;
    });
    return arr;
  }, [particleData]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const colAttr = meshRef.current.geometry.attributes.color;
    const pos = posAttr.array as Float32Array;
    const col = colAttr.array as Float32Array;
    const time = state.clock.elapsedTime;

    const mX = mouse.current.x;
    const mY = mouse.current.y;

    for (let i = 0; i < particleData.length; i++) {
      const i3 = i * 3;
      const p = particleData[i];

      p.position.x += p.velocity.x;
      p.position.y += p.velocity.y + Math.sin(time * 0.3 + p.phase) * 0.0005;
      p.position.z += p.velocity.z;

      if (Math.abs(p.position.x) > 12) p.velocity.x *= -1;
      if (Math.abs(p.position.y) > 8) p.velocity.y *= -1;
      if (Math.abs(p.position.z) > 5) p.velocity.z *= -1;

      const dx = mX * 12 - p.position.x;
      const dy = -(mY * 7) - p.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 2.5 && dist > 0.01) {
        const force = ((2.5 - dist) / 2.5) * 0.02;
        p.position.x -= (dx / dist) * force;
        p.position.y -= (dy / dist) * force;
      }

      const pulse = 0.6 + 0.4 * Math.sin(time * 0.5 + p.phase);
      const hiddenFactor = p.isHidden ? 1.0 : 0.15;
      const brightness = pulse * hiddenFactor;

      pos[i3] = p.position.x;
      pos[i3 + 1] = p.position.y;
      pos[i3 + 2] = p.position.z;
      col[i3] = p.color.r * brightness;
      col[i3 + 1] = p.color.g * brightness;
      col[i3 + 2] = p.color.b * brightness;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posArray, 3]} count={particleData.length} array={posArray} itemSize={3} />
        <bufferAttribute attach="attributes-color" args={[colArray, 3]} count={particleData.length} array={colArray} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function NeuralWeb() {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const nodes: THREE.Vector3[] = Array.from({ length: 80 }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 6
    ));

    const conn: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 4 && Math.random() < 0.3) conn.push(i, j);
      }
    }

    const positions: number[] = [];
    for (let k = 0; k < conn.length; k += 2) {
      const i = conn[k], j = conn[k + 1];
      positions.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!lineRef.current) return;
    const pos = lineRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 1] += Math.sin(time * 0.1 + pos[i] * 0.5 + pos[i + 2] * 0.3) * 0.003;
    }
    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#22d3ee" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}

interface BiomeParticlesProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

export default function BiomeParticles({ mousePosition }: BiomeParticlesProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}>
        <NeuralWeb />
        <ParticleField mouse={mousePosition} />
      </Canvas>
    </div>
  );
}