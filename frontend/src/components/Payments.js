import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../images/accountantdbhero.jpg';
import Footer from './Footer';

const API_URL = process.env.REACT_APP_API_URL;

const HomeContainer = styled.div`
  background-color: black;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const PaymentButton = styled.button`
  margin-top: 1em;
  font-size: 110%;  
`;

const TableContainer = styled.div`
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  color: black;
  padding-left:3em;
  padding-right:3em;
  text-align: center;
  margin-bottom: 2em;
  padding-bottom: 2em;
`;

const SubHeading = styled.h2`
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  font-size: 2rem;
  width: fit-content;
  color: black;
`;

const MyTable = styled.table`
  margin-left: auto;
  margin-right: auto;
  width: fit-content;

  th, td {
    border: 1px solid black;
    padding: 8px;
  }

  tr {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
  }
`;

const HeroImage = styled.div`
  margin-top: 2.2em;
  width: 100%;
  background-image: url(${heroImage});
  background-position-y: top;
  background-size: cover;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  display: inline-block;
  font-size: 1.5rem;
  margin-bottom: 0rem;
`;

const Payments = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [customers, setCustomers] = useState([]);
  const location = useLocation();
  const [paymentMethods, setPaymentMethods] = useState([]);
    const findCustomerById = (customerId) => {
    return customers.find(customer => customer.id === customerId);
  };

  const goToAddPayments = () => {
    navigate("/add-payment-method");
  };
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    fetch(API_URL + `billing/delete-payment-method/${id}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`,
        },
    })
    .then(response => {
        if (response.status === 204) {  
            alert("Delete was successful!");
            window.location.reload();
        } else {
            return response.json();
        }
    })
    .then(data => {
        if (data && data.error) {
            alert(`Failed: ${data.error}`);
        }
    })
    .catch(error => {
        console.error("There was an error deleting the payment method:", error);
        alert("Failed: There was an error processing your request.");
    });
};

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(API_URL + 'accounts/users/me/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setUser(data);
          setRole(data.role_name);
          if(data.role_name != 'Lot Operator' && data.role_name != 'Advertiser'){
            fetch(API_URL + 'accounts/get-accounts-payment/', {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
              },
            })
            .then(response => response.json())
            .then(data => setCustomers(data));
          }
      });
      fetch(API_URL + 'billing/payment-methods/', {  // Updated endpoint
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => setPaymentMethods(data));
    }
  }, [location]);

  
  const renderTableForLotOperatorAndAdvertiser = () => (
    <MyTable>
      <thead>
        <tr>
          <th>Credit Card Type</th>
          <th>Expiration Month</th>
          <th>Expiration Year</th>
          <th>Name</th>
          <th>Billing Address</th>
          <th>Zip Code</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paymentMethods.map(method => (
          <tr key={method.name}>
            <td>{method.credit_card_type}</td>
            <td>{method.expiration_month}</td>
            <td>{method.expiration_year}</td>
            <td>{method.name}</td>
            <td>{method.billing_address}</td>
            <td>{method.zip_code}</td>
            <td><button onClick={() => handleDelete(method.id)}>Delete</button></td>
          </tr>
        ))}
      </tbody>
    </MyTable>
  );

  const renderTableForOtherRoles = () => {
    let filteredMethods = paymentMethods;
  
    if (role === 'Lot Specialist') {
      filteredMethods = paymentMethods.filter(method => {
        const customer = findCustomerById(method.customer);
        return customer?.role?.role_name === 'Lot Operator';
      });
    } else if (role === 'Advertising Specialist') {
      filteredMethods = paymentMethods.filter(method => {
        const customer = findCustomerById(method.customer);
        return customer?.role?.role_name === 'Advertiser';
      });
    }
  
    return (
      <MyTable>
          <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Credit Card Type</th>
            <th>Expiration Month</th>
            <th>Expiration Year</th>
            <th>Name</th>
            <th>Billing Address</th>
            <th>Zip Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredMethods.map(method => {
            const customer = findCustomerById(method.customer);
            return (
              <tr key={method.name}>
                <td>{customer?.email || ""}</td>
                <td>{customer?.role?.role_name || ""}</td>
                <td>{method.credit_card_type}</td>
                <td>{method.expiration_month}</td>
                <td>{method.expiration_year}</td>
                <td>{method.name}</td>
                <td>{method.billing_address}</td>
                <td>{method.zip_code}</td>
                <td><button onClick={() => handleDelete(method.id)}>Delete</button></td>
              </tr>
            );
          })}
        </tbody>
      </MyTable>
    );
  };
  

  return (
    <HomeContainer>
      <HeroImage>
        <TableContainer>
          {user ? (
            <SubHeading>Welcome back, {user.first_name}</SubHeading>
          ) : (
            <SubHeading>Welcome back</SubHeading>
          )}
          <p><strong><br />Payment Methods</strong></p>
          {role === 'Lot Operator' || role === 'Advertiser' ? renderTableForLotOperatorAndAdvertiser() : renderTableForOtherRoles()}
          <PaymentButton onClick={goToAddPayments}>Add New Payment Method</PaymentButton>
        </TableContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};

export default Payments;
