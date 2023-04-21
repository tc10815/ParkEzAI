import React from "react";
import styled from 'styled-components';

const HomeContainer = styled.div`
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0; // Remove bottom margin
  color: white;
  width: fit-content;
  margin-top:15vh;
  background-color: rgba(0, 0, 0, 1); // No transparency
  padding: 0.5rem 1rem;
`;

const SubHeading = styled.h2`
  font-size: 2rem;
  width: fit-content;
  color: white;
  background-color: rgba(0, 0, 0, 1); // No transparency
  padding: 0.5rem 1rem;
`;

const SignInOrganizer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 0;
`;

const LoginFailed = () => {
  return (
    <HomeContainer>
      <SignInOrganizer>
        <Heading>Login Failed</Heading>
        <SubHeading>Please check your email and password and try again.</SubHeading>
      </SignInOrganizer>
  </HomeContainer>
  );
};

export default LoginFailed;