const { dateTOString } = require("../../helpers/date");
const Event = require("../../models/event");
const User = require("../../models/user");
const {user,transfromEvent}=require('./merge');



module.exports = {
    events: () => {
      return Event.find({})
        .then((events) => {
          return events.map((event) => {
            return {
              ...event._doc,
              date: dateTOString(event._doc.date),
              creator: user.bind(this, event._doc.creator),
            };
          });
          /**
           * since return data has mongoose medatata attached it, if you want to leave out the mongoose's attached metadatea,you should do this way
           * return events.map((event)=>{
           * return {...event._doc,_id:result._doc._id.toString()}})//because mongodb's ObjectId format
           * you also can do return {...event._doc,_id:event.id}
           */
        })
        .catch((err) => {
          throw err;
        });
    },
  
    createEvent: (args,req) => {
      //console.log(args);
      if(!req.isAuth){
        throw new Error('Unauthenticated')
      }
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: req.userId,
      });
  
      var newEvent;
      return event
        .save()
        .then((result) => {
          newEvent = transfromEvent(result); ////also can be   {...result._doc}
          return User.findById(req.userId);
        })
        .then((user) => {
          if (!user) {
            throw new Error("User no found!");
          }
          user.createEvents.push(newEvent._id); //mongoose method
          return user.save();
        })
        .then((result) => {
          return newEvent;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
  
  
 
  };
  