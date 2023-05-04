import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import heroImage from "../images/account-hero.jpg";
import jwt_decode from "jwt-decode";


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

const FooterItem = styled.p`
  margin: 0.2rem;
`;

const MyLabel = styled.label`
  width: 40px;
`;

const DeleteOwnAccountForm = styled.form`

`;

const DeleteOwnAccount = () => {
  const navigate = useNavigate();
  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);

    const password = e.target.elements[0].value;
    const user_id = decodedToken.data.user_id;


    const response = await fetch("http://gruevy.com/ezphp/delete_own_account.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, user_id }),
    });



    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.success) {
            localStorage.removeItem("token");
            window.dispatchEvent(new CustomEvent("logout"));
            navigate("/login");
        } else {
            alert('Error delete account');
      }
    } else {
        alert('Error delete account');
    }
  };

  return (
    <>
      <HomeContainer>
        <FormContainer>
          <DeleteOwnAccountForm onSubmit={handleDeleteSubmit}>
            <TitleText>Delete Your Account</TitleText>
            <MyLabel>
              Password:&emsp;
              <input type="password" />
            </MyLabel>
            <br />
            <br />
            <button type="submit">Delete Account</button>
          </DeleteOwnAccountForm>
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

export default DeleteOwnAccount;
