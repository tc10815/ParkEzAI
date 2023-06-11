import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
`

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
  width:300px;
  margin-left:auto;
  margin-right:auto;
`
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
`
const UpdateAccount = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isStaff, setIsStaff] = useState(true);
  const location = useLocation();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('http://127.0.0.1:8000/accounts/users/me/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => setUser(data))
    }
  }, [location]); 

  const handleUpdateSubmit = async (event) => {
    event.preventDefault(); 

    if (['Advertiser', 'Lot Operator'].includes(user.role_name)){
      let first_name = event.target.elements[0].value
      let last_name = event.target.elements[1].value
      let email = event.target.elements[2].value
      let company_address = event.target.elements[3].value;
      let company_name = event.target.elements[4].value;
      let city = event.target.elements[5].value;
      let state = event.target.elements[6].value;
      let zip = event.target.elements[7].value;
      let password = event.target.elements[8].value;
      const requestBody = {
        email, first_name, last_name, password, 
        company_name, company_address, city, state, zip,
      };
      console.log("ReqSubmitted", requestBody);
      const response = await fetch(`http://127.0.0.1:8000/accounts/users/edit/`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
          body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        navigate("/error-change");
      } else {
        navigate("/success-change");
        const data = await response.json();
        console.log("success:", data);
      }
    } else {
      let first_name = event.target.elements[0].value;
      let last_name = event.target.elements[1].value;
      let email = event.target.elements[2].value;
      let password = event.target.elements[3].value;
      const requestBody = {
        email, first_name, last_name, password, 
      };
      console.log("ReqSubmitted", requestBody);
      const response = await fetch(`http://127.0.0.1:8000/accounts/users/edit/`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
          body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        navigate("/error-change");
      } else {
        const data = await response.json();
        console.log("success:", data);
        navigate("/success-change");
      }
    }

  };
  return (
    <>
    <HomeContainer>
      <FormContainer>
      
        {user && (
        <UpdateForm onSubmit={handleUpdateSubmit}>
          <TitleText>Update Account</TitleText>
          <CenterMe>
          <MyLabel>
        First Name:&emsp;
         <input id="fname" type="text" defaultValue={user.first_name} />
      </MyLabel>
      <br />
      <MyLabel>
        Last Name:&emsp;
        <input type="text" defaultValue={user.last_name} />
      </MyLabel>
      <MyLabel>
        Email:&emsp;
        <input type="email" defaultValue={user.email} /> 
      </MyLabel>
      <br />
          {['Advertiser', 'Lot Operator'].includes(user.role_name) && (
            <>
              <MyLabel>
                Address:&emsp;
                <input defaultValue={user.company_address} />
              </MyLabel>
              <br />
              <MyLabel>
                Business:&emsp;
                <input 
                  type="text"  defaultValue={user.company_name}
                />
              </MyLabel>
              <br />
              <MyLabel>
                City:&emsp;
                <input
                  type="text" defaultValue={user.city}
                />
              </MyLabel>
              <br />
              <MyLabel>
                State:&emsp;
                <input
                  type="text" defaultValue={user.state}
                />
              </MyLabel>
              <br />
              <MyLabel>
                Zip:&emsp;
                <input
                  type="text" defaultValue={user.zip}
                />
              </MyLabel>
            </>
          )} 
          </CenterMe>
          <label>
            <br /> <br />
            Enter password to update:<br />
            <input type="password" />
          </label>
          <br />
          <button type="submit">Update</button>
          <br />
          <br />
          <Link to="/change-password">
            <button type="button">Change Password</button>
          </Link>
          <br />
          <Link to="/delete-account">
            <button type="button">Delete This Account</button>
          </Link>
        </UpdateForm>

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

export default UpdateAccount;
