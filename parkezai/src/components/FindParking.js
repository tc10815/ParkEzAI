import React from 'react';
import theme from '../theme';
import styled from 'styled-components';

const DummyContainer = styled.div`
  flex-grow: 1;
  background-color: ${theme.backgroundColor};

`;

const FindParking = () => {
  return (
    <DummyContainer>
    <div>
      <h1>Find Parking</h1>
      <p>This is a placeholder component for finding parking lots.</p>
    </div>
    </DummyContainer>
  );
};

export default FindParking;