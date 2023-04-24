import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import jwt_decode from "jwt-decode";
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

  useEffect(() => {
    const fetchAccounts = async () => {
      const response = await fetch("https://tomcookson.com/php2/manage_accounts.php", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Data from manage_accounts.php: ", data);
        if (data.success) {
          setAccounts(data.users);
        } else {
          console.error("Error fetching accounts: ", data.message);
        }
      } else {
        console.error("Error fetching accounts");
      }
    };
  
    fetchAccounts();
  }, []);
  

  const handleResetPassword = async (accountId) => {
    const new_password = prompt("Please enter the new password:");
    if (!new_password) return;
  
    const hashed_password = await fetch("https://tomcookson.com/php2/password_hash.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: new_password }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Error hashing password");
        }
      })
      .then((data) => {
        if (data.success) {
          return data.hashed_password;
        } else {
          throw new Error("Error hashing password: " + data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        return null;
      });
  
    if (!hashed_password) {
      alert("Error hashing password");
      return;
    }
  
    const response = await fetch("https://tomcookson.com/php2/reset_password.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account_id: accountId, new_password: hashed_password }),
    });
  
    if (response.ok) {
      alert("Password reset successfully.");
    } else {
      alert("Error resetting password.");
    }
  };
  

  const handleDeleteAccount = async (accountId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this account?");
    if (!confirmDelete) return;

    const response = await fetch("https://tomcookson.com/php2/delete_account.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account_id: accountId }),
    });

    if (response.ok) {
      setAccounts(accounts.filter((account) => account.id !== accountId));
      alert("Account deleted successfully.");
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
              <Th>ID</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <Td>{account.id}</Td>
                <Td>{account.email}</Td>
                <Td>{account.role_id}</Td>
                <Td>
                  <Button onClick={() => handleResetPassword(account.id)}>Reset Password</Button>
                  <Button onClick={() => handleDeleteAccount(account.id)}>Delete</Button>
                </Td>
              </tr>
            ))}
          </tbody>
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
