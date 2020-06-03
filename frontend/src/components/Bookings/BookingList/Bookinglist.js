import React from "react";
import './Bookinglist.css'


const BookingList = (props) => (
  <ul className='booking_list'>
    {props.bookings.map((booking) => {
      return (
        <li key={booking._id} className="bookings_item">
          <div >
            {booking.event.title} - {' '} 
            {booking.createdAt}
          </div>
          <div >
              <button className='btn' onClick={props.cancelEvent.bind(this,booking._id)}>Cancel</button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default BookingList;
