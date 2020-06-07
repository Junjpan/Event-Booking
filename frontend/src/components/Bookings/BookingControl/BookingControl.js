import React from "react";
import './BookingControl.css'


const BookingControl = (props) => (
  <div className="booking-control">
    <button  className={props.outPutType==="List"?"active":''} onClick={props.changeListDisplay.bind(this, "List")}>
      List
    </button>
    <button
      className={props.outPutType==="Chart"?"active":''}
      onClick={props.changeListDisplay.bind(this, "Chart")}
    >
      Chart
    </button>
  </div>
);

export default BookingControl
