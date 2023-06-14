// Error.js
import React from 'react';
import styled from 'styled-components';


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

const ErrorChange = () => {
  return (
    <Container>
      <Message>Unable to create or modify account</Message>
    </Container>
  );
};

export default ErrorChange;