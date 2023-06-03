import React from 'react';
import styled from 'styled-components';
import heroImage from '../images/signup-hero.jpg';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';



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
  margin-top: 10vh;
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
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const role = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const firstName = e.target.elements[2].value;
    const lastName = e.target.elements[3].value;
    const companyName = e.target.elements[4].value;
    const companyAddress = e.target.elements[5].value;
    const state = e.target.elements[6].value;
    const city = e.target.elements[7].value;
    const zip = e.target.elements[8].value;
    const password = e.target.elements[9].value;
  
    const role_id = role === "parking_lot_owner" ? "Lot Operator" : "Advertiser";
  
    const response = await fetch("http://localhost:8000/accounts/create_user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role_id,  // change key to `role` instead of `role_id`
        email,
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        company_address: companyAddress,
        state,
        city,
        zip,
        password,
        is_uninitialized: false, // if you want to set `is_uninitialized` to false, otherwise remove this line
      }),
    });
  
    if (response.ok) {
      navigate('/success');
    } else {
      const errorText = await response.text();
      setErrorMessage(errorText);
      navigate('/error', { state: { errorMessage: errorText } });
    }
  };
  
  const resetAndPrepopulate = async () => {
    const response = await fetch("http://gruevy.com/ezphp/reset_and_prepopulate.php", { method: "POST" });

    if (response.ok) {
        const data = await response.json();
        alert(data.message);
    } else {
        alert("Error resetting and prepopulating users");
    }
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
              <option value="advertiser">Advertising</option>
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
        <h2>Demonstrations Features (not for production)</h2>
        <button id="reset-and-prepopulate" type="button" onClick={resetAndPrepopulate}>Reset Database with Demonstration Data</button>
        <Link to="/users">
          <button type="button">View All Users</button>
        </Link>
      </Footer>
    </HomeContainer>
  );
};
export default Signup;
