const Booking = require("../../models/booking");
const Event=require("../../models/booking");
const {user,singleEvent,transformBooking,transfromEvent} =require("./merge");


module.exports = {
  
  bookings: async (args,req) => {
    if(!req.isAuth){
      throw new Error('Unauthenticated')
    }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args,req) => {
    if(!req.isAuth){
      throw new Error('Unauthenticated')
    }
   // const fetchEvent = await Event.findById(args.eventId);
    const booking = new Booking({
      user: req.userId,
      event: args.eventId,
    });

    const result = await booking.save();

    return transformBooking(result);
  },
  cancelBooking: async (args,req) => {
    if(!req.isAuth){
      throw new Error('Unauthenticated')
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transfromEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};

  