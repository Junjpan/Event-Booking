import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Auth from "./pages/Auth";
import EventPage from "./pages/Events";
import BookingPage from "./pages/Booking";
import MainNavigation from "./components/navigation/MainNavigation";

function App() {
  return (
    <Router>
      <div className='App'>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            <Redirect from='/' to='/auth' exact />
            <Route path='/events' component={EventPage} />
            <Route path='/auth' component={Auth} />
            <Route path='/bookings' component={BookingPage} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
//
