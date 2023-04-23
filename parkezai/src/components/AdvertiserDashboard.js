import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import styled from 'styled-components';
import heroImage from '../images/advertiserdbhero.jpg';
import placeholderImage1 from '../images/ad1-jg.jpg';
import placeholderImage2 from '../images/ad2-jg.jpg';
import placeholderImage3 from '../images/ad3-jg.jpg';

const AdCard = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: inline-block;
  margin: 1rem;
  padding: 1rem;
  text-align: center;
  width: 280px;
`;

const AdImage = styled.img`
  width: 100%;
  height: auto;
`;

const HomeContainer = styled.div`
  background-color: black;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const AdContainer = styled.div`
  background-color: white;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  color: black;
  padding-left:3em;
  padding-right:3em;
  text-align: center;
  margin-bottom: 2em;
  padding-bottom: 2em;
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

const SubHeading = styled.h2`
  margin-left: auto;
  margin-right: auto;
  padding-top: 2rem;
  font-size: 2rem;
  width: fit-content;
  color: black;
`;

const MyTable = styled.table`
  margin-left: auto;
  margin-right: auto;
  width: fit-content;
`;

const HeroImage = styled.div`
  margin-top: 2.2em;
  width: 100%;
  background-image: url(${heroImage});
  background-position-y: top;
  background-size: cover;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  display: inline-block;
  font-size: 1.5rem;
  margin-bottom: 0rem;
`;

const AdvertiserDashboard = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [ad1, setAd1] = useState({
    imageUrl: placeholderImage1,
    title: "Top Off Your Look with High Heads!",
    description: "Looking for the perfect hat to make a statement? At High Heads, we have hats so unique, you'll feel like a jolly giraffe! Visit our store today and find the perfect headpiece to elevate your style.",
    impressions: 3000,
    clicks: 80,
    conversions: 12,
    spend: 150,
    last7Days: { impressions: 1200, clicks: 35, conversions: 5, spend: 60 },
    thisMonth: { impressions: 2500, clicks: 68, conversions: 10, spend: 130 },
  });
  
  const [ad2, setAd2] = useState({
    imageUrl: placeholderImage2,
    title: "Heads up! High Heads Hat Store is here!",
    description: "Let your personality shine with a hat from High Heads! From sunhats to snapbacks, our hats are so stylish, even Jolly Giraffe would approve. Stand tall and be proud with a High Heads hat!",
    impressions: 4000,
    clicks: 100,
    conversions: 14,
    spend: 200,
    last7Days: { impressions: 1300, clicks: 40, conversions: 6, spend: 70 },
    thisMonth: { impressions: 3500, clicks: 90, conversions: 12, spend: 180 },
  });
  
  const [ad3, setAd3] = useState({
    imageUrl: placeholderImage3,
    title: "Get a-HEAD of Fashion Trends with High Heads!",
    description: "Are you always on the lookout for the next big thing in fashion? High Heads Hat Store is here to help you stay ahead of the game! With our unique and funny hat designs, you'll be the talk of the town.",
    impressions: 3500,
    clicks: 75,
    conversions: 15,
    spend: 175,
    last7Days: { impressions: 1100, clicks: 25, conversions: 7, spend: 55 },
    thisMonth: { impressions: 3000, clicks: 65, conversions: 13, spend: 155 },
  });
  


  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_decode(token);
    setUser(decodedToken);
  }, [location]);

  return (
    <HomeContainer>
      <HeroImage>
        <AdContainer>
          {user ? (
            <>
              <SubHeading>Welcome back, {user.data.first_name}</SubHeading>
            </>
          ) : (
            <SubHeading>Welcome back</SubHeading>
          )}
        <p>Current Ads and Analysis</p>
        <div>
        <AdCard>
            <AdImage src={ad1.imageUrl} alt={ad1.title} />
            <h3>{ad1.title}</h3>
            <p>{ad1.description}</p>
            <p>Daily Impressions: {ad1.impressions}</p>
            <p>Clicks: {ad1.clicks}</p>
            <p>Conversions: {ad1.conversions}</p>
            <p>Ad Spend: ${ad1.spend}</p>
            <p>Last 7 Days: {ad1.last7Days.impressions} Impressions, {ad1.last7Days.clicks} Clicks, {ad1.last7Days.conversions} Conversions, ${ad1.last7Days.spend} Spend</p>
            <p>This Month: {ad1.thisMonth.impressions} Impressions, {ad1.thisMonth.clicks} Clicks, {ad1.thisMonth.conversions} Conversions, ${ad1.thisMonth.spend} Spend</p>
        </AdCard>
        <AdCard>
            <AdImage src={ad2.imageUrl} alt={ad2.title} />
            <h3>{ad2.title}</h3>
            <p>{ad2.description}</p>
            <p>Impressions: {ad2.impressions}</p>
            <p>Clicks: {ad2.clicks}</p>
            <p>Conversions: {ad2.conversions}</p>
            <p>Ad Spend: ${ad2.spend}</p>
            <p>Last 7 Days: {ad2.last7Days.impressions} Impressions, {ad2.last7Days.clicks} Clicks, {ad2.last7Days.conversions} Conversions, ${ad2.last7Days.spend} Spend</p>
            <p>This Month: {ad2.thisMonth.impressions} Impressions, {ad2.thisMonth.clicks} Clicks, {ad2.thisMonth.conversions} Conversions, ${ad2.thisMonth.spend} Spend</p>
        </AdCard>
        <AdCard>
            <AdImage src={ad3.imageUrl} alt={ad3.title} />
            <h3>{ad3.title}</h3>
            <p>{ad3.description}</p>
            <p>Impressions: {ad3.impressions}</p>
            <p>Clicks: {ad3.clicks}</p>
            <p>Conversions: {ad3.conversions}</p>
            <p>Ad Spend: ${ad3.spend}</p>
            <p>Last 7 Days: {ad3.last7Days.impressions} Impressions, {ad3.last7Days.clicks} Clicks, {ad3.last7Days.conversions} Conversions, ${ad3.last7Days.spend} Spend</p>
            <p>This Month: {ad3.thisMonth.impressions} Impressions, {ad3.thisMonth.clicks} Clicks, {ad3.thisMonth.conversions} Conversions, ${ad3.thisMonth.spend} Spend</p>
        </AdCard>
        </div>
          <p>Ad Performance Statistics</p>
          <MyTable>
          <tr>
                <th></th>
                <th>Impressions</th>
                <th>Last 7 Days</th>
                <th>This Month</th>
            </tr>
            <tr>
                <td>Total Impressions</td>
                <td>1,200</td>
                <td>6,500</td>
                <td>21,000</td>
            </tr>
            <tr>
                <td>Click-through Rate</td>
                <td>2.5%</td>
                <td>2.8%</td>
                <td>3.0%</td>
            </tr>
            <tr>
                <td>Conversions</td>
                <td>12</td>
                <td>65</td>
                <td>210</td>
            </tr>
            <tr>
                <td>Average Ad Spend</td>
                <td>$500</td>
                <td>$3,000</td>
                <td>$10,500</td>
            </tr>
            <tr>
                <td>Cost per Click</td>
                <td>$1.25</td>
                <td>$1.20</td>
                <td>$1.10</td>
            </tr>
            <tr>
                <td>Cost per Conversion</td>
                <td>$41.67</td>
                <td>$46.15</td>
                <td>$50.00</td>
            </tr>
            </MyTable>
        </AdContainer>
      </HeroImage>
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
export default AdvertiserDashboard;
