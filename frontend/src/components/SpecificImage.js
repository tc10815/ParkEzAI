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

const SpecificImage = () => {
  const [imageSrc, setImageSrc] = useState('');
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
            setImageSrc(API_URL + 'lots' + data.image_url);
            setHumanLabels(JSON.stringify(data.human_labels));
            setModelLabels(JSON.stringify(data.model_labels));
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
      <button onClick={handlePrevious}>Previous</button>
      <button onClick={handleNext}>Next</button>
      <img src={imageSrc} alt="Specified image" />
      <PStyle>Human Labels: {humanLabels}</PStyle>
      <PStyle>Model Labels: {modelLabels}</PStyle>
    </div>
  );
};

export default SpecificImage;
