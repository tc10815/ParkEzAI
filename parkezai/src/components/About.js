import React from 'react';
import styled from 'styled-components';
import heroImage from '../images/about-hero.jpg';
import about1image from '../images/about-image1.jpg';
import about2image from '../images/about-image2.jpg';


const HomeContainer = styled.div`
  background-color: white;

  align-items: center;
  justify-content: center;
  height: 100%;
`;

const OverviewSection = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem auto;
  max-width: 80vw;
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

const Heading = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0; // Remove bottom margin
  color: white;
  width: fit-content;
  background-color: rgba(0, 0, 0, 1); // No transparency
  padding: 0.5rem 1rem;
  top:30vh;
`;

const HeroImage = styled.div`
  width: 100%;
  min-height: 30vh;
  background-image: url(${heroImage});
  background-position-y: top;
  background-size: cover;
  display: flex; // Set display to flex
  justify-content: center; // Center horizontally
  align-items: center; // Center vertically
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const WhiteCon = styled.div`
  background-color: white;
`;

const ContentSection = styled.section`
  max-width: 80vw;
  margin: 2rem auto;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Quote = styled.blockquote`
  font-size: 1.5rem;
  font-style: italic;
  margin: 2rem 0;
  text-align: center;
`;

const QuoteAuthor = styled.cite`
  font-size: 1.2rem;
  display: block;
  margin-top: 0.5rem;
`;

const Image = styled.img`
  width: 100%;
  max-width: 800px;
  height: auto;
  object-fit: cover;
  margin-bottom: 2rem;
`;

const PricingSection = styled.section`
  max-width: 80vw;
  margin: 2rem auto;
  text-align: center;
`;

const PricingTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const PricingTable = styled.table`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-collapse: collapse;
  font-size: 1.2rem;
`;

const PricingHeader = styled.thead`
  font-weight: bold;
`;

const PricingRow = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const PricingCell = styled.td`
  padding: 1rem;
  text-align: left;
`;



const About = () => {
  return (
    <HomeContainer>
      <WhiteCon>
      <HeroImage>
        <Heading>About ParkEz</Heading>
      </HeroImage>
      <ContentSection>
        <Subtitle>Our Story</Subtitle>
        <Paragraph>
          ParkEz was founded in 2021 by a group of parking lot owners and advertisers who saw an opportunity to revolutionize the parking industry. Our mission is to make parking simpler, more accessible, and more efficient for both parking lot owners and users, while also creating new advertising opportunities for businesses.
        </Paragraph>
        <Paragraph>
          Through our platform, we connect parking lot owners with advertisers, helping them increase revenue while providing a better experience for their customers. By leveraging cutting-edge technology, we create customized solutions for each of our clients, ensuring they get the most out of their partnership with us.
        </Paragraph>
        <Image src={about1image} alt="Team working together" />
        <Subtitle>Our Values</Subtitle>
        <Paragraph>
          At ParkEz, we prioritize innovation, collaboration, and customer satisfaction. We believe that by working together and constantly pushing the boundaries of what's possible, we can create a world where parking is no longer a source of stress but rather an opportunity for growth and connection.
        </Paragraph>
        <Subtitle>Our Team</Subtitle>
        <Paragraph>
          Our team is made up of industry experts with diverse backgrounds in technology, advertising, and parking management. We are dedicated to providing our clients with the highest level of service and support, ensuring their success and satisfaction.
        </Paragraph>
        <Image src={about2image} alt="Team members in a meeting" />
        <PricingSection>
        <PricingTitle>Pricing</PricingTitle>
        <PricingTable>
          <PricingHeader>
            <PricingRow>
              <PricingCell>Service</PricingCell>
              <PricingCell>Details</PricingCell>
              <PricingCell>Price</PricingCell>
            </PricingRow>
          </PricingHeader>
          <tbody>
            <PricingRow>
              <PricingCell>Parking Lot Owner</PricingCell>
              <PricingCell>
                <ul>
                  <li>Up to 50 spaces: $50/month</li>
                  <li>51-200 spaces: $150/month</li>
                  <li>201-500 spaces: $300/month</li>
                  <li>Additional camera: $50/month</li>
                  <li>License plate tracking: $100/month</li>
                </ul>
              </PricingCell>
              <PricingCell>$50+/month</PricingCell>
            </PricingRow>
            <PricingRow>
              <PricingCell>Advertiser</PricingCell>
              <PricingCell>Price per lot page advertised on</PricingCell>
              <PricingCell>$20/month per lot</PricingCell>
            </PricingRow>
          </tbody>
        </PricingTable>
      </PricingSection>
        <Subtitle>Testimonials</Subtitle>
        <Quote>
          "Working with ParkEz has completely transformed our parking operations. Their innovative solutions have helped us generate more revenue while improving the overall experience for our customers."
          <QuoteAuthor>Jane Smith, Parking Lot Owner</QuoteAuthor>
        </Quote>
        <Quote>
          "As an advertiser, partnering with ParkEz has been a game-changer. Their platform allows us to reach a wider audience and make a greater impact with our ads."
          <QuoteAuthor>John Doe, Advertiser</QuoteAuthor>
        </Quote>
      </ContentSection>


      <Footer>
        <FooterItem>ParkEz Inc.</FooterItem>
        <FooterItem>1234 Park Street, Suite 567</FooterItem>
        <FooterItem>Stamford, CT 06902</FooterItem>
        <FooterItem>Phone: (203) 123-4567</FooterItem>
        <FooterItem>Email: support@parkez.ai</FooterItem>
      </Footer>
      </WhiteCon>

    </HomeContainer>
  );
};

export default About;