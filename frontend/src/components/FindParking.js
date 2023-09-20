import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../images/park-hero.jpg';
import { Container, Row, Col, InputGroup, FormControl, ListGroup } from 'react-bootstrap';
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
        data.sort((a, b) => a.name.localeCompare(b.name));
        setLots(data);
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleMenuClick = (lots) => {
    navigate(`/lot/${lots.id}`);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', height: 'calc(100vh)', backgroundPosition: 'center' }}>
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center align-items-start-sm h-100">
          <Col xs={12} md={4} className="text-center">
            <h1 className="text-white bg-dark py-0 my-0 mb-0 shadow-text">Choose Lot to Find Parking</h1>

            <Row className="justify-content-center">
              <Col xs={12} md={8}>
                <InputGroup>
                  <FormControl
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search"
                    className="my-3 py-2 px-4 bg-dark text-white custom-placeholder"
                  />
                </InputGroup>
              </Col>
            </Row>

            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'start' }}>
              <ListGroup variant="flush" className="m-0 p-0">
                {lots.filter(lot =>
                  lot.name.toLowerCase().includes(search.toLowerCase()) ||
                  lot.city.toLowerCase().includes(search.toLowerCase()) ||
                  lot.state.toLowerCase().includes(search.toLowerCase()) ||
                  lot.zip.toLowerCase().includes(search.toLowerCase())
                ).map((lot, index) => (
                  <ListGroup.Item
                    key={index}
                    className="py-2 px-3 my-0 bg-dark text-white bg-hover-aqua"
                    onClick={() => handleMenuClick(lot)}
                    style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
                  >
                    {lot.name}, {lot.city} {lot.state}  {lot.zip}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>

            <p className="text-white font-weight-bold shadow-text mt-5">
              <strong>Note:</strong> Monroe St, Coldwater is the only working demo parking lot at this time
            </p>
            <p className="text-white shadow-text">Other lots are to demonstrate lot search</p>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};
export default FindParking;