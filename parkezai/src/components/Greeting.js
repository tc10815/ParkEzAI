//NEW CODE
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from 'styled-components';
import jwt_decode from "jwt-decode";

const Greeting = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setUser(decodedToken.user);
    }
  }, [location]);
  const WrapperStyle = styled.div`
    position: absolute;
    color:black;
    text-align: center;
    background-color:white;
  `
  return (
    <div>
      <WrapperStyle>
        <h1>Welcome, {user.first_name}!</h1>
        <p>Your role: {user.role_id === 1 ? "Lot Operator" : "Advertiser"}</p>
        <p>Your company: {user.company_name}</p>
        <p>Your email: {user.email}</p>
      </WrapperStyle>
    </div>
  );
};

export default Greeting;



