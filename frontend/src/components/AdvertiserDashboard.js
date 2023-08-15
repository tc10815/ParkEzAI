import React, { useState, useEffect } from "react";
import { useLocation, Link} from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import heroImage from '../images/advertiserdbhero.jpg';
import sampleLotImage from '../images/samplelot.jpg';
import Footer from "./Footer";

const API_URL = process.env.REACT_APP_API_URL;

const AdCard = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: inline-block;
  margin: 1rem;
  padding: 1rem;
  text-align: center;
`;


const AdImage = styled.img`
  height: auto;
`;

const NoAdsMessage = styled.div`
  background-color: white;
  border-radius: 5px;
  display: inline-block;
  margin: 1rem;
  padding: 1rem;
  padding-tom:10rem;
  padding-bottom: 40rem;
  text-align: center;
  font-size: 1.2rem;
`;

const HomeContainer = styled.div`
  background-color: black;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const AdContainer = styled.div`
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
  padding-top: 3.5em;
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

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;  
  align-items: center;
  justify-content: center;
`;

const SideImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;  // To provide some space between the images
`;

const AdvertiserDashboard = () => {
  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [topImageIndices, setTopImageIndices] = useState([]);
  const [sideImageIndices, setSideImageIndices] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(API_URL + 'accounts/users/me/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => setUser(data));

      // Fetch the user's ads
      fetch(API_URL + 'ads/user-ads/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => setAds(data));
    }
  }, [location]);
  
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (ads.length) {
      setTopImageIndices(new Array(ads.length).fill(1));
      setSideImageIndices(new Array(ads.length).fill(1));
    }
  }, [ads]);

  useEffect(() => {
    const newTopIndices = topImageIndices.map((index, i) => {
      if (totalSeconds % ads[i].image_change_interval === 0) {
        return index % 3 + 1;
      }
      return index;
    });

    const newSideIndices = sideImageIndices.map((index, i) => {
      if (totalSeconds % ads[i].image_change_interval === 0) {
        return index % 3 + 1;
      }
      return index;
    });

    setTopImageIndices(newTopIndices);
    setSideImageIndices(newSideIndices);
  }, [totalSeconds]);

  const getImageSrc = (ad, type, index) => {
    const baseName = `${type}_banner_image`;
    return ad[`${baseName}${index}`];
  };


  return (
    <HomeContainer>
      <HeroImage>
        <AdContainer>
        {user ? (
            <>
              {ads.length > 0 ? (
                ads.map((ad, i) => (
                <AdCard key={ad.advert_id}>
                  <h3>Advertisement Name: <em>{ad.name}</em> <Link to={"/edit-ad/" + ad.advert_id}>(edit)</Link></h3>
                  <ImageContainer>
                    <a href={ad.url} target="_blank" rel="noopener noreferrer">
                      <AdImage src={getImageSrc(ad, 'top', topImageIndices[i])} alt="Top Banner" />
                    </a>
                    <SideImageContainer>
                      <AdImage src={sampleLotImage} style={{ height:'600px'}} alt="Sample Lot" />
                      <a href={ad.url} target="_blank" rel="noopener noreferrer">
                        <AdImage src={getImageSrc(ad, 'side', sideImageIndices[i])} alt="Side Banner" />
                      </a>
                    </SideImageContainer>
                  </ImageContainer>
                  <p>Target URL: {ad.url}</p>
                  <p>Impressions: {ad.impressions}</p>
                  <p>Clicks: {ad.clicks}</p>
                  <p>Start Date: {ad.start_date}</p>
                  <p>End Date: {ad.end_date}</p>
                  <p>Seconds between frames: {ad.image_change_interval}</p>
                </AdCard>
                ))
                ) : (
                  <NoAdsMessage>
                    <h3>No ads yet</h3>
                    No ads have been created for your account yet. <br /><br />
                    Select 'Create Ad' from the menu above to create an ad.
                  </NoAdsMessage>
                )}
              </>
            ) : (
              <SubHeading>Welcome back</SubHeading>
            )}
          </AdContainer>
        </HeroImage>
      <Footer />
    </HomeContainer>
  );
};

export default AdvertiserDashboard;