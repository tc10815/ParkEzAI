import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../images/advertiserdbhero.jpg';
import Footer from "./Footer";
import theme from '../theme';

const API_URL = process.env.REACT_APP_API_URL;


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

const StyledDetailsTable = styled.table`
  margin-left: auto;
  margin-right: auto;
  width: 40%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const StyledLabel = styled.label`
  font-size: 1rem;
  display: block;
  margin-top: 20px;
  text-align: center;
`;

const StyledInput = styled.input`
  margin-top: 20px;
  padding: 5px;
  font-size: 1rem;
  width: 60%; /* Adjust as needed */
  margin-left: auto;
  margin-right: auto;
  display: block;
  border: 1px solid ${theme.secondary};
  border-radius: 4px;
`;


const StyledSubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: black;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: ${theme.secondary};
  }
`;

const SubHeading = styled.h2`
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  font-size: 2rem;
  width: fit-content;
  color: black;
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

const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const StyledTable = styled.table`
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2em;
  margin-top: 2em;
  width: 60%; /* Adjust this width as per your requirements */
  border-collapse: collapse;
`;

const CreateAd = () => {
  const [user, setUser] = useState(null);
  const [availableLots, setAvailableLots] = useState([]);
  const [selectedLots, setSelectedLots] = useState([]);
  const [adName, setAdName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [targetURL, setTargetURL] = useState('');
  const [secondsBetweenImages, setSecondsBetweenImages] = useState('');

  const handleCheckboxChange = (lotName, isChecked) => {
    if (isChecked) {
      setSelectedLots(prevSelectedLots => [...prevSelectedLots, lotName]);
    } else {
      setSelectedLots(prevSelectedLots => prevSelectedLots.filter(lot => lot !== lotName));
    }
  };


  useEffect(() => {
    if (token) {
      fetch(API_URL + 'accounts/users/me/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => setUser(data));
    }
  }, [location]);
  useEffect(() => {
    if (token) {
      fetch(API_URL + 'ads/lot-metadata/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => setAvailableLots(data));
    }
  }, [location]);


  return (
    <HomeContainer>
      <HeroImage>
        <AdContainer>
          <SubHeading>Create New Advertisement</SubHeading>
          <form>
            <StyledDetailsTable>
              <tbody>
                <tr>
                  <td><StyledLabel htmlFor="adName">Name of Advertisement:</StyledLabel></td>
                  <td>
                    <StyledInput 
                      id="adName"
                      type="text" 
                      placeholder="Ad Name" 
                      value={adName} 
                      onChange={(e) => setAdName(e.target.value)} 
                    />
                  </td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="startDate">Start Date:</StyledLabel></td>
                  <td>
                    <StyledInput 
                      id="startDate"
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)} 
                    />
                  </td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="endDate">End Date:</StyledLabel></td>
                  <td>
                    <StyledInput 
                      id="endDate"
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)} 
                    />
                  </td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="targetURL">Target URL:</StyledLabel></td>
                  <td>
                    <StyledInput 
                      id="targetURL"
                      type="url" 
                      placeholder="http://example.com" 
                      value={targetURL} 
                      onChange={(e) => setTargetURL(e.target.value)} 
                    />
                  </td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="secondsBetweenImages">Seconds Between Images:</StyledLabel></td>
                  <td>
                    <StyledInput 
                      id="secondsBetweenImages"
                      type="number" 
                      min="1"
                      placeholder="Seconds" 
                      value={secondsBetweenImages} 
                      onChange={(e) => setSecondsBetweenImages(e.target.value)} 
                    />
                  </td>
                </tr>
              </tbody>
            </StyledDetailsTable>
            <SubHeading style={{fontSize:'1em'}}>Select Parking Lots where Advertisement will Show</SubHeading>
            <StyledTable>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Zip</th>
                </tr>
              </thead>
              <tbody>
                {availableLots.map(lot => (
                  <tr key={lot.name}>
                    <td>
                      <StyledCheckbox 
                        id={lot.name}
                        checked={selectedLots.includes(lot.name)}
                        onChange={(e) => handleCheckboxChange(lot.name, e.target.checked)}
                      />
                    </td>
                    <td>{lot.name}</td>
                    <td>{lot.state}</td>
                    <td>{lot.city}</td>
                    <td>{lot.zip}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            <StyledDetailsTable>
              <tbody>
                <tr>
                  <td><StyledLabel htmlFor="topBanner1">Top Banner Image 1:</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="topBanner1" /></td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="topBanner2">Top Banner Image 2:</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="topBanner2" /></td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="topBanner3">Top Banner Image 3:</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="topBanner3" /></td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="sideBanner1">Side Banner Image 1:</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="sideBanner1" /></td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="sideBanner2">Side Banner Image 2:</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="sideBanner2" /></td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="sideBanner3">Side Banner Image 3:</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="sideBanner3" /></td>
                </tr>
              </tbody>
            </StyledDetailsTable>
            <div style={{ textAlign: 'center' }}>
              <StyledSubmitButton type="button" onClick={() => { /* Your function here */ }}>
                Create Ad
              </StyledSubmitButton>
            </div>
          </form>
        </AdContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};
export default CreateAd;