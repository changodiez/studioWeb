import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// SHADERS
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
    
    float borderX = smoothstep(0.0, max(0.001, uBoundaryFade), vUv.x) * smoothstep(1.0, 1.0 - max(0.001, uBoundaryFade), vUv.x);
    float borderY = smoothstep(0.0, max(0.001, uBoundaryFade), vUv.y) * smoothstep(1.0, 1.0 - max(0.001, uBoundaryFade), vUv.y);
    float border = mix(1.0, borderX * borderY, step(0.001, uBoundaryFade));
    
    gl_FragColor = (result / decay) * border;
  }
`;

// Shader de render con transición entre texturas
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
  uniform sampler2D uNextTexture;
  uniform sampler2D uVelocity;
  uniform sampler2D uDensity;
  uniform float uTime;
  uniform float uShowNext;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    vec2 vel = texture2D(uVelocity, uv).xy;
    float density = texture2D(uDensity, uv).r;
    
    vec2 distortedUv = uv - vel * 0.2;
    distortedUv = clamp(distortedUv, 0.001, 0.999);
    
    // Imagen actual
    vec4 texColor = texture2D(uTexture, distortedUv);
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Siguiente imagen (se revela cuando uShowNext > 0)
    vec4 nextTexColor = texture2D(uNextTexture, distortedUv);
    float nextGray = dot(nextTexColor.rgb, vec3(0.299, 0.587, 0.114));
    
    float velMag = length(vel);
    float smokeAlpha = clamp(density * 1.3, 0.0, 1.0);
    vec3 smokeColor = vec3(0.05 + velMag * 0.1);
    
    // Mezclar imagen actual con humo
    vec3 currentColor = vec3(gray);
    currentColor = mix(currentColor, smokeColor, smokeAlpha);
    
    // Siguiente imagen limpia (sin humo)
    vec3 nextColor = vec3(nextGray);
    
    // Transición: cuando uShowNext es 1 y el humo se va, revela la nueva imagen
    // La nueva imagen se revela donde NO hay humo
    float revealAmount = uShowNext * (1.0 - smokeAlpha);
    vec3 finalColor = mix(currentColor, nextColor, revealAmount);
    
    float edgeDark = smoothstep(0.2, 0.8, velMag);
    finalColor *= 1.0 - edgeDark * 0.3 * (1.0 - revealAmount);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const getRandomImageUrl = () => {
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/1920/1080?grayscale&random=${randomId}&t=${Date.now()}`;
};

const DisintegrationShader = ({ position = [0, 0, 0], scale = 1, onBurnedChange, disableTouch = false }) => {
  const meshRef = useRef();
  const { camera, gl } = useThree();
  
  const [mouseUV, setMouseUV] = useState([0.5, 0.5]);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const disableTouchRef = useRef(disableTouch);
  
  // Actualizar ref cuando cambia el prop
  useEffect(() => {
    disableTouchRef.current = disableTouch;
  }, [disableTouch]);
  const [currentTexture, setCurrentTexture] = useState(null);
  const [nextTexture, setNextTexture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wasBurned, setWasBurned] = useState(false);
  const [showNext, setShowNext] = useState(0);

  // Notificar al padre cuando cambia el estado de quemado
  useEffect(() => {
    if (onBurnedChange) {
      onBurnedChange(wasBurned);
    }
  }, [wasBurned, onBurnedChange]);
  
  const prevMouseUV = useRef([0.5, 0.5]);
  const burnLevel = useRef(0);
  const wasMouseOver = useRef(false);
  const textureLoader = useRef(new THREE.TextureLoader());
  const isTransitioning = useRef(false);
  
  const simSize = 256;
  const texelSize = [1 / simSize, 1 / simSize];

  // Cargar una textura
  const loadTexture = useCallback((url) => {
    return new Promise((resolve, reject) => {
      textureLoader.current.load(
        url,
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }, []);

  // Precargar siguiente imagen
  const preloadNextImage = useCallback(async () => {
    try {
      const texture = await loadTexture(getRandomImageUrl());
      setNextTexture(texture);
    } catch (error) {
      console.error('Error preloading texture:', error);
    }
  }, [loadTexture]);

  // Cargar imagen inicial y precargar siguiente
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const texture = await loadTexture(getRandomImageUrl());
        setCurrentTexture(texture);
        // Precargar siguiente
        const next = await loadTexture(getRandomImageUrl());
        setNextTexture(next);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading initial texture:', error);
        setIsLoading(false);
      }
    };
    init();
  }, [loadTexture]);

  // Cuando termina la transición, hacer swap de texturas
  const completeTransition = useCallback(() => {
    if (nextTexture && isTransitioning.current) {
      // Swap: la siguiente se vuelve la actual
      if (currentTexture) {
        currentTexture.dispose();
      }
      setCurrentTexture(nextTexture);
      setShowNext(0);
      isTransitioning.current = false;
      
      // Precargar nueva siguiente
      preloadNextImage();
    }
  }, [nextTexture, currentTexture, preloadNextImage]);

  const createRT = () => new THREE.WebGLRenderTarget(simSize, simSize, {
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const vorticityMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: vorticityVertex,
    fragmentShader: vorticityFragment,
    uniforms: {
      uVelocity: { value: null },
      uCurl: { value: null },
      uTexelSize: { value: new THREE.Vector2(texelSize[0], texelSize[1]) },
      uVorticity: { value: 30.0 },
      uDt: { value: 0.016 },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      uBoundaryFade: { value: 0.0 },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  const renderUniforms = useRef({
    uTexture: { value: null },
    uNextTexture: { value: null },
    uVelocity: { value: velocityRT[0].texture },
    uDensity: { value: densityRT[0].texture },
    uTime: { value: 0 },
    uShowNext: { value: 0 },
  });

  // Actualizar texturas en uniforms
  useEffect(() => {
    if (currentTexture) {
      renderUniforms.current.uTexture.value = currentTexture;
    }
  }, [currentTexture]);

  useEffect(() => {
    if (nextTexture) {
      renderUniforms.current.uNextTexture.value = nextTexture;
    }
  }, [nextTexture]);

  const velIdx = useRef(0);
  const denIdx = useRef(0);

  useEffect(() => {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    
    // Función común para procesar posición (mouse o touch)
    const processPointerPosition = (clientX, clientY) => {
      pointer.x = (clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      
      if (meshRef.current) {
        const intersects = raycaster.intersectObject(meshRef.current);
        if (intersects.length > 0 && intersects[0].uv) {
          setMouseUV([intersects[0].uv.x, intersects[0].uv.y]);
          setIsMouseOver(true);
          return true;
        }
      }
      return false;
    };
    
    // === MOUSE EVENTS ===
    const handleMouseMove = (event) => {
      if (!processPointerPosition(event.clientX, event.clientY)) {
        setIsMouseOver(false);
      }
    };

    const handleMouseLeave = () => {
      setIsMouseOver(false);
    };

    // === TOUCH EVENTS ===
    const handleTouchStart = (event) => {
      // Si touch está deshabilitado, no procesar (permite scroll normal)
      if (disableTouchRef.current) return;
      
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        processPointerPosition(touch.clientX, touch.clientY);
      }
    };

    const handleTouchMove = (event) => {
      // Si touch está deshabilitado, no procesar (permite scroll normal)
      if (disableTouchRef.current) return;
      
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        if (processPointerPosition(touch.clientX, touch.clientY)) {
          // Prevenir scroll mientras interactúa con la imagen
          event.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      // Si touch está deshabilitado, no cambiar estado
      if (disableTouchRef.current) return;
      setIsMouseOver(false);
    };

    // Añadir event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [camera]);

  useFrame((state) => {
    if (!meshRef.current || !currentTexture) return;

    const time = state.clock.elapsedTime;
    const dt = 0.016;

    // Detectar cuando el mouse sale después de "quemar"
    if (wasMouseOver.current && !isMouseOver && wasBurned && nextTexture) {
      // Iniciar transición - mostrar siguiente imagen
      setShowNext(1);
      isTransitioning.current = true;
      setWasBurned(false);
      burnLevel.current = 0;
    }
    wasMouseOver.current = isMouseOver;

    // Actualizar uniform de showNext
    renderUniforms.current.uShowNext.value = showNext;

    const velocityDissipation = isMouseOver ? 0.05 : 0.8;
    const densityDissipation = isMouseOver ? 0.08 : 2.5;

    if (isMouseOver) {
      const dx = mouseUV[0] - prevMouseUV.current[0];
      const dy = mouseUV[1] - prevMouseUV.current[1];

      burnLevel.current += 0.006;
      if (burnLevel.current > 2.5) {
        setWasBurned(true);
      }

      // === Splat velocity ===
      splatMat.uniforms.uTarget.value = velocityRT[velIdx.current].texture;
      splatMat.uniforms.uPoint.value.set(mouseUV[0], mouseUV[1]);
      splatMat.uniforms.uColor.value.set(dx * 30.0, dy * 30.0, 0);
      splatMat.uniforms.uRadius.value = 0.0012;
      
      simQuad.material = splatMat;
      gl.setRenderTarget(velocityRT[1 - velIdx.current]);
      gl.render(simScene, simCamera);
      velIdx.current = 1 - velIdx.current;

      // === Splat density ===
      splatMat.uniforms.uTarget.value = densityRT[denIdx.current].texture;
      splatMat.uniforms.uColor.value.set(0.5, 0.0, 0.0);
      splatMat.uniforms.uRadius.value = 0.0007;
      
      simQuad.material = splatMat;
      gl.setRenderTarget(densityRT[1 - denIdx.current]);
      gl.render(simScene, simCamera);
      denIdx.current = 1 - denIdx.current;
    } else {
      burnLevel.current = Math.max(0, burnLevel.current - 0.02);
    }

    // === Curl ===
    curlMat.uniforms.uVelocity.value = velocityRT[velIdx.current].texture;
    simQuad.material = curlMat;
    gl.setRenderTarget(curlRT);
    gl.render(simScene, simCamera);

    // === Vorticity ===
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

    renderUniforms.current.uVelocity.value = velocityRT[velIdx.current].texture;
    renderUniforms.current.uDensity.value = densityRT[denIdx.current].texture;
    renderUniforms.current.uTime.value = time;

    // Detectar cuando la transición está completa (humo casi disipado)
    // Esto se hace cuando showNext es 1 y el humo se ha ido
    if (isTransitioning.current && showNext === 1) {
      // Chequear si el humo se ha disipado lo suficiente
      // Usamos burnLevel como proxy - cuando es muy bajo, la transición está completa
      if (burnLevel.current < 0.1 && !isMouseOver) {
        completeTransition();
      }
    }

    prevMouseUV.current = [mouseUV[0], mouseUV[1]];
  });

  useEffect(() => {
    return () => {
      velocityRT.forEach(t => t.dispose());
      densityRT.forEach(t => t.dispose());
      curlRT.dispose();
    };
  }, [velocityRT, densityRT, curlRT]);

  if (isLoading || !currentTexture) {
    return null;
  }

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
