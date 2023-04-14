import React from 'react';
import styled from 'styled-components';
import theme from '../theme';


const DummyContainer = styled.div`
  flex-grow: 1;
  background-color: ${theme.backgroundColor};

`;
const Signup = () => {
  return (
    <DummyContainer>
    <div>
      <h1>Signup</h1>
      <p>This is a placeholder component for Signup.</p>
    </div>
    </DummyContainer>
  );
};

export default Signup;
