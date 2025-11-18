import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import ProjectDetail from './ProjectDetail';

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
  transition: background-color 0.3s ease;
`;

const ProjectLink = styled.div`
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
  transition: color 0.3s ease;
  
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
  transition: color 0.3s ease;
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
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "Architecture Visualization",
      category: "3D Design",
      year: "2024",
      image: "https://picsum.photos/800/600?random=101",
      description: "Una exploración visual de espacios arquitectónicos modernos utilizando técnicas avanzadas de renderizado 3D. Este proyecto combina realismo fotográfico con elementos artísticos para crear visualizaciones que inspiran y comunican la esencia de cada espacio.",
      images: [
        "https://picsum.photos/1200/800?random=201",
        "https://picsum.photos/1200/800?random=202",
        "https://picsum.photos/1200/800?random=203",
        "https://picsum.photos/1200/800?random=204"
      ],
      video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 2,
      title: "Product Experience", 
      category: "Web Development",
      year: "2024",
      image: "https://picsum.photos/800/600?random=102",
      description: "Plataforma web interactiva diseñada para mostrar productos de manera inmersiva. La experiencia combina diseño minimalista con interacciones fluidas que guían al usuario a través de un viaje visual único.",
      images: [
        "https://picsum.photos/1200/800?random=205",
        "https://picsum.photos/1200/800?random=206",
        "https://picsum.photos/1200/800?random=207"
      ],
      video: null
    },
    {
      id: 3,
      title: "Brand Identity",
      category: "Branding",
      year: "2023", 
      image: "https://picsum.photos/800/600?random=103",
      description: "Desarrollo de identidad visual completa para una marca emergente. El proceso incluyó investigación, conceptualización y aplicación de la marca en múltiples touchpoints, creando una experiencia cohesiva y memorable.",
      images: [
        "https://picsum.photos/1200/800?random=208",
        "https://picsum.photos/1200/800?random=209",
        "https://picsum.photos/1200/800?random=210",
        "https://picsum.photos/1200/800?random=211",
        "https://picsum.photos/1200/800?random=212"
      ],
      video: null
    },
    {
      id: 4,
      title: "Interactive Platform",
      category: "Development",
      year: "2023",
      image: "https://picsum.photos/800/600?random=104",
      description: "Plataforma interactiva que permite a los usuarios explorar contenido de manera innovadora. Utilizando tecnologías web modernas, creamos una experiencia fluida y responsiva que se adapta a diferentes dispositivos.",
      images: [
        "https://picsum.photos/1200/800?random=213",
        "https://picsum.photos/1200/800?random=214"
      ],
      video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      id: 5,
      title: "Motion Graphics",
      category: "Animation",
      year: "2023",
      image: "https://picsum.photos/800/600?random=105",
      description: "Serie de animaciones motion graphics que combinan elementos gráficos con narrativa visual. Cada pieza está diseñada para comunicar conceptos complejos de manera clara y atractiva.",
      images: [
        "https://picsum.photos/1200/800?random=215",
        "https://picsum.photos/1200/800?random=216",
        "https://picsum.photos/1200/800?random=217"
      ],
      video: null
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
        <ProjectList>
          {projects.map((project, index) => (
            <ProjectItem
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ backgroundColor: '#111' }}
              onClick={() => handleProjectClick(project)}
            >
              <ProjectLink>
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