import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import Spinner from "../components/Spinner/spinner";
import BookingList from '../components/Bookings/BookingList/Bookinglist';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingControl from "../components/Bookings/BookingControl/BookingControl";

class BookingPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outPutType:"List"
  };

  static contextType = AuthContext;

  cancelEvent=(bookingId)=>{
/** another way without variables specify
 * const cancelBooking={
      query:`mutation{
        cancelBooking(bookingId:"${bookingId}"){
          _id
          title
        }
      }`
 */

    const cancelBooking={
      query:`mutation CancelBooking($id:ID!){
        cancelBooking(bookingId:$id){
          _id
          title
        }
      }`,
      variables:{
        id:bookingId
      }
    }

    fetch('http://localhost:5000/graphql',{
      method:"POST",
      body:JSON.stringify(cancelBooking),
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.context.token,
      }
    }).then(res=>res.json())
      .then(resdata=>{console.log(resdata);
        this.setState(prevState=>{
          const updatedBookings=prevState.bookings.filter(booking=>{
            return booking._id!==bookingId
          })
          return {bookings:updatedBookings,isLoading:false}
        })
      this.fetchBookings()})
      .catch(err=>console.log(err))

  }


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

  changeListDisplay=outPutType=>{

    if(outPutType==='List'){
      this.setState({outPutType:"List"})
    }else{
      this.setState({outPutType:"Chart"})
    }
  }

  render() {
    let content=<Spinner />;
    if(!this.state.isLoading){
      content=( <React.Fragment>
        <BookingControl changeListDisplay={this.changeListDisplay} outPutType={this.state.outPutType}  />
        <div>
          {this.state.outPutType==="List"?<BookingList bookings={this.state.bookings} cancelEvent={this.cancelEvent}/>
          :<BookingChart bookings={this.state.bookings} />}
        </div>
       
      </React.Fragment>)
    }

    return (
      <React.Fragment>
       {content}
      </React.Fragment>
    );
  }
}

export default BookingPage;
