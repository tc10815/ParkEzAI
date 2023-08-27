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


const AddLotInvoice = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const [invoiceFormData, setInvoiceFormData] = useState({
    date_of_invoice: '',
    date_of_payment: '',
    customer: '',
    payment_method: '',
    has_been_paid: false,
    cameras: [],
    payment_due: 0,
    is_monthly_invoice: true,
    description: ''
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
      .then(data => setUser(data));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Post data to your API endpoint to add LotInvoice
    fetch(API_URL + 'billing/create-lot-invoice/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(invoiceFormData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('Error adding Lot Invoice');
        } else {
            alert('Lot Invoice successfully added')
            navigate("/invoices");  // Redirect to an appropriate page after adding invoice
        }
    });
  };

return (
    <HomeContainer>
      <HeroImage>
        <FormContainer>
          {user ? (
            <>
              <SubHeading>Create a Lot Invoice, {user.first_name}</SubHeading>
              <form onSubmit={handleSubmit}>
                <FormLabel>Date of Invoice</FormLabel>
                <FormInput 
                  type="date"
                  value={invoiceFormData.date_of_invoice}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, date_of_invoice: e.target.value })}
                />

                <FormLabel>Date of Payment (optional)</FormLabel>
                <FormInput 
                  type="date"
                  value={invoiceFormData.date_of_payment}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, date_of_payment: e.target.value })}
                />

                <FormLabel>Customer</FormLabel>
                <FormInput 
                  type="text"
                  placeholder="Customer ID or Name"
                  value={invoiceFormData.customer}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, customer: e.target.value })}
                />

                <FormLabel>Payment Method ID</FormLabel>
                <FormInput 
                  type="text"
                  placeholder="Payment Method ID"
                  value={invoiceFormData.payment_method}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, payment_method: e.target.value })}
                />

                <FormLabel>Has Been Paid?</FormLabel>
                <FormSelect
                  value={invoiceFormData.has_been_paid}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, has_been_paid: e.target.value === 'true' })}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </FormSelect>

                {/* You may need a more sophisticated input for cameras, but this is a simple one for now */}
                <FormLabel>Cameras (comma-separated IDs)</FormLabel>
                <FormInput 
                  type="text"
                  placeholder="Camera IDs"
                  value={invoiceFormData.cameras.join(',')}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, cameras: e.target.value.split(',') })}
                />

                <FormLabel>Payment Due (in pennies)</FormLabel>
                <FormInput 
                  type="number"
                  value={invoiceFormData.payment_due}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, payment_due: parseInt(e.target.value) })}
                />

                <FormLabel>Is Monthly Invoice?</FormLabel>
                <FormSelect
                  value={invoiceFormData.is_monthly_invoice}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, is_monthly_invoice: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </FormSelect>

                <FormLabel>Description (optional)</FormLabel>
                <FormTextarea
                  value={invoiceFormData.description}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, description: e.target.value })}
                ></FormTextarea>

                <button type="submit">Create Lot Invoice</button>
              </form>
            </>
          ) : (
            <SubHeading>Please Login to Create a Lot Invoice</SubHeading>
          )}
        </FormContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};

export default AddLotInvoice;