import React from 'react';
import styled from 'styled-components';
import parkImage from '../images/park-hero.jpg';


const HomeContainer = styled.div`

  align-items: center;
  justify-content: center;
  height: 100%;
`;

const OverviewSection = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem auto;
  max-width: 80vw;
`;

const Footer = styled.footer`
  background-color: black;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FooterItem = styled.p`
  margin: 0.2rem;
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
  background-image: url(${parkImage});
  background-position-y: top;
  background-position-x: center;
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

const FindParking = () => {
  return (
    <HomeContainer>
      
      <HeroImage>
        {/* Add the Heading and SubHeading components inside the HeroImage */}
        <SubHeading>Find a Parking Spot</SubHeading>
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
      <Footer>
        <FooterItem>ParkEz Inc.</FooterItem>
        <FooterItem>1234 Park Street, Suite 567</FooterItem>
        <FooterItem>Stamford, CT 06902</FooterItem>
        <FooterItem>Phone: (203) 123-4567</FooterItem>
        <FooterItem>Email: support@parkez.ai</FooterItem>
      </Footer>
    </HomeContainer>
  );
};

export default FindParking;