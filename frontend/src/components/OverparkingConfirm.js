import React, { useState, useRef, useEffect } from "react";
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../images/operatordbhero.jpg';
import Footer from "./Footer";

const API_URL = process.env.REACT_APP_API_URL;

const HomeContainer = styled.div`
  background-color: black;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const HeroImage = styled.div`
  margin-top: 2.2em;
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

// ** for later **
// function formatDate(inputdate){
//   const timestampUTC = new Date(inputdate); // parse the ISO string into a Date object
//   const timestampEST = new Date(timestampUTC.getTime() + (4 * 60 * 60 * 1000)); // subtract 5 hours from UTC to get EST
//   let hour = timestampEST.getHours();
//   let ampm = 'am'
//   if (hour === 0){
//     hour = 12;
//   } else if (hour > 12){
//     hour = hour - 12;
//     ampm = 'pm'
//   } 
  
//   return (timestampEST.getMonth() + 1) + '/' + timestampEST.getDate() + '/' + timestampEST.getFullYear() + ' ' 
//     + hour + ':' + String(timestampEST.getMinutes()).padStart(2, '0') + ampm;
// };


const OverparkingConfirm = () => {
  const { lot, cam, space,starttime, endtime} = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const endpoint = new URL(`lots/overparking_confirm/${lot}/${cam}/${space}/${starttime}/${endtime}/`, API_URL);
    const token = localStorage.getItem("token");
    
      fetch(API_URL + 'accounts/users/me/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => setUser(data));
      if (token) {
        fetch(endpoint.toString(), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
        });
  }}, [lot, cam, space, starttime, endtime]);


  
  return (
    <HomeContainer>
      <HeroImage>
        <h1>Lot {lot}</h1>
        <h1>cam {cam}</h1>
        <h1>space {space}</h1>
        <h1>starttime {starttime}</h1>
        <h1>endtime {endtime}</h1>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};
export default OverparkingConfirm;
