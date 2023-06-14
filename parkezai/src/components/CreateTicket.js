import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import heroImage from "../images/support-hero.jpg";
import Footer from "./Footer";

const HomeContainer = styled.div`
  background-image: url(${heroImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 70rem;
  display: block;
  justify-content: space-between;
`;
const FormContainer = styled.div`
  margin-top: 18vh;
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
  color: black;
  padding-left: 3em;
  padding-right: 3em;
  text-align: center;
  margin-bottom: 2em;
  padding-bottom: 2em;
`;
const TitleText = styled.p`
  font-size: 2rem;
  font-weight: 600;
  color: black;
`;

const CreateTicketForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const MyLabel = styled.label`
  display: inline-block;
  width: 400px;
`;

const CreateTicket = () => {
  const navigate = useNavigate();

  const handleCreateTicketSubmit = async (event) => {
    event.preventDefault();
    const subject = event.target.elements[0].value;
    const description = event.target.elements[1].value;
    const priority = event.target.elements[2].value;

    const response = await fetch("http://127.0.0.1:8000/tickets/create_ticket/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({subject, description, priority}),
    });
  
    if (response.ok) {
      navigate("/my-tickets");
    }
  };

  return (
    <>
      <HomeContainer>
        <FormContainer>
              <CreateTicketForm onSubmit={handleCreateTicketSubmit}>
              <TitleText>Create Ticket</TitleText>
              <MyLabel>
                Subject:<br />
                <input type="text" style={{minWidth:'350px'}} required />
              </MyLabel>
              <br />
              <MyLabel>
                Description<br />
                <textarea style={{minHeight: '200px', minWidth:'350px'}} required />
              </MyLabel>
              <br />
              <MyLabel>
                Priority:&emsp;
                <select required>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </MyLabel>
              <br />
              <button type="submit">Create Ticket</button>
            </CreateTicketForm>
        </FormContainer>
      </HomeContainer>
      <Footer />
    </>
  );
};

export default CreateTicket;