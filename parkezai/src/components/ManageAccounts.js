import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
// import jwt_decode from "jwt-decode";
import styled from 'styled-components';
import heroImage from '../images/account-hero.jpg';

const HomeContainer = styled.div`
  background-image: url(${heroImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const FormContainer = styled.div`
  margin-top: 18vh;
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  color: black;
  padding-left:3em;
  padding-right:3em;
  text-align: center;
  margin-bottom: 2em;
  padding-bottom: 2em;
`;

const TitleText = styled.p`
  font-size: 2rem;
  font-weight: 600;
  color:black;
`;

const Footer = styled.footer`
  background-color: black;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FooterItem = styled.p`
  margin: 0.2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid black;
  padding: 0.5rem;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid black;
  padding: 0.5rem;
  text-align: left;
`;

const Button = styled.button`
  margin-left: 1rem;
`;

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();


  const fetchAccounts = async () => {
    const response = await fetch("http://127.0.0.1:8000/accounts/get-accounts-staff/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setAccounts(data);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);  

  const handleResetPassword = async (accountEmail) => {
    const new_password = prompt("Please enter the new password:");
    
    if (!new_password) return;
    
    const requestBody = {
      email: accountEmail,
      new_password
    };

    const response = await fetch("http://127.0.0.1:8000/accounts/change-password-staff/", { 
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        alert("Password reset successfully.");
      } else {
        alert("Error resetting password.");
      }
    } else {
      alert("Error resetting password.");
    }
  };
  
  

  const handleDeleteAccount = async (accountEmail) => {
    const email = accountEmail;
    const confirmDelete = window.confirm("Are you sure you want to delete this account?");
    if (!confirmDelete) return;
    const response = await fetch("http://127.0.0.1:8000/accounts/delete-user/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ email }),
      });
    if (response.ok) {
      const data = await response;
      alert("Account deleted successfully.");
      fetchAccounts();
    } else {
      alert("Error deleting account.");
    }
  };

  return (
    <HomeContainer>
      <FormContainer>
        <TitleText>Manage Accounts</TitleText>
        <Table>
          <thead>
            <tr>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          {accounts
          .map((account) => (
            <tr key={account.email}>
                <Td>{account.email}</Td>
                <Td>{account.role.role_name}</Td>
                <Td>
                  <Button onClick={() => handleResetPassword(account.email)}>Reset Password</Button>
                  <Button onClick={() => handleDeleteAccount(account.email)}>Delete</Button>
                </Td>
            </tr>
          ))}
        </Table>
      </FormContainer>
      <Footer>
      <FooterItem>ParkEz Inc.</FooterItem>
        <FooterItem>1234 Park Street, Suite 567</FooterItem>
        <FooterItem>Stamford, CT 06902</FooterItem>
        <FooterItem>Phone: (203) 123-4567</FooterItem>
        <FooterItem>Email: support@parkez.ai</FooterItem>
      </Footer>
    </HomeContainer>
  );
};

export default ManageAccounts;
