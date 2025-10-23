import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Configuración de animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const TextContainer = styled(motion.div)`
  text-align: center;
  margin: 2rem 0;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 300;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.2rem);
  font-weight: 300;
  max-width: 600px;
  line-height: 1.6;
  color: #a0a0a0;
`;

const AnimatedText = ({ 
  title, 
  subtitle, 
  titleDelay = 0, 
  subtitleDelay = 0.3,
  inView = true 
}) => {
  return (
    <TextContainer
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <Title
        variants={itemVariants}
        custom={titleDelay}
      >
        {title}
      </Title>
      <Subtitle
        variants={itemVariants}
        custom={subtitleDelay}
      >
        {subtitle}
      </Subtitle>
    </TextContainer>
  );
};

export default AnimatedText;