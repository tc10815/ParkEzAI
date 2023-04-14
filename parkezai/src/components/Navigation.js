import {  Link } from 'react-router-dom';

import Home from './Home';
import FindParking from './FindParking';
import About from './About';
import HelpCenter from './HelpCenter';
import Login from './Login';
import Signup from './Signup';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/find-parking">Find Parking</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/help-center">Help Center</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;