import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// ============================================
// SHADER: Splat - añade velocidad donde está el mouse
// ============================================
const splatVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const splatFragment = `
  precision highp float;
  uniform sampler2D uTarget;
  uniform vec2 uPoint;
  uniform vec3 uColor;
  uniform float uRadius;
  uniform float uAspectRatio;
  varying vec2 vUv;
  
  void main() {
    vec2 p = vUv - uPoint;
    p.x *= uAspectRatio;
    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

// ============================================
// SHADER: Curl - calcula rotación del campo
// ============================================
const curlVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const curlFragment = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;
  varying vec2 vUv;
  
  void main() {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
    float curl = R - L - T + B;
    gl_FragColor = vec4(0.5 * curl, 0.0, 0.0, 1.0);
  }
`;

// ============================================
// SHADER: Vorticity - aplica fuerzas de remolino
// ============================================
const vorticityVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const vorticityFragment = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform vec2 uTexelSize;
  uniform float uVorticity;
  uniform float uDt;
  varying vec2 vUv;
  
  void main() {
    float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
    float C = texture2D(uCurl, vUv).x;
    
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= uVorticity * C;
    force.y *= -1.0;
    
    vec2 vel = texture2D(uVelocity, vUv).xy;
    gl_FragColor = vec4(vel + force * uDt, 0.0, 1.0);
  }
`;

// ============================================
// SHADER: Advect - mueve el campo
// ============================================
const advectVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const advectFragment = `
  precision highp float;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 uTexelSize;
  uniform float uDt;
  uniform float uDissipation;
  uniform float uBoundaryFade;
  varying vec2 vUv;
  
  void main() {
    vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize * 100.0;
    coord = clamp(coord, 0.0, 1.0);
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + uDissipation * uDt;
    
    // Fade muy suave en los bordes - permite acumulación pero no infinita
    float borderX = smoothstep(0.0, max(0.001, uBoundaryFade), vUv.x) * smoothstep(1.0, 1.0 - max(0.001, uBoundaryFade), vUv.x);
    float borderY = smoothstep(0.0, max(0.001, uBoundaryFade), vUv.y) * smoothstep(1.0, 1.0 - max(0.001, uBoundaryFade), vUv.y);
    float border = mix(1.0, borderX * borderY, step(0.001, uBoundaryFade));
    
    gl_FragColor = (result / decay) * border;
  }
`;

// ============================================
// SHADER: Renderizado final
// ============================================
const renderVertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const renderFragment = `
  precision highp float;
  uniform sampler2D uTexture;
  uniform sampler2D uVelocity;
  uniform sampler2D uDensity;
  uniform float uTime;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    vec2 vel = texture2D(uVelocity, uv).xy;
    float density = texture2D(uDensity, uv).r;
    
    // Distorsionar UV
    vec2 distortedUv = uv - vel * 0.2;
    distortedUv = clamp(distortedUv, 0.001, 0.999);
    
    // Imagen en escala de grises
    vec4 texColor = texture2D(uTexture, distortedUv);
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Efecto de humo
    float velMag = length(vel);
    float smokeAlpha = clamp(density * 1.3, 0.0, 1.0);
    vec3 smokeColor = vec3(0.05 + velMag * 0.1);
    
    vec3 finalColor = vec3(gray);
    finalColor = mix(finalColor, smokeColor, smokeAlpha);
    
    float edgeDark = smoothstep(0.2, 0.8, velMag);
    finalColor *= 1.0 - edgeDark * 0.3;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const DisintegrationShader = ({ image, position = [0, 0, 0], scale = 1 }) => {
  const meshRef = useRef();
  const texture = useTexture(image);
  const { camera, gl } = useThree();
  
  const [mouseUV, setMouseUV] = useState([0.5, 0.5]);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const prevMouseUV = useRef([0.5, 0.5]);
  
  const simSize = 256;
  const texelSize = [1 / simSize, 1 / simSize];

  const createRT = () => new THREE.WebGLRenderTarget(simSize, simSize, {
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  });

  // Render targets
  const velocityRT = useMemo(() => [createRT(), createRT()], []);
  const densityRT = useMemo(() => [createRT(), createRT()], []);
  const curlRT = useMemo(() => createRT(), []);

  const simScene = useMemo(() => new THREE.Scene(), []);
  const simCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const simQuad = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geo);
    simScene.add(mesh);
    return mesh;
  }, [simScene]);

  // Materiales
  const splatMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: splatVertex,
    fragmentShader: splatFragment,
    uniforms: {
      uTarget: { value: null },
      uPoint: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: new THREE.Vector3(0, 0, 0) },
      uRadius: { value: 0.0008 },
      uAspectRatio: { value: 1.0 },
    },
  }), []);

  const curlMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: curlVertex,
    fragmentShader: curlFragment,
    uniforms: {
      uVelocity: { value: null },
      uTexelSize: { value: new THREE.Vector2(texelSize[0], texelSize[1]) },
    },
  }), []);

  const vorticityMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: vorticityVertex,
    fragmentShader: vorticityFragment,
    uniforms: {
      uVelocity: { value: null },
      uCurl: { value: null },
      uTexelSize: { value: new THREE.Vector2(texelSize[0], texelSize[1]) },
      uVorticity: { value: 30.0 }, // Genera el efecto de quemarse orgánicamente
      uDt: { value: 0.016 },
    },
  }), []);

  const advectMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: advectVertex,
    fragmentShader: advectFragment,
    uniforms: {
      uVelocity: { value: null },
      uSource: { value: null },
      uTexelSize: { value: new THREE.Vector2(texelSize[0], texelSize[1]) },
      uDt: { value: 0.016 },
      uDissipation: { value: 0.2 },
      uBoundaryFade: { value: 0.0 }, // Sin fade - permite acumulación en bordes
    },
  }), []);

  const renderUniforms = useRef({
    uTexture: { value: texture },
    uVelocity: { value: velocityRT[0].texture },
    uDensity: { value: densityRT[0].texture },
    uTime: { value: 0 },
  });

  const velIdx = useRef(0);
  const denIdx = useRef(0);

  // Mouse tracking
  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      
      if (meshRef.current) {
        const intersects = raycaster.intersectObject(meshRef.current);
        if (intersects.length > 0 && intersects[0].uv) {
          setMouseUV([intersects[0].uv.x, intersects[0].uv.y]);
          setIsMouseOver(true);
        } else {
          setIsMouseOver(false);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', () => setIsMouseOver(false));
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const dt = 0.016;

    // Disipación - lenta cuando mouse está para acumulación gradual
    const velocityDissipation = isMouseOver ? 0.05 : 0.8;
    const densityDissipation = isMouseOver ? 0.08 : 2.5;

    if (isMouseOver) {
      const dx = mouseUV[0] - prevMouseUV.current[0];
      const dy = mouseUV[1] - prevMouseUV.current[1];

      // === Splat velocity ===
      splatMat.uniforms.uTarget.value = velocityRT[velIdx.current].texture;
      splatMat.uniforms.uPoint.value.set(mouseUV[0], mouseUV[1]);
      splatMat.uniforms.uColor.value.set(dx * 30.0, dy * 30.0, 0);
      splatMat.uniforms.uRadius.value = 0.0012;
      
      simQuad.material = splatMat;
      gl.setRenderTarget(velocityRT[1 - velIdx.current]);
      gl.render(simScene, simCamera);
      velIdx.current = 1 - velIdx.current;

      // === Splat density (humo) ===
      splatMat.uniforms.uTarget.value = densityRT[denIdx.current].texture;
      splatMat.uniforms.uColor.value.set(0.5, 0.0, 0.0); // Moderado para efecto gradual
      splatMat.uniforms.uRadius.value = 0.0007;
      
      simQuad.material = splatMat;
      gl.setRenderTarget(densityRT[1 - denIdx.current]);
      gl.render(simScene, simCamera);
      denIdx.current = 1 - denIdx.current;
    }

    // === Curl ===
    curlMat.uniforms.uVelocity.value = velocityRT[velIdx.current].texture;
    simQuad.material = curlMat;
    gl.setRenderTarget(curlRT);
    gl.render(simScene, simCamera);

    // === Vorticity (solo cuando hay mouse para mantener remolinos) ===
    if (isMouseOver) {
      vorticityMat.uniforms.uVelocity.value = velocityRT[velIdx.current].texture;
      vorticityMat.uniforms.uCurl.value = curlRT.texture;
      vorticityMat.uniforms.uDt.value = dt;
      
      simQuad.material = vorticityMat;
      gl.setRenderTarget(velocityRT[1 - velIdx.current]);
      gl.render(simScene, simCamera);
      velIdx.current = 1 - velIdx.current;
    }

    // === Advect velocity ===
    advectMat.uniforms.uVelocity.value = velocityRT[velIdx.current].texture;
    advectMat.uniforms.uSource.value = velocityRT[velIdx.current].texture;
    advectMat.uniforms.uDt.value = dt;
    advectMat.uniforms.uDissipation.value = velocityDissipation;
    
    simQuad.material = advectMat;
    gl.setRenderTarget(velocityRT[1 - velIdx.current]);
    gl.render(simScene, simCamera);
    velIdx.current = 1 - velIdx.current;

    // === Advect density ===
    advectMat.uniforms.uVelocity.value = velocityRT[velIdx.current].texture;
    advectMat.uniforms.uSource.value = densityRT[denIdx.current].texture;
    advectMat.uniforms.uDissipation.value = densityDissipation;
    
    simQuad.material = advectMat;
    gl.setRenderTarget(densityRT[1 - denIdx.current]);
    gl.render(simScene, simCamera);
    denIdx.current = 1 - denIdx.current;

    gl.setRenderTarget(null);

    // Update render uniforms
    renderUniforms.current.uVelocity.value = velocityRT[velIdx.current].texture;
    renderUniforms.current.uDensity.value = densityRT[denIdx.current].texture;
    renderUniforms.current.uTime.value = time;

    prevMouseUV.current = [mouseUV[0], mouseUV[1]];
  });

  useEffect(() => {
    return () => {
      velocityRT.forEach(t => t.dispose());
      densityRT.forEach(t => t.dispose());
      curlRT.dispose();
    };
  }, [velocityRT, densityRT, curlRT]);

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[2, 2, 1, 1]} />
      <shaderMaterial
        vertexShader={renderVertex}
        fragmentShader={renderFragment}
        uniforms={renderUniforms.current}
      />
    </mesh>
  );
};

export default DisintegrationShader;
