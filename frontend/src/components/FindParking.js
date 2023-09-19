import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../images/park-hero.jpg';
import Footer from "./Footer";


const API_URL = process.env.REACT_APP_API_URL;

const FindParking = () => {
  const [lots, setLots] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const endpoint = new URL('lots/menu', API_URL);
    fetch(endpoint.toString())
      .then(response => response.json())
      .then(data => {
          data.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
          setLots(data);
          console.log(data)
        })
      .catch((error) => {
          console.error('Error fetching data:', error);
      });
  },[]);

  const handleMenuClick = (lots) => {
    navigate(`/lot/${lots.id}`);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
      <div style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', height: 'calc(100vh)', backgroundPosition: 'center' }}>
          <div className="container h-100">
              <div className="row justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 text-center">
                  <h1 className="text-white py-0 my-0 mb-5 shadow-text">Choose Lot to Find Parking</h1>
                  <div className="row justify-content-center">
                    <div className="col-12 col-lg-4"> 
                      <input
                          type="text"
                          value={search}
                          onChange={handleSearchChange}
                          placeholder="Search"
                          className="form-control my-0 py-0 bg-dark text-white custom-placeholder"
                                />
                      </div>
                    </div>
                      <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'start'}}>
                          <ul className="list-unstyled m-0 p-0">
                              {lots.filter(lots => 
                                  lots.name.toLowerCase().includes(search.toLowerCase()) ||
                                  lots.city.toLowerCase().includes(search.toLowerCase()) ||
                                  lots.state.toLowerCase().includes(search.toLowerCase()) ||
                                  lots.zip.toLowerCase().includes(search.toLowerCase())
                              ).map((lots, index) => (
                                  <li 
                                      key={index} 
                                      className="py-1 px-2 my-1 bg-dark text-white bg-hover-aqua" 
                                      onClick={() => handleMenuClick(lots)}
                                      style={{cursor: 'pointer', transition: 'background-color 0.3s'}}
                                  >
                                      {lots.name}, {lots.city} {lots.state}  {lots.zip}
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <p className="text-white font-weight-bold shadow-text mt-5">
                          <strong>Note:</strong> Monroe St, Coldwater is the only working demo parking lot at this time
                      </p>
                      <p className="text-white shadow-text">Other lots are to demonstrate lot search</p>
                  </div>
              </div>
          </div>
        <Footer />
    </div>
  );
};

export default FindParking;