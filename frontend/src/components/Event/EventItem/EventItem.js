import React from "react";

const EventItem = (props) => (
  <li
    style={{
      border: "solid 1px rgb(153, 77, 89)",
      margin: "1rem 0",
      padding: "1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div>
      <h1
        style={{ fontSize: "1.5rem", margin: "0", color: "rgb(153, 77, 89)" }}
      >
        {props.event.title}
      </h1>
  <h4 style={{ margin: "0" ,color:"gray" }}>$ {props.event.price} -{props.event.date}</h4>
    </div>
    <div>
      {props.loginUseId === props.event.creator._id ? (
        <p style={{ margin: "0" }}>You are the Owner of this event</p>
      ) : (
        <button className='btn' onClick={props.showDetails.bind(this,props.event._id)}>View Details</button>
      )}
    </div>
  </li>
);//We use bind here, because we don't want it excuate automatically when the page load until you click on the button

export default EventItem;
