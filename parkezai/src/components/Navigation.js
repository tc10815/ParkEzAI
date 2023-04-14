import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1c1c1c;
  padding: 1rem;
`;

const StyledUl = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const StyledLi = styled.li`
  margin-left: 1rem;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #ffffff;
  font-weight: bold;
  transition: color 0.3s;

  &:hover {
    color: #ffc107;
  }
`;

const Logo = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: bold;
`;

const Navigation = () => {
  return (
    <StyledNav>
      <Logo>ParkEzAI</Logo>
      <StyledUl>
        <StyledLi>
          <StyledLink to="/">Home</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/find-parking">Find Parking</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/about">About</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/help-center">Help Center</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/login">Login</StyledLink>
        </StyledLi>
        <StyledLi>
          <StyledLink to="/signup">Sign Up</StyledLink>
        </StyledLi>
      </StyledUl>
    </StyledNav>
  );
};

export default Navigation;
