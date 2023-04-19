// Error.js
import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #000000;
  color: white;
  text-align: center;
`;

const Message = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Error = () => {
  const location = useLocation();
  const errorMessageJson = location.state.errorMessage;
  console.log(errorMessageJson);
  const jsonObject = JSON.parse(errorMessageJson);
  const errorKey = Object.keys(jsonObject)[0];
  const errorMessage = jsonObject[errorKey];
  return (
    <Container>
      <Message>Unable to create account</Message>
      <p><strong>{errorKey}</strong><br />{errorMessage}</p>
    </Container>
  );
};

export default Error;