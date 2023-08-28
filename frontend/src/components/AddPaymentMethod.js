import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
const FormContainer = styled.div`
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  color: black;
  padding: 3em;
  text-align: left; // change to left alignment for labels
  margin-bottom: 2em;
`;

const FormLabel = styled.label`
  display: block; 
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;
const SubHeading = styled.h2`
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  font-size: 2rem;
  width: fit-content;
  color: black;
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

const AddPaymentMethod = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [paymentFormData, setPaymentFormData] = useState({
    customer_id: '',
    credit_card_type: '',
    fake_credit_card_number: '',
    expiration_month: '',
    expiration_year: '',
    name: '',
    billing_address: '',
    zip_code: '',
    security_code: '',
  });

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
        if (["Lot Operator", "Advertiser"].includes(data.role_name)) {
          setPaymentFormData(prev => ({ ...prev, customer_id: data.pk }));
        }
        console.log('userdata');
        console.log(data);
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
    }
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    // Post data to your API endpoint to add payment method
    fetch(API_URL + 'billing/create-payment-method/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(paymentFormData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error adding payment method');
        } else {
            alert('Payment method successfully added')
            navigate("/payment-methods");
        }
    });
};



  return (
    <HomeContainer>
      <HeroImage>
        {console.log(customers)}
        <FormContainer>
          {user && customers ? (
            <>
              <SubHeading>Add a Payment Method, {user.first_name}</SubHeading>
              <form onSubmit={handleSubmit}>
                <FormLabel>Payment Method for Which Customer</FormLabel>
                {['Customer Support', 'Accountant', 'Lot Specialist', 'Advertising Specialist'].includes(user.role_name) && (
                  <FormSelect
                    value={paymentFormData.customer_id}
                    onChange={e => setPaymentFormData({ ...paymentFormData, customer_id: e.target.value })}
                  >
                    <option value=''>Select a Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} - {customer.email}
                      </option>
                    ))}
                  </FormSelect>
                )}
                <FormLabel>Card Type</FormLabel>
                <FormSelect
                  value={paymentFormData.credit_card_type}
                  onChange={e => setPaymentFormData({ ...paymentFormData, credit_card_type: e.target.value })}
                >
                  <option value="">Select Card Type</option>
                  {['VISA', 'MASTER', 'DISCOVER'].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </FormSelect>
                <FormLabel>Card Number (fake)</FormLabel>
                <FormInput 
                  type="text" 
                  placeholder="Card Number" 
                  value={paymentFormData.fake_credit_card_number}
                  onChange={e => setPaymentFormData({ ...paymentFormData, fake_credit_card_number: e.target.value })}
                  maxLength={16}
                />
                <FormLabel>Expiration Date</FormLabel>
                <FormSelect
                  value={paymentFormData.expiration_month}
                  onChange={e => setPaymentFormData({ ...paymentFormData, expiration_month: e.target.value })}
                >
                  <option value="">Select Expiry Month</option>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
                  ))}
                </FormSelect>
                <FormInput
                  type="number"
                  placeholder="Expiry Year (YYYY)"
                  value={paymentFormData.expiration_year}
                  onChange={e => setPaymentFormData({ ...paymentFormData, expiration_year: e.target.value })}
                />
                <FormLabel>Name and Address on Card</FormLabel>
                <FormInput
                  type="text"
                  placeholder="Name on Card"
                  value={paymentFormData.name}
                  onChange={e => setPaymentFormData({ ...paymentFormData, name: e.target.value })}
                />
                <FormTextarea
                  placeholder="Billing Address"
                  value={paymentFormData.billing_address}
                  onChange={e => setPaymentFormData({ ...paymentFormData, billing_address: e.target.value })}
                ></FormTextarea>
                <FormLabel>Zip Code</FormLabel>
                <FormInput
                  type="text"
                  placeholder="Zip Code"
                  value={paymentFormData.zip_code}
                  onChange={e => setPaymentFormData({ ...paymentFormData, zip_code: e.target.value })}
                  maxLength={6}
                />
                <FormLabel>Security Code</FormLabel>
                <FormInput
                  type="password"
                  placeholder="Security Code (CVV)"
                  value={paymentFormData.security_code}
                  onChange={e => setPaymentFormData({ ...paymentFormData, security_code: e.target.value })}
                  maxLength={4}
                />
                <button type="submit">Add Payment Method</button>
              </form>
            </>
          ) : (
            <SubHeading>Please Login to Add a Payment Method</SubHeading>
          )}
        </FormContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};
export default AddPaymentMethod;