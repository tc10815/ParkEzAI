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
  margin-top:10px;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
  width: fit-content;
  color: white;
`;

const AdImage = styled.img`
  height: auto;
  width: 100%;
  transition: opacity 0.5s;
`;

const AdBanner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
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
  const [ad, setAd] = useState(null);
  const [currentTopImageIndex, setCurrentTopImageIndex] = useState(1);
  const [currentSideImageIndex, setCurrentSideImageIndex] = useState(1);
  const [previousImageName, setPreviousImageName] = useState('');
  const { lot } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const endpoint = new URL('lots/lot_latest/', API_URL);
    if(typeof lot == 'string'){
      endpoint.searchParams.append('lot', lot);
    } else {
      endpoint.searchParams.append('lot', 'coldwater');
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
            setImageSrc(API_URL + 'lots' + data.image_url); 
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
        fetch(`${API_URL}ads/serve-ad/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lot_id: lot,
          }),
        })
          .then(response => response.json())
          .then(data => {
            setAd(data);
          })
          .catch((error) => {
            console.error('Error fetching ad:', error);
          });
      }, []);
  const handlePrevious = () => {
    navigate(`/image/coldwater/${previousImageName}`);
    if(typeof camera == 'string'){
      navigate(`/image/${lot}/${previousImageName}`);
    } else {
      navigate(`/image/coldwater/${previousImageName}`);
    }

  };

  useEffect(() => {
    if (ad) {
      const interval = setInterval(() => {
        setCurrentTopImageIndex((prev) => (prev % 3) + 1);
        setCurrentSideImageIndex((prev) => (prev % 3) + 1);
      }, ad.image_change_interval * 1000);

      return () => clearInterval(interval);
    }
  }, [ad]);

  const handleAdClick = () => {
    // Check if there's an ad and an advert_id
    if (ad && ad.advert_id) {
        fetch(`${API_URL}ads/increment_clicks/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                advert_id: ad.advert_id,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Click incremented successfully:', data);
        })
        .catch((error) => {
            console.error('Error incrementing click:', error);
        });
    }
  };


  return (
    <div>
      {ad && (
          <AdBanner style={{marginTop:'60px'}}>
            <a href={ad.url} target="_blank" rel="noopener noreferrer" onClick={handleAdClick}>
              <AdImage style={{width: '100%',height:'auto'}} src={ad[`top_banner_image${currentTopImageIndex}`]} />
            </a>
          </AdBanner>)}
      <TimeH2>
        {humanTime}
      </TimeH2>
      <ImageDiv>
        <LotCanvas ref={canvasRef} />
        {ad && (
          <AdBanner style={{marginLeft:'50px'}}>
            <a href={ad.url} target="_blank" rel="noopener noreferrer" onClick={handleAdClick}>
              <AdImage style={{width: '100%',height:'auto'}} src={ad[`side_banner_image${currentSideImageIndex}`]} />
            </a>
          </AdBanner>
          )}
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
