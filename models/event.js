const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  creator:{type:mongoose.Schema.Types.ObjectId,
           ref:'User'}
});

module.exports = mongoose.model("Event", eventSchema);
