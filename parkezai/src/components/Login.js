import React from 'react';
import styled from 'styled-components';
import theme from '../theme';


const DummyContainer = styled.div`
  flex-grow: 1;
  background-color: ${theme.backgroundColor};

`;


const Login = () => {
  return (
    <DummyContainer>
    <div>
      <h1>Login</h1>
      <p>This is a placeholder component for Login.</p>
    </div>
    </DummyContainer>
  );
};

export default Login;