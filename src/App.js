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
        {/* Hero Section con shader de humo */}
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
            <DisintegrationShader
              image="https://picsum.photos/1920/1080?grayscale&random=100"
              scale={2.2}
            />
          </Canvas>
          
          {/* Texto Hero */}
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
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.h1 
              style={{ 
                fontSize: 'clamp(2rem, 6vw, 4rem)', 
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

          {/* Scroll Indicator */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#444',
              zIndex: 10,
              textAlign: 'center'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ fontSize: '1rem' }}
            >
              ↓
            </motion.div>
          </motion.div>
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
