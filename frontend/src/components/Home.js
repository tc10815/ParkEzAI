import React from 'react';
import { Container, Row, Col, Image, ListGroup } from 'react-bootstrap';
import heroImage from '../images/home-hero_mod.jpg';
import Footer from "./Footer";

const Home = () => {
  return (
    <div>
      <div className="bg-dark text-white text-center py-5 position-relative d-md-block d-none" style={{ height: '70vh' }}>
        <Image src={heroImage} alt="Hero" fluid className="position-absolute top-0 start-0 w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'top' }} />
        <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-md-5">
          <div className="bg-dark p-4 d-md-inline-block">
            <h1 className="mb-3 p-1">Welcome to ParkEZ</h1>
            <h3 className="p-1">Solutions for Businesses and Drivers</h3>
          </div>
        </div>
      </div>
      <div className="bg-dark text-white text-center py-5 position-relative d-md-none" style={{ height: '70vh' }}>
        <Image src={heroImage} alt="Hero" fluid className="position-absolute top-0 start-0 w-100 h-100" style={{ objectFit: 'cover', objectPosition: 'top' }} />
        <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-md-5">
          <div className="bg-dark p-4 d-inline-block w-100">
            <h1 className="mb-3 p-1">Welcome to ParkEZ</h1>
            <h3 className="p-1">Solutions for Businesses and Drivers</h3>
          </div>
        </div>
      </div>
      <Container fluid className="bg-light py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} className="text-center mb-5">
              <p>
                ParkEZ is a state-of-the-art parking management platform designed to improve the way businesses and drivers approach parking. Our comprehensive solution offers real-time parking availability, advanced security features, and targeted advertising opportunities. With ParkEZ, drivers can effortlessly find and secure parking spots, while businesses can maximize their revenue and improve customer satisfaction. Join us in creating a better parking experience for drivers and businesses alike.
              </p>
            </Col>
            <Col md={4} className="mb-3">
              <h4>Benefits for Businesses</h4>
              <ListGroup className="custom-list-group" variant="flush">
                <ListGroup.Item>Maximize revenue by efficiently managing parking spaces</ListGroup.Item>
                <ListGroup.Item>Reduce illegal parking and provide parking availability to customers</ListGroup.Item>
                <ListGroup.Item>Real-time occupancy tracking and notifications for overparking</ListGroup.Item>
                <ListGroup.Item>Access to archived camera footage for security purposes</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4} className="mb-3">
              <h4>Benefits for People Parking</h4>
              <ListGroup className="custom-list-group" variant="flush">
                <ListGroup.Item>Find available parking spots easily and quickly</ListGroup.Item>
                <ListGroup.Item>Park in secure and video monitored locations</ListGroup.Item>
                <ListGroup.Item>Access real-time information on parking spot availability</ListGroup.Item>
                <ListGroup.Item>Receive personalized recommendations for nearby parking spots</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4} className="mb-3">
              <h4>Benefits for Advertisers</h4>
              <ListGroup className="custom-list-group" variant="flush">
                <ListGroup.Item>Advertise on our platform, targeting potential customers</ListGroup.Item>
                <ListGroup.Item>Reach users looking for parking spaces near your establishment</ListGroup.Item>
                <ListGroup.Item>Monitor ad success through impression statistics and click counts</ListGroup.Item>
                <ListGroup.Item>Target specific parking lots for increased visibility</ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
