import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import heroImage from '../images/account-hero.jpg';
import Footer from "./Footer";

const API_URL = process.env.REACT_APP_API_URL;

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`
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

  const fetchAccounts = async () => {
    const response = await fetch(API_URL + "accounts/get-accounts-staff/", {
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

    const response = await fetch(API_URL + "accounts/change-password-staff/", { 
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
    const response = await fetch(API_URL + "accounts/delete-user/", {
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
      <Footer />
    </HomeContainer>
  );
};

export default ManageAccounts;
