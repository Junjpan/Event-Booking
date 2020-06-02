import React from "react";
import EventItem from "./EventItem/EventItem";

const EventList = (props) => (
  <ul className='events__list'>
    {props.events.map((event) => {
      return (
        <EventItem
          key={event._id}
          event={event}
          loginUseId={props.loginUseId}
          showDetails={props.showDetails}
        />
      );
    })}
  </ul>
);

export default EventList;
