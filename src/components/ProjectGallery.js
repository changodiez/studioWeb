import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import ProjectDetail from './ProjectDetail';

const GallerySection = styled.section`
  width: 100%;
  background: #0a0a0a;
  padding: 8rem 2rem;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const GalleryHeader = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto 4rem;
  
  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 0.75rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #666;
  margin-bottom: 0.5rem;
`;

const GalleryGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ProjectCard = styled(motion.article)`
  cursor: pointer;
  position: relative;
`;

const ImageContainer = styled(motion.div)`
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #111;
  margin-bottom: 1rem;
`;

const ProjectImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${ProjectCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProjectInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 300;
  color: #fff;
  margin: 0;
  letter-spacing: 0.01em;
  transition: color 0.3s ease;
  
  ${ProjectCard}:hover & {
    color: #888;
  }
`;

const ProjectCategory = styled.span`
  font-size: 0.75rem;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ProjectGallery = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Architecture Visualization",
      category: "3D Design",
      year: "2024",
      image: "https://picsum.photos/800/600?grayscale&random=101",
      description: "Una exploración visual de espacios arquitectónicos modernos utilizando técnicas avanzadas de renderizado 3D. Este proyecto combina realismo fotográfico con elementos artísticos para crear visualizaciones que inspiran y comunican la esencia de cada espacio.",
      images: [
        "https://picsum.photos/1200/800?grayscale&random=201",
        "https://picsum.photos/1200/800?grayscale&random=202",
        "https://picsum.photos/1200/800?grayscale&random=203",
        "https://picsum.photos/1200/800?grayscale&random=204"
      ],
      video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 2,
      title: "Product Experience", 
      category: "Web Development",
      year: "2024",
      image: "https://picsum.photos/800/600?grayscale&random=102",
      description: "Plataforma web interactiva diseñada para mostrar productos de manera inmersiva. La experiencia combina diseño minimalista con interacciones fluidas que guían al usuario a través de un viaje visual único.",
      images: [
        "https://picsum.photos/1200/800?grayscale&random=205",
        "https://picsum.photos/1200/800?grayscale&random=206",
        "https://picsum.photos/1200/800?grayscale&random=207"
      ],
      video: null
    },
    {
      id: 3,
      title: "Brand Identity",
      category: "Branding",
      year: "2023", 
      image: "https://picsum.photos/800/600?grayscale&random=103",
      description: "Desarrollo de identidad visual completa para una marca emergente. El proceso incluyó investigación, conceptualización y aplicación de la marca en múltiples touchpoints, creando una experiencia cohesiva y memorable.",
      images: [
        "https://picsum.photos/1200/800?grayscale&random=208",
        "https://picsum.photos/1200/800?grayscale&random=209",
        "https://picsum.photos/1200/800?grayscale&random=210",
        "https://picsum.photos/1200/800?grayscale&random=211",
        "https://picsum.photos/1200/800?grayscale&random=212"
      ],
      video: null
    },
    {
      id: 4,
      title: "Interactive Platform",
      category: "Development",
      year: "2023",
      image: "https://picsum.photos/800/600?grayscale&random=104",
      description: "Plataforma interactiva que permite a los usuarios explorar contenido de manera innovadora. Utilizando tecnologías web modernas, creamos una experiencia fluida y responsiva que se adapta a diferentes dispositivos.",
      images: [
        "https://picsum.photos/1200/800?grayscale&random=213",
        "https://picsum.photos/1200/800?grayscale&random=214"
      ],
      video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ];

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseDetail = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <GallerySection id="proyectos">
        <GalleryHeader
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SectionTitle>Proyectos</SectionTitle>
        </GalleryHeader>
        
        <GalleryGrid>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              onClick={() => handleProjectClick(project)}
            >
              <ImageContainer>
                <ProjectImage 
                  src={project.image} 
                  alt={project.title}
                  loading="lazy"
                />
              </ImageContainer>
              <ProjectInfo>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectCategory>{project.category}</ProjectCategory>
              </ProjectInfo>
            </ProjectCard>
          ))}
        </GalleryGrid>
      </GallerySection>

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};

export default ProjectGallery;
