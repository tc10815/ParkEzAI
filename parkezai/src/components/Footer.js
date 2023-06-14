import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
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

const Footer = () => {
  return (
    <FooterContainer>
      <FooterItem>ParkEz Inc.</FooterItem>
      <FooterItem>1234 Park Street, Suite 567</FooterItem>
      <FooterItem>Stamford, CT 06902</FooterItem>
      <FooterItem>Phone: (203) 123-4567</FooterItem>
      <FooterItem>Email: support@parkez.ai</FooterItem>
    </FooterContainer>
  );
};

export default Footer;