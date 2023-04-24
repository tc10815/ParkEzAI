import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import jwt_decode from "jwt-decode";
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
  const [userId, setUserId] = useState('');
  const [roleId, setRoleId] =  useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [business, setBusiness] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchuser = async () => {
      const token = localStorage.getItem("token");
  
      if (token) {
        const decodedToken = jwt_decode(token);
        const response = await fetch("https://tomcookson.com/php2/fetch_user_data.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: decodedToken.data.user_id }),
        });
  
        if (response.ok) {
          const retuser = await response.json();
          setUser(retuser);
          setFirstName(retuser.user.first_name)
          setLastName(retuser.user.last_name);
          setEmail(retuser.user.email);
          setAddress(retuser.user.company_address);
          setBusiness(retuser.user.company_name);
          setCity(retuser.user.city);
          setState(retuser.user.state);
          setZip(retuser.user.zip);
          setUserId(retuser.user.id);
          setRoleId(retuser.user.role_id);
        } else {
          console.error("Error fetching user data");
        }
      
      }
    };
  
    fetchuser();
  }, [location]);
  
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const first_name = e.target.elements[0].value;
    const last_name = e.target.elements[1].value;
    const email = e.target.elements[2].value;

    var address = "";
    var business = "";
    var city = "";
    var state = "";
    var zip = "";
    if (user.user.role_id < 3) {
     address =  e.target.elements[3].value;
     business = e.target.elements[4].value;
     city = e.target.elements[5].value;
     state = e.target.elements[6].value;
     zip = e.target.elements[7].value;
    }

    var password = e.target.elements[3].value;
    if (user.user.role_id < 3) {
      password = e.target.elements[8].value;
    }

    const requestBody = {
      user_id: userId,
      first_name,
      last_name,
      email,
      password,
    };

    if (user.user.role_id < 3) {
      requestBody.address = address;
      requestBody.business = business;
      requestBody.city = city;
      requestBody.state = state;
      requestBody.zip = zip;
    }

    const response = await fetch("https://tomcookson.com/php2/update_account.php", {
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
        <UpdateForm onSubmit={handleUpdateSubmit}>
          <TitleText>Update Account</TitleText>
          <CenterMe>
          <MyLabel>
        First Name:&emsp;
        <input id="fname" type="text" defaultValue={firstName} />
      </MyLabel>
      <br />
      <MyLabel>
        Last Name:&emsp;
        <input type="text" defaultValue={lastName} />
      </MyLabel>
      <MyLabel>
        Email:&emsp;
        <input type="email" defaultValue={email} />
      </MyLabel>
      <br />
          {user.user.role_id < 3 && (
            <>
              <MyLabel>
                Address:&emsp;
                <input defaultValue={address} />
              </MyLabel>
              <br />
              <MyLabel>
                Business:&emsp;
                <input 
                  type="text"  defaultValue={business}
                />
              </MyLabel>
              <br />
              <MyLabel>
                City:&emsp;
                <input
                  type="text" defaultValue={city}
                />
              </MyLabel>
              <br />
              <MyLabel>
                State:&emsp;
                <input
                  type="text" defaultValue={state}
                />
              </MyLabel>
              <br />
              <MyLabel>
                Zip:&emsp;
                <input
                  type="text" defaultValue={zip}
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
