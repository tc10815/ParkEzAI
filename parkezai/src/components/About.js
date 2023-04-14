import React from 'react';
import theme from '../theme';
import styled from 'styled-components';


const Wrapper = styled.div`
  background-color: ${theme.backgroundColor};
`;
const About = () => {
  return (
    <Wrapper>   
    <div>
      <h1>About</h1>
      <p>This is a placeholder component for About.</p>
    </div>
    </Wrapper>

  );
};

export default About;