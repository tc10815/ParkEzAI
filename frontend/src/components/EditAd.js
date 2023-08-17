import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
const EditAd = () => {
  const { advert_id } = useParams();
  const token = localStorage.getItem("token");
  console.log('EditAd component rendered with', advert_id, token);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [availableLots, setAvailableLots] = useState([]);
  const [selectedLots, setSelectedLots] = useState([]);
  const [adName, setAdName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetURL, setTargetURL] = useState('');
  const [secondsBetweenImages, setSecondsBetweenImages] = useState('');
  const [currentImages, setCurrentImages] = useState({
    topBanner1: '',
    topBanner2: '',
    topBanner3: '',
    sideBanner1: '',
    sideBanner2: '',
    sideBanner3: ''
  });

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

  const handleFileChange = (e, adId, type, index) => {
    const files = e.target.files;
    if (files.length > 0) {
        setUploadedFiles(prev => ({
            ...prev,
            [adId]: {
                ...prev[adId],
                [`${type}_banner_image${index}`]: files[0]
            }
        }));
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

useEffect(() => {
  console.log('useEffect triggered');
  if (token && advert_id) {
    console.log('useEffect triggered');
    fetch(API_URL + `ads/edit/${advert_id}/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setAdName(data.name);
        setStartDate(data.start_date);
        setEndDate(data.end_date);
        setTargetURL(data.url);
        setSecondsBetweenImages(data.image_change_interval);
        data.lots.map(lot => lot.name);
        setCurrentImages({
          topBanner1: data.top_banner_image1,
          topBanner2: data.top_banner_image2,
          topBanner3: data.top_banner_image3,
          sideBanner1: data.side_banner_image1,
          sideBanner2: data.side_banner_image2,
          sideBanner3: data.side_banner_image3
         });  
      });
  }
}, [token, advert_id]);

const handleUpdate = async () => {
  if (!isValidURL(targetURL)) {
      alert("Please ensure the URL is valid and includes 'http://' or 'https://'.");
      return;
  }
  if (!isValidAdName(adName)) {
      alert("Ad name should:\n- Be less than 256 characters.\n- Not contain any of the following characters: /\\:*?\"<>|\n- Not be a reserved name like 'CON', 'PRN', etc.");
      return;
  }

  // Construct FormData object for updating
  const formData = new FormData();
  formData.append('name', adName);
  formData.append('start_date', startDate);
  formData.append('end_date', endDate);
  formData.append('url', targetURL);
  formData.append('image_change_interval', secondsBetweenImages);
  selectedLots.forEach(lot => formData.append('lots', lot));

  // Since we're not dealing with images in this update, there's no need to append image files to the FormData
  console.log(formData);
  // Send PUT request to Django backend (Make sure the endpoint is correct)
  fetch(API_URL + `ads/edit_without_images/${advert_id}/`, {  // <--- Updated endpoint
      method: 'PUT',
      headers: {
          'Authorization': `Token ${token}`,
      },
      body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log('Server response:', data);
    if(data && data.advert_id) {
        alert('Advertisement updated successfully!');
        navigate("/advertiser-dashboard");
    } else {
        alert('Error updating advertisement. Please check your input.');
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
        <p>{advert_id}</p>
      <HeroImage>
        <AdContainer>
          <SubHeading>Edit Advertisement</SubHeading>
          <form>
            <StyledLabel>
              Ad Name:
              <StyledInput
                type="text"
                value={adName}
                onChange={(e) => setAdName(e.target.value)}
              />
            </StyledLabel>
            
            <StyledLabel>
              Start Date:
              <StyledInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </StyledLabel>

            <StyledLabel>
              End Date:
              <StyledInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </StyledLabel>

            <StyledLabel>
              Target URL: (must include <strong><em>http://</em></strong> or <strong><em>https://</em></strong>)
              <StyledInput
                type="url"
                value={targetURL}
                onChange={(e) => setTargetURL(e.target.value)}
              />
            </StyledLabel>

            <StyledLabel>
              Seconds Between Images:
              <StyledInput
                type="number"
                value={secondsBetweenImages}
                onChange={(e) => setSecondsBetweenImages(e.target.value)}
              />
            </StyledLabel>

            <StyledLabel>
              Select Lots:
              <StyledTable>
                <tbody>
                {availableLots.map((lot, index) => (
                  <tr key={index}>
                    <td>
                    <StyledCheckbox
                      checked={selectedLots.includes(lot.name)}
                      onChange={(e) => handleCheckboxChange(lot.name, e.target.checked)} />
                    </td>
                    <td>{lot.name}</td>
                  </tr>
                ))}
                </tbody>
              </StyledTable>
            </StyledLabel>



            <StyledLabel>
                Top Banner Image 1:<br />
                <img src={currentImages.topBanner1} alt="Top Banner 1" width="600" />
                <StyledInput
                    id="topBanner1"
                    type="file"
                    accept=".jpg"
                    onChange={(e) => handleFileChange(e, advert_id, 'top', 1)}
                />
            </StyledLabel>
            <StyledInput

/>

            <StyledLabel>
                Top Banner Image 2:<br />
                <img src={currentImages.topBanner2} alt="Top Banner 2" width="600" />
                <StyledInput
                    id="topBanner2"
                    type="file"
                    accept=".jpg"
                    onChange={(e) => handleFileChange(e, advert_id, 'top', 2)}
                />
            </StyledLabel>

            <StyledLabel>
                Top Banner Image 3:<br />
                <img src={currentImages.topBanner3} alt="Top Banner 3" width="600" />
                <StyledInput
                    id="topBanner3"
                    type="file"
                    accept=".jpg"
                    onChange={(e) => handleFileChange(e, advert_id, 'top', 3)}
                />
            </StyledLabel>

            <StyledLabel>
                Side Banner Image 1:<br />
                <img src={currentImages.sideBanner1} alt="Side Banner 1" width="90" />
                <StyledInput
                    id="sideBanner1"
                    type="file"
                    accept=".jpg"
                    onChange={(e) => handleFileChange(e, advert_id, 'side', 1)}
                />
            </StyledLabel>

            <StyledLabel>
                Side Banner Image 2:<br />
                <img src={currentImages.sideBanner2} alt="Side Banner 2" width="90" />
                <StyledInput
                    id="sideBanner2"
                    type="file"
                    accept=".jpg"
                    onChange={(e) => handleFileChange(e, advert_id, 'side', 2)}
                />
            </StyledLabel>

            <StyledLabel>
                Side Banner Image 3:<br />
                <img src={currentImages.sideBanner3} alt="Side Banner 3" width="90" />
                <StyledInput
                    id="sideBanner3"
                    type="file"
                    accept=".jpg"
                    onChange={(e) => handleFileChange(e, advert_id, 'side', 3)}
                />
            </StyledLabel>




            <div style={{ textAlign: 'center' }}>
              <StyledSubmitButton type="button" onClick={handleUpdate}>
                Update Ad
              </StyledSubmitButton>
            </div>
          </form>
        </AdContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};

export default EditAd;