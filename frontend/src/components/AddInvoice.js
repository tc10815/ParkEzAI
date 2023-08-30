import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../images/park-hero.jpg';
import theme from '../theme';
import Footer from "./Footer";


const API_URL = process.env.REACT_APP_API_URL;

const HomeContainer = styled.div`
  background-color: white;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const SubHeading = styled.h2`
  font-size: 2rem;
  width: fit-content;
  color: white;
  background-color: rgba(0, 0, 0, 1); 
  padding: 0.5rem 1rem;
`;

const ListOrganize = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-left: 0;
`;

const HeroImage = styled.div`
  width: 100%;
  min-height: 100vh;
  background-image: url(${heroImage});
  background-position-y: top;
  background-position-x: center;  background-size: cover;
  display: flex; // Set display to flex
  justify-content: center; // Center horizontally
  align-items: center; // Center vertically
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const LocationList = styled.ul`
  list-style-type: none;
  list-style-position: inside;
  margin-right: 0rem;
  margin-left:0rem;
  padding-right: 0rem;
  padding-left:0rem;
`;

const LocationItem = styled.li`
  font-size: 120%;
  margin-right: 0rem;
  margin-left:0rem;
  padding-right: 0rem;
  padding-left:0rem;
  color: white;
  text-align: center;
  background-color: rgba(0, 0, 0, 1);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.secondary};
  }
`;

const SearchBar = styled.input`
  margin: 1rem 0;
  padding: 0.5rem;
  font-size: 1rem;
  color: white;
  background-color: black;
  border: 1px solid lightgray;
  border-radius: 5px;
  width: 100%;
  max-width: 300px;
  &:focus {
    outline: none;
    border-color: ${theme.secondary};
  }
  ::placeholder {
    color: lightgray;
  }
`;


const AddInvoice = () => {
  const navigate = useNavigate();

  const handleMenuClick = (selected) => {
    if (selected === 'lot'){
      navigate("/add-lot-invoice");
    }
    if (selected === 'ad'){
      navigate("/add-ad-invoice");
    }
  };

  return (
    <HomeContainer>
      <HeroImage>
        <ListOrganize>
          <SubHeading>Choose Create Invoice Type</SubHeading>
          <LocationList>
            <LocationItem onClick={() => handleMenuClick('lot')}>
              Create Lot Operator Invoice
            </LocationItem>
            <LocationItem onClick={() => handleMenuClick('ad')}>
              Create Advertiser Invoice
            </LocationItem>
          </LocationList>
        </ListOrganize>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};

export default AddInvoice;