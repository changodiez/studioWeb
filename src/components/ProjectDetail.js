import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ModalContainer = styled(motion.div)`
  min-height: 100vh;
  padding: 6rem 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 5rem 1.5rem 3rem;
  }
`;

const CloseButton = styled(motion.button)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: transparent;
  border: 1px solid #333;
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 2001;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #fff;
    background: rgba(255, 255, 255, 0.05);
  }
  
  @media (max-width: 768px) {
    top: 1.5rem;
    right: 1.5rem;
    width: 45px;
    height: 45px;
  }
`;

const Header = styled.div`
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 300;
  margin-bottom: 1rem;
  letter-spacing: -0.03em;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Meta = styled(motion.div)`
  display: flex;
  gap: 2rem;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #ccc;
  max-width: 800px;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentSection = styled.div`
  margin-bottom: 4rem;
`;

const VideoContainer = styled(motion.div)`
  width: 100%;
  margin-bottom: 4rem;
  border-radius: 8px;
  overflow: hidden;
  background: #111;
  
  video, iframe {
    width: 100%;
    height: auto;
    display: block;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
`;

const GalleryImage = styled(motion.div)`
  width: 100%;
  aspect-ratio: 16 / 10;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    transition: background 0.3s ease;
  }
  
  &:hover::after {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const FullImageModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.98);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
`;

const FullImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
`;

const ProjectDetail = ({ project, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    // Cerrar con la tecla Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContainer
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </CloseButton>

          <Header>
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {project.title}
            </Title>
            <Meta
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span>{project.category}</span>
              <span>{project.year}</span>
            </Meta>
            {project.description && (
              <Description
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {project.description}
              </Description>
            )}
          </Header>

          {project.video && (
            <ContentSection>
              <VideoContainer
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {project.video.includes('youtube.com') || project.video.includes('youtu.be') ? (
                  <iframe
                    src={project.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    title={project.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ aspectRatio: '16/9' }}
                  />
                ) : (
                  <video
                    src={project.video}
                    controls
                    style={{ width: '100%', height: 'auto' }}
                  />
                )}
              </VideoContainer>
            </ContentSection>
          )}

          {project.images && project.images.length > 0 && (
            <ContentSection>
              <ImageGallery>
                {project.images.map((image, index) => (
                  <GalleryImage
                    key={index}
                    style={{ backgroundImage: `url(${image})` }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    onClick={() => setSelectedImage(image)}
                    whileHover={{ scale: 1.02 }}
                  />
                ))}
              </ImageGallery>
            </ContentSection>
          )}

          <AnimatePresence>
            {selectedImage && (
              <FullImageModal
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
              >
                <FullImage
                  src={selectedImage}
                  alt={project.title}
                  onClick={(e) => e.stopPropagation()}
                />
              </FullImageModal>
            )}
          </AnimatePresence>
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
};

export default ProjectDetail;

