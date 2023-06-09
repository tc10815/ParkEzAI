import React from "react";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../images/account-hero.jpg';
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

const MyLabel = styled.label`
  width: 400px;
  padding: 8px;
`;
const CreateStaffForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const CreateStaffAccount = () => {
  const navigate = useNavigate();

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const role_name = e.target.elements[1].value;
    const password = e.target.elements[2].value;
    const requestBody = {
      email,
      role_name,
      password,
    };
    const response = await fetch(API_URL + "accounts/create_employee/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (response.ok) {
      navigate("/success-create");
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
                <option value="Customer Support">Customer Support</option>
                <option value="Lot Specialist">Lot Specialist</option>
                <option value="Advertising Specialist">Advertising Specialist</option>
                <option value="Accountant">Accountant</option>
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
      <Footer />
      </>
    );
};

export default CreateStaffAccount;
