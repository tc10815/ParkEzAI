import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  max-width: 70vw;
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
`;

const ButtonsDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LabelsDiv = styled.div`
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  max-width: 70vw;
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
    

}

const Archive = () => {
  const canvasRef = useRef(null);
  const [humanTime, setHumanTime] = useState('');
  const [humanLabels, setHumanLabels] = useState('');
  const [humanLabelsJson, setHumanLabelsJson] = useState({});
  const [bestSpots, setBestSpots] = useState({});
  const [bestSpot, setBestSpot] = useState('');
  const [previousImageName, setPreviousImageName] = useState('');
  const [nextImageName, setNextImageName] = useState('');
  const [realLot, setRealLot] = useState(''); // fixed useState here
  const { lot, imageName } = useParams();
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
        setRealLot(data1.lot); // used setRealLot here
        endpoint.searchParams.append('lot', data1.lot);
        endpoint.searchParams.append('image', data1.image);
      } else {
        endpoint.searchParams.append('lot', lot);
        endpoint.searchParams.append('image', imageName);
      }
      
      const response2 = await fetch(endpoint.toString());
      const data2 = await response2.json();

      setBestSpots(data2.bestspots);
      setHumanLabelsJson(data2.human_labels);
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
    fetchData().catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, [lot, imageName]);

  const handlePrevious = () => {
    navigate(`/archive/${realLot}/${previousImageName}`);
  };

  const handleNext = () => {
    navigate(`/archive/${realLot}/${nextImageName}`);
  };

  return (
    <div>
      <TimeH2>
        {humanTime}
      </TimeH2>
      <ImageDiv>
        <LotCanvas ref={canvasRef} />
      </ImageDiv>
      <ButtonsDiv>
        <Button onClick={handlePrevious}>Previous</Button>
        <Button onClick={handleNext}>Next</Button>
      </ButtonsDiv>
      <LabelsDiv>
        <PStyle>Best Open Spot: {bestSpot}</PStyle>
        <PStyle>Spots occupied: {humanLabels}</PStyle>
      </LabelsDiv>
    </div>
  );
};

export default Archive;
