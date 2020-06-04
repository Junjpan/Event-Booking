import React, { Component } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/backdrop";
import AuthContext from "../context/auth-context";
import EventList from "../components/Event/EventList";
import Spinner from "../components/Spinner/spinner";

class EventPage extends Component {
  state = {
    creating: false,
    events: [],
    isloading: false,
    selectedEvent: null,
  };


  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
    this.dateRef = React.createRef();
    this.priceRef = React.createRef();
    this.descriptionRef = React.createRef();
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = () => {
    this.setState({ isLoading: true });
    const events = {
      query: `
      query{
        events{
          _id
          title
          description
          price
          date
          creator{
            email
            _id
          }
        }
      }
      `,
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(events),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resdata) =>
        this.setState({ events: resdata.data.events, isLoading: false })
      )
      .catch((err) => {
        this.setState({ isLoading: false });
        throw err;
      });
  };

  create = () => {
    this.setState({ creating: true });
  };

  onCancel = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  onConfirm = () => {
    const title = this.titleRef.current.value;
    const date = this.dateRef.current.value;
    const price = +this.priceRef.current.value; //put the plus sign to convert the string to number
    const description = this.descriptionRef.current.value;

    const requestBody = {
      //type need to match up the backend server's schema type
      query: `
      mutation CreateEvent($title:String!,$date:String!,$price:Float!,$desc:String!){
        createEvent(eventInput:{title:$title,date:$date,price:$price,description:$desc}){
        _id
        title
        description
        price
        date
      }
    }
      `,

      variables:{
        title:title,
        date:date,
        desc:description,
        price:price
      }
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        /** 
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }*/
        console.log("hello");
        return res.json();
      })
      .then((resdata) => {
        this.setState((prevState) => {
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id: resdata.data.createEvent._id,
            title: resdata.data.createEvent.title,
            description: resdata.data.createEvent.description,
            date: resdata.data.createEvent.date,
            price: resdata.data.createEvent.price,
            creator: {
              _id: this.context.userId,
            },
          });
          return { events: updatedEvents };
        });
      }) //res.data if you are sucess fetch data, otherwise receive error message from res.errors
      .catch((err) => {
        console.log(err);
      });

    this.setState({ creating: false });
  };

  showDetails = (eventId) => {
    console.log(eventId);
    this.setState((prevState) => {
      const selected = prevState.events.find((e) => e._id === eventId);
      return { selectedEvent: selected };
    });
  };

  bookEventHandler = () => {
if(!this.context.token){
  this.setState({selectedEvent:null})
  return;
}
    const bookEvent = {
      query: `
      mutation BookEvent($id:ID!){
        bookEvent(eventId:$id){
          _id
          createdAt
          updatedAt
        }
      }
      `,
      variables:{
        id:this.state.selectedEvent._id
      }
    };

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(bookEvent),
      headers: {
        "Content-Type": "application/json",
        "Authorization":"Bearer " + this.context.token
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resdata) =>
       { 
        this.setState({selectedEvent:null})
       }
        
      )
      .catch((err) => {
          this.setState({ isLoading: false });
        console.log (err);
      });
  };

  

  render() {
    return (
      <React.Fragment>
        {this.state.creating && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title='Add Event'
              canCancel
              canConfirm
              onCancel={this.onCancel}
              onConfirm={this.onConfirm}
              confirmText="Confirm"
            >
              <form>
                <div className='form-control'>
                  <label htmlFor='title'>Title</label>
                  <input type='text' id='title' ref={this.titleRef} required />
                </div>
                <div className='form-control'>
                  <label htmlFor='Price'>Price</label>
                  <input
                    type='number'
                    id='Price'
                    ref={this.priceRef}
                    step="0.01"
                    required
                  />
                </div>
                <div className='form-control'>
                  <label htmlFor='date'>Date</label>
                  <input
                    type='date' //if you want to get the time you can do type='datetime-local'
                    id='date'
                    ref={this.dateRef}
                    required
                  />
                </div>
                <div className='form-control'>
                  <label htmlFor='description'>Description</label>
                  <textarea
                    id='description'
                    rows='5'
                    type='text'
                    ref={this.descriptionRef}
                    required
                  />
                </div>
              </form>
            </Modal>
          </React.Fragment>
        )}
        {this.state.selectedEvent && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title={this.state.selectedEvent.title}
              canCancel
              canConfirm
              onCancel={this.onCancel}
              onConfirm={this.bookEventHandler}
              confirmText={this.context.token?"Book Event":"Login To Book Event"}
            >
              <h1>{this.state.selectedEvent.title}</h1>
              <h2>
                $ {this.state.selectedEvent.price} -
                {this.state.selectedEvent.date}
              </h2>
              <p>{this.state.selectedEvent.description}</p>
            </Modal>
          </React.Fragment>
        )}

        {this.context.token && (
          <div className='events-control'>
            <p>Share your own envets!</p>
            <button className='btn' onClick={this.create}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isloading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            userId={this.state.userid}
            loginUseId={this.context.userId}
            showDetails={this.showDetails}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventPage;
