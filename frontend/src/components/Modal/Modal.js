import React from "react";
import './modal.css';

const Modal = (props) => (

  
    <div className="modal">
  <div>
    <header className="modal_header"><h1>{props.title}</h1></header>
    <section className='modal_content'>{props.children}</section>
    <section className='modal_actions'>
      {props.canCancel && <button className='btn' onClick={props.onCancel}>Cancel</button>}
      {props.canConfirm && <button className='btn' onClick={props.onConfirm}>Confirm</button>}
    </section>
  </div>
  </div>
);
export default Modal;
