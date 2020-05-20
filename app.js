const express=require('express');
const bodyParser=require('body-parser');
const PORT=process.env.PORT||5000;
const graphQLHTTP=require('express-graphql');
const {buildSchema}=require('graphql');

const app=express();

const events=[];

app.use(bodyParser.json());

app.use('/graphql',graphQLHTTP({
    schema:buildSchema(`
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
    rootValue:{
        events:()=>{return events},
        createEvent:(args)=>{
            console.log(args)
            const event={
                _id:Math.random().toString(),
                title:args.eventInput.title,
               description:args.eventInput.description,
               price:+args.eventInput.price,
               date:args.eventInput.date
            }
            events.push(event)
            return event
        }
    },
    graphiql:true
}))
app.get('/',(req,res,next)=>{
    res.send('Hello world!')
})

app.listen(PORT,()=>{
    console.log('Listen on port'+ PORT)
})