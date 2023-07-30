import React, { useState, useRef, useEffect } from "react";
import {useLocation} from 'react-router-dom';
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

const LotCanvas = styled.canvas`
  max-width: 70vw;
  height: auto; 
`
const ImageDiv = styled.div` 
  margin-top:2;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
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

function formatDate(inputdate){
  // setHumanTime(data.timestamp);
  const timestampUTC = new Date(inputdate); // parse the ISO string into a Date object
  const timestampEST = new Date(timestampUTC.getTime() + (4 * 60 * 60 * 1000)); // subtract 5 hours from UTC to get EST
  let hour = timestampEST.getHours();
  let ampm = 'am'
  if (hour == 0){
    hour = 12;
  } else if (hour > 12){
    hour = hour - 12;
    ampm = 'pm'
  } 
  
  return (timestampEST.getMonth() + 1) + '/' + timestampEST.getDate() + '/' + timestampEST.getFullYear() + ' ' 
    + hour + ':' + String(timestampEST.getMinutes()).padStart(2, '0') + ampm;
};

const OperatorDashboard = () => {

  const [user, setUser] = useState(null);
  const location = useLocation();
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [humanLabels, setHumanLabels] = useState('');
  const [currentCarsParked, setCurrentCarsParked] = useState('');
  const [maxCarsParked, setMaxCarsParked] = useState('');
  const [avgCarsParked, setAvgCarsParked] = useState('');

  const [carsParkedToday, setCarsParkedToday] = useState('');

  const [spots, setSpots] = useState({});
  const [bestSpots, setBestSpots] = useState({});
  const [bestSpot, setBestSpot] = useState('');
  const [humanTime, setHumanTime] = useState('');
  const [previousImageName, setPreviousImageName] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
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
    if (token) {
      fetch(API_URL + 'lots/lot_dashboard/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
          setSpots(data.spots);
          setBestSpots(data.bestspots);

          let bestSpotString = 'None available';
          let BestSpotSoFarKey = 99999;
          for (let spot in Object.keys(data.bestspots)){
            if(!data.human_labels[data.bestspots[spot]] & Number(spot) < BestSpotSoFarKey){
              bestSpotString = data.bestspots[spot];
              BestSpotSoFarKey = Number(spot);
            }
          }
          setBestSpot(bestSpotString);
          let totalSpotsFull = 0;
          for (let key in data.human_labels) {
            if (data.human_labels[key]){
              totalSpotsFull = totalSpotsFull + 1;
            }
          }

          setCurrentCarsParked(totalSpotsFull);

          const date = new Date();
          const options = { weekday: 'long' };
          const dayOfWeek = date.toLocaleDateString('en-US', options);
          const hours = Array.from({ length: 24 }, (_, i) => i);
          const half_hours = ['00', '30']
          let totalCarsParkedEachHour = 0;
          let totalImagesCounted = 0;
          for (let hour in hours){
            for (let half_hour in half_hours){
              const key = dayOfWeek + ' ' + hour + ':' + half_hours[half_hour];
              if (data.week_history[key]['cars'] != -1){
                const keys = Object.keys(data.week_history[key]['cars']);
                for (let inner_key of keys){
                  if(data.week_history[key]['cars'][inner_key]){
                    totalCarsParkedEachHour = totalCarsParkedEachHour + 1;
                  }
                  totalImagesCounted = totalImagesCounted + 1;
                }
              } 

            }  
          }
          setCarsParkedToday(totalCarsParkedEachHour);
          setAvgCarsParked(totalCarsParkedEachHour / totalImagesCounted);
                

          setMaxCarsParked(Object.keys(data.human_labels).length)
          setHumanTime(formatDate(data.timestamp));
          setImageSrc(API_URL + 'lots' + data.image_url);  // prefix the image URL with the server base URL and 'lots'
          setPreviousImageName(data.previous_image_name_part);
          const image = new Image();
          image.src = API_URL + "lots" + data.image_url;
          image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            context.lineWidth = 9;
            context.font = "bold 50px Arial";
            const entries = Object.entries(data.spots);
            entries.reverse().forEach(([key, value]) => {
            const [x1, x2, y1, y2] = value;
              const width = x2 - x1;
              const height = y2 - y1;
          
              if (key === bestSpotString){
                  context.strokeStyle = 'green';
                  context.fillStyle = 'green';
              } else if (data.human_labels[key]){
                  context.strokeStyle = 'red';
                  context.fillStyle = 'red';
              } else {
                  context.strokeStyle = 'blue';
                  context.fillStyle = 'blue';
              }
          
              context.strokeRect(x1, y1, width, height);
              context.fillText(key, x1, y1 - 5); 
          });
          }
      })
      }

  }, [location]);
  
  return (
    <HomeContainer>
      <HeroImage>
      <WebCamContainer>
      {user ? (
            <>
              <SubHeading>Welcome back, {user ? user.first_name : ''}</SubHeading>
            </>
          ) : (
            <SubHeading>Welcome back</SubHeading>
          )}
          <p>Parking Lot Cameras Livefeed</p>
          <ImageDiv>
            <LotCanvas ref={canvasRef} />
          </ImageDiv>
          <p>Parking Analysis</p>
          <MyTable>
            <tr>
              <td>Current Occupancy</td>
              <td>{currentCarsParked}/{maxCarsParked}</td>
            </tr>
            <tr>
              <td>Total Cars Parked Today Each Hour</td>
              <td>{carsParkedToday/2}</td>
            </tr>
            <tr>
              <td>Average Occupancy Today</td>
              <td>{(avgCarsParked * 100).toFixed(1)}%</td>
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
      <Footer />
    </HomeContainer>
  );
};
export default OperatorDashboard;
