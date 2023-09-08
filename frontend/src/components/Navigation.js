import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import logo from '../images/parkezlogosmall2.png';
import styled from 'styled-components';
import theme from '../theme';
import { FiMenu } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
`;

const Hamburger = styled.div`
  display: flex;
  align-items: Left;
`;

const HamburgerMenuItems = styled.div`
  margin-top:30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
`

const StyledNav = styled.nav`
@media (min-width: 768px) {
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
}
@media (max-width: 768px) {
  display: none;
}
`;

const PhoneNav = styled.nav`
@media (min-width: 768px) {
  display: none;
}
@media (max-width: 768px) {
  font-size:1.3rem;
}
`;

const StyledUl = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  margin: 0em;
  padding: 0;
`;

const StyledLi = styled.li`
@media (min-width: 768px) {
  display: flex;
  margin-right: 1rem;
  height: 100%;
}
`;


const StyledNavLink = styled(NavLink)`
  @media (min-width: 768px) {

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
  }
  @media (max-width: 768px) {
    color:white;
  }

`;

const StyledButton = styled.div`
  @media (min-width: 768px) {

    display: flex;
    align-items: center;
    background-color: transparent;
    height: 100%;
    transition: background-color 0.3s;

    &:hover {
      background-color: ${theme.secondary};
    }
  }
  @media (min-width: 768px) {
    color:white;
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
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  const location = useLocation();

  const isBlackNavbarPage = () => {
    const blackNavbarPages = ['/login', '/advertiser-dashboard', '/create-ad'];
    return blackNavbarPages.includes(location.pathname);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // Send a GET request to the logout endpoint
    const response = await fetch(API_URL + "accounts/logout/", {
        method: "GET",
        headers: {
            "Authorization": `Token ${token}`,
        },
    });
    localStorage.removeItem("token");
    setUserRole(null);
    navigate("/login");
};

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setIsOpen(false);
  };



  const fetchUserRole = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch(API_URL + 'accounts/users/me/', {
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
                <StyledNavLink to="/plate-data">Plates</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/my-tickets">Support</StyledNavLink>
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
                <StyledNavLink to="/create-ad">Create Ad</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/my-tickets">Support</StyledNavLink>
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
                <StyledNavLink to="/billing">Billing Admin</StyledNavLink>
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
                <StyledNavLink to="/billing">Lot Billing Admin</StyledNavLink>
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
                <StyledNavLink to="/billing">Ad Billing Admin</StyledNavLink>
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
                <StyledNavLink to="/billing">Accountant Dashboard</StyledNavLink>
              </StyledButton>
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/add-invoice">New Invoice</StyledNavLink>
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
            </StyledLi>
            <StyledLi>
              <StyledButton onClick={scrollToTop}>
                <StyledNavLink to="/tickets">Support tickets</StyledNavLink>
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
    <>
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
    <PhoneNav>
      <Hamburger>
        <div><FiMenu style={{color: 'white', marginLeft: '15px', height: '50px'}}  onClick={handleToggle} /></div>
        {isOpen && <HamburgerMenuItems style={{
            textSize: "50px",
          
        }}>{renderLinksByRole()}</HamburgerMenuItems>}
      </Hamburger>
    </PhoneNav>
    </>
  );
};

export default Navigation;
