import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
// import jwt_decode from "jwt-decode";
import styled from "styled-components";
import heroImage from "../images/support-hero.jpg";


const HomeContainer = styled.div`
  background-image: url(${heroImage});
  background-size: cover;
  background-attachment:fixed;
  background-position: center;
  background-repeat: no-repeat;
  display: block;
  justify-content: space-between;
`;

const MyButton = styled.button`
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 1.5em;
      width: fit-content;
      text-align: center;
      display: block;
      text-decortataion: none;
      
`;


const FormContainer = styled.div`
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  width: 20rem;
  color: black;
  padding-left: 2em;
  padding-right: 2em;
  padding-top 1em;
  padding-bottom: 2em;
  text-align: center;
  margin-bottom: 2em;
`;

const TitleText = styled.p`
  margin-top: 2em;
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

const MyTickets = () => {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        // const decodedToken = jwt_decode(token);
        // setUser(decodedToken.data);
      }
    };

    fetchUser();
  }, [location]);

  useEffect(() => {
    const fetchTickets = async () => {
      if (user) {
        const requestBody = {
          user_id: user.user_id,
        };

        const response = await fetch("http://gruevy.com/ezphp/get_tickets.php", {
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
            console.log(data.tickets);
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
    const response = await fetch("http://gruevy.com/ezphp/delete_ticket.php", {
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
                    <p>Status: {ticket.status}</p>
                    <p>Priority: {ticket.priority}</p>
                    <p>Category: {ticket.category}</p>
                    <p style={{fontSize:'10px'}}><strong>Created:</strong> {ticket.date_created}<br />
                    <strong>Updated:</strong> {ticket.date_updated}</p>
                    <button onClick={() => handleDeleteTicket(ticket.ticket_id)}>Delete Ticket</button>
                  </TicketItem>
                  </FormContainer>

                ))}
                <Link to="/create-ticket">
                  <MyButton type="button">Create Ticket</MyButton>
                </Link>
              </TicketList>

            </>
          )}

      </HomeContainer>

    </>
  );
};

export default MyTickets;
