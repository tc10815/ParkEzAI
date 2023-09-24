import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

const API_URL = process.env.REACT_APP_API_URL;


const PStyle = styled.p`
  font-size: 2rem;
  width: fit-content;
  color: white;
  background-color: rgba(0, 0, 0, 1); 
  padding: 0.5rem 1rem;
`;

const LotCanvas = styled.canvas`
  max-width: 60vw;
  height: auto; 
`
const TimeH2 = styled.h2` 
  margin-top:75px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  width: fit-content;
  color: white;
`;

const OverparkTable = styled.table`
  color: white;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  font-size: 2rem;

`
const ImageDiv = styled.div` 
  margin-top:2;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  padding: 1rem 2rem; 
  font-size: 1.5rem;  
  margin: 0.5rem; 
  margin-left: 100px;
  margin-right: 100px;

`;

const ButtonsDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LabelsDiv = styled.div`
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  align-items: center;
  width: fit-content;
`;

function formatDate(inputdate){
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
    

}

function findOverparking(sortedData, currentDateString){

  const spotNames = Object.keys(JSON.parse(sortedData[0].human_labels));
  let spotOccupancyTime = {};
  let lastFreeSpace = {};

  spotNames.forEach(spotNames => {
    spotOccupancyTime[spotNames] = 0;
    lastFreeSpace[spotNames] = '';
  });
  let indexOfCurrentImage = sortedData.findIndex(item => item.image.includes(currentDateString));
  if (currentDateString === 'default'){
    indexOfCurrentImage = sortedData.length - 1;
  }
  for (let x = 0; x < indexOfCurrentImage; x++){
    for (let keyName of spotNames){
      let time_diff = (new Date(sortedData[x+1].timestamp) - new Date(sortedData[x].timestamp))/60000 / 60;
    
      if (JSON.parse(sortedData[x+1].human_labels)[keyName]){

        // Makes it so first picture of car in spot counts as minute 0 in determining overparking
        if (x !== indexOfCurrentImage-1) spotOccupancyTime[keyName] = spotOccupancyTime[keyName] + time_diff;
        
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
  if (currentDateString !== 'default'){
    current_datetime = currentDateString;
  }

  let occupancyCheckLink = {};
  spotNames.forEach(spotNames => {
    occupancyCheckLink[spotNames] = 'lot/' + sortedData[0].camera_name + '/' + spotNames + '/' + lastFreeSpace[spotNames] + '/' + current_datetime + '/';
  });

  return [spotOccupancyTime, occupancyCheckLink];
}



const Archive = () => {
  const canvasRef = useRef(null);
  const [humanTime, setHumanTime] = useState('');
  const [humanLabels, setHumanLabels] = useState('');
  const [bestSpot, setBestSpot] = useState('');
  const [previousImageName, setPreviousImageName] = useState('');
  const [nextImageName, setNextImageName] = useState('');
  const [realLot, setRealLot] = useState(''); 
  const [selectedTimestamp, setSelectedTimestamp] = useState("");
  const [comboBoxChoices, setComboBoxChoices] = useState([]);
  const [comboBoxChoicesLinks, setComboBoxChoicesLinks] = useState([]);

  const {lot, imageName } = useParams();
  const [overparkingData, setOverparkingData] = useState({});
  const [overparkingConfirmLinks, setOverparkingConfirmLinks] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const endpoint = new URL('lots/lot_specific', API_URL);
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      if (lot === 'default' || imageName === 'default') {
        const default_url = new URL('lots/get_defaults', API_URL);
        const response1 = await fetch(default_url.toString(), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        const data1 = await response1.json();
        setRealLot(data1.lot);
        endpoint.searchParams.append('lot', data1.lot);
        endpoint.searchParams.append('image', data1.image);
        
      } else {
        setRealLot(lot);
        endpoint.searchParams.append('lot', lot);
        endpoint.searchParams.append('image', imageName);
      }


      
      const response2 = await fetch(endpoint.toString());
      const data2 = await response2.json();
      const trueLabels = Object.entries(data2.human_labels)
                    .filter(([key, value]) => value === true)
                    .map(([key]) => key)
                    .join(", ");
      let bestSpotString = 'None available';
      let BestSpotSoFarKey = 99999;
      for (let spot in Object.keys(data2.bestspots)){
        if(!data2.human_labels[data2.bestspots[spot]] & Number(spot) < BestSpotSoFarKey){
          bestSpotString = data2.bestspots[spot];
          BestSpotSoFarKey = Number(spot);
        }
      }
      setBestSpot(bestSpotString);            
      setHumanLabels(trueLabels);
      setHumanTime(formatDate(data2.timestamp));
      setPreviousImageName(data2.previous_image_name_part);
      setNextImageName(data2.next_image_name_part);
      const image = new Image();
      image.src = API_URL + "lots" + data2.image_url;
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.lineWidth = 9;
        context.font = "bold 50px Arial";
        
        const entries = Object.entries(data2.spots);
        entries.reverse().forEach(([key, value]) => {
          const [x1, x2, y1, y2] = value;
          const width = x2 - x1;
          const height = y2 - y1;
      
          if(key === bestSpotString){
              context.strokeStyle = 'green';
              context.fillStyle = 'green';
          }else if(data2.human_labels[key]){
              context.strokeStyle = 'red';
              context.fillStyle = 'red';
          }else{
              context.strokeStyle = 'blue';
              context.fillStyle = 'blue';
          }
      
          context.strokeRect(x1, y1, width, height);
          context.fillText(key, x1, y1 - 5); 
      });
      }
    }
    const fetchOverparkingData = async () => {
      if (token) {
        const response = await fetch(API_URL + 'lots/get_lot_history/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        const data = await response.json();
        const sortedData = data.image_data.slice().sort((a, b) => {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateA - dateB;// For ascending order 
        });
        let choices = [];
        let choicesString = [];
        for (let a of sortedData){
          const temp = a.image;
          const match = temp.match(/_(\d+)\./);
          let imgcropped = "";
          if (match) {
            imgcropped = match[1];
          }
          const yearTemp =  imgcropped.slice(0,4);
          const monthTemp =  Number(imgcropped.slice(4,6));
          const dayTemp = Number(imgcropped.slice(6,8));
          const hourTemp = Number(imgcropped.slice(8,10)) % 12 || 12;
          const minuteTemp = imgcropped.slice(10,12);
          const ampmTemp = Number(imgcropped.slice(8,10)) < 12 ? "am" : "pm";
          const dateString = monthTemp + '/' + dayTemp + '/' + yearTemp + ' ' + hourTemp + ':' + minuteTemp + ampmTemp;
          choices.unshift(dateString);
          choicesString.unshift(imgcropped);
        }
        setComboBoxChoices(choices);
        setComboBoxChoicesLinks(choicesString);
        let doubleret = findOverparking(sortedData, imageName);
        setOverparkingData(doubleret[0]);
        setOverparkingConfirmLinks(doubleret[1]);
      }
    }

    fetchData().then(fetchOverparkingData).catch((error) => {
      console.error('Error fetching data:', error);
    });


  
  }, [lot, imageName]);

  const handlePrevious = () => {
    navigate(`/archive/${realLot}/${previousImageName}`);
  };

  const handleNext = () => {
    navigate(`/archive/${realLot}/${nextImageName}`);
  };

  const handleTimestampChange = (event) => {
    setSelectedTimestamp(event.target.value);
    const choiceNumber = comboBoxChoices.indexOf(event.target.value);
    navigate(`/archive/${realLot}/${comboBoxChoicesLinks[choiceNumber]}/`);
};


  return (
    <div style={{backgroundColor:'black'}}>
      <TimeH2>
      <Button onClick={handlePrevious}>Previous</Button>
        {humanTime}
        <Button onClick={handleNext}>Next</Button>
      </TimeH2>
      <div style={{width: "fit-content", marginLeft: "auto", marginRight: "auto", paddingBottom:"10px", color:"white"}}>
      <strong>Jump to date/time in archive:</strong> <select value={selectedTimestamp} onChange={handleTimestampChange}>
      {Array.isArray(comboBoxChoices) && comboBoxChoices.map((item, index) => (
          <option key={index} value={item}>
              {item}
          </option>
      ))}
      </select>
      </div>
      <ImageDiv>
        <LotCanvas ref={canvasRef} />
      </ImageDiv>
      <br />
          <OverparkTable>
            <thead>
            <tr>
                <th colSpan="2" style={{textAlign:'center'}}>Overparking</th>
              </tr>
              <tr>
                <td>Spot Name |</td>
                <td>Hours Parked</td>
              </tr>
            </thead>
            <tbody>
                {Object.keys(overparkingData).map((key) => 
                    overparkingData[key] !== 0 && (
                        <tr key={key}>
                            <td>
                                <Link 
                                    to={`/realLotoverpark-confirm/${overparkingConfirmLinks[key]}`}
                                    style={{ color: overparkingData[key] > 5 ? "red" : "white", fontWeight: overparkingData[key] > 5 ? "bold" : "normal" }}
                                >
                                    {key}
                                </Link>
                            </td>
                            <td>
                                <Link 
                                    to={`/overpark-confirm/${overparkingConfirmLinks[key]}`}
                                    style={{ color: overparkingData[key] > 5 ? "red" : "white", fontWeight: overparkingData[key] > 5 ? "bold" : "normal" }}
                                >
                                    {parseFloat(overparkingData[key].toFixed(1))}
                                </Link>
                            </td> 
                        </tr>
                    )
                )}
            </tbody>
          </OverparkTable>
          <p style={{color:'red', textAlign:'center'}}>*Red indicates overparking alert.</p>
          <p style={{color:'red', textAlign:'center'}}>Click spot name or hours parked to confirm overparking.</p>
        <LabelsDiv>
          <PStyle>Best Open Spot: {bestSpot}<br />Spots occupied: {humanLabels}</PStyle>
        </LabelsDiv>
    </div>
  );
};

export default Archive;
