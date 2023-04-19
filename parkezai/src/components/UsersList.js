import React, { useState, useEffect } from 'react';
import styled from 'styled-components';


const H1Header = styled.h1`
    text-align: center;
    color: white;
`;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color:white;
  border-style: solid;
  border-color: white;
`;

const TableHeader = styled.th`
  padding: 1rem;
  border: 1px solid black;
  border-style: solid;
  border-color: white;
`;

const TableCell = styled.td`
  padding: 1rem;
  border: 1px solid black;
  border-style: solid;
  border-color: white;
`;

const ContentWrapper = styled.div`
  margin: auto;
  width: 75vw;
  padding: 10px;
  color:white;
`;

const Para = styled.div`
  color:white;
  text-align: center;
`;

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("https://tomcookson.com/parkezaiphp/get_users.php", { method: "GET" });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        console.log(data);
      } else {
        alert("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <ContentWrapper>
      <H1Header>All Users</H1Header>
      <UsersTable>
        <thead>
          <tr>
            <TableHeader>ID</TableHeader>
            <TableHeader>Role</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>First Name</TableHeader>
            <TableHeader>Last Name</TableHeader>
            <TableHeader>Company Name</TableHeader>
            <TableHeader>Company Address</TableHeader>
            <TableHeader>State</TableHeader>
            <TableHeader>City</TableHeader>
            <TableHeader>ZIP</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.role_id === "1" ? "Lot Operator" : user.role_id === "2" ? "Advertiser" : "Unknown"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.company_name}</TableCell>
                <TableCell>{user.company_address}</TableCell>
                <TableCell>{user.state}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{user.zip}</TableCell>
            </tr>
          ))}
        </tbody>
      </UsersTable><br />
      <Para><strong>Demonstration Accounts</strong></Para>
      <Para><strong>Type:</strong> Lot Operator<br /><strong>Email:</strong> funky.chicken@example.com<br /><strong>Password:</strong> funky123</Para><br />
      <Para><strong>Type:</strong> Advertiser<br /> <strong>Email:</strong> jolly.giraffe@example.com<br /><strong>Password:</strong> jolly123</Para>
    </ContentWrapper>

  );
};

export default UsersList;
