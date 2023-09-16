import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import logo from '../images/parkezlogosmall2.png';
import styled from 'styled-components';
import theme from '../theme';
import { FiMenu } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL;

const Navigation = () => {

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <Link className="navbar-brand ps-3" to="/"> {/* Added padding to the start (left) of the logo */}
                <img src={logo} alt="Parkez Logo" width="30" height="24" className="d-inline-block align-text-top" />
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <FiMenu />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link onClick={scrollToTop} className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link onClick={scrollToTop} className="nav-link" to="/find-parking">Find Parking</Link>
                    </li>
                    <li className="nav-item">
                        <Link onClick={scrollToTop} className="nav-link" to="/about">About</Link>
                    </li>
                    <li className="nav-item">
                        <Link onClick={scrollToTop} className="nav-link" to="/signup">Sign Up</Link>
                    </li>
                </ul>
                <ul className="navbar-nav mb-2 mb-lg-0">
                    <li className="nav-item pe-3"> 
                        <Link onClick={scrollToTop} className="nav-link" to="/login">Login</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;
