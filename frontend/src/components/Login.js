import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table, Modal} from 'react-bootstrap';
import heroImage from '../images/signin-hero.jpg';

const API_URL = process.env.REACT_APP_API_URL;

const resetAndPrepopulate = async () => {
  const response = await fetch(API_URL + 'accounts/populate_db/', { method: "POST" });

  if (response.ok) {
      const data = await response.json();
      alert(data.message);
  } else {
      alert("Error resetting and prepopulating users");
  }
};


const handleCellClick = (email, password, setEmail, setPassword) => {
  setEmail(email);
  setPassword(password);
};

const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [redirectTo, setRedirectTo] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleClose = () => {
    setShowModal(false);
    navigate(redirectTo);
  };
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const password = e.target.elements[1].value;

    const response = await fetch(API_URL + 'dj-rest-auth/login/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }); 
    if (response.ok) {
      const { key } = await response.json();
      localStorage.setItem("token", key);
      if (typeof key !== "undefined") {
        const response = await fetch(API_URL + 'accounts/users/me/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
          },
        });
        const user = await response.json();
        window.dispatchEvent(new Event('login'));
        if (user.is_uninitialized == false){
          switch(user.role_name){
            case 'Lot Operator':
              navigate("/operator-dashboard"); 
              break;
            case 'Advertiser':
              navigate("/advertiser-dashboard"); 
              break;
            case 'Customer Support':
              navigate("/tickets"); 
              break;
            case 'Lot Specialist':
              navigate("/tickets"); 
              break;
            case 'Advertising Specialist':
              navigate("/tickets"); 
              break;
            case 'Accountant':
              navigate("/billing"); 
              break;
            default:
              alert('Default');
              navigate("/account"); 
              break;
          }
        } else {
            navigate("/initiate-account"); 
        }
  
      } else {
        setModalMessage(`Incorrect username or password.`);
        setRedirectTo(window.location.pathname);
        setShowModal(true);      }
    } else {
      setModalMessage(`Incorrect username or password.`);
      setRedirectTo(window.location.pathname);
      setShowModal(true);    }

  };


  return (
    <div>
  <Container fluid className="d-flex flex-column vh-100" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover'}}>
      <Row className="align-items-start justify-content-center pt-5 mt-5" style={{ flex: 1 }}>
        <Col xs={12} md={5} className="text-center">
          <div className="text-white bg-dark  py-3 px-3">
          <h1>Welcome back</h1>
          <h3>Please sign in</h3>
          <Form onSubmit={handleSignInSubmit} className="text-center pb-3">
            <Form.Group className="my-2">
              <Form.Control type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="my-2">
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </Form.Group>
            <Button className="login-border mt-3" type="submit" variant="dark">Login</Button>
            <div className="text-white mt-3">Forgot my password</div>
          </Form>
        <Table responsive bordered className="text-white dark-table mt-4">
        <thead>
          <tr>
          <td colSpan="3"><strong>Demo Logins <br /></strong> (not for production)<br /><br />click login  name to fill in credentials</td>
          </tr>
          <tr>
            <td><strong>Role</strong></td>
            <td><strong>Email</strong></td>
            <td><strong>Password</strong></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td  className="clickable " onClick={() => handleCellClick('funky.chicken@example.com', 'funky123', setEmail, setPassword)}>Lot Operator</td>
            <td  className="clickable" onClick={() => handleCellClick('funky.chicken@example.com', 'funky123', setEmail, setPassword)}>funky.chicken@example.com</td>
            <td  className="clickable" onClick={() => handleCellClick('funky.chicken@example.com', 'funky123', setEmail, setPassword)}>funky123</td>
          </tr>
          <tr>
            <td  className="clickable" onClick={() => handleCellClick('jolly.giraffe@example.com', 'jolly123', setEmail, setPassword)}>Advertiser</td>
            <td  className="clickable" onClick={() => handleCellClick('jolly.giraffe@example.com', 'jolly123', setEmail, setPassword)}>jolly.giraffe@example.com</td>
            <td  className="clickable" onClick={() => handleCellClick('jolly.giraffe@example.com', 'jolly123', setEmail, setPassword)}>jolly123</td>
          </tr>
          <tr>
            <td  className="clickable" onClick={() => handleCellClick('curious.cat@parkez.com', 'curious123', setEmail, setPassword)}>Customer Support</td>
            <td  className="clickable" onClick={() => handleCellClick('curious.cat@parkez.com', 'curious123', setEmail, setPassword)}>curious.cat@parkez.com</td>
            <td  className="clickable" onClick={() => handleCellClick('curious.cat@parkez.com', 'curious123', setEmail, setPassword)}>curious123</td>
          </tr>
          <tr>
            <td  className="clickable" onClick={() => handleCellClick('chatty.penguin@parkez.com', 'chatty123', setEmail, setPassword)}>Lot Specialist</td>
            <td  className="clickable" onClick={() => handleCellClick('chatty.penguin@parkez.com', 'chatty123', setEmail, setPassword)}>chatty.penguin@parkez.com</td>
            <td  className="clickable" onClick={() => handleCellClick('chatty.penguin@parkez.com', 'chatty123', setEmail, setPassword)}>chatty123</td>
          </tr>
          <tr>
            <td  className="clickable" onClick={() => handleCellClick('happy.hippo@parkez.com', 'happy123', setEmail, setPassword)}>Advertising Specialist</td>
            <td  className="clickable" onClick={() => handleCellClick('happy.hippo@parkez.com', 'happy123', setEmail, setPassword)}>happy.hippo@parkez.com</td>
            <td  className="clickable" onClick={() => handleCellClick('happy.hippo@parkez.com', 'happy123', setEmail, setPassword)}>happy123</td>
          </tr>
          <tr>
            <td  className="clickable" onClick={() => handleCellClick('lively.lemur@parkez.com', 'lively123', setEmail, setPassword)}>Accountant	</td>
            <td  className="clickable" onClick={() => handleCellClick('lively.lemur@parkez.com', 'lively123', setEmail, setPassword)}>lively.lemur@parkez.com</td>
            <td  className="clickable" onClick={() => handleCellClick('lively.lemur@parkez.com', 'lively123', setEmail, setPassword)}>lively123</td>
          </tr>
        </tbody>
        </Table>
        </div>
        </Col>
      </Row>
    </Container>
    <div className="d-none d-sm-block">
    <footer  className="bg-dark text-white text-center py-4 my-footer">          
          <p className="mb-1">ParkEz Inc.</p>
          <p className="mb-1">1234 Park Street, Suite 567</p>
          <p className="mb-1">Stamford, CT 06902</p>
          <p className="mb-1">Phone: (203) 123-4567</p>
          <p className="mb-1">Email: support@parkez.ai</p>
          <br />
      <br />
      <button id="reset-and-prepopulate" type="button" onClick={resetAndPrepopulate}>Reset Database with Demonstration Data</button>
      <br />
      <Link to="/users">
          <button type="button">View All Users</button>
        </Link>
    </footer>
    </div>
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

export default Login;
