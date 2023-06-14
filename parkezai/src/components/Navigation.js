import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../images/parkezlogosmall2.png';
import styled from 'styled-components';
import theme from '../theme';

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
  const location = useLocation();

  const isBlackNavbarPage = () => {
    const blackNavbarPages = ['/login', '/advertiser-dashboard'];
    return blackNavbarPages.includes(location.pathname);
  };

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



  const fetchUserRole = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch('http://localhost:8000/accounts/users/me/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        const user = await response.json();
        const roleName = user.role_name;
        setUserRole(roleName);
      } catch (error) {
        console.log("Request to backend failed. Please ensure the endpoint is correct and the backend is running.");
      }
    }
  };

  

  useEffect(() => {
    const handleTokenUpdate = (event) => {

    };
    const handleLogout = () => {
      setUserRole(null);
    };
    window.addEventListener('tokenUpdate', handleTokenUpdate);
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('tokenUpdate', handleTokenUpdate);
      window.removeEventListener('logout', handleLogout);
  
    };
  }, []);

 
  useEffect(() => {
    const handleLogin = () => {
      fetchUserRole();
    };
    window.addEventListener('login', handleLogin);

    return () => {
      window.removeEventListener('login', handleLogin);
    };
  }, []);

  useEffect(() => {
    fetchUserRole();
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
        'Lot Operator': (
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
                <StyledNavLink to="/my-tickets">Support</StyledNavLink>
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
        'Advertiser': (
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
                <StyledNavLink to="/my-tickets">Support</StyledNavLink>
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
        'Customer Support': (
          <>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/tickets">Support tickets</StyledNavLink>
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
                <StyledNavLink to="/manage-accounts">Manage User Accounts</StyledNavLink>
              </StyledButton>
            </StyledLi>
          </>
        ),
        'Lot Specialist': (
          <>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/tickets">Support tickets</StyledNavLink>
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
                <StyledNavLink to="/manage-accounts">Manage Lot Accounts</StyledNavLink>
              </StyledButton>
            </StyledLi>
          </>
        ),
        'Advertising Specialist': (
          <>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/tickets">Support tickets</StyledNavLink>
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
                <StyledNavLink to="/manage-accounts">Manage Ad Accounts</StyledNavLink>
              </StyledButton>
            </StyledLi>
          </>
        ),
        'Accountant': (
          <>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/accountant-dashboard">Accountant Dashboard</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/manage-accounts">Manage Accounts</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/create-staff-account">Create Employees</StyledNavLink>
              </StyledButton>
              <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/tickets">Support tickets</StyledNavLink>
              </StyledButton>
            </StyledLi>
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
    <StyledNav scrolled={scrolled || isBlackNavbarPage()}>
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