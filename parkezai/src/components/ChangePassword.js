import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import heroImage from "../images/account-hero.jpg";
import Footer from "./Footer";

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

const ChangePasswordForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MyLabel = styled.label`
  display: inline-block;
  width: 400px;
  text-align: right;
`;

const ChangePassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.elements[0].value;
    const newPassword = e.target.elements[1].value;
    const confirmPassword = e.target.elements[2].value;

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      e.target.elements[1].value = "";
      e.target.elements[2].value = "";
      return;
    }

    const requestBody = {
      old_password: oldPassword,
      new_password: newPassword,
    };

    const response = await fetch("http://127.0.0.1:8000/accounts/change-password/", { 
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        navigate("/success-change");
      } else {
        navigate("/error-change");
      }
    } else {
      navigate("/error-change");
    }
  };

  return (
    <>
      <HomeContainer>
        <FormContainer>
            <ChangePasswordForm onSubmit={handleChangePasswordSubmit}>
              <TitleText>Change Password</TitleText>
              <MyLabel>
                Old Password:&emsp;
                <input type="password" />
              </MyLabel>
              <br />
              <MyLabel>
                New Password:&emsp;
                <input type="password" />
              </MyLabel>
              <MyLabel>
                Confirm New Password:&emsp;
                <input type="password" />
              </MyLabel>
              <br />
              <button type="submit">Change Password</button>
            </ChangePasswordForm>
        </FormContainer>
      </HomeContainer>
      <Footer />
    </>
  );
};

export default ChangePassword;
