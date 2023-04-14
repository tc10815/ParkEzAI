import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Home from './components/Home';
import FindParking from './components/FindParking';
import About from './components/About';
import HelpCenter from './components/HelpCenter';
import Login from './components/Login';
import Signup from './components/Signup';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/find-parking">Find Parking</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/help-center">Help</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/find-parking" element={<FindParking/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/help-center" element={<HelpCenter/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
