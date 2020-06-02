import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/spinner";

class BookingPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const bookings = {
      query: `
      query{
        bookings{
            _id
        event{
            _id
            title
            description
            price
            date
        }
        createdAt
        updatedAt
        }
      }
      `,
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(bookings),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resdata) => {
        console.log(resdata);
        this.setState({ isLoading: false, bookings: resdata.data.bookings });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        throw err;
      });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <ul>
            {this.state.bookings.map((booking) => {
              return (
                <li key={booking._id}>
                  {booking.event.title} - {booking.createdAt}
                </li>
              );
            })}
          </ul>
        )}
      </React.Fragment>
    );
  }
}

export default BookingPage;
