import React, { useEffect, useState } from 'react';
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

const CamImage = styled.img`
  max-width: 70vw;
  height: auto; 
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

const SpecificImage = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [humanTime, setHumanTime] = useState('');
  const [humanLabels, setHumanLabels] = useState('');
  const [modelLabels, setModelLabels] = useState('');
  const [previousImageName, setPreviousImageName] = useState('');
  const [nextImageName, setNextImageName] = useState('');
  const { camera, imageName } = useParams();
  const navigate = useNavigate();


  useEffect(() => {

    const endpoint = new URL('lots/lot_specific', API_URL);
    endpoint.searchParams.append('camera', camera);
    endpoint.searchParams.append('image', imageName);

    // Fetch image and labels from API
    fetch(endpoint.toString())
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setHumanTime(formatDate(data.timestamp));
            setImageSrc(API_URL + 'lots' + data.image_url);
            setHumanLabels(data.human_labels);
            setModelLabels(data.model_labels);
            setPreviousImageName(data.previous_image_name_part);
            setNextImageName(data.next_image_name_part);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}, [camera, imageName]);


  const handlePrevious = () => {
    navigate(`/image/${camera}/${previousImageName}`);
  };

  const handleNext = () => {
    navigate(`/image/${camera}/${nextImageName}`);
  };

  return (
    <div>
      <TimeH2>
        {humanTime}
      </TimeH2>
      <ImageDiv>
        <CamImage src={imageSrc} alt="Specified image" />
      </ImageDiv>
      <ButtonsDiv>
        <Button onClick={handlePrevious}>Previous</Button>
        <Button onClick={handleNext}>Next</Button>
      </ButtonsDiv>
      <LabelsDiv>
        <PStyle>Human Labels: {humanLabels}</PStyle>
        <PStyle>Model Labels: {modelLabels}</PStyle>
      </LabelsDiv>
    </div>
  );
};

export default SpecificImage;
