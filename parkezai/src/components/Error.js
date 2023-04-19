// Error.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #ffcdd2;
`;

const Message = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Error = (props) => {
  const { errorMessage } = props.location.state;

  return (
    <Container>
      <Message>Error creating account</Message>
      <p>{errorMessage}</p>
    </Container>
  );
};

export default Error;