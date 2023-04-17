import React from 'react';
import styled from 'styled-components';
import heroImage from '../images/park-hero.jpg';
import theme from '../theme';


const HomeContainer = styled.div`
  background-color: white;
  align-items: center;
  justify-content: center;
  height: 100%;
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

const SubHeading = styled.h2`
  font-size: 2rem;
  width: fit-content;
  color: white;
  background-color: rgba(0, 0, 0, 1); 
  padding: 0.5rem 1rem;
  position: absolute;
  top: 5vh;
`;

const listOrganize = styled.div`
    position: absolute;
    top: 20vh;
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

// Add new styled components
const LocationList = styled.ul`
  list-style-type: none;
`;

const LocationItem = styled.li`
  font-size: 1.2rem;
  margin-bottom: 0rem;
  color: white;
  background-color: rgba(0, 0, 0, 1);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${theme.secondary};
  }
`;

const FindParkingButton = styled.button`
  font-size: 1.2rem;
  color: white;
  background-color: rgba(0, 0, 0, 1);
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background-color: ${theme.secondary};
  }
`;

// Add a list of fake locations
const locations = [
  { name: "Burger Gnome", address: "123 Munchkin Lane" },
  { name: "The Thrifty Owl", address: "456 Feather St" },
  { name: "Pasta Playground", address: "789 Noodle Ave" },
  { name: "Fruity Pebbles Market", address: "321 Rainbow Rd" },
  { name: "Meatball Emporium", address: "654 Spaghetti St" },
  { name: "Veggie Voyager", address: "987 Carrot Blvd" },
  { name: "Quirky Quinoa", address: "135 Grain Ct" },
  { name: "The Hummingbird Bakery", address: "246 Sugar Dr" },
  { name: "Cosmic Cantina", address: "369 Starry Way" },
  { name: "Chili Conundrum", address: "987 Pepper Pl" },
];

const FindParking = () => {
  const handleLocationClick = (location) => {
    console.log(`Selected location: ${location.name}`);
  };

  const handleFindParkingClick = () => {
    console.log("Find Parking button clicked");
  };

  return (
    <HomeContainer>
      <HeroImage>
        <SubHeading>Find a Parking Spot</SubHeading>
        <LocationList>
          {locations.map((location, index) => (
            <LocationItem key={index} onClick={() => handleLocationClick(location)}>
              {location.name} - {location.address}
            </LocationItem>
          ))}
        </LocationList>
        <FindParkingButton onClick={handleFindParkingClick}>
          Find Parking
        </FindParkingButton>
      </HeroImage>
      <Footer>
        <FooterItem>ParkEz Inc.</FooterItem>
        <FooterItem>1234 Park Street, Suite 567</FooterItem>
        <FooterItem>Stamford, CT 06902</FooterItem>
        <FooterItem>Phone: (203) 123-4567</FooterItem>
        <FooterItem>Email: support@parkez.ai</FooterItem>
      </Footer>
    </HomeContainer>
  );
};

export default FindParking;