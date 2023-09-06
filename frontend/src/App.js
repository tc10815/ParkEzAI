import React, {useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, useNavigate, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Billing from './components/Billing';
import FindParking from './components/FindParking';
import About from './components/About';
import HelpCenter from './components/HelpCenter';
import Login from './components/Login';
import Signup from './components/Signup';
import styled from 'styled-components';
import UsersList from './components/UsersList';
import Success from './components/Success';
import Error from './components/Error';
import LoginFailed from './components/LoginFailed';
import OperatorDashboard from './components/OperatorDashboard';
import AdvertiserDashboard from './components/AdvertiserDashboard';
import UpdateAccount from './components/UpdateAccount';
import ChangePassword from './components/ChangePassword';
import SuccessChange from './components/SuccessChange';
import ErrorChange from './components/ErrorChange';
import CreateStaffAccount from './components/CreateStaffAccount';
import SuccessCreate from './components/SuccessCreate';
import ErrorCreate from './components/ErrorCreate'; 
import ManageAccounts from './components/ManageAccounts';
import DeleteOwnAccount from './components/DeleteOwnAccount';
import InitiateAccount from './components/InitiateAccount';
import CreateTicket from './components/CreateTicket';
import MyTickets from './components/MyTickets';
import Tickets from './components/Tickets';
import LatestLotImage from './components/LatestLotImage';
import SpecificImage from './components/SpecificImage';
import OverparkingConfirm from './components/OverparkingConfirm';
import Archive from './components/Archive';
import CreateAd from './components/CreateAd';
import EditAd from './components/EditAd';
import Payments from './components/Payments';
import AddPaymentMethod from './components/AddPaymentMethod';
import AddLotInvoice from './components/AddLotInvoice';
import AddAdInvoice from './components/AddAdInvoice';
import AddInvoice from './components/AddInvoice';
import PayInvoice from './components/PayInvoice';
import PlateData from './components/PlateData';

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
  const ArchiveRedirect = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      navigate('/archive/default/default');
    }, [navigate]);
  
    return null; // This component doesn't render anything to the DOM
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
          <Route path="/login-failed" element={<LoginFailed />} />
          <Route path="/operator-dashboard" element={<OperatorDashboard />} />
          <Route path="/advertiser-dashboard" element={<AdvertiserDashboard />} />
          <Route path="/account" element={<UpdateAccount />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/success-create" element={<SuccessCreate />} />
          <Route path="/error-create" element={<ErrorCreate />} />
          <Route path="/manage-accounts" element={<ManageAccounts />} />
          <Route path="/delete-account" element={<DeleteOwnAccount />} />
          <Route path="/initiate-account" element={<InitiateAccount />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/create-ad" element={<CreateAd />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/coldwater" element={<LatestLotImage />} />
          <Route path="/lot/:lot" element={<LatestLotImage />} />
          <Route path="/edit-ad/:advert_id" element={<EditAd />} />
          <Route path="/image/:lot/:imageName" element={<SpecificImage />} />
          <Route path="/archive" element={<ArchiveRedirect />} />
          <Route path="/archive/:lot/:imageName" element={<Archive />} />
          <Route path="/overpark-confirm/:lot/:cam/:space/:starttime/:endtime" element={<OverparkingConfirm />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/payment-methods" element={<Payments />} />
          <Route path="/add-payment-method" element={<AddPaymentMethod />} />
          <Route path="/add-lot-invoice" element={<AddLotInvoice />} />
          <Route path="/add-ad-invoice" element={<AddAdInvoice />} />
          <Route path="/add-invoice" element={<AddInvoice />} />
          <Route path="/pay-invoice/:invoice_type/:id" element={<PayInvoice />} />
          <Route path="/plate-data" element={<PlateData />} />
        </Routes>
      </ContentWrapper>
    </Router>
  );
};

export default App;