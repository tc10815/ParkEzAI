import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import heroImage from "../images/account-hero.jpg";
import Footer from "./Footer";

const API_URL = process.env.REACT_APP_API_URL;

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

const MyLabel = styled.label`
  width: 40px;
`;

const DeleteOwnAccountForm = styled.form``;

const DeleteOwnAccount = () => {
  const navigate = useNavigate();
  const handleDeleteSubmit = async (e) => {
    e.preventDefault();

    const password = e.target.elements[0].value;

    const response = await fetch(API_URL + "accounts/delete-account/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      localStorage.removeItem("token");
      window.dispatchEvent(new CustomEvent("logout"));
      navigate("/login");
    } else {
        const data = await response.json();
        console.error(data.error);
        alert('Error deleting account');
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
      <Footer />
    </>
  );
};

export default DeleteOwnAccount;
