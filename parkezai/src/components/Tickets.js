import React, { useState, useEffect } from "react";
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
  margin-top: 2.3em;
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

const TicketItemTag = styled.li`
  margin-bottom: 0rem;
`;

const Tickets = () => {
  const [tickets, setTickets] = useState([]);

  const fetchStaffTickets = async () => {
    const response = await fetch("http://127.0.0.1:8000/tickets/get_tickets", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setTickets(data);
    }
  };

  useEffect(() => {
    fetchStaffTickets();
  }, []);

  const handleDeleteTicket = async (ticketId) => {
    const response = await fetch(`http://127.0.0.1:8000/tickets/delete_ticket/${ticketId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      setTickets(tickets.filter((ticket) => ticket.ticket_id !== ticketId));
    } else {
      alert('Error deleting tickets')
    }
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    const requestBody = {
      ticket_id: ticketId,
      status,
    };

    const response = await fetch(`http://127.0.0.1:8000/tickets/update_ticket/${ticketId}/`, {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(requestBody),
  });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setTickets(
          tickets.map((ticket) =>
            ticket.ticket_id === ticketId
              ? { ...ticket, status }
              : ticket
          )
        );
      } 
    } else {
      alert("Error updating ticket:");
    }
  };

  const handleUpdateTicketPriority = async (ticketId, priority) => {
    const requestBody = {
      ticket_id: ticketId,
      priority,
    };

    const response = await fetch(`http://127.0.0.1:8000/tickets/update_ticket/${ticketId}/`, {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(requestBody),
  });
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setTickets(
          tickets.map((ticket) =>
            ticket.ticket_id === ticketId
              ? { ...ticket, priority }
              : ticket
          )
        );
      } else {
        console.error("Error updating ticket priority:", data.message, data.error);
      }
    } else {
      console.error("Error updating ticket priority:", response.statusText);
    }
  };


  return (
    <>
      <HomeContainer>
          <>
            <TitleText>My Tickets</TitleText>
            <TicketList>
              {tickets.map((ticket) => (
                <FormContainer>
                  <TicketItemTag key={ticket.ticket_id}>
                    <h3>{ticket.subject}</h3>
                    <p>{ticket.description}</p>
                    <div>
                      <label>Status: </label>
                      <select
                        defaultValue={ticket.status}
                        onChange={(e) =>
                          handleUpdateTicketStatus(ticket.ticket_id, e.target.value)
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
                          handleUpdateTicketPriority(ticket.ticket_id, e.target.value)
                        }
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                    <p>Category: {ticket.category}</p>
                    <p style={{ fontSize: '10px' }}>
                      <strong>Name:</strong> {ticket.user.first_name} {ticket.user.last_name}<br />
                      <strong>Email:</strong> {ticket.user.email}<br />
                      <strong>Created:</strong> {ticket.date_created}<br />
                      <strong>Updated:</strong> {ticket.date_updated}</p>            
                      <button onClick={() => handleDeleteTicket(ticket.ticket_id)}>
                      Delete Ticket
                    </button>

                  </TicketItemTag>
                </FormContainer>
              ))}
              <p style={{ backgroundColor: 'white', color: 'black', marginLeft: 'auto', marginRight: 'auto', padding: '2px', marginBottom: '2em', width: 'fit-content' }}>Note: Database is updated instantly for status and priority</p>
            </TicketList>
          </>
      </HomeContainer>

    </>
  );
};

export default Tickets;
