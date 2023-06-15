import React, { useState, useEffect } from "react";
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../images/accountantdbhero.jpg';
import Footer from './Footer';

const HomeContainer = styled.div`
  background-color: black;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const TableContainer = styled.div`
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

const AccountantDashboard = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('https://backend.plan6.com/accounts/users/me/', {
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
        <TableContainer>
        {user ? (
            <>
              <SubHeading>Welcome back, {user ? user.first_name : ''}</SubHeading>
            </>
          ) : (
            <SubHeading>Welcome back</SubHeading>
          )}
          <p><strong><br />Income Statistics</strong></p>
            <MyTable>
                <tr>
                    <th></th>
                    <th>Daily</th>
                    <th>Monthly</th>
                    <th>Yearly</th>
                </tr>
                <tr>
                    <td>Advertiser Income</td>
                    <td>$1,200</td>
                    <td>$36,000</td>
                    <td>$432,000</td>
                </tr>
                <tr>
                    <td>Parking Lot Owner Income</td>
                    <td>$1,500</td>
                    <td>$45,000</td>
                    <td>$540,000</td>
                </tr>
                <tr>
                    <td>Total Income</td>
                    <td>$2,700</td>
                    <td>$81,000</td>
                    <td>$972,000</td>
                </tr>
            </MyTable>
            <p>Employee Accounts</p>
            <MyTable>
            <tr>
                <th>Role</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
            </tr>
            <tr>
                <td>Customer Support</td>
                <td>John</td>
                <td>Doe</td>
                <td>john.doe@parkez.ai</td>
            </tr>
            <tr>
                <td>Lot Specialist</td>
                <td>Jane</td>
                <td>Smith</td>
                <td>jane.smith@parkez.ai</td>
            </tr>
            <tr>
                <td>Advertising Specialist</td>
                <td>Mark</td>
                <td>Johnson</td>
                <td>mark.johnson@parkez.ai</td>
            </tr>
            <tr>
                <td>Accountant</td>
                <td>Alice</td>
                <td>Jones</td>
                <td>alice.jones@parkez.ai</td>
            </tr>
        </MyTable>

        <p>Customer Accounts</p>
        <MyTable>
          <tr>
            <th>Role</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Business</th>
            <th>Address</th>
          </tr>
          <tr>
            <td>Lot Operator</td>
            <td>David</td>
            <td>Williams</td>
            <td>david.williams@example.com</td>
            <td>Central Parking</td>
            <td>123 Main St, Springfield</td>
          </tr>
          <tr>
            <td>Advertiser</td>
            <td>Susan</td>
            <td>Taylor</td>
            <td>susan.taylor@example.com</td>
            <td>City Bikes</td>
            <td>456 Oak St, Springfield</td>
          </tr>
          <tr>
            <td>Lot Operator</td>
            <td>Emma</td>
            <td>Johnson</td>
            <td>emma.johnson@example.com</td>
            <td>Green Park</td>
            <td>789 Pine St, Springfield</td>
          </tr>
          <tr>
            <td>Advertiser</td>
            <td>Michael</td>
            <td>Smith</td>
            <td>michael.smith@example.com</td>
            <td>Super Shoes</td>
            <td>321 Maple St, Springfield</td>
          </tr>
          <tr>
            <td>Lot Operator</td>
            <td>Olivia</td>
            <td>Brown</td>
            <td>olivia.brown@example.com</td>
            <td>Uptown Parking</td>
            <td>654 Cedar St, Springfield</td>
          </tr>
          <tr>
            <td>Advertiser</td>
            <td>Lucas</td>
            <td>Garcia</td>
            <td>lucas.garcia@example.com</td>
            <td>Urban Wear</td>
            <td>987 Birch St, Springfield</td>
          </tr> 
        </MyTable>
        </TableContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );

};
export default AccountantDashboard;
