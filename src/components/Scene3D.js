import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber'; // ✅ Remover useThree ya que no usamos viewport
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

const Scene3D = () => {
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotación suave
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
      
      // Efecto de flotación
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
      
      // Efecto hover
      if (isHovered) {
        meshRef.current.scale.lerp({ x: 1.2, y: 1.2, z: 1.2 }, 0.1);
      } else {
        meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 }, 0.1);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} />
      
      <Sphere 
        ref={meshRef} 
        args={[1, 100, 200]} 
        scale={1.5}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <MeshDistortMaterial
          color={isHovered ? "#f72585" : "#4cc9f0"}
          attach="material"
          distort={isHovered ? 0.8 : 0.5}
          speed={isHovered ? 3 : 2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </>
  );
};

export default Scene3D;