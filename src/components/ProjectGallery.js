import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const GallerySection = styled.section`
  width: 100%;
  background: #0a0a0a;
  padding: 0;
`;

const ProjectList = styled.div`
  width: 100%;
`;

const ProjectItem = styled(motion.div)`
  width: 100%;
  border-bottom: 1px solid #333;
  cursor: pointer;
  position: relative;
  overflow: hidden;
`;

const ProjectLink = styled.a`
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 4rem 2rem;
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

const ProjectContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const ProjectText = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 300;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const ProjectCategory = styled.p`
  color: #666;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 300;
`;

const ProjectYear = styled.div`
  color: #666;
  font-size: 1rem;
  font-weight: 300;
  
  @media (max-width: 768px) {
    align-self: flex-end;
  }
`;

const ProjectImage = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  width: 400px;
  height: 300px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  
  @media (max-width: 768px) {
    width: 300px;
    height: 200px;
  }
`;

const ProjectGallery = () => {
  const projects = [
    {
      id: 1,
      title: "Architecture Visualization",
      category: "3D Design",
      year: "2024",
      image: "https://picsum.photos/800/600?random=101"
    },
    {
      id: 2,
      title: "Product Experience", 
      category: "Web Development",
      year: "2024",
      image: "https://picsum.photos/800/600?random=102"
    },
    {
      id: 3,
      title: "Brand Identity",
      category: "Branding",
      year: "2023", 
      image: "https://picsum.photos/800/600?random=103"
    },
    {
      id: 4,
      title: "Interactive Platform",
      category: "Development",
      year: "2023",
      image: "https://picsum.photos/800/600?random=104"
    },
    {
      id: 5,
      title: "Motion Graphics",
      category: "Animation",
      year: "2023",
      image: "https://picsum.photos/800/600?random=105"
    }
  ];

  return (
    <GallerySection id="proyectos">
      <ProjectList>
        {projects.map((project, index) => (
          <ProjectItem
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ backgroundColor: '#111' }}
          >
            <ProjectLink href="#">
              <ProjectContent>
                <ProjectText>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectCategory>{project.category}</ProjectCategory>
                </ProjectText>
                <ProjectYear>{project.year}</ProjectYear>
              </ProjectContent>
            </ProjectLink>
            
            <ProjectImage
              style={{ backgroundImage: `url(${project.image})` }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </ProjectItem>
        ))}
      </ProjectList>
    </GallerySection>
  );
};

export default ProjectGallery;