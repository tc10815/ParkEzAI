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

const BigButton = styled.button`
  margin-top: 1em;
  font-size: 110%;  
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

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so +1 and pad with a leading 0 if necessary
  const day = String(today.getDate()).padStart(2, '0'); // Pad with a leading 0 if necessary
  return `${year}-${month}-${day}`;
}

const AddLotInvoice = () => {
  const [user, setUser] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]); // New state for payment methods
  const [customers, setCustomers] = useState([]);
  const [lotOperators, setLotOperators] = useState([]); // New state for lot operators
  const navigate = useNavigate();
  
  const [invoiceFormData, setInvoiceFormData] = useState({
    date_of_invoice: getToday(),
    date_of_payment: null,
    customer: null,  
    payment_method: "",  
    has_been_paid: false,
    cameras: [],
    payment_due: 0,
    is_monthly_invoice: false,
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
      .then(data => {
        setUser(data);
        fetch(API_URL + 'accounts/get-accounts-payment/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        })
        .then(response => response.json())
        .then(data => setCustomers(data));
      })
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Fetching payment methods
      fetch(API_URL + 'billing/payment-methods/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('PaymentData');
        console.log(data);
        setPaymentMethods(data);

        //paymentMethods.customer.email 
    });
      // Fetching lot operators
      fetch(API_URL + 'accounts/get-accounts-payment/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        const operators = data.filter(u => u.role.role_name === "Lot Operator");
        console.log('customer data')
        console.log(data);
        // operators.email
        setLotOperators(operators);
        if (operators.length > 0 && !invoiceFormData.customer) {
          setInvoiceFormData(prev => ({ ...prev, customer: operators[0].id }));
        }
      });
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
            navigate("/billing");
        }
    });
  };
  const getFilteredPaymentMethods = () => {
    if (invoiceFormData.customer) {
      const selectedCustomerId = parseInt(invoiceFormData.customer);
      return paymentMethods.filter(method => method.customer === selectedCustomerId);
    }
    return [];
  };

return (
    <HomeContainer>
      <HeroImage>
        <FormContainer>
          {user ? (
            <>
              <SubHeading>Create a Lot Invoice</SubHeading>
              <form onSubmit={handleSubmit}>
                <FormLabel>Date of Invoice</FormLabel>
                <FormInput 
                  type="date"
                  value={invoiceFormData.date_of_invoice}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, date_of_invoice: e.target.value })}
                />

                <FormLabel>Date of Payment (optional, leave blank if unpaid)</FormLabel>
                <FormInput 
                  type="date"
                  value={invoiceFormData.date_of_payment}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, date_of_payment: e.target.value })}
                />

                <FormLabel>Customer</FormLabel>
                <FormSelect
                  value={invoiceFormData.customer}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, customer: e.target.value })}
                >
                  {lotOperators.map(operator => (
                    <option key={operator.id} value={operator.id}>
                      {operator.first_name} {operator.last_name} ({operator.email})
                    </option>
                  ))}
                </FormSelect>

                <FormLabel>Payment Method</FormLabel>
                <FormSelect
                    value={invoiceFormData.payment_method}
                    onChange={e => setInvoiceFormData({ ...invoiceFormData, payment_method: e.target.value })}
                >
                    <option value="">Select a payment method</option>
                    {getFilteredPaymentMethods().map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name} ({method.credit_card_type} ending in {method.name.slice(-4)})
                      </option>
                    ))}
                </FormSelect>

                <FormLabel>Has Been Paid?</FormLabel>
                <FormSelect
                  value={invoiceFormData.has_been_paid}
                  onChange={e => setInvoiceFormData({ ...invoiceFormData, has_been_paid: e.target.value === 'true' })}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </FormSelect>

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

                <BigButton type="submit">Create Lot Invoice</BigButton>
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