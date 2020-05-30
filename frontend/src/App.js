import React, { Component } from "react";
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
import AuthContext from "./context/auth-context";

class App extends Component {
  state = {
    userId: null,
    token: null,
  };

  login = (userId, token, tokenExpiration) => {
    console.log(userId);
    this.setState({ userId, token });
  };

  logout = () => {
    this.setState({ userId: null, token: null });
  };

  render() {
    return (
      <Router>
        <div className='App'>
          <AuthContext.Provider
            value={{
              userId: this.state.userId,
              token: this.state.token,
              login: this.login,
              logout: this.logout,
            }}
          >
            <MainNavigation />
            <main className='main-content'>
              <Switch>
                {!this.state.token && <Redirect from='/bookings' to='/auth' exact />}
                {this.state.token && <Redirect from='/' to='/events' exact />}
                {this.state.token && (
                  <Redirect from='/auth' to='/events' exact />
                )}
                <Route path='/events' component={EventPage} />
                {!this.state.token && <Route path='/auth' component={Auth} />}
                {this.state.token && (
                  <Route path='/bookings' component={BookingPage} />
                )}
                {!this.state.token && <Redirect to='/auth' exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </div>
      </Router>
    );
  }
}

export default App;
//
