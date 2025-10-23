import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    
    vec3 newPosition = position;
    
    // Calcular distancia desde el vértice al mouse
    float dist = distance(uv, uMouse);
    
    // Efecto de deformación solo cerca del mouse
    if (dist < 0.1) {
      float force = (0.2 - dist) * 5.0; // Intensidad de la deformación
      float wave = sin(uTime * 3.0 + dist * 20.0) * 0.1;
      
      // Deformar la geometría
      newPosition.x += cos(uv.x * 10.0) * wave * force * uHover;
      newPosition.y += sin(uv.y * 10.0) * wave * force * uHover;
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  varying vec2 vUv;

  void main() {
    vec2 distortedUv = vUv;
    
    // Calcular distancia al mouse
    float dist = distance(vUv, uMouse);
    
    // Aplicar distorsión de la textura cerca del mouse
    if (dist < 0.3 && uHover > 0.0) {
      float force = (0.3 - dist) * 2.0;
      float wave = sin(uTime * 5.0 + dist * 30.0) * 0.05;
      
      distortedUv.x += cos(vUv.x * 20.0) * wave * force * uHover;
      distortedUv.y += sin(vUv.y * 20.0) * wave * force * uHover;
    }
    
    vec4 texColor = texture2D(uTexture, distortedUv);
    
    // Efecto de desintegración sutil en el área del mouse
    if (dist < 0.15 && uHover > 0.0) {
      float disintegration = sin(uTime * 8.0 + dist * 50.0) * 0.5 + 0.5;
      if (disintegration > 0.7) {
        texColor.rgb = mix(texColor.rgb, vec3(0.1, 0.5, 1.0), 0.01);
      }
    }
    
    gl_FragColor = texColor;
  }
`;

const DisintegrationShader = ({ image, position = [0, 0, 0], scale = 1 }) => {
  const meshRef = useRef();
  const texture = useTexture(image);
  const { size } = useThree();
  const [mouse, setMouse] = useState([0.5, 0.5]);
  const [hovered, setHovered] = useState(0);
  const uniformsRef = useRef({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uMouse: { value: [0.5, 0.5] },
    uHover: { value: 0 }
  });

  // Seguir mouse con mayor precisión
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = event.clientX / size.width;
      const y = 1.0 - (event.clientY / size.height); // Invertir Y para coordenadas UV
      setMouse([x, y]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  useFrame((state) => {
    if (meshRef.current) {
      uniformsRef.current.uTime.value = state.clock.elapsedTime;
      uniformsRef.current.uMouse.value = mouse;
      uniformsRef.current.uHover.value = hovered;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerEnter={() => setHovered(1)}
      onPointerLeave={() => setHovered(0)}
    >
      <planeGeometry args={[2, 2, 64, 64]} /> {/* Más subdivisiones para mejor deformación */}
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniformsRef.current}
      />
    </mesh>
  );
};

export default DisintegrationShader;