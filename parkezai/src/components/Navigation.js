import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../theme';

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ scrolled }) => (scrolled ? theme.primary : 'transparent')};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
  padding: 0rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background-color 0.3s;
`;


const StyledUl = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  margin: 0em;
  padding: 0;
`;

const StyledLi = styled.li`
  display: flex;
  margin-right: 1rem;
  height: 100%;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${theme.accent};
  font-weight: 600;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem 0.5rem; // Increase the padding values to make the buttons bigger
`;

const StyledButton = styled.div`
  display: flex;
  align-items: center;
  background-color: transparent;
  height: 100%;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${theme.secondary};
  }
`;

const Logo = styled.div`
  color: ${theme.accent};
  font-size: 1.2rem;
  font-weight: bold;
  padding-left: 1.5rem;
`;

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      // Clean up the event listener
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);


  return (
    <StyledNav scrolled={scrolled}>
      <Logo>ParkEzAI</Logo>
      <StyledUl>
        <StyledLi>
          <StyledButton>
            <StyledLink to="/">Home</StyledLink>
          </StyledButton>
        </StyledLi>
        <StyledLi>
          <StyledButton>
            <StyledLink to="/find-parking">Find Parking</StyledLink>
          </StyledButton>
        </StyledLi>
        <StyledLi>
          <StyledButton>
            <StyledLink to="/about">About</StyledLink>
          </StyledButton>
        </StyledLi>
        <StyledLi>
          <StyledButton>
            <StyledLink to="/help-center">Help Center</StyledLink>
          </StyledButton>
        </StyledLi>
        <StyledLi>
          <StyledButton>
            <StyledLink to="/login">Login</StyledLink>
          </StyledButton>
        </StyledLi>
        <StyledLi>
          <StyledButton>
            <StyledLink to="/signup">Sign Up</StyledLink>
          </StyledButton>
        </StyledLi>
      </StyledUl>
    </StyledNav>
  );
};

export default Navigation;
