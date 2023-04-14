import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import FindParking from './components/FindParking';
import About from './components/About';
import HelpCenter from './components/HelpCenter';
import Login from './components/Login';
import Signup from './components/Signup';
import Navigation from './components/Navigation';




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
