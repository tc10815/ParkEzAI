import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import heroImage from "../images/account-hero.jpg";

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
  padding-left: 3em;
  padding-right: 3em;
  text-align: center;
  margin-bottom: 2em;
  padding-bottom: 2em;
`;

const TitleText = styled.p`
  font-size: 2rem;
  font-weight: 600;
  color: black;
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

const CenterMe = styled.div`
  width: 350px;
  margin-left: auto;
  margin-right: auto;
`;
const FooterItem = styled.p`
  margin: 0.2rem;
`;
const UpdateForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MyLabel = styled.label`
  width: 40px;
`;
const InitiateAccount = () => {
  const navigate = useNavigate();

  const handleInitiateSubmit = async (e) => {
    e.preventDefault();
    const first_name = e.target.elements[0].value;
    const last_name = e.target.elements[1].value;
    const old_password = e.target.elements[2].value;
    const new_password = e.target.elements[3].value;

    const requestBody = {
      first_name,
      last_name,
      old_password,
      new_password,
    };

    const response = await fetch("http://127.0.0.1:8000/accounts/initiate-user/", {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
        navigate("/account");
      } else {
        alert('Error has occurred initiating account');
      }
  };

  return (
    <>
      <HomeContainer>
        <FormContainer>
            <UpdateForm onSubmit={handleInitiateSubmit}>
              <TitleText>Initiate Account</TitleText>
              <CenterMe>
                <MyLabel>
                  First Name:&emsp;
                  <input type="text" />
                </MyLabel>
                <br />
                <MyLabel>
                  Last Name:&emsp;
                  <input type="text" />
                </MyLabel>
                <br />
                <br />

                <MyLabel>
                  Temporary Password:<br />

                  <input type="password" />
                </MyLabel>
                <br /><br />
                <MyLabel>
                  New Password:<br />
                  <input type="password" />
                </MyLabel>
              </CenterMe>
              <br />
              <button type="submit">Initiate</button>
              <br />
            </UpdateForm>
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

export default InitiateAccount;

  
