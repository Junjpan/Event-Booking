import React from "react";
import { NavLink } from "react-router-dom";
import './mainNavigation.css'

const MainNavigation = (props) => (
  <header className="main-navigation">
    <div className='main-navigation_logo'>
      SimpleEvent
    </div>
    <nav className='main-naviagation_item'>
      <ul>
        <li><NavLink to="/auth">Login</NavLink></li>
        <li><NavLink to="/bookings">Bookings</NavLink></li>
        <li><NavLink to="/events">Events</NavLink></li>
      </ul>
    </nav>
  </header>
);
export default MainNavigation;
