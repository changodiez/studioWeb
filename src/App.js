import React from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { GlobalStyle } from './styles/GlobalStyles';
import Layout from './components/Layout';
import DisintegrationShader from './components/DisintegrationShader';
import ProjectGallery from './components/ProjectGallery';

function App() {
  return (
    <>
      <GlobalStyle />
      <Layout>
        {/* Hero Section - Mantenemos el shader 3D */}
        <section 
          id="inicio" 
          style={{ 
            width: '100vw', 
            height: '100vh', 
            position: 'relative',
            background: '#0a0a0a'
          }}
        >
          <Canvas camera={{ position: [0, 0, 3] }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <DisintegrationShader
              image="https://picsum.photos/1920/1080?random=100"
              scale={2.2}
            />
          </Canvas>
          
          {/* Texto Hero Mejorado */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '4rem',
              left: '4rem',
              color: 'white',
              zIndex: 10
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <motion.h1 
              style={{ 
                fontSize: 'clamp(2.5rem, 8vw, 5rem)', 
                fontWeight: 300,
                marginBottom: '1.5rem',
                letterSpacing: '-0.03em',
                lineHeight: '0.95'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              Creative
              <br />
              Studio
            </motion.h1>
            <motion.p 
              style={{ 
                fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', 
                fontWeight: 300,
                opacity: 0.85,
                letterSpacing: '0.02em',
                maxWidth: '500px',
                lineHeight: '1.6'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              We create digital experiences that blend technology with timeless design principles.
            </motion.p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              zIndex: 10,
              textAlign: 'center'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ 
                marginBottom: '0.5rem',
                fontSize: '1.2rem'
              }}
            >
              ↓
            </motion.div>
            <p style={{ 
              fontSize: '0.8rem', 
              fontWeight: 300,
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}>
              Scroll to explore
            </p>
          </motion.div>
        </section>

        {/* Galería de Proyectos - Estilo Anna Venezia */}
        <ProjectGallery />

        {/* Contact Section - Más minimalista */}
        <section 
          id="contacto" 
          style={{ 
            width: '100%',
            minHeight: '50vh',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8rem 2rem',
            borderTop: '1px solid #333'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            style={{ 
              textAlign: 'center',
              maxWidth: '500px'
            }}
          >
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              viewport={{ once: true }}
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
                fontWeight: 300,
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em'
              }}
            >
              Let's create
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              viewport={{ once: true }}
              style={{ 
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', 
                color: '#a0a0a0',
                marginBottom: '2.5rem',
                lineHeight: '1.7'
              }}
            >
              Ready to bring your vision to life? 
              Get in touch to discuss your next project.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="mailto:hello@studio.com"
                style={{
                  color: '#4cc9f0',
                  fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                  textDecoration: 'none',
                  borderBottom: '1px solid #4cc9f0',
                  paddingBottom: '4px',
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  color: '#ffffff',
                  borderBottomColor: '#ffffff'
                }}
                transition={{ duration: 0.3 }}
              >
                hello@studio.com
              </motion.a>
            </motion.div>
          </motion.div>
        </section>
      </Layout>
    </>
  );
}

export default App;