const DataLoader=require('dataloader');
const Event=require("../../models/event");
const User = require("../../models/user");
const {dateTOString}=require("../../helpers/date")
const mongoose=require('mongoose');

const eventLoader=new DataLoader((eventIds)=>{
  return events(eventIds)
})

const userLoader=new DataLoader((userIds)=>{
  return User.find({_id:{$in:userIds}});
})

const events =  (eventids) => {
    //console.log("eventids " + eventids);
    return Event.find({ _id: { $in: eventids } })
      .then((events) => {
        return events.map((event) => {
          return transfromEvent(event); //use the below user function
        });
      })
      .catch((err) => {
        throw err;
      });
  };
  
  const singleEvent = async (eventId) => {
    try {
     //use eventLoader
     const event=await eventLoader.load(eventId.toString())
      // const event = await Event.findById(eventId);
      return event; 
    } catch (err) {
      throw err;
    }
  };
  const user = (userid) => {
    //return User.findById(userid)
  return userLoader.load(userid.toString())
      .then((user) => {
        return {
          ...user._doc,
         // createEvents: events.bind(this, user._doc.createEvents),
         //instead we use eventLoader
         createEvents:()=>eventLoader.loadMany(user._doc.createEvents)
        };
      })
      .catch((err) => {
        throw err;
      });
  };
  const transfromEvent = (event) => {
    return {
      ...event._doc,
      date: dateTOString(event._doc.date),
      creator: user.bind(this, event._doc.creator),
    };
  };

  const transformBooking =booking=>{
      console.log(booking)
    return {
      ...booking._doc,
      _id:booking.id,//moogse give an easy way to access id, with the_doc
      createdAt: dateTOString(booking._doc.createdAt),
      updatedAt: dateTOString(booking._doc.updatedAt),
      event: singleEvent.bind(this, booking._doc.event),
      user: user.bind(this, booking._doc.user),
    }
  }
 
  exports.events=events;
  exports.user=user;
  exports.singleEvent=singleEvent;
  exports.transfromEvent=transfromEvent;
  exports.transformBooking=transformBooking;