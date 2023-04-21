import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from 'styled-components';
import jwt_decode from "jwt-decode";

const HomeContainer = styled.div`
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const roles_dict = {
  1: 'a parking lot operator',
  2: 'an advertiser'
}

const SubHeading = styled.h2`
  margin-top:20vh;
  font-size: 2rem;
  width: fit-content;
  color: white;
  background-color: rgba(0, 0, 0, 1); // No transparency
  padding: 0.5rem 1rem;
`;



const SubSubHeading = styled.p`
  font-size: 1.5rem;
  width: fit-content;
  color: white;
  padding: 0.5rem 1rem;
`;

const WrapperStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 0;
`;

const Greeting = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    setUser(decodedToken);
    
  }, [location]);
  console.log(user);

  return (
      <HomeContainer>
        <WrapperStyle>
          {user ? (
            <>
              <SubHeading>Welcome back, {user.data.first_name}</SubHeading>
              <SubSubHeading>You are logged in as {roles_dict[user.data.role_id]}</SubSubHeading>
            </>

          ) : (
            <SubHeading>Data loading...</SubHeading>
          )}
        </WrapperStyle>
      </HomeContainer>
    );
};

export default Greeting;



