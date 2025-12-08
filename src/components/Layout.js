import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    padding: 1rem 0;
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
  z-index: 1001;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    display: none;
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

const MenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
`;

const MenuLine = styled(motion.span)`
  display: block;
  width: 24px;
  height: 1px;
  background: #fff;
  transform-origin: center;
`;

const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 10, 0.98);
  z-index: 999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const MobileNavLink = styled(motion.a)`
  color: #fff;
  text-decoration: none;
  font-weight: 300;
  font-size: 1.5rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: color 0.3s ease;
  
  &:hover {
    color: #888;
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#proyectos', label: 'Proyectos' },
    { href: '#contacto', label: 'Contacto' }
  ];

  return (
    <LayoutContainer>
      <Header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Nav>
          <Logo whileHover={{ opacity: 0.7 }} onClick={closeMenu}>
            fum
          </Logo>
          
          <NavLinks>
            {menuLinks.map(link => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </NavLinks>
          
          <MenuButton onClick={toggleMenu} aria-label="Menu">
            <MenuLine
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <MenuLine
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <MenuLine
              animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </MenuButton>
        </Nav>
      </Header>

      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenuOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {menuLinks.map((link, index) => (
              <MobileNavLink
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {link.label}
              </MobileNavLink>
            ))}
          </MobileMenuOverlay>
        )}
      </AnimatePresence>

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
