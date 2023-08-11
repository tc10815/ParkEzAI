import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../images/advertiserdbhero.jpg';
import Footer from "./Footer";

const API_URL = process.env.REACT_APP_API_URL;


const HomeContainer = styled.div`
  background-color: black;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const AdContainer = styled.div`
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  color: black;
  padding-left:3em;
  padding-right:3em;
  text-align: center;
  margin-bottom: 2em;
  padding-bottom: 2em;
`;

const SubHeading = styled.h2`
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  font-size: 2rem;
  width: fit-content;
  color: black;
`;

const HeroImage = styled.div`
  padding-top: 3.5em;
  width: 100%;
  background-image: url(${heroImage});
  background-position-y: top;
  background-size: cover;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  display: inline-block;
  font-size: 1.5rem;
  margin-bottom: 0rem;
`;

const CreateAd = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(API_URL + 'accounts/users/me/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => setUser(data));
    }
  }, [location]);

  return (
    <HomeContainer>
      <HeroImage>
        <AdContainer>
            <SubHeading>Create Ad</SubHeading>
        </AdContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );

};
export default CreateAd;
