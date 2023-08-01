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
  const [carsParked7Days, setCarsParked7Days] = useState('');
  const [carsParked7DaysAvg, setCarsParked7DaysAvg] = useState('');
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
          const last7DaysList = [];

          for (let i = 1; i <= 7; i++) {
            const newDate = new Date(date);
            newDate.setDate(date.getDate() - i);
            const formattedDate = (newDate.getMonth() + 1) + '/' + newDate.getDate();
            last7DaysList.push(formattedDate);
          }

          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          const options = { weekday: 'long' };
          const dayOfWeek = date.toLocaleDateString('en-US', options);
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
          'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          let sliced =  daysOfWeek.slice(daysOfWeek.indexOf(dayOfWeek) + 1, daysOfWeek.indexOf(dayOfWeek) + 8);
          let last7DayNameList = sliced.reverse();
          
          const hours = Array.from({ length: 24 }, (_, i) => i);
          const half_hours = ['00', '30']
          let totalCarsParkedEachHour = 0;
          let totalImagesCounted = 0;
          let total_days_of_week = {};
          let total_images_counted_week = {};
          for (let allWeekdays of days){
            total_days_of_week[allWeekdays] = 0;
            total_images_counted_week[allWeekdays] = 0;
          }

          for (let allWeekdays of days){
            for (let hour in hours){
              for (let half_hour in half_hours){
                const key = allWeekdays + ' ' + hour + ':' + half_hours[half_hour];
                if (data.week_history[key]['cars'] != -1){
                  const keys = Object.keys(data.week_history[key]['cars']);
                  for (let inner_key of keys){
                    if(data.week_history[key]['cars'][inner_key]){
                      total_days_of_week[allWeekdays] = total_days_of_week[allWeekdays] + 1;
                    }
                    total_images_counted_week[allWeekdays] = total_images_counted_week[allWeekdays] + 1; 
                  }
                }
              }  
            }
          }

          for (let theDay in total_images_counted_week){
            console.log(total_images_counted_week[theDay]);
          }

          for (let key of Object.keys(total_days_of_week)){
            total_days_of_week[key] = total_days_of_week[key] / 2;
          }
          // last7DayNameList, last7DaysList
          let carsParked7DaysString = '';
          let carsParked7DaysAvgString = '';
          let count = 0;
          for (let key of last7DayNameList){
            if (count != 0 ){
                carsParked7DaysString = carsParked7DaysString + total_days_of_week[key] + ' ('  + last7DaysList[count] + ')'+ ', ';
                carsParked7DaysAvgString = carsParked7DaysAvgString + ' ' + ((total_days_of_week[key]/total_images_counted_week[key])*100).toFixed(1) + '% ('  + last7DaysList[count] + ')'+ ', ';
              }
              count = count + 1;
          }
          setCarsParked7Days(carsParked7DaysString.slice(0, -2));
          setCarsParked7DaysAvg(carsParked7DaysAvgString.slice(0, -2));
          // setCarsParked7Days(getWeekdays(total_days_of_week, dayOfWeek));
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
              <td>Total Cars Parked Today Tallied Each Hour</td>
              <td>{carsParkedToday/2}</td>
            </tr>
            <tr>
              <td>Average Occupancy Today</td>
              <td>{(avgCarsParked * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td>7-Day Average Occupancy</td>
              <td>{carsParked7DaysAvg}</td>
            </tr>
            <tr>
              <td>7-Day Total Cars Parked</td>
              <td>{carsParked7Days}</td>
            </tr>
            <tr>
              <td>Current Overparking Spaces</td>
              <td>Spot 4 (28 minutes overparked) (placeholder)</td>
            </tr>
          </MyTable>
        </WebCamContainer>

      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};
export default OperatorDashboard;
