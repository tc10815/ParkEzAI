import React from 'react';
import theme from '../theme';
import styled from 'styled-components';

const DummyContainer = styled.div`
  flex-grow: 1;
  background-color: ${theme.backgroundColor};
`;

const About = () => {
  return (
    <DummyContainer>   
    <div>
      <h1>About</h1>
      <p>This is a placeholder component for About.</p>
    </div>
    </DummyContainer>

  );
};

export default About;