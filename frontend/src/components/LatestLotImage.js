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

const LatestLotImage = () => {
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [humanLabels, setHumanLabels] = useState('');
  const [humanLabelsJson, setHumanLabelsJson] = useState({});
  const [spots, setSpots] = useState({});
  const [bestSpots, setBestSpots] = useState({});
  const [bestSpot, setBestSpot] = useState('');
  const [humanTime, setHumanTime] = useState('');
  const [previousImageName, setPreviousImageName] = useState('');
  const { camera } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const endpoint = new URL('lots/lot_latest/', API_URL);
    if(typeof camera == 'string'){
      endpoint.searchParams.append('camera', camera);
    } else {
      endpoint.searchParams.append('camera', 'coldwatermi');
    }

    // Fetch image and labels from API
    fetch(endpoint.toString())
        .then(response => response.json())
        .then(data => {
            setSpots(data.spots);
            setBestSpots(data.bestspots);
            setHumanLabelsJson(data.human_labels);
            const trueLabels = Object.entries(data.human_labels)
                        .filter(([key, value]) => value === true)
                        .map(([key]) => key)
                        .join(", ");

            let bestSpotString = 'None available';
            let BestSpotSoFarKey = 99999;
            for (let spot in Object.keys(data.bestspots)){
              if(!data.human_labels[data.bestspots[spot]] & Number(spot) < BestSpotSoFarKey){
                bestSpotString = data.bestspots[spot];
                BestSpotSoFarKey = Number(spot);
              }
            }
            setBestSpot(bestSpotString);
            setHumanLabels(trueLabels);
            setHumanTime(formatDate(data.timestamp));
            setImageSrc(API_URL + 'lots' + data.image_url);  // prefix the image URL with the server base URL and 'lots'
            setPreviousImageName(data.previous_image_name_part);
            const image = new Image();
            image.src = API_URL + "lots" + data.image_url;
            image.onload = () => {
              canvas.width = image.width;
              canvas.height = image.height;
              context.drawImage(image, 0, 0, canvas.width, canvas.height);
              context.lineWidth = 5;
              context.font = "bold 40px Arial";
              Object.entries(data.spots).forEach(([key, value]) => {
                const [x1, x2, y1, y2] = value;
                const width = x2 - x1;
                const height = y2 - y1;
            
                if(key === bestSpotString){
                    context.strokeStyle = 'green';
                    context.fillStyle = 'green';
                  }else if(data.human_labels[key]){
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
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}, []);

  const handlePrevious = () => {
    navigate(`/image/coldwatermi/${previousImageName}`);
    if(typeof camera == 'string'){
      navigate(`/image/${camera}/${previousImageName}`);
    } else {
      navigate(`/image/coldwatermi/${previousImageName}`);
    }

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
      </ButtonsDiv>
      <LabelsDiv>
        <PStyle>Best Open Spot: {bestSpot}</PStyle>
        <PStyle>Spots occupied: {humanLabels}</PStyle>
      </LabelsDiv>
    </div>
  );
};

export default LatestLotImage;
