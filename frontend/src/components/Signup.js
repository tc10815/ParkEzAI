import React, { useState } from 'react';
import heroImage from '../images/signup-hero.jpg';
import { Container, Row, Col, Form, Button, Modal, FormControl, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const role = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const firstName = e.target.elements[2].value;
    const lastName = e.target.elements[3].value;
    const companyName = e.target.elements[4].value;
    const companyAddress = e.target.elements[5].value;
    const state = e.target.elements[6].value;
    const city = e.target.elements[7].value;
    const zip = e.target.elements[8].value;
    const password = e.target.elements[9].value;
    const role_id = role === "parking_lot_owner" ? "Lot Operator" : "Advertiser";
    const response = await fetch(API_URL + "accounts/create_user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role_id, 
        email,
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        company_address: companyAddress,
        state,
        city,
        zip,
        password,
        is_uninitialized: false,
      }),
    });

    if (response.ok) {
      setModalMessage('New account has been successfully created.');
      setRedirectTo('/login');
      setShowModal(true);
    } else {
      setModalMessage(`Failed to create account.`);
      setRedirectTo(window.location.pathname);
      setShowModal(true);
    }
  };
  const handleClose = () => {
    setShowModal(false);
    navigate(redirectTo);
  };

  const resetAndPrepopulate = async () => {
    const response = await fetch(API_URL + "accounts/populate_db/", { method: "POST" });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
    } else {
      alert("Error resetting and prepopulating users");
    }
  };
  return (
    <div style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', height: '100vh', backgroundPosition: 'center' }}>
      <Container className="h-100">
        <Row className="align-items-center">
          <Col xs={12} className="text-center">
            <h1 className="text-white bg-dark py-3 my-4 my-md-5">Join us for parking lot monitoring or to advertise</h1>

            <Form onSubmit={handleSignUpSubmit} className="mx-auto">
              <Form.Group>
                <Form.Control as="select" required>
                  <option value="">Choose lot monitoring or advertising</option>
                  <option value="parking_lot_owner">Parking Lot Monitoring</option>
                  <option value="advertiser">Advertising</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Control type="email" placeholder="Email" required />
              </Form.Group>
              <Form.Group>
                <Form.Control type="text" placeholder="First Name" required />
              </Form.Group>
              <Form.Group>
                <Form.Control type="text" placeholder="Last Name" required />
              </Form.Group>
              <Form.Group>
                <Form.Control type="text" placeholder="Company Name" required />
              </Form.Group>
              <Form.Group>
                <Form.Control type="text" placeholder="Company Address" required />
              </Form.Group>
              <Form.Group>
                <Form.Control as="select" required>
                  <option value="">Select State...</option>
                  <option value="CT">CT</option>
                  <option value="NJ">NJ</option>
                  <option value="NY">NY</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Control type="text" placeholder="City" required />
              </Form.Group>
              <Form.Group>
                <Form.Control type="text" placeholder="ZIP" required />
              </Form.Group>
              <Form.Group>
                <Form.Control type="password" placeholder="Password" required />
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100">Sign Up</Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <footer className="bg-dark text-white text-center py-4">
        <h2>Demonstrations Features (not for production)</h2>
        <Button variant="dark" onClick={resetAndPrepopulate}>Reset Database with Demonstration Data</Button>
        <Link to="/users">
          <Button variant="dark">View All Users</Button>
        </Link>
        <p className="mb-1">ParkEz Inc.</p>
        <p className="mb-1">1234 Park Street, Suite 567</p>
        <p className="mb-1">Stamford, CT 06902</p>
        <p className="mb-1">Phone: (203) 123-4567</p>
        <p className="mb-1">Email: support@parkez.ai</p>
      </footer>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};
export default Signup;
