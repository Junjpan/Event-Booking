const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const graphQLHTTP = require("express-graphql");
const mongoose = require("mongoose");
const { buildSchema } = require("graphql");
const bcrypt = require("bcryptjs");
const Event = require("./models/event");
const User = require("./models/user");

const app = express();
require("dotenv").config();
//alternative, you can set the env inside the nodemon.json file, and put env info inside that file
//{"env:{"MONGO_USER":"...","MONGO_PASSWORD"}"}, and you can acess the vriable like process.env.MOGO_USER

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphQLHTTP({
    schema: buildSchema(`
    type Event {
        _id:ID!
        title:String!
        description:String!
        price:Float!
        date:String!
        creator:User!
    }
    
    type User {
        _id:ID!
        email:String!
        password:String
        createEvent:[Event!]!
      }
    
    input UserInput{
        email:String!
        password:String!
    }  
    input EventInput {
        title:String!
        description:String!
        price:Float!
        date:String!
    }

    type RootQuery{
        events: [Event!]!
        users:[User!]!
    }
    type RootMutation{
        createEvent(eventInput:EventInput):Event
        createUser(userInput:UserInput):User
    }

    schema{
        query:RootQuery,
        mutation:RootMutation
    }
    
    
    `),
    rootValue: {
      events: () => {
        return Event.find({})
          .then((events) => {
            return events;
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
      createEvent: (args) => {
        //console.log(args);
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "5ec74d15d4f707249cc169b8",
        });
        
        var newEvent;
        return event
          .save()
          .then((result) => {
            newEvent=result  ////also can be   {...result._doc}
            return User.findById("5ec74d15d4f707249cc169b8");
          })
          .then(user=>{
            if(!user){
              throw new Error ('User no found!')
            }
          user.createEvents.push(newEvent._id) //mongoose method
          return user.save()
          })
          .then((result)=>{
            return newEvent
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },

      createUser: (args) => {
        return User.findOne({ email: args.userInput.email })
          .then((user) => {
            if (user) {
              throw new Error("User exists already");
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashPassword) => {
            const user = new User({
              email: args.userInput.email,
              password: hashPassword,
            });

            return user.save(); //return to make sure async
          })
          .then((result) => {
            return { ...result._doc, password: null };
          }) //don't want to return password,to be abel to do this, we have to do ...result._doc
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true,
  })
);
app.get("/", (req, res, next) => {
  res.send("Hello world!");
});

mongoose
  .connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Listen on port" + PORT);
      console.log("Connected to MongoDB");
    });
  })
  .catch((err) => {
    console.log(err);
  });
