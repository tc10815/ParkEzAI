import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../images/accountantdbhero.jpg';
import Footer from './Footer';
import { formatDateNoTime, formatAmount} from '../shared/tools';

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
    padding: 8px;  // Optional: Add some padding for a better appearance
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

const Billing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [invoices, setInvoices] = useState([]);
  const [role, setRole] = useState('');
  const goToPaymentMethods = () => {
    navigate("/payment-methods");
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
        })
      fetch(API_URL + 'billing/invoices/', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => setInvoices(data));
    }
  }, [location]);

  const deleteInvoice = (id) => {
    console.log('delete clicked');
    const token = localStorage.getItem("token");
    let deleteUrl = '';

    if (id.substring(0,2) === 'ad') {
      deleteUrl = `${API_URL}billing/delete-ad-invoice/${id.substring(3)}/`;
    } else if (id.substring(0,2) === 'op') { //"Lot Operator" or "Advertiser"
      deleteUrl = `${API_URL}billing/delete-lot-invoice/${id.substring(3)}/`;
    }
    console.log(deleteUrl);
    fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })
    .then(response => {
      if (response.status === 204) {
        alert('Invoice deleted successfully!');
        setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.invoice_id !== id));
      } else {
        alert('Error deleting invoice!');
      }
    });
  };


  return (
    <HomeContainer>
      <HeroImage>
        <TableContainer>
          {user ? (
            <>
              <SubHeading>Welcome back, {user ? user.first_name : ''}</SubHeading>
            </>
          ) : (
            <SubHeading>Welcome back</SubHeading>
          )}
          <p><strong><br />Invoices</strong></p>
          <MyTable>
            <thead>
              <tr>
                {console.log(role)}
                <th>Invoice ID</th>
                <th>Role</th>
                <th>Email</th>
                <th>Invoice Issued</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
                <th>Invoice Total</th>
                {role !== "Lot Operator" && role !== "Advertiser" ? (
                        <th>
                          Action
                        </th>
                      ) : (
                        <br />
                      )}
                {console.log(invoices)}
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <>
                 <tr key={invoice.invoice_id}>
                   <td>{invoice.invoice_id}</td>
                   <td>{invoice.customer?.role?.role_name || ''}</td>
                   <td>{invoice.customer?.email || ''}</td>
                   <td>{formatDateNoTime(invoice.date_of_invoice)}</td>
                    <td>{invoice.has_been_paid ? 'Paid' : 'Unpaid'}</td>
                    <td>{invoice.date_of_payment ? formatDateNoTime(invoice.date_of_payment) : 'Unpaid'}</td>
                    <td>{invoice.payment_method_name}</td>
                    <td>{formatAmount(invoice.payment_due)}</td>
                      {role !== "Lot Operator" && role !== "Advertiser" ? (
                    <td>
                       <button onClick={() => deleteInvoice(invoice.invoice_id)}>Delete</button>
                    </td>
                      ) : (
                        <br />
                      )}
                  </tr>
                  {invoice.description && role !== "Lot Operator" && role !== "Advertiser" ? (
                    <tr>
                      <td style={{textAlign:'left'}} colSpan="9"><strong>Description:</strong> {invoice.description}</td>
                    </tr>
                     ) : (
                    <tr>
                      <td style={{textAlign:'left'}} colSpan="8"><strong>Description:</strong> {invoice.description}</td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </MyTable>
          <PaymentButton onClick={goToPaymentMethods}>View Payment Methods</PaymentButton>
        </TableContainer>
      </HeroImage>
      <Footer />
    </HomeContainer>
  );
};
export default Billing;
