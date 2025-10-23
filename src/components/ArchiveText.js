import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const TextContainer = styled.div`
  text-align: center;
  margin: 4rem 0;
`;

const Line = styled(motion.div)`
  overflow: hidden;
`;

const Text = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 300;
  line-height: 0.9;
  letter-spacing: -0.03em;
  margin: 0;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: clamp(2rem, 10vw, 4rem);
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.1rem;
  font-weight: 300;
  margin-top: 2rem;
  max-width: 500px;
  line-height: 1.6;
  color: #a0a0a0;
`;

const ArchiveText = ({ lines, subtitle, staggerDelay = 0.1 }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const lineVariants = {
    hidden: { y: "100%" },
    visible: {
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <TextContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {lines.map((line, index) => (
          <Line key={index}>
            <Text variants={lineVariants}>
              {line}
            </Text>
          </Line>
        ))}
        
        {subtitle && (
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: lines.length * staggerDelay + 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            {subtitle}
          </Subtitle>
        )}
      </motion.div>
    </TextContainer>
  );
};

export default ArchiveText; 