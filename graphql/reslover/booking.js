const Booking = require("../../models/booking");
const Event=require("../../models/booking");
const {user,singleEvent,transformBooking,transfromEvent} =require("./merge");


module.exports = {
  
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args) => {
   // const fetchEvent = await Event.findById(args.eventId);
    const booking = new Booking({
      user: "5ec74d15d4f707249cc169b8",
      event: args.eventId,
    });

    const result = await booking.save();

    return transformBooking(result);
  },
  cancelBooking: async (args) => {
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

  