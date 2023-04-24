import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../images/account-hero.jpg';

const HomeContainer = styled.div`
  background-image: url(${heroImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FormContainer = styled.div`
  margin-top: 18vh;
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  color: black;
  padding-left:3em;
  padding-right:3em;
  text-align: center;
  margin-bottom: 2em;
  padding-bottom: 2em;
`;

const TitleText = styled.p`
  font-size: 2rem;
  font-weight: 600;
  color:black;
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

const MyLabel = styled.label`
  display: inline-block;
  width: 400px;
  text-align: right;
`;

const CreateStaffForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CreateStaffAccount = () => {
  const navigate = useNavigate();

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const role_id = e.target.elements[1].value;
    const temp_password = e.target.elements[2].value;

    const requestBody = {
      email,
      role_id,
      temp_password,
    };

    const response = await fetch("https://tomcookson.com/php2/create_staff_account.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        navigate("/success-create");
      } else {
        navigate("/error-create");
      }
    } else {
      navigate("/error-create");
    }
  };

  return (
    <>
      <HomeContainer>
        <FormContainer>
          <CreateStaffForm onSubmit={handleCreateSubmit}>
            <TitleText>Create Staff Account</TitleText>
            <MyLabel>
              Email:&emsp;
              <input type="email" />
            </MyLabel>
            <MyLabel>
              Role:&emsp;
              <select>
                <option value="3">Customer Support</option>
                <option value="4">Lot Specialist</option>
                <option value="5">Advertising Specialist</option>
                <option value="6">Accountant</option>
              </select>
            </MyLabel>
            <MyLabel>
              Temporary Password:&emsp;
              <input type="password" />
            </MyLabel>
            <br />
            <button type="submit">Create Staff Account</button>
          </CreateStaffForm>
        </FormContainer>
      </HomeContainer>
      <Footer>
          <FooterItem>ParkEz Inc.</FooterItem>
          <FooterItem>1234 Park Street, Suite 567</FooterItem>
          <FooterItem>Stamford, CT 06902</FooterItem>
          <FooterItem>Phone: (203) 123-4567</FooterItem>
          <FooterItem>Email: support@parkez.ai</FooterItem>
        </Footer>
      </>
    );
};

export default CreateStaffAccount;
