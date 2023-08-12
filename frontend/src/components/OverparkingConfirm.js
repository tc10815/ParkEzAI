import React, { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
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

const PageTitle = styled.div`
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    padding-top: 1em;
    padding-bottom: 1em;
    font-size: 2rem;
    line-height: 2;
    `;

const ContentContainer = styled.div`
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

const CroppedImage = styled.img`
  object-fit: none; 
  object-position: -${props => props.left}px -${props => props.top}px;
  width: ${props => props.height}px;
  height: ${props => props.width}px;
  clip-path: inset(0 0 0 0);
`;


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

function timeDifferenceInMinutes(currentString, previousString) {
  const current = new Date(currentString);
  const previous = new Date(previousString);
  const difference = current - previous;
  return (difference / 1000 / 60 / 60).toFixed(1); 
}



const OverparkingConfirm = () => {
  const { lot, cam, space, starttime, endtime } = useParams();
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [crop, setCrop] = useState([0,0,0,0]); 
  const [mostRecentTime, setMostRecentTime] = useState('');

  useEffect(() => {
    const endpoint = new URL(`lots/overparking_confirm/${lot}/${cam}/${space}/${starttime}/${endtime}/`, API_URL);
    const token = localStorage.getItem("token");
    
    fetch(API_URL + 'accounts/users/me/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => setUser(data));
    
    if (token) {
      fetch(endpoint.toString(), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        const sortedImages = data.cam_images.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setImages(sortedImages.reverse()); 
        setMostRecentTime(sortedImages[0].timestamp);
        setCrop(data.crop);
    }); 
    
    }
  }, [lot, cam, space, starttime, endtime]);

  return (
    <HomeContainer>
      <HeroImage>
        <ContentContainer>
          <PageTitle><em>Overparking Confirmation</em><br /><u>{space}</u> Spot History in <u>{cam}</u></PageTitle>
          {images.map((imageObj, index) => (
              <div key={index}>
                  <p><strong>{`${space} at ${formatDate(imageObj.timestamp)} `}</strong> <br />
                  {`${timeDifferenceInMinutes(mostRecentTime,imageObj.timestamp)} hours before ${formatDate(mostRecentTime)}` }</p>
                  <CroppedImage 
                      src={`${API_URL}${'lots/' + imageObj.image.slice(1)}`}
                      alt={`Image from ${imageObj.camera_name} at ${imageObj.timestamp}`}
                      top={crop[2]}
                      left={crop[0]}
                      height={crop[1]- crop[0]}
                      width={crop[3] - crop[2]}
                  />
              </div>
          ))}
          </ContentContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};
export default OverparkingConfirm;
