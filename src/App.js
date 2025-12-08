import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { GlobalStyle } from './styles/GlobalStyles';
import Layout from './components/Layout';
import DisintegrationShader from './components/DisintegrationShader';
import ProjectGallery from './components/ProjectGallery';

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isBurned, setIsBurned] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [shaderKey, setShaderKey] = useState(0);
  
  const heroRef = useRef(null);

  // Detectar dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Controlar scroll en móvil
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    
    if (!isMobile) {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
      document.documentElement.style.overflow = 'auto';
      if (canvas) canvas.style.touchAction = 'auto';
      return;
    }

    if (canScroll) {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
      document.documentElement.style.overflow = 'auto';
      if (canvas) canvas.style.touchAction = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
      if (canvas) canvas.style.touchAction = 'none';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
      document.documentElement.style.overflow = 'auto';
      if (canvas) canvas.style.touchAction = 'auto';
    };
  }, [canScroll, isMobile]);

  // Cuando se quema, habilitar scroll (en móvil)
  useEffect(() => {
    if (isBurned && isMobile) {
      setTimeout(() => {
        setCanScroll(true);
      }, 500);
    }
  }, [isBurned, isMobile]);

  // Detectar cuando el usuario vuelve al top
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const wasAtTop = isAtTop;
      const nowAtTop = scrollTop < 100;
      
      setIsAtTop(nowAtTop);
      
      if (nowAtTop && !wasAtTop && isMobile) {
        setCanScroll(false);
        setIsBurned(false);
        setShaderKey(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAtTop, isMobile]);

  // Ocultar indicador después de primera interacción
  useEffect(() => {
    const hideIndicator = () => setHasInteracted(true);
    window.addEventListener('touchstart', hideIndicator, { once: true });
    window.addEventListener('mousemove', hideIndicator, { once: true });
    return () => {
      window.removeEventListener('touchstart', hideIndicator);
      window.removeEventListener('mousemove', hideIndicator);
    };
  }, []);

  const handleBurnedChange = (burned) => {
    setIsBurned(burned);
  };

  // Wrapper para centrar el indicador
  const indicatorWrapperStyle = {
    position: 'fixed',
    top: '5rem',
    left: '0px',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'none'
  };

  // Estilos de la tarjeta de indicación
  const indicatorCardStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'rgba(0, 0, 0, 0.6)',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    whiteSpace: 'nowrap'
  };

  return (
    <>
      <GlobalStyle />
      <Layout>
        {/* Hero Section con shader de humo */}
        <section 
          ref={heroRef}
          id="inicio" 
          style={{ 
            width: '100%', 
            height: '100vh', 
            position: 'relative',
            background: '#0a0a0a',
            overflowX: 'hidden'
          }}
        >
          <Canvas camera={{ position: [0, 0, 3] }}>
            <DisintegrationShader 
              key={shaderKey}
              scale={2.2} 
              onBurnedChange={handleBurnedChange}
              disableTouch={isMobile && canScroll}
            />
          </Canvas>
          
          {/* Texto Hero */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '4rem',
              left: '2rem',
              color: 'white',
              zIndex: 10,
              pointerEvents: 'none'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.h1 
              style={{ 
                fontSize: 'clamp(1.8rem, 5vw, 4rem)', 
                fontWeight: 300,
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
                lineHeight: '1'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              fum
              <br />
              <span style={{ color: '#666' }}>Studio</span>
            </motion.h1>
          </motion.div>

          {/* Indicadores móvil - wrapper para centrar */}
          <div style={indicatorWrapperStyle}>
            <AnimatePresence mode="wait">
              {/* Indicador inicial - antes de interactuar */}
              {isMobile && !hasInteracted && (
                <motion.div
                  key="initial"
                  style={indicatorCardStyle}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 1.5, duration: 0.3 }}
                >
                  <span style={{ fontSize: '1rem' }}>👆</span>
                  <span style={{ 
                    color: '#aaa',
                    fontSize: '0.7rem', 
                    letterSpacing: '0.05em'
                  }}>
                    Toca y arrastra para crear humo
                  </span>
                </motion.div>
              )}

              {/* Indicador bloqueado - después de interactuar, antes de quemar */}
              {isMobile && !canScroll && !isBurned && hasInteracted && (
                <motion.div
                  key="locked"
                  style={indicatorCardStyle}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span style={{ fontSize: '0.9rem' }}>🔒</span>
                  <span style={{ 
                    color: '#aaa',
                    fontSize: '0.7rem', 
                    letterSpacing: '0.05em'
                  }}>
                    Crea humo para desbloquear el scroll
                  </span>
                </motion.div>
              )}

              {/* Indicador desbloqueado - después de quemar */}
              {isMobile && canScroll && (
                <motion.div
                  key="unlocked"
                  style={indicatorCardStyle}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span style={{ fontSize: '0.9rem' }}>🔓</span>
                  <span style={{ 
                    color: '#4ade80',
                    fontSize: '0.7rem', 
                    letterSpacing: '0.05em'
                  }}>
                    Desbloqueado · scroll para descubrir
                  </span>
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ 
                      color: '#888',
                      fontSize: '0.9rem',
                      marginLeft: '0.25rem'
                    }}
                  >
                    ↓
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Indicador scroll desktop */}
          {!isMobile && (
            <motion.div
              style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                pointerEvents: 'none',
                zIndex: 10
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              <span style={{ 
                color: '#555',
                fontSize: '0.7rem', 
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                Scroll para descubrir
              </span>
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ 
                  color: '#444',
                  fontSize: '1.2rem'
                }}
              >
                ↓
              </motion.span>
            </motion.div>
          )}

        </section>

        {/* Galería de Proyectos */}
        <ProjectGallery />

        {/* Contact Section */}
        <section 
          id="contacto" 
          style={{ 
            width: '100%',
            minHeight: '40vh',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6rem 2rem',
            borderTop: '1px solid #1a1a1a'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ 
              textAlign: 'center',
              maxWidth: '400px'
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              style={{ 
                fontSize: '0.75rem',
                color: '#555',
                marginBottom: '1.5rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}
            >
              Contacto
            </motion.p>
            
            <motion.a
              href="mailto:hola@fumstudio.com"
              style={{
                color: '#fff',
                fontSize: '1.25rem',
                textDecoration: 'none',
                fontWeight: 300,
                letterSpacing: '0.02em',
                transition: 'color 0.3s ease'
              }}
              whileHover={{ color: '#666' }}
            >
              hola@fumstudio.com
            </motion.a>
          </motion.div>
        </section>
      </Layout>
    </>
  );
}

export default App;
