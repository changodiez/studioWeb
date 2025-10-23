import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Section = styled.section`
  position: relative;
  width: 100%;
  background: #0a0a0a;
  overflow: hidden;
`;

/* Este contenedor será sticky para mantener vista mientras se hace la "traducción" horizontal */
const Sticky = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

/* Contenedor horizontal que se mueve en X */
const Horizontal = styled(motion.div)`
  display: flex;
  align-items: center;
  height: 100%;
  width: max-content;
  will-change: transform;
`;

/* Tarjeta proyecto */
const ProjectCard = styled.div`
  width: 70vw;
  height: 70vh;
  margin-right: 4rem;
  background: #1a1a1a;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;

  &:last-child {
    margin-right: 30vw;
  }

  @media (max-width: 768px) {
    width: 85vw;
    height: 60vh;
    margin-right: 2rem;
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
`;

const ProjectInfo = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
  color: white;
`;

const ScrollHint = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: #666;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  z-index: 100;
  background: rgba(10, 10, 10, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  pointer-events: none;
`;

const HorizontalScrollGallery = () => {
  const sectionRef = useRef(null);
  const horizontalRef = useRef(null);
  const [sectionHeight, setSectionHeight] = useState(window.innerHeight);
  const [translateX, setTranslateX] = useState(0);
  const [active, setActive] = useState(false);

  const projects = [
    { id: 1, title: 'Architecture Visualization', image: 'https://picsum.photos/1200/800?random=101' },
    { id: 2, title: 'Product Experience',    image: 'https://picsum.photos/1200/800?random=102' },
    { id: 3, title: 'Brand Identity',         image: 'https://picsum.photos/1200/800?random=103' },
    { id: 4, title: 'Interactive Platform',   image: 'https://picsum.photos/1200/800?random=104' },
  ];

  // Recalcula tamaños cuando carga y en resize
  useEffect(() => {
    const calculate = () => {
      const horiz = horizontalRef.current;
      const sec = sectionRef.current;
      if (!horiz || !sec) return;

      const totalScrollWidth = horiz.scrollWidth;             // ancho total del contenido
      const viewportWidth = window.innerWidth;
      // Altura necesaria para mapear completamente el desplazamiento vertical al movimiento horizontal:
      // queremos que el usuario tenga que scrollear la distancia equivalente a (totalScrollWidth - viewportWidth)
      const extraScroll = Math.max(totalScrollWidth - viewportWidth, 0);
      const newSectionHeight = window.innerHeight + extraScroll;
      setSectionHeight(newSectionHeight);
    };

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, [projects.length]);

  // Escucha scroll y mapea a translateX mientras la sección está visible
  useEffect(() => {
    let rafId = null;

    const onScroll = () => {
      if (!sectionRef.current || !horizontalRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const start = rect.top; // distancia desde top viewport a top de la sección
      const end = rect.bottom - window.innerHeight; // cuando termina el "rango" útil
      // cuando rect.top == 0 -> empezamos a mapear; cuando rect.top == -(sectionHeight - window.innerHeight) -> terminado
      // Calculamos progreso entre 0 y 1:
      const scrollable = Math.max(sectionHeight - window.innerHeight, 1);
      const scrolled = Math.min(Math.max(window.scrollY - (window.scrollY + rect.top) + (window.scrollY - window.scrollY), 0), scrollable); 
      // alternativa: usar window.pageYOffset y obtener offset de la sección
      const sectionTopInPage = window.scrollY + rect.top;
      const progress = Math.min(Math.max((window.scrollY - sectionTopInPage) / scrollable, 0), 1);

      const totalScrollWidth = horizontalRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxTranslate = Math.max(totalScrollWidth - viewportWidth, 0);
      const x = -progress * maxTranslate;

      // usar requestAnimationFrame para suavidad
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setTranslateX(x);
        setActive(progress > 0 && progress < 1);
      });
    };

    // attach
    window.addEventListener('scroll', onScroll, { passive: true });
    // inicial
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [sectionHeight]);

  return (
    <Section ref={sectionRef} id="proyectos" style={{ height: sectionHeight }}>
      <Sticky>
        <Horizontal
          ref={horizontalRef}
          style={{ x: translateX }}
          transition={{ type: 'spring', stiffness: 90, damping: 25 }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectImage style={{ backgroundImage: `url(${project.image})` }} />
              <ProjectInfo>
                <h3 style={{ margin: 0, fontWeight: 300 }}>{project.title}</h3>
              </ProjectInfo>
            </ProjectCard>
          ))}
        </Horizontal>
      </Sticky>

      {active && <ScrollHint>Scroll horizontally ↓</ScrollHint>}
    </Section>
  );
};

export default HorizontalScrollGallery;
