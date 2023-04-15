import React from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from "styled-components";
import heroImage from '../images/home-hero_mod.jpg';


const HomeContainer = styled.div`

  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0; // Remove bottom margin
  color: white;
  width: fit-content;
  background-color: rgba(0, 0, 0, 1); // No transparency
  padding: 0.5rem 1rem;
  position:absolute;
  top:45vh;
`;

const SubHeading = styled.h2`
  font-size: 2rem;
  width: fit-content;
  color: white;
  background-color: rgba(0, 0, 0, 1); // No transparency
  padding: 0.5rem 1rem;
  position:absolute;
  top:55vh;
`;

const HeroImage = styled.div`
  width: 100%;
  min-height: 70vh;
  background-image: url(${heroImage});
  background-position-y: top;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  display: inline-block;
  
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
      
      <HeroImage>
        {/* Add the Heading and SubHeading components inside the HeroImage */}
        <Heading>Welcome to ParkEZ</Heading>
        <SubHeading>Smart Parking Solutions for Businesses and Drivers</SubHeading>
      </HeroImage>
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
