import React from "react";
import { NavLink } from "react-router-dom";
import "./mainNavigation.css";
import AuthContext from "../../context/auth-context";

const MainNavigation = (props) => (
  <AuthContext.Consumer>
    {(context) => {
      return (
        <header className='main-navigation'>
          <div className='main-navigation_logo'>SimpleEvent</div>
          <nav className='main-naviagation_item'>
            <ul>
              {!context.token && (
                <li>
                  <NavLink to='/auth'>Login</NavLink>
                </li>
              )}

              {context.token && (
                <li>
                  <NavLink to='/bookings'>Bookings</NavLink>
                </li>
              )}
              <li>
                <NavLink to='/events'>Events</NavLink>
              </li>
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);
export default MainNavigation;
