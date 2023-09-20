import React from 'react';
import heroImage from '../images/about-hero.jpg';
import about1image from '../images/about-image1.jpg';
import about2image from '../images/about-image2.jpg';
import Footer from './Footer';

const About = () => {
  return (
    <div className="bg-white d-flex flex-column"> 
      <div className="bg-white">
        <div 
          className="d-flex justify-content-center align-items-center text-white"
          style={{ 
            backgroundImage: `url(${heroImage})`, 
            backgroundPosition: 'top', 
            backgroundSize: 'cover', 
            minHeight: '30vh'
          }}
        >
          <h1 className="fs-1 bg-dark py-2 px-4">About ParkEz</h1>
        </div>

        <div className="container text-center my-4">
          <h2 className="fs-2 mb-3">Our Story</h2>
          <p>
          ParkEz was founded in 2021 by a group of parking lot owners and advertisers who saw an opportunity to revolutionize the parking industry. Our mission is to make parking simpler, more accessible, and more efficient for both parking lot owners and users, while also creating new advertising opportunities for businesses.
        </p>
        <p>
          Through our platform, we connect parking lot owners with advertisers, helping them increase revenue while providing a better experience for their customers. By leveraging cutting-edge technology, we create customized solutions for each of our clients, ensuring they get the most out of their partnership with us.
        </p>      
          
          <img src={about1image} alt="Team working together" className="w-100 mb-4" style={{ maxWidth: '800px' }} />

          <h2 className="fs-2 mb-3">Our Values</h2>
          <p className="fs-5 text-start mb-4">
          At ParkEz, we prioritize innovation, collaboration, and customer satisfaction. We believe that by working together and constantly pushing the boundaries of what's possible, we can create a world where parking is no longer a source of stress but rather an opportunity for growth and connection.
          </p>

          <h2 className="fs-2 mb-3">Our Team</h2>
          <p className="fs-5 text-start mb-4">
          Our team is made up of industry experts with diverse backgrounds in technology, advertising, and parking management. We are dedicated to providing our clients with the highest level of service and support, ensuring their success and satisfaction.
          </p>
          <img src={about2image} alt="Team members in a meeting" className="w-100 mb-4" style={{ maxWidth: '800px' }} />

          <div className="container-lg mt-4" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4">Pricing</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Service</th>
            <th>Details</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Parking Lot Owner</td>
            <td>
              <ul className="list-unstyled">
                <li><strong><em>Up to 50 spaces:</em></strong> $50/month</li>
                <li><strong><em>51-200 spaces:</em></strong> $150/month</li>
                <li><strong><em>201-500 spaces:</em></strong> $300/month</li>
                <li><strong><em>Additional camera:</em></strong> $50/month</li>
                <li><strong><em>License plate tracking:</em></strong> $100/month</li>
              </ul>
            </td>
            <td>$50+/month</td>
          </tr>
          <tr>
            <td>Advertiser</td>
            <td>Price per lot page advertised on</td>
            <td>$20/month per lot</td>
          </tr>
        </tbody>
      </table>
    </div>
          <h2 className="fs-2 mb-3">Testimonials</h2>
          <blockquote className="blockquote text-center fs-4">
            <p>"Working with ParkEz has completely transformed our parking operations. Their innovative solutions have helped us generate more revenue while improving the overall experience for our customers."</p>
            <footer className="blockquote-footer">Jane Smith, Parking Lot Owner</footer>
          </blockquote>
          <blockquote className="blockquote text-center fs-4">
            <p>"As an advertiser, partnering with ParkEz has been a game-changer. Their platform allows us to reach a wider audience and make a greater impact with our ads."</p>
            <footer className="blockquote-footer">John Doe, Advertiser</footer>
          </blockquote>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default About;