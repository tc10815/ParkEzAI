import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const API_URL = process.env.REACT_APP_API_URL;

const PStyle = styled.p`
  font-size: 2rem;
  width: fit-content;
  color: white;
  background-color: rgba(0, 0, 0, 1); 
  padding: 0.5rem 1rem;
`;

const Coldwater = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [humanLabels, setHumanLabels] = useState('');
  const [modelLabels, setModelLabels] = useState('');
  const [previousImageName, setPreviousImageName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const endpoint = new URL('lots/lot_latest/', API_URL);
    endpoint.searchParams.append('camera', 'coldwatermi');
    
    // Fetch image and labels from API
    fetch(endpoint.toString())
        .then(response => response.json())
        .then(data => {
            console.log(data);  // log the received data
            setImageSrc(API_URL + 'lots' + data.image_url);  // prefix the image URL with the server base URL and 'lots'
            setHumanLabels(data.human_labels);
            setModelLabels(data.model_labels);
            setPreviousImageName(data.previous_image_name_part);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}, []);



  const handlePrevious = () => {
    navigate(`/image/coldwatermi/${previousImageName}`);
  };

  return (
    <div>
      <button onClick={handlePrevious}>Previous Image</button>
      <img src={imageSrc} alt="Latest image" />
      <PStyle>Human Labels: {humanLabels}</PStyle>
      <PStyle>Model Labels: {modelLabels}</PStyle>
    </div>
  );
};

export default Coldwater;