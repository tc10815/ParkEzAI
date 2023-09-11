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

const StyledInput = styled.input`
  font-size: 2rem;
  width: fit-content;
  color: white;
  transform: scale(1.5);
  margin-right: 8px;   
  margin-left: 8px;   
  margin-top: 4px;   
  margin-bottom: 4px;
`;
const StyledLabel = styled.label`
  font-size: 2rem;
  width: fit-content;
  margin-left: 10px;   
  margin-right: 10px;   

  color: white;
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

const UserList = styled.ul`
  list-style-type: none;
  list-style-position: inside;
  margin-right: 0rem;
  margin-left:0rem;
  padding-right: 0rem;
  padding-left:0rem;
`;

const UserItem = styled.li`
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

const ChooseAdDashboard = () => {
  const navigate = useNavigate();
  const [usersWithLots, setUsersWithLots] = useState([]);

  useEffect(() => {
    const fetchUsersWithLots = async () => {
      const response = await fetch(API_URL + "accounts/get-advertisers/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsersWithLots(data);
      }
    };

    fetchUsersWithLots();
  }, []);
  
  const handleUserClick = (email) => {
      navigate(`/advertiser-dashboard?email=${email}`);
  }

  return (
    <HomeContainer>
    <HeroImage>
        <ListOrganize>
            <SubHeading>Select Advertiser to view Dashboard</SubHeading>
            <UserList>
                {usersWithLots.map(user => (
                    <UserItem key={user.email} onClick={() => handleUserClick(user.email)}>
                        {user.email}
                    </UserItem>
                ))}
            </UserList>
        </ListOrganize>
    </HeroImage>
    <Footer />
  </HomeContainer>
  );
};

export default ChooseAdDashboard;