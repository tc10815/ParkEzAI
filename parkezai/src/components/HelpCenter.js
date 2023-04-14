import React from 'react';
import theme from '../theme';
import styled from 'styled-components';

const DummyContainer = styled.div`
  flex-grow: 1;
  background-color: ${theme.backgroundColor};

`;

const HelpCenter = () => {
  return (
    <DummyContainer>
    <div>
      <h1>Help center</h1>
      <p>This is a placeholder component for help center.</p>
    </div>
    </DummyContainer>
  );
};

export default HelpCenter;