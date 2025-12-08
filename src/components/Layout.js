import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

const Header = styled(motion.header)`
  padding: 1.5rem 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 1.25rem 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const Logo = styled(motion.div)`
  font-size: 1.25rem;
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  color: #fff;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
  
  a {
    color: #888;
    text-decoration: none;
    font-weight: 300;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 0.3s ease;
    
    &:hover {
      color: #fff;
    }
  }
`;

const Main = styled.main`
  position: relative;
`;

const Footer = styled(motion.footer)`
  padding: 2rem 0;
  text-align: center;
  color: #444;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  background: #0a0a0a;
  border-top: 1px solid #1a1a1a;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Nav>
          <Logo whileHover={{ opacity: 0.7 }}>
            fum
          </Logo>
          <NavLinks>
            <a href="#inicio">Inicio</a>
            <a href="#proyectos">Proyectos</a>
            <a href="#contacto">Contacto</a>
          </NavLinks>
        </Nav>
      </Header>
      <Main>
        {children}
      </Main>
      <Footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <p>© 2025 fum Studio</p>
      </Footer>
    </LayoutContainer>
  );
};

export default Layout;
