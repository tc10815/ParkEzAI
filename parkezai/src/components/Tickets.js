import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import styled from "styled-components";
import heroImage from "../images/support-hero.jpg";

const HomeContainer = styled.div`
  background-image: url(${heroImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: block;
  min-height: 100vh;
  justify-content: space-between;
`;

const MyButton = styled.button`
    margin-left: auto;
    margin-right: auto;
    width: fit-content;
    text-align: center;
    display: block;
    text-decortataion: none;
`;


const FormContainer = styled.div`
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  color: black;
  padding-left: 3em;
  padding-right: 3em;
  text-align: center;
  margin-bottom: 2em;
  padding-bottom: 0.5em;
`;

const TitleText = styled.p`
  margin-top: 3em;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  font-size: 2rem;
  font-weight: 600;
  padding: 0.5rem;
  color: black;
  background-color:white;
`;

const TicketList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const TicketItem = styled.li`
  margin-bottom: 0rem;
`;


const Tickets = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwt_decode(token);
        setUser(decodedToken.data);
      }
    };

    fetchUser();
  }, [location]);

  const fetchStaffTickets = async (role) => {
    const requestBody = {
      role,
    };

    const response = await fetch("https://tomcookson.com/php2/get_staff_tickets.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      if (user) {

        if ([3, 4, 5, 6].includes(user.role_id)) {
          fetchStaffTickets(user.role_id);
        } else {
          const requestBody = {
            user_id: user.user_id,
          };

          const response = await fetch("https://tomcookson.com/php2/get_tickets.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });


          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setTickets(data.tickets);
            }
          }
        }
      }
    };

    fetchTickets();
  }, [user]);

  const handleDeleteTicket = async (ticketId) => {
    const requestBody = {
        ticket_id: ticketId,
      };
      console.log('body request');
      console.log(requestBody);
      const response = await fetch("https://tomcookson.com/php2/delete_ticket.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTickets(tickets.filter((ticket) => ticket.ticket_id !== ticketId));
        }
      }
  };

  const handleUpdateTicket = async (ticketId, status, priority) => {
    const requestBody = {
      ticket_id: ticketId,
      status,
      priority,
    };
  
    const response = await fetch("https://tomcookson.com/php2/update_ticket.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setTickets(
          tickets.map((ticket) =>
            ticket.ticket_id === ticketId
              ? { ...ticket, status, priority }
              : ticket
          )
        );
      } else {
        console.error("Error updating ticket:", data.message, data.error);
      }
    } else {
      console.error("Error calling update_ticket.php:", response.statusText);
    }
  };
  

  return (
    <>
      <HomeContainer>
        {user && (
          <>
            <TitleText>My Tickets</TitleText>
            <TicketList>
              {tickets.map((ticket) => (
                <FormContainer>
            <TicketItem key={ticket.ticket_id}>
            <h3>{ticket.subject}</h3>
            <p>{ticket.description}</p>
            <div>
                <label>Status: </label>
                <select
                defaultValue={ticket.status}
                onChange={(e) =>
                    handleUpdateTicket(ticket.ticket_id, e.target.value, ticket.priority)
                }
                >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                </select>
            </div>
            <div>
                <label>Priority: </label>
                <select
                defaultValue={ticket.priority}
                onChange={(e) =>
                    handleUpdateTicket(ticket.ticket_id, ticket.status, e.target.value)
                }
                >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
                </select>
            </div>
            <p>Category: {ticket.category}</p>
            <p style={{fontSize:'10px'}}>
                <strong>Name:</strong> {ticket.first_name} {ticket.last_name}<br />
                <strong>Email:</strong> {ticket.email}<br />
                <strong>Created:</strong> {ticket.date_created}<br />
                <strong>Updated:</strong> {ticket.date_updated}</p>            <button onClick={() => handleDeleteTicket(ticket.ticket_id)}>
                Delete Ticket
            </button>

            </TicketItem>
            </FormContainer>
            ))}
            <p style={{backgroundColor:'white', color:'black', marginLeft:'auto', marginRight:'auto', padding:'2px',width:'fit-content'}}>Note: Database is updated instantly for status and priority</p>
            </TicketList>
            </>
          )}

      </HomeContainer>

    </>
  );
};

export default Tickets;
