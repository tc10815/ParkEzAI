import React, { useState, useRef, useEffect } from "react";
import {useLocation, Link} from 'react-router-dom';
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

const overparkingStyle = {
  margin: "auto", // Centers the table horizontally
  textAlign: "center", // Centers the text within table cells
};

function findOverparking(allData){
  const sortedData = allData.slice().sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateA - dateB; // For ascending order
  });
  const spotNames = Object.keys(JSON.parse(sortedData[0].human_labels));

  let spotOccupancyTime = {};
  let lastFreeSpace = {};

  spotNames.forEach(spotNames => {
    spotOccupancyTime[spotNames] = 0;
    lastFreeSpace[spotNames] = '';
  });

  for (let x = 0; x < sortedData.length-1; x++){
    for (let keyName of spotNames){
      let time_diff = (new Date(sortedData[x+1].timestamp) - new Date(sortedData[x].timestamp))/60000 / 60;
    
      if(JSON.parse(sortedData[x+1].human_labels)[keyName]){
        // Makes it so first picture of car in spot counts as minute 0 in determining overparking
        if (x !== sortedData.length-2) spotOccupancyTime[keyName] = spotOccupancyTime[keyName] + time_diff;
        
      } else {
        spotOccupancyTime[keyName] = 0;
        let match = sortedData[x+1].image.match(/_(\d+)\./);
        if (match) {
          lastFreeSpace[keyName] = match[1];
        }
      }
    }
  }
  let current_datetime = '';
  let match = sortedData[sortedData.length-1].image.match(/_(\d+)\./);
  if (match) {
    current_datetime = match[1];
  }

  let occupancyCheckLink = {};
  spotNames.forEach(spotNames => {
    occupancyCheckLink[spotNames] = 'lot/' + sortedData[0].camera_name + '/' + spotNames + '/' + lastFreeSpace[spotNames] + '/' + current_datetime + '/';
    // overparking_confirm/<str:lot>/<str:cam>/<str:spot>/<str:startdatetime>/<str:enddatetime>/
  });
  return [spotOccupancyTime, occupancyCheckLink];
}

function formatDate(inputdate){
  const timestampUTC = new Date(inputdate); // parse the ISO string into a Date object
  const timestampEST = new Date(timestampUTC.getTime() + (4 * 60 * 60 * 1000)); // subtract 5 hours from UTC to get EST
  let hour = timestampEST.getHours();
  let ampm = 'am'
  if (hour === 0){
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
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  const canvasRef = useRef(null);
  const [currentCarsParked, setCurrentCarsParked] = useState('');
  const [dateOfMostRecentImage, setDateOfMostRecentImage] = useState('');
  const [maxCarsParked, setMaxCarsParked] = useState('');
  const [carsParkedToday, setCarsParkedToday] = useState('');
  const [averageOccupancyToday, setAverageOccupancyToday] = useState('');
  const [overparkingData, setOverparkingData] = useState({});
  const [overparkingConfirmLinks, setOverparkingConfirmLinks] = useState({});
  const [sevenDayNames, setSevenDayNames] = useState([]);
  const [sevenTotalSpaceCounts, setSevenTotalSpaceCounts] = useState([]);
  const [sevenTotalCarCounts, setSevenTotalCarCounts] = useState([]);
  const [recentReadings, setRecentReadings] = useState({});

  const calculateTableData = (data) => {
    const sortedData = data.slice().sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateA - dateB;// For ascending order 
    });
    let iteration = 0;
    let days_changed_so_far = 0;
    let last_day = '';
    let car_counter = 0;
    let car_array = [];
    let photo_counter = 0;
    let photo_array = [];
    let previous_time = 0;
    let day_array = [];
    day_array.push('');

    for( let x of sortedData.reverse()){
      let today = new Date((new Date(x.timestamp).getTime() + (4 * 60 * 60 * 1000)));
      let today_string = (today.getMonth()+1) + '/' + today.getDate();
      let dictionary = JSON.parse(x.human_labels);
      const total_cars = Object.values(dictionary).reduce((acc, curr) => curr ? acc + 1 : acc, 0);
      const total_spaces = Object.keys(dictionary).length;
      // console.log(total_cars + '/' + total_spaces + ' = ' + (total_cars/total_spaces));
      if (today_string !== last_day){
        last_day = today_string;
        days_changed_so_far++;
        day_array.push(today_string);
        car_array.push(car_counter);
        photo_array.push(photo_counter);
        car_counter = 0;
        photo_counter = 0;
      } 
      if (previous_time === 0){
        previous_time = today.getTime();
      } else {
        car_counter += (previous_time - today.getTime()) / (60 * 60 * 1000)
        previous_time = today.getTime();
      }
      car_counter += total_cars;
      photo_counter = photo_counter + total_spaces;
      iteration++;
      if (days_changed_so_far > 8) break;
    }
    // setCarsParkedToday(str(car_array[0]/photo_array[0]));
    setCarsParkedToday(car_array[1]/2);
    setAverageOccupancyToday(((car_array[1]/photo_array[1])*100).toFixed(1));
    car_array.shift();
    photo_array.shift();
    day_array.shift();
    setSevenDayNames(day_array);
    setSevenTotalSpaceCounts(photo_array);
    setSevenTotalCarCounts(car_array);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const token = localStorage.getItem("token");
    if (token) {
      fetch(API_URL + 'lots/get_lot_history/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          calculateTableData(data.image_data);

          let doubleret = findOverparking(data.image_data);
          setOverparkingData(doubleret[0]);
          setOverparkingConfirmLinks(doubleret[1]);
        });

    }
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
      let url = API_URL + 'lots/lot_dashboard/';
      if (email) {
        url += `?email=${email}`;
      }

      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
          setDateOfMostRecentImage(data.timestamp);
          let bestSpotString = 'None available';
          let BestSpotSoFarKey = 99999;
          for (let spot in Object.keys(data.bestspots)){
            if(!data.human_labels[data.bestspots[spot]] & Number(spot) < BestSpotSoFarKey){
              bestSpotString = data.bestspots[spot];
              BestSpotSoFarKey = Number(spot);
            }
          }
          let totalSpotsFull = 0;
          for (let key in data.human_labels) {
            if (data.human_labels[key]){
              totalSpotsFull = totalSpotsFull + 1;
            }
          }
          setCurrentCarsParked(totalSpotsFull);
          setMaxCarsParked(Object.keys(data.human_labels).length)
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
              const fetchReadings = async () => {
                let readings = {};
                for (let lpr of data.lpr_metadata) {
                    const response = await fetch(API_URL + `lots/recentreadings/${lpr.name}/`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`,
                        }
                    });
                    readings[lpr.name] = await response.json();
                    console.log(readings);
                }
                setRecentReadings(readings);
            }
            fetchReadings();
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
          <p>Parking Lot {formatDate(dateOfMostRecentImage)}</p>
          <ImageDiv>
            <LotCanvas ref={canvasRef} />
          </ImageDiv>
          <h3 style={{textDecoration: "underline"}}>Parking Analysis</h3>
          <MyTable>
            <tbody>
              <tr>
                <th>Current Occupancy</th>
                <td>{currentCarsParked}/{maxCarsParked}</td>
              </tr>
              <tr>
                <th>Total Cars Parked Today Tallied Each Hour</th>
                <td>{Math.round(carsParkedToday)}</td>
              </tr>
              <tr>
                <th>Average Occupancy Today</th>
                <td>{averageOccupancyToday}%</td>
              </tr>
              </tbody>
          </MyTable>
          <br />
          <MyTable>
            <thead>
              <tr>
                <th>{console.log()}</th>
                <th>{sevenDayNames[0]}</th>
                <th>{sevenDayNames[1]}</th>
                <th>{sevenDayNames[2]}</th>
                <th>{sevenDayNames[3]}</th>
                <th>{sevenDayNames[4]}</th>
                <th>{sevenDayNames[5]}</th>
                <th>{sevenDayNames[6]}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>7-Day Average Occupancy &nbsp;&nbsp;&nbsp;</th>
                <td>{((sevenTotalCarCounts[0]/sevenTotalSpaceCounts[0])*100).toFixed(1)}%&nbsp;</td>
                <td>{((sevenTotalCarCounts[1]/sevenTotalSpaceCounts[1])*100).toFixed(1)}%&nbsp;</td>
                <td>{((sevenTotalCarCounts[2]/sevenTotalSpaceCounts[2])*100).toFixed(1)}%&nbsp;</td>
                <td>{((sevenTotalCarCounts[3]/sevenTotalSpaceCounts[3])*100).toFixed(1)}%&nbsp;</td>
                <td>{((sevenTotalCarCounts[4]/sevenTotalSpaceCounts[4])*100).toFixed(1)}%&nbsp;</td>
                <td>{((sevenTotalCarCounts[5]/sevenTotalSpaceCounts[5])*100).toFixed(1)}%&nbsp;</td>
                <td>{((sevenTotalCarCounts[6]/sevenTotalSpaceCounts[6])*100).toFixed(1)}%&nbsp;</td>              
              </tr>
              <tr>
                <th>7-Day Total Cars Parked</th>
                <td>{Math.round(sevenTotalCarCounts[0]/2)}</td>
                <td>{Math.round(sevenTotalCarCounts[1]/2)}</td>
                <td>{Math.round(sevenTotalCarCounts[2]/2)}</td>
                <td>{Math.round(sevenTotalCarCounts[3]/2)}</td>
                <td>{Math.round(sevenTotalCarCounts[4]/2)}</td>
                <td>{Math.round(sevenTotalCarCounts[5]/2)}</td>
                <td>{Math.round(sevenTotalCarCounts[6]/2)}</td>
              </tr>
            </tbody>
          </MyTable>
          <br />
          <table style={overparkingStyle}>
            <thead>
              <tr>
                <th>Spot Name |</th>
                <th>Hours Parked</th>
              </tr>
            </thead>
            <tbody>
                {Object.keys(overparkingData).map((key) => 
                    overparkingData[key] !== 0 && (
                        <tr key={key}>
                            <td>
                                <Link 
                                    to={`/overpark-confirm/${overparkingConfirmLinks[key]}`}
                                    style={{ color: overparkingData[key] > 5 ? "red" : "black", fontWeight: overparkingData[key] > 5 ? "bold" : "normal" }}
                                >
                                    {key}
                                </Link>
                            </td>
                            <td>
                                <Link 
                                    to={`/overpark-confirm/${overparkingConfirmLinks[key]}`}
                                    style={{ color: overparkingData[key] > 5 ? "red" : "black", fontWeight: overparkingData[key] > 5 ? "bold" : "normal" }}
                                >
                                    {parseFloat(overparkingData[key].toFixed(1))}
                                </Link>
                            </td> 
                        </tr>
                    )
                )}
            </tbody>
          </table>  
          <h3 style={{textDecoration: "underline"}}>License Plate Data**</h3>
                {
                  Object.keys(recentReadings).map(lprName => (
                      <div key={lprName}>
                          <h3>Plate Reader: <em>{lprName}</em></h3>
                          <MyTable>
                              <thead>
                                  <tr>
                                      <th>Time</th>
                                      <th>Plate Number</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {recentReadings[lprName].map(reading => (
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
          <p><Link to={`/plate-data/`}>See unabbreviated log</Link></p>
          <p><em>*Red indicates overparking alert.</em></p>
          <p><em>**Lot shown is real data: real lot, real time. License Plate data is fictional and used to demonstrate interface, although interface can accept real license plate data.</em></p>
        </WebCamContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};
export default OperatorDashboard;
