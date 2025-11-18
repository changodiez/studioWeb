import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

const Header = styled(motion.header)`
  padding: 2rem 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(10px);
  transition: background 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1.5rem 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4rem;
  
  @media (max-width: 768px) {
    padding: 0 2rem;
  }
`;

const Logo = styled(motion.div)`
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 3rem;
  
  @media (max-width: 768px) {
    gap: 2rem;
  }
  
  a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 300;
    font-size: 0.85rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    transition: color 0.3s ease;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 1px;
      background: #4cc9f0;
      transition: width 0.3s ease;
    }
    
    &:hover {
      color: #4cc9f0;
      
      &::after {
        width: 100%;
      }
    }
  }
`;

const Main = styled.main`
  position: relative;
`;

const Footer = styled(motion.footer)`
  padding: 2rem 0;
  text-align: center;
  color: #666;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  background: #0a0a0a;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Nav>
          <Logo
            whileHover={{ scale: 1.05 }}
          >
            Studio
          </Logo>
          <NavLinks>
            <a href="#inicio">Home</a>
            <a href="#proyectos">Work</a>
            <a href="#contacto">Contact</a>
          </NavLinks>
        </Nav>
      </Header>
      <Main>
        {children}
      </Main>
      <Footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <p>&copy; 2024 Studio. All rights reserved.</p>
      </Footer>
    </LayoutContainer>
  );
};

export default Layout;