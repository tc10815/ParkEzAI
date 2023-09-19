import React from 'react';
import heroImage from '../images/home-hero_mod.jpg';
import Footer from "./Footer";

const Home = () => {
  return (
    <div>
    <div className="bg-dark text-white text-center py-5 position-relative d-md-block d-none" style={{height: '70vh'}}>
        <img src={heroImage} alt="Hero" className="img-fluid position-absolute top-0 start-0 w-100 h-100" style={{objectFit: 'cover', objectPosition: 'top'}} />
        <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-md-5">
            <div className="bg-dark p-4 d-md-inline-block">
                <h1 className="mb-3 p-1">Welcome to ParkEZ</h1>
                <h3 className="p-1">Solutions for Businesses and Drivers</h3>
            </div>
        </div>
    </div>
    <div className="bg-dark text-white text-center py-5 position-relative d-md-none" style={{height: '70vh'}}>
        <img src={heroImage} alt="Hero" className="img-fluid position-absolute top-0 start-0 w-100 h-100" style={{objectFit: 'cover', objectPosition: 'top'}} />
        <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-md-5">
            <div className="bg-dark p-4 d-inline-block w-100">
                <h1 className="mb-3 p-1">Welcome to ParkEZ</h1>
                <h3 className="p-1">Solutions for Businesses and Drivers</h3>
            </div>
        </div>
    </div>
    <div className="bg-light"> 
    <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-md-10 text-center mb-5">
                <p>
                  ParkEZ is a state-of-the-art parking management platform designed to improve the way businesses and drivers approach parking. Our comprehensive solution offers real-time parking availability, advanced security features, and targeted advertising opportunities. With ParkEZ, drivers can effortlessly find and secure parking spots, while businesses can maximize their revenue and improve customer satisfaction. Join us in creating a better parking experience for drivers and businesses alike.
                </p>
            </div>
            <div className="col-md-4 mb-3">
                <h4>Benefits for Businesses</h4>
                <ul>
                    <li>Maximize revenue by efficiently managing parking spaces</li>
                    <li>Reduce illegal parking and provide parking availability to customers</li>
                    <li>Real-time occupancy tracking and notifications for overparking</li>
                    <li>Access to archived camera footage for security purposes</li>
                </ul>
            </div>
            <div className="col-md-4 mb-3">
                <h4>Benefits for People Parking</h4>
                <ul>
                    <li>Find available parking spots easily and quickly</li>
                    <li>Park in secure and video monitored locations</li>
                    <li>Access real-time information on parking spot availability</li>
                    <li>Receive personalized recommendations for nearby parking spots</li>
                </ul>
            </div>
            <div className="col-md-4 mb-3">
                <h4>Benefits for Advertisers</h4>
                <ul>
                    <li>Advertise on our platform, targeting potential customers</li>
                    <li>Reach users looking for parking spaces near your establishment</li>
                    <li>Monitor ad success through impression statistics and click counts</li>
                    <li>Target specific parking lots for increased visibility</li>
                </ul>
            </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};
export default Home;