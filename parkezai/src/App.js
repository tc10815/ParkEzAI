import React, { useState } from 'react';
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
import Greeting from './components/Greeting';
import LoginFailed from './components/LoginFailed';
import OperatorDashboard from './components/OperatorDashboard';
import AdvertiserDashboard from './components/AdvertiserDashboard';
import AccountantDashboard from './components/AccountantDashboard';
import UpdateAccount from './components/UpdateAccount';
import ChangePassword from './components/ChangePassword';
import SuccessChange from './components/SuccessChange';
import ErrorChange from './components/ErrorChange';
import CreateStaffAccount from './components/CreateStaffAccount';
import SuccessCreate from './components/SuccessCreate';
import ErrorCreate from './components/ErrorCreate'; 

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 4rem); // Adjust this value based on the height of the navigation menu
`;

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navigation user={user} onLogout={handleLogout} />
      <ContentWrapper>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/find-parking" element={<FindParking />} />
          <Route path="/about" element={<About />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-staff-account" element={<CreateStaffAccount />} />
          <Route path="/success" element={<Success />} />
          <Route path="/success-change" element={<SuccessChange />} />
          <Route path="/error" element={<Error />} />
          <Route path="/error-change" element={<ErrorChange />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/greeting" element={<Greeting />} />
          <Route path="/login-failed" element={<LoginFailed />} />
          <Route path="/operator-dashboard" element={<OperatorDashboard />} />
          <Route path="/advertiser-dashboard" element={<AdvertiserDashboard />} />
          <Route path="/accountant-dashboard" element={<AccountantDashboard />} />
          <Route path="/account" element={<UpdateAccount />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/success-create" element={<SuccessCreate />} />
          <Route path="/error-create" element={<ErrorCreate />} />
        </Routes>
      </ContentWrapper>
    </Router>
  );
};

export default App;