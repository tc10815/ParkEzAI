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
  font-size: 1.2rem;
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


const FindParking = () => {
  const [lots, setLots] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const endpoint = new URL('lots/menu', API_URL);
    fetch(endpoint.toString())
      .then(response => response.json())
      .then(data => {
          data.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
          setLots(data);
          console.log(data)
        })
      .catch((error) => {
          console.error('Error fetching data:', error);
      });
  },[]);

  const handleMenuClick = (lots) => {
    navigate(`/lot/${lots.id}`);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <HomeContainer>
      <HeroImage>
        <ListOrganize>
          <SubHeading>Choose Lot to Find Parking</SubHeading>
          <SearchBar
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search"
          />
          <LocationList>
            {lots.filter(lots => 
                lots.name.toLowerCase().includes(search.toLowerCase()) ||
                lots.city.toLowerCase().includes(search.toLowerCase()) ||
                lots.state.toLowerCase().includes(search.toLowerCase()) ||
                lots.zip.toLowerCase().includes(search.toLowerCase())
            ).map((lots, index) => (
              <LocationItem key={index} onClick={() => handleMenuClick(lots)}>
                {lots.name}, {lots.city} {lots.state}  {lots.zip}            
              </LocationItem>
            ))}
          </LocationList>
          <p style={{color:'white'}}><strong>Note:</strong> Monroe St, Coldwater is the only working demo parking lot at this time</p>
          <p style={{color:'white'}}>Other lots are to demonstrate lot search</p>
        </ListOrganize>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};

export default FindParking;