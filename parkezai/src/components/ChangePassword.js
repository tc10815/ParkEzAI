import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
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

const FooterItem = styled.p`
  margin: 0.2rem;
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
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwt_decode(token);
        setUser(decodedToken.data);
      }
    };

    fetchUser();
  }, [location]);

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.elements[0].value;
    const newPassword = e.target.elements[1].value;
    const confirmPassword = e.target.elements[2].value;

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    const requestBody = {
      user_id: user.user_id,
      old_password: oldPassword,
      new_password: newPassword,
    };

    const response = await fetch("http://gruevy.com/ezphp/change_password.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          {user && (
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
          )}
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

export default ChangePassword;
