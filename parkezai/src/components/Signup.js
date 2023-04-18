import React from 'react';
import styled from 'styled-components';
import heroImage from '../images/signup-hero.jpg';


const HomeContainer = styled.div`
  background-color: black;
  align-items: center;
  justify-content: center;
  height: 100%;
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

const SignUpOrganizer = styled.div`
  margin-top: 12vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 0;
`;

const SubHeading = styled.h2`
  font-size: 2rem;
  width: fit-content;
  color: white;
  background-color: rgba(0, 0, 0, 1); // No transparency
  padding: 0.5rem 1rem;
`;

const HeroImage = styled.div`
  width: 100%;
  min-height: 100vh;
  background-image: url(${heroImage});
  background-position-y: top;
  background-size: cover;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  display: inline-block;
  
  font-size: 1.5rem;
  margin-bottom: 0rem;

`;
const Input = styled.input`
  font-size: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.1rem;
  width: 100%;
  max-width: 300px;
`;

const LoginButton = styled.button`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin-top: 0.8rem;
  cursor: pointer;
  margin-bottom: 1rem;
  background-color: rgba(0, 0, 0, 1);
  color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0072ff;
  }
`;
const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SignupButton = styled(LoginButton)`
  margin-bottom: 0;
`;

const Select = styled.select`
  font-size: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.1rem;
  width: 100%;
  max-width: 300px;
`;

const Signup = () => {
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    console.log('Sign Up form submitted');
  };
  return (
    <HomeContainer>
      <HeroImage>
        <SignUpOrganizer>
          <SubHeading>Join us for parking lot monitoring or to advertise</SubHeading>
          <SignUpForm onSubmit={handleSignUpSubmit}>
            <Select required>
              <option value="">Choose lot monitoring or advertising</option>
              <option value="parking_lot_owner">Parking Lot Monitoring</option>
              <option value="advertiser">Advertisering</option>
            </Select>
            <Input type="email" placeholder="Email" required />
            <Input type="text" placeholder="First Name" required />
            <Input type="text" placeholder="Last Name" required />
            <Input type="text" placeholder="Company Name" required />
            <Input type="text" placeholder="Company Address" required />
            <Select required>
              <option value="">Select State...</option>
              <option value="CT">CT</option>
              <option value="NJ">NJ</option>
              <option value="NY">NY</option>
            </Select>
            <Input type="text" placeholder="City" required />
            <Input type="text" placeholder="ZIP" required />
            <Input type="password" placeholder="Password" required />
            <SignupButton type="submit">Sign Up</SignupButton>
          </SignUpForm>
        </SignUpOrganizer>
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

export default Signup;
