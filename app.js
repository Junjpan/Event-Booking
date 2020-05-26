const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const graphQLHTTP = require("express-graphql");
const mongoose = require("mongoose");
const schema=require("./graphql/schema/index");
const rootResolver=require("./graphql/reslover/index")
const isAuth=require('./middleware/is-auth');

const app = express();
require("dotenv").config();
//alternative, you can set the env inside the nodemon.json file, and put env info inside that file
//{"env:{"MONGO_USER":"...","MONGO_PASSWORD"}"}, and you can acess the vriable like process.env.MOGO_USER

app.use(bodyParser.json());

app.use(isAuth)
app.use(
  "/graphql",
  graphQLHTTP({
    schema,
    rootValue:rootResolver,
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
