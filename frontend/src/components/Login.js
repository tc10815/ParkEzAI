import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import styled from 'styled-components';
import heroImage from '../images/signin-hero.jpg';

const API_URL = process.env.REACT_APP_API_URL;

const HomeContainer = styled.div`
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: 3em;
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
  margin-top:15vh;
  background-color: rgba(0, 0, 0, 1); // No transparency
  padding: 0.5rem 1rem;
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
  background-position-y: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  display: inline-block;
  
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;
const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Input = styled.input`
  font-size: 1rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 300px;
`;
const LoginButton = styled.button`
  font-size: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  background-color: rgba(0, 0, 0, 1);
  color: white;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0072ff;
  }
`;
const ForgotPasswordLink = styled.a`
  font-size: 0.8rem;
  color: white;
  text-decoration: underline;
  cursor: pointer;
  text-shadow: 0px 0px 3px rgba(0, 0, 0, 1),0px 0px 3px rgba(0, 0, 0, 1),0px 0px 3px rgba(0, 0, 0, 1);
  &:hover {
    color: #e7f1ff;
  }
`;
const SignInOrganizer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 0;
`;
const UsersTable = styled.table`
  text-align: center;
  border-collapse: collapse;
  color:white;
  border-style: solid;
  border-color: white;
`;

const TableHeader = styled.th`
  padding: 0.2rem;
  border: 1px solid black;
  border-style: solid;
  border-color: white;
`;

const TableCell = styled.td`
  padding: 0.2rem;
  border: 1px solid black;
  border-style: solid;
  border-color: white;
`;

const resetAndPrepopulate = async () => {
  const response = await fetch(API_URL + 'accounts/populate_db/', { method: "POST" });

  if (response.ok) {
      const data = await response.json();
      alert(data.message);
  } else {
      alert("Error resetting and prepopulating users");
  }
};


const Login = () => {
  const navigate = useNavigate();

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const password = e.target.elements[1].value;

    const response = await fetch(API_URL + 'dj-rest-auth/login/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }); 
    if (response.ok) {
      const { key } = await response.json();
      localStorage.setItem("token", key);
      if (typeof key !== "undefined") {
        const response = await fetch(API_URL + 'accounts/users/me/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        const user = await response.json();
        window.dispatchEvent(new Event('login'));
        if (user.is_uninitialized == false){
          switch(user.role_name){
            case 'Lot Operator':
              navigate("/operator-dashboard"); 
              break;
            case 'Advertiser':
              navigate("/advertiser-dashboard"); 
              break;
            case 'Customer Support':
              navigate("/tickets"); 
              break;
            case 'Lot Specialist':
              navigate("/tickets"); 
              break;
            case 'Advertising Specialist':
              navigate("/tickets"); 
              break;
            case 'Accountant':
              navigate("/accountant-dashboard"); 
              break;
            default:
              alert('Default');
              navigate("/account"); 
              break;
          }
        } else {
            navigate("/initiate-account"); 
        }
  
      } else {
        navigate("/login-failed");
      }
    } else {
      navigate("/login-failed");
    }

  };


  return (
        <HomeContainer>
        <HeroImage>
          <SignInOrganizer>
            <Heading>Welcome back</Heading>
            <SubHeading>Please sign in</SubHeading>
            <SignInForm onSubmit={handleSignInSubmit}>
              <Input type="email" placeholder="Email" required />
              <Input type="password" placeholder="Password" required />
              <LoginButton type="submit">Login</LoginButton>
              <ForgotPasswordLink>Forgot my password</ForgotPasswordLink>
            </SignInForm>
          </SignInOrganizer>
        </HeroImage>
        <Footer>
          <FooterItem>ParkEz Inc.</FooterItem>
          <FooterItem>1234 Park Street, Suite 567</FooterItem>
          <FooterItem>Stamford, CT 06902</FooterItem>
          <FooterItem>Phone: (203) 123-4567</FooterItem>
          <FooterItem>Email: support@parkez.ai</FooterItem>
          <br />
          <UsersTable>
        <thead>
          <tr>
          <td colSpan="3"><strong>Demo Logins (not for production)</strong> Click Reset at bottom if accounts don't work.</td>
          </tr>
          <tr>
            <TableHeader>Role</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Password</TableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <TableCell>Lot Operator</TableCell>
            <TableCell>funky.chicken@example.com</TableCell>
            <TableCell>funky123</TableCell>
          </tr>
          <tr>
            <TableCell>Advertiser</TableCell>
            <TableCell>jolly.giraffe@example.com</TableCell>
            <TableCell>jolly123</TableCell>
          </tr>
          <tr>
            <TableCell>Customer Support</TableCell>
            <TableCell>curious.cat@parkez.com</TableCell>
            <TableCell>curious123</TableCell>
          </tr>
          <tr>
            <TableCell>Lot Specialist</TableCell>
            <TableCell>chatty.penguin@parkez.com</TableCell>
            <TableCell>chatty123</TableCell>
          </tr>
          <tr>
            <TableCell>Advertising Specialist</TableCell>
            <TableCell>happy.hippo@parkez.com</TableCell>
            <TableCell>happy123</TableCell>
          </tr>
          <tr>
            <TableCell>Accountant	</TableCell>
            <TableCell>lively.lemur@parkez.com</TableCell>
            <TableCell>lively123</TableCell>
          </tr>
        </tbody>
      </UsersTable>
      <br />
      <button id="reset-and-prepopulate" type="button" onClick={resetAndPrepopulate}>Reset Database with Demonstration Data</button>
      <br />
      <Link to="/users">
          <button type="button">View All Users</button>
        </Link>
        </Footer>
      </HomeContainer>
  );
};

export default Login;
