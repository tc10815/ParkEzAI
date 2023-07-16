import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const API_URL = process.env.REACT_APP_API_URL;

const PStyle = styled.p`
  font-size: 2rem;
  width: fit-content;
  color: white;
  background-color: rgba(0, 0, 0, 1); 
  padding: 0.5rem 1rem;
`;

const SpecificImage = () => {
  const { camera, imageName } = useParams();
  const [imageSrc, setImageSrc] = useState('');
  const [humanLabels, setHumanLabels] = useState('');
  const [modelLabels, setModelLabels] = useState('');

  useEffect(() => {
    // Fetch image and labels from API
    var url = 'lots/lot_specific';
    if(API_URL == 'http://127.0.0.1:8000') {
      var url = '/lots/lot_specific';
    }

    // Fetch image and labels from API


    fetch(`${API_URL}` + url + `?camera=${camera}&image=${imageName}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);  // log the received data
            setImageSrc(API_URL + 'lots' + data.image_url);  // prefix the image URL with the server base URL and 'lots'
            setHumanLabels(data.human_labels);
            setModelLabels(data.model_labels);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
  }, [camera, imageName]);

  return (
    <div>
      <img src={imageSrc} alt="Specific image" />
      <PStyle>Human Labels: {humanLabels}</PStyle>
      <PStyle>Model Labels: {modelLabels}</PStyle>
    </div>
  );
};

export default SpecificImage;
