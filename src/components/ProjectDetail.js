import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0a0a0a;
  z-index: 2000;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ModalContainer = styled(motion.div)`
  min-height: 100vh;
  padding: 6rem 2rem 4rem;
  max-width: 1000px;
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
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  z-index: 2001;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #666;
    background: rgba(255, 255, 255, 0.03);
  }
  
  @media (max-width: 768px) {
    top: 1.5rem;
    right: 1.5rem;
    width: 40px;
    height: 40px;
  }
`;

const Header = styled.div`
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Meta = styled(motion.div)`
  display: flex;
  gap: 2rem;
  color: #555;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1rem;
  line-height: 1.8;
  color: #888;
  max-width: 700px;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const ContentSection = styled.div`
  margin-bottom: 3rem;
`;

const VideoContainer = styled(motion.div)`
  width: 100%;
  margin-bottom: 3rem;
  overflow: hidden;
  background: #111;
  
  video, iframe {
    width: 100%;
    height: auto;
    display: block;
    filter: grayscale(100%);
  }
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const GalleryImage = styled(motion.img)`
  width: 100%;
  height: auto;
  display: block;
  filter: grayscale(100%);
  cursor: pointer;
  transition: filter 0.3s ease;
  
  &:hover {
    filter: grayscale(80%);
  }
`;

const FullImageModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
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
  filter: grayscale(100%);
`;

const ProjectDetail = ({ project, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (selectedImage) {
          setSelectedImage(null);
        } else {
          onClose();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, selectedImage]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ModalContainer
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CloseButton
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ×
          </CloseButton>

          <Header>
            <Title
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {project.title}
            </Title>
            <Meta
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <span>{project.category}</span>
              <span>{project.year}</span>
            </Meta>
            {project.description && (
              <Description
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {project.description}
              </Description>
            )}
          </Header>

          {project.video && (
            <ContentSection>
              <VideoContainer
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
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
                    src={image}
                    alt={`${project.title} - ${index + 1}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    onClick={() => setSelectedImage(image)}
                    loading="lazy"
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
