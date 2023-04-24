import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../images/parkezlogosmall2.png';
import styled from 'styled-components';
import theme from '../theme';
import jwt_decode from 'jwt-decode';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
`;

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


const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: ${theme.accent};
  font-weight: 600;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem 0.5rem; 

  &.active {
    background-color: rgba(57,130,142,0.35);
    
  }
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
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole(null);
    navigate("/login");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUserRole(decodedToken.data.role_id);
    }
  }, []);

  useEffect(() => {
    const handleTokenUpdate = (event) => {
      const updatedToken = event.detail;
      const decodedToken = jwt_decode(updatedToken);
      setUserRole(decodedToken.data.role_id);
    };

    window.addEventListener('tokenUpdate', handleTokenUpdate);

    return () => {
      window.removeEventListener('tokenUpdate', handleTokenUpdate);
    };
  }, []);

 



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

  const renderLinksByRole = () => {
    const loggedInLinks = (
      <StyledLi>
        <StyledButton onClick={handleLogout}>
          <StyledNavLink to="/login">Logout</StyledNavLink>
        </StyledButton>
      </StyledLi>
    );

    if (!userRole) {
      return (
        <>
        <StyledLi>
          <StyledButton onClick={scrollToTop}>
            <StyledNavLink to="/">Home</StyledNavLink>
          </StyledButton>
        </StyledLi>
        <StyledLi>
          <StyledButton onClick={scrollToTop}>
            <StyledNavLink to="/find-parking">Find Parking</StyledNavLink>
          </StyledButton>
        </StyledLi>
        <StyledLi>
          <StyledButton onClick={scrollToTop}>
            <StyledNavLink to="/about">About</StyledNavLink>
          </StyledButton>
        </StyledLi>

          <StyledLi>
            <StyledButton onClick={scrollToTop}>
              <StyledNavLink to="/signup">Sign Up</StyledNavLink>
            </StyledButton>
          </StyledLi>
          <StyledLi>
            <StyledButton onClick={scrollToTop}>
              <StyledNavLink to="/login">Login</StyledNavLink>
            </StyledButton>
          </StyledLi>
        </>
      );
    } else {
      const roleLinks = {
        1: (
          <>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/operator-dashboard">Parking Lot Dashboard</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/archive">Archive</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/support">Support</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/analysis">Analysis</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/billing">Billing</StyledNavLink>
              </StyledButton>
            </StyledLi>
          </>
        ),
        2: (
          <>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/advertiser-dashboard">Advertisements Dashboard</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/archive">Archive</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/support">Support</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/analysis">Analysis</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/billing">Billing</StyledNavLink>
              </StyledButton>
            </StyledLi>
          </>
        ),
        3: (
          <>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/support-tickets">Support tickets</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/lot-admin">Lot Admin</StyledNavLink>
              </StyledButton>
              </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/ad-admin">Ad Admin</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/billing-admin">Billing Admin</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/user-account-admin">User Account Admin</StyledNavLink>
              </StyledButton>
            </StyledLi>
          </>
        ),
        4: (
          <>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/support-tickets">Support tickets</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/lot-admin">Lot Admin</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/lot-billing-admin">Lot Billing Admin</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/lot-account-admin">Lot Account Admin</StyledNavLink>
              </StyledButton>
            </StyledLi>
          </>
        ),
        5: (
          <>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/support-tickets">Support tickets</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/ad-admin">Ad Admin</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/ad-billing-admin">Ad Billing Admin</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/ad-account-admin">Ad Account Admin</StyledNavLink>
              </StyledButton>
            </StyledLi>
          </>
        ),
        6: (
          <>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/accountant-dashboard">Accountant Dashboard</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/billing">Billing</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/create-staff-account">Employee Admin</StyledNavLink>
              </StyledButton>
            </StyledLi>
          </>
        ),
      };

      return (
        <>
          {roleLinks[userRole]}
          <StyledLi>
            <StyledButton onClick={scrollToTop}>
              <StyledNavLink to="/account">Account</StyledNavLink>
            </StyledButton>
          </StyledLi>
          {loggedInLinks}
        </>
      );
    }
  };

  return (
    <StyledNav scrolled={scrolled}>
      <LogoContainer>
        <img
          src={logo}
          alt="ParkEzAI Logo"
          style={{ height: '40px', width: '40px', marginRight: '0px' }}
        />
        <Logo>ParkEz</Logo>
      </LogoContainer>
      <StyledUl>{renderLinksByRole()}</StyledUl>
    </StyledNav>
  );
};

export default Navigation;