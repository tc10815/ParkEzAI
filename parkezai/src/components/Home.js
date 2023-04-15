import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const SubHeading = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 300px;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const BenefitSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const BenefitTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const BenefitList = styled.ul`
  font-size: 1rem;
  text-align: left;
  max-width: 800px;
  list-style-type: disc;
  padding-left: 1.5rem;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Heading>Welcome to ParkEZ</Heading>
      <SubHeading>Smart Parking Solutions for Businesses and Drivers</SubHeading>
      <PlaceholderImage>
        Placeholder for a Hero Image
      </PlaceholderImage>
      <BenefitSection>
        <BenefitTitle>Benefits for Businesses with Parking Lots</BenefitTitle>
        <BenefitList>
          <li>Maximize revenue by efficiently managing parking spaces</li>
          <li>Reduce illegal parking and provide parking availability to customers</li>
          <li>Real-time occupancy tracking and notifications for overparking</li>
          <li>Access to archived camera footage for security purposes</li>
        </BenefitList>
      </BenefitSection>
      <BenefitSection>
        <BenefitTitle>Benefits for Advertisers</BenefitTitle>
        <BenefitList>
          <li>Advertise on our platform, targeting potential customers</li>
          <li>Reach users looking for parking spaces near your establishment</li>
          <li>Monitor ad success through impression statistics and click counts</li>
          <li>Target specific parking lots for increased visibility</li>
        </BenefitList>
      </BenefitSection>
    </HomeContainer>
  );
};

export default Home;
