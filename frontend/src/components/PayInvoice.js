import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../images/park-hero.jpg';
import theme from '../theme';
import Footer from "./Footer";
import { formatDateNoTime, formatAmount} from '../shared/tools';


const API_URL = process.env.REACT_APP_API_URL;

const HomeContainer = styled.div`
  background-color: white;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const PaymentDropdown = styled.select`
  margin-top: 1em;
  font-size: 110%;  
  padding: 0.5em;
  background-color: white;
`;


const SubHeading = styled.h2`
  font-size: 2rem;
  color: black;
  background-color: white; 
  width: fit-content;
  left-margin: auto;
  right-margin: auto;
`;

const FormatForm = styled.div`
  padding: 1em;
  background-color: white;
  font-size: 120%;
`;

const HeroImage = styled.div`
  width: 100%;
  min-height: 100vh;
  background-image: url(${heroImage});
  background-position-y: top;
  background-position-x: center;  background-size: cover;
  display: flex; // Set display to flex
  justify-content: center; // Center horizontally
  align-items: center; // Center vertically
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const PaymentButton = styled.button`
  margin-top: 1em;
  font-size: 110%;  
`;

const PayInvoice = () => {
  const navigate = useNavigate();
  const { invoice_type, id } = useParams();
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState([]);
  const [user, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [role, setRole] = useState('');
  const [currentInvoiceId, setCurrentInvoiceId] = useState('');
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [userPk, setUserPk] = useState(''); 
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
          const datapk = data.pk + '';
          setUserPk(datapk);
        })
        setCurrentInvoiceId(invoice_type + '-' + id);
      fetch(API_URL + 'billing/invoices/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
            setInvoices(data);
        });
        fetch(API_URL + 'billing/payment-methods/', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            })
            .then(response => response.json())
            .then(data => setPaymentMethods(data));          
        }
  }, []);
  
  useEffect(() => {
    const foundInvoice = invoices.find(invoice => invoice.invoice_id === currentInvoiceId);
    setCurrentInvoice(foundInvoice);
  }, [invoices, currentInvoiceId]);

  useEffect(() => {
    if (currentInvoice?.customer?.id && paymentMethods.length > 0) {
      const filteredMethods = paymentMethods.filter(method => method.customer === currentInvoice.customer.id);
      setFilteredPaymentMethods(filteredMethods);
    }
  }, [currentInvoice, paymentMethods]);


  const payBill = () => {
    console.log('paymentMethods');
    console.log(paymentMethods);// only show payments items in the array paymentMethods (item.customer) is equal to user.pk  
    console.log('currentInvoice');
    console.log(currentInvoice);// only show payments items in the array paymentMethods (item.customer) is equal to user.pk  

  }

  return (
    <HomeContainer>
      <HeroImage>
        <FormatForm>
        <SubHeading>Invoice Details</SubHeading>
          {currentInvoice ? (
            <>
              <p><strong>Invoice ID:</strong> {currentInvoice.invoice_id}</p>
              <p><strong>Role:</strong> {currentInvoice.customer?.role?.role_name || ''}</p>
              <p><strong>Email:</strong> {currentInvoice.customer?.email || ''}</p>
              <p><strong>Invoice Issued:</strong> {formatDateNoTime(currentInvoice.date_of_invoice)}</p>
              <p><strong>Status:</strong> {currentInvoice.has_been_paid ? 'Paid' : 'Unpaid'}</p>
              <p><strong>Payment Date:</strong> {currentInvoice.date_of_payment ? formatDateNoTime(currentInvoice.date_of_payment) : 'Unpaid'}</p>
              <p><strong>Invoice Total:</strong> {formatAmount(currentInvoice.payment_due)}</p>
              <p><strong>Description:</strong> {currentInvoice.description}</p>

              <PaymentDropdown>
                {filteredPaymentMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.credit_card_type} - {method.name}
                  </option>
                ))}
              </PaymentDropdown>
              <PaymentButton onClick={payBill}>Pay Invoice</PaymentButton>
            </>
          ) : (
            <p>Loading invoice details...</p>
          )}        
          </FormatForm>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};

export default PayInvoice;