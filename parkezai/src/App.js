import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import FindParking from './components/FindParking';
import About from './components/About';
import HelpCenter from './components/HelpCenter';
import Login from './components/Login';
import Signup from './components/Signup';
import styled from 'styled-components';
import UsersList from './components/UsersList';
import Success from './components/Success';
import Error from './components/Error';


const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 4rem); // Adjust this value based on the height of the navigation menu
`;

const App = () => {
  return (
    <Router>
      <Navigation />
      <ContentWrapper>
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/find-parking" element={<FindParking/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/help-center" element={<HelpCenter/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/success" element={<Success/>} />
          <Route path="/error" element={<Error/>} />
          <Route path="/users" element={<UsersList />} />
        </Routes>
      </ContentWrapper>
    </Router>
  );
};

export default App;
