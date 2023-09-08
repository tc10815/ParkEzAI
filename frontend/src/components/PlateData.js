import React, { useState, useRef, useEffect } from "react";
import { useLocation } from 'react-router-dom';
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

const SubHeading = styled.h2`
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  font-size: 2rem;
  width: fit-content;
  color: black;
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

const PlateData = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [monthlyReadings, setMonthlyReadings] = useState({});
  const [monthShown, setMonthShown] = useState(new Date().getMonth() + 1);
  const [yearShown, setYearShown] = useState(new Date().getFullYear());
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchReadings = async (year, month) => {
    const token = localStorage.getItem("token");
    let readings = {};
    const response = await fetch(API_URL + 'lots/lot_dashboard/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });
    const data = await response.json();
    for (let lpr of data.lpr_metadata) {
      const res = await fetch(API_URL + `lots/monthlyreadings/${lpr.name}/${year}/${month}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        }
      });
      readings[lpr.name] = await res.json();
    }
    setMonthlyReadings(readings);
  }

  useEffect(() => {
    fetchReadings(yearShown, monthShown);
  }, [yearShown, monthShown, location]);

  return (
    <HomeContainer>
      <HeroImage>
      <WebCamContainer>
      <SubHeading>Complete License Plate Log for {monthNames[monthShown - 1]}, {yearShown}</SubHeading>
          <p>From all of your License Plate Readers</p>
            <select value={yearShown} onChange={e => setYearShown(e.target.value)}>
              {[...Array(10)].map((_, idx) => (
                <option key={idx} value={new Date().getFullYear() - idx}>
                  {new Date().getFullYear() - idx}
                </option>
              ))}
            </select>
            <select value={monthShown} onChange={e => setMonthShown(e.target.value)}>
              {monthNames.map((month, idx) => (
                <option key={idx} value={idx + 1}>
                  {month}
                </option>
              ))}
            </select>        {
            Object.keys(monthlyReadings).map(lprName => (
              <div key={lprName}>
                <h3>Plate Reader: {lprName}</h3>
                <MyTable>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Plate Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyReadings[lprName].map(reading => (
                      <tr key={reading.timestamp}>
                        <td>{new Date(reading.timestamp).toLocaleString()}</td>
                        <td>{reading.plate_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </MyTable>
              </div>
            ))
          }
          <p>*Red indicates overparking alert.</p>
          <p>**Lot shown is real data: real lot, real time. License Plate data is fictional and used to demonstrate interface, although interface can accept real license plate data.</p>
        </WebCamContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};

export default PlateData;
