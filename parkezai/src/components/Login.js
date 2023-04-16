import React from 'react';
import styled from 'styled-components';
import heroImage from '../images/signin-hero.jpg';


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

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0; // Remove bottom margin
  color: white;
  width: fit-content;
  background-color: rgba(0, 0, 0, 1); // No transparency
  padding: 0.5rem 1rem;
  position:absolute;
  top:10vh;
`;

const SubHeading = styled.h2`
  font-size: 2rem;
  width: fit-content;
  color: white;
  background-color: rgba(0, 0, 0, 1); // No transparency
  padding: 0.5rem 1rem;
  position:absolute;
  top:20vh;
`;

const HeroImage = styled.div`
  width: 100%;
  min-height: 100vh;
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

const Login = () => {
  return (
    <HomeContainer>
      <HeroImage>
        {/* Add the Heading and SubHeading components inside the HeroImage */}
        <Heading>Welcome back</Heading>
        <SubHeading>Please sign in</SubHeading>
      </HeroImage>
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

export default Login;