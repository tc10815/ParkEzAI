import React from 'react';
import theme from '../theme';
import styled from 'styled-components';

const DummyContainer = styled.div`
  flex-grow: 1;
  background-color: ${theme.backgroundColor};
`;

const Home = () => {
  return (
    <DummyContainer>
    <div>
      <h1>Home</h1>
      <p>This is a placeholder component for Home.</p>
    </div>
    </DummyContainer>
  );
};

export default Home;