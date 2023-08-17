import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [targetURL, setTargetURL] = useState('');
  const [secondsBetweenImages, setSecondsBetweenImages] = useState('');
  
  const isValidURL = (str) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + 
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + 
      '((\\d{1,3}\\.){3}\\d{1,3}))' + 
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
      '(\\?[;&a-z\\d%_.~+=-]*)?' + 
      '(\\#[-a-z\\d_]*)?$', 'i');
    return !!pattern.test(str);
  };

  const isValidAdName = (name) => {
    const illegalChars = /[\/:*?"<>|]/;
    const reservedNames = ["CON", "PRN", "AUX", "NUL", "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9", "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"];
    return !illegalChars.test(name) && !reservedNames.includes(name.toUpperCase()) && name.length <= 255;
  };

  const handleCheckboxChange = (lotName, isChecked) => {
    if (isChecked) {
      setSelectedLots(prevSelectedLots => [...prevSelectedLots, lotName]);
    } else {
      setSelectedLots(prevSelectedLots => prevSelectedLots.filter(lot => lot !== lotName));
    }
  };

  const validateImage = (file, width, height, imageName) => {
    return new Promise((resolve, reject) => {
        if (file && file.type === 'image/jpeg' && file.size <= 500000) { // 500KB
            const img = new Image();
            img.onload = function() {
                if (this.width === width && this.height === height) {
                    resolve(true);
                } else {
                    reject(`For ${imageName}: Expected dimensions: ${width}x${height}, but got: ${this.width}x${this.height}`);
                }
            };
            img.onerror = function() {
                reject(`Error while reading ${imageName}.`);
            };
            img.src = URL.createObjectURL(file);
        } else {
            reject(`Invalid file type or size for ${imageName}. Ensure it is a JPEG and under 500KB.`);
        }
    });
};


  const handleSubmit = async () => {
    if (!isValidURL(targetURL)) {
      alert("Please ensure the URL is valid and includes 'http://' or 'https://'.");
      return;
    }
    if (!isValidAdName(adName)) {
      alert("Ad name should:\n- Be less than 256 characters.\n- Not contain any of the following characters: /\\:*?\"<>|\n- Not be a reserved name like 'CON', 'PRN', etc.");
      return;
    }

    try {
      await validateImage(document.getElementById('topBanner1').files[0], 728, 90, 'Top Banner Image 1');
      await validateImage(document.getElementById('topBanner2').files[0], 728, 90, 'Top Banner Image 2');
      await validateImage(document.getElementById('topBanner3').files[0], 728, 90, 'Top Banner Image 3');

      await validateImage(document.getElementById('sideBanner1').files[0], 160, 600, 'Side Banner Image 1');
      await validateImage(document.getElementById('sideBanner2').files[0], 160, 600, 'Side Banner Image 2');
      await validateImage(document.getElementById('sideBanner3').files[0], 160, 600, 'Side Banner Image 3');

  } catch (error) {
      alert(error);
      return;
  }

    // Construct FormData object
    const formData = new FormData();
    formData.append('name', adName);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('url', targetURL);
    formData.append('image_change_interval', secondsBetweenImages);
    selectedLots.forEach(lot => formData.append('lots', lot));

    // Append image files
    const topBanner1 = document.getElementById('topBanner1').files[0];
    const topBanner2 = document.getElementById('topBanner2').files[0];
    const topBanner3 = document.getElementById('topBanner3').files[0];
    const sideBanner1 = document.getElementById('sideBanner1').files[0];
    const sideBanner2 = document.getElementById('sideBanner2').files[0];
    const sideBanner3 = document.getElementById('sideBanner3').files[0];

    formData.append('top_banner_image1', topBanner1);
    formData.append('top_banner_image2', topBanner2);
    formData.append('top_banner_image3', topBanner3);
    formData.append('side_banner_image1', sideBanner1);
    formData.append('side_banner_image2', sideBanner2);
    formData.append('side_banner_image3', sideBanner3);

    // Send POST request to Django backend
    fetch(API_URL + 'ads/create-ad/', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
      if(data && data.advert_id) {
          alert('Advertisement created successfully!');
          navigate("/advertiser-dashboard");
      } else {
          alert('Error creating advertisement. Please check your input.');
      }
    })
    .catch(error => {
        console.error('Error:', error);
    });
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
                  <td><StyledLabel htmlFor="startDate">Start Date (leave blank to start run now):</StyledLabel></td>
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
                  <td><StyledLabel htmlFor="endDate">End Date (leave blank to run indefinitely):</StyledLabel></td>
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
                  <td><StyledLabel htmlFor="targetURL">Target URL: (must include <strong><em>http://</em></strong> or <strong><em>https://</em></strong>)</StyledLabel></td>

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
                  <td><StyledLabel htmlFor="secondsBetweenImages">Seconds Between Ad Images:</StyledLabel></td>
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
                        id={lot.id}
                        checked={selectedLots.includes(lot.id)}
                        onChange={(e) => handleCheckboxChange(lot.id, e.target.checked)}
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
            <SubHeading style={{fontSize:'1em', width:'50%'}}>All ads are 3 images appearing in banners on top of lot and on side of lot. They change images at the above specified number of seconds.</SubHeading>
            <p>(each image must be less than 0.5mb)</p>
            <StyledDetailsTable>
              <tbody>
                <tr>
                  <td><StyledLabel htmlFor="topBanner1">Top Banner Image 1 (728px by 90px):</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="topBanner1" /></td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="topBanner2">Top Banner Image 2 (728px by 90px):</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="topBanner2" /></td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="topBanner3">Top Banner Image 3 (728px by 90px):</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="topBanner3" /></td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="sideBanner1">Side Banner Image 1 (160px by 600px):</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="sideBanner1" /></td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="sideBanner2">Side Banner Image 2 (160px by 600px):</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="sideBanner2" /></td>
                </tr>
                <tr>
                  <td><StyledLabel htmlFor="sideBanner3">Side Banner Image 3 (160px by 600px):</StyledLabel></td>
                  <td><StyledInput type="file" accept=".jpg" id="sideBanner3" /></td>
                </tr>
              </tbody>
            </StyledDetailsTable>
            <div style={{ textAlign: 'center' }}>
              <StyledSubmitButton type="button" onClick={() => { handleSubmit() }}>
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