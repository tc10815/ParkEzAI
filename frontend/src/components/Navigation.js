import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import logo from '../images/parkezlogosmall2.png';
import { FiMenu } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL;

const Navigation = () => {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
    const token = localStorage.getItem("token");
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
        window.scrollTo(0, 0);
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

      const renderLinksByRole = () => {
        const loggedInLinks = (
          <li className="nav-item ps-2 pe-2">
              <NavLink onClick={handleLogout} className="nav-link"  to="/login">Logout</NavLink>
          </li>
        );
        if (!userRole) {
            return (
              <>
              <li className="nav-item ps-2 pe-2">
                  <NavLink onClick={scrollToTop} className="nav-link"  to="/">Home</NavLink>
              </li>
              <li className="nav-item ps-2 pe-2">
                  <NavLink onClick={scrollToTop} className="nav-link"  to="/find-parking">Find Parking</NavLink>
              </li>
              <li className="nav-item ps-2 pe-2">
                  <NavLink onClick={scrollToTop} className="nav-link"  to="/about">About</NavLink>
              </li>
                <li className="nav-item ps-2 pe-2">
                    <NavLink onClick={scrollToTop} className="nav-link"  to="/signup">Sign Up</NavLink>
                </li>
                <li className="nav-item ps-2 pe-2">
                    <NavLink onClick={scrollToTop} className="nav-link"  to="/login">Login</NavLink>
                </li>
              </>
            );
          } else {
            const roleLinks = {
              'Lot Operator': (
                <>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/operator-dashboard">Parking Lot Dashboard</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/archive">Archive</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/plate-data">Plates</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/my-tickets">Support</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/billing">Billing</NavLink>
                  </li>
                </>
              ),
              'Advertiser': (
                <>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/advertiser-dashboard">Advertisements Dashboard</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/create-ad">Create Ad</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/my-tickets">Support</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/billing">Billing</NavLink>
                  </li>
                </>
              ),
              'Customer Support': (
                <>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/tickets">Support tickets</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/choose-lot-dashboard">Lot Admin</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/choose-ad-dashboard">Ad Admin</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/billing">Billing Admin</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/manage-accounts">Manage User Accounts</NavLink>
                  </li>
                </>
              ),
              'Lot Specialist': (
                <>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/tickets">Support tickets</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">                    
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/choose-lot-dashboard">Lot Admin</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/billing">Lot Billing Admin</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/manage-accounts">Manage Lot Accounts</NavLink>
                  </li>
                </>
              ),
              'Advertising Specialist': (
                <>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/tickets">Support tickets</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/choose-ad-dashboard">Ad Admin</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/billing">Ad Billing Admin</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/manage-accounts">Manage Ad Accounts</NavLink>
                  </li>
                </>
              ),
              'Accountant': (
                <>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/billing">Accountant Dashboard</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/add-invoice">New Invoice</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/choose-lot-dashboard">Lot Admin</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/choose-ad-dashboard">Ad Admin</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/manage-accounts">Manage Accounts</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/create-staff-account">Create Employees</NavLink>
                  </li>
                  <li className="nav-item ps-2 pe-2">
                      <NavLink onClick={scrollToTop} className="nav-link"  to="/tickets">Support tickets</NavLink>
                  </li>
                </>
              ),
            };
      
            return (
              <>
                {roleLinks[userRole]}
                <li className="nav-item ps-2 pe-2">
                    <NavLink onClick={scrollToTop} className="nav-link"  to="/account">Account</NavLink>
                </li>
                {loggedInLinks}
              </>
            );
          }
        };
      
return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <Link className="navbar-brand ps-3" to="/">
            <img src={logo} alt="Parkez Logo" className="custom-logo" />
            <span className="me-2 ps-2 pe-2">ParkEz AI</span> 
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <FiMenu />
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav mb-2 mb-lg-0">
                {renderLinksByRole()}
            </ul>
        </div>
    </nav>    
  );
};
export default Navigation;