import React, { Component } from "react";
import "./event.css";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/backdrop";

class EventPage extends Component {
  state = {
    creating: false,
  };

  create=()=> {
    this.setState({ creating: true });
  }

  onCancel=()=>{
    this.setState({creating:false})
  }

  onConfirm=()=>{
    this.setState({creating:false})
  }

  render() {
    return (
      <React.Fragment>
        {this.state.creating && (
          <React.Fragment>
            <Backdrop />
            <Modal title='Add Event' canCancel canConfirm onCancel={this.onCancel} onConfirm={this.onConfirm}>
              <p>Modal Content</p>
            </Modal>
          </React.Fragment>
        )}
        <div className='events-control'>
          <p>Share your own envets!</p>
          <button className='btn' onClick={this.create}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventPage;
