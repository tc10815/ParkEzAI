import React from 'react';
import styled from 'styled-components';
import heroImage from '../images/home-hero_mod.jpg';
import Footer from "./Footer";


const HomeContainer = styled.div`
  background-color: white;

  align-items: center;
  justify-content: center;
  height: 100%;
`;

const OverviewSection = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin: 1rem auto;
  max-width: 80vw;
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



const BenefitSectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 2rem;
  background-color: white;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const BenefitSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  flex: 1;
  padding: 0 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
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
const WhiteCon = styled.div`
  background-color: white;
`;

const Home = () => {
  return (
    <HomeContainer>
      <WhiteCon>
      <HeroImage>
        <Heading>Welcome to ParkEZ</Heading>
        <SubHeading>Smart Parking Solutions for Businesses and Drivers</SubHeading>
      </HeroImage>
      <OverviewSection>
        ParkEZ is a state-of-the-art parking management platform designed to improve the way businesses and drivers 
        approach parking. Our comprehensive solution offers real-time parking availability, advanced security features, 
        and targeted advertising opportunities. With ParkEZ, drivers can effortlessly find and secure parking spots, while 
        businesses can maximize their revenue and improve customer satisfaction. Join us in creating a better parking experience for drivers and businesses alike.
      </OverviewSection>
      <BenefitSectionsContainer>
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
          <BenefitTitle>Benefits for People Parking</BenefitTitle>
          <BenefitList>
            <li>Find available parking spots easily and quickly</li>
            <li>Park in secure and video monitored locations</li>
            <li>Access real-time information on parking spot availability</li>
            <li>Receive personalized recommendations for nearby parking spots</li>
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
      </BenefitSectionsContainer>
      <Footer />
      </WhiteCon>
    </HomeContainer>
  );
};

export default Home;
