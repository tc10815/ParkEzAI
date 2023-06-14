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
`;

const Message = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Success = () => {
  return (
    <Container>
      <Message>Account created successfully!</Message>
      <p>Your account has been created. You can now log in and start using the service.</p>
    </Container>
  );
};

export default Success;