import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation} from 'react-router-dom';
import jwt_decode from "jwt-decode";
import styled from 'styled-components';
import heroImage from '../images/operatordbhero.jpg';
import LotStream from './LotStream';


const HomeContainer = styled.div`
  background-color: black;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const WebCamContainer = styled.div`
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
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  font-size: 2rem;
  width: fit-content;
  color: black;
`;

const MyTable = styled.table`
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  
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


const OperatorDashboard = () => {

  const [user, setUser] = useState(null);
  const location = useLocation();


  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    setUser(decodedToken);

  }, [location]);
  return (
    <HomeContainer>
      <HeroImage>
      <WebCamContainer>
      {user ? (
            <>
              <SubHeading>Welcome back, {user.data.first_name}</SubHeading>            
            </>
          ) : (
            <SubHeading>Welcome back</SubHeading>
          )}
          <p>Parking Lot Cameras Livefeed</p>
          <p><LotStream /></p>
          <p>Parking Analysis</p>
          <MyTable>
            <tr>
              <td>Current Occupancy</td>
              <td>11/15</td>
            </tr>
            <tr>
              <td>Cars Parked Today</td>
              <td>142</td>
            </tr>
            <tr>
              <td>Average Occupancy Today</td>
              <td>8.3</td>
            </tr>
            <tr>
              <td>Total Cars Parked Today</td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;123, 143, 142, 120, 101, 141, 150, 140 (yesterday)</td>
            </tr>
            <tr>
              <td>Past 7-Day Average Occupancy</td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;10.5, 9.3, 11.3, 7.3, 10.2, 9.5, 10.3, 10.2 (yesterday)</td>
            </tr>
            <tr>
              <td>Past 7-Day Total Cars Parked</td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;123, 143, 142, 120, 101, 141, 150, 140 (yesterday)</td>
            </tr>
            <tr>
              <td>Current Overparking Spaces</td>
              <td>Spot 4 (28 minutes overparked)</td>
            </tr>
          </MyTable>
        </WebCamContainer>
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
export default OperatorDashboard;
