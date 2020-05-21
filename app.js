const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const graphQLHTTP = require("express-graphql");
const mongoose = require("mongoose");
const { buildSchema } = require("graphql");
const Event = require("./models/event");

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
    }
    
    
    input EventInput {
        title:String!
        description:String!
        price:Float!
        date:String!
    }

    type RootQuery{
        events: [Event!]!
    }
    type RootMutation{
        createEvent(eventInput:EventInput):Event
    }

    schema{
        query:RootQuery,
        mutation:RootMutation
    }
    
    
    `),
    rootValue: {
      events: () => {
        return Event.find({})
                    .then(events=>{
                        return events
                        /**
                         * since return data has mongoose medatata attached it, if you want to leave out the mongoose's attached metadatea,you should do this way
                         * return events.map((event)=>{
                         * return {...event._doc,_id:result._doc._id.toString()}})//because mongodb's ObjectId format
                         * you also can do return {...event._doc,_id:event.id}
                         */
                    })
                    .catch(err=>{throw err})
      },
      createEvent: (args) => {
        //console.log(args);
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });

    return  event
          .save()
          .then(result=>{console.log(result) ;return result;}) //you also return {...result._doc}
          .catch((err) => {
            console.log(err);
            throw err
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
