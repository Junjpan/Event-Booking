import React, { Component } from "react";
import "./Auth.css";

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
    this.state = {
      isLogin: true,
    };
  }

  login = () => {
    this.setState({ isLogin: !this.state.isLogin });
    //another way to write the code:
    //this.setState(prevState=>{return {isLogin:!prevState.isLogin}})
  };

  submitForm = (e) => {
    e.preventDefault();
    const email = this.email.current.value;
    const password = this.password.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    //match up the schema on the backend server
    let requestBody;
    if (!this.state.isLogin) {
      requestBody = {
        query: `
      mutation{
        createUser(userInput:{email:"${email}",password:"${password}"}){
          _id
          email
        }
      }
      `,
      };
    } else {
      requestBody = {
        query: `
      query{
        login(email:"${email}",password:"${password}"){
          userId
          token
          tokenExpiration}

      }
      `,
      };
    }
    //login(email:String!,password:String!):AuthData!

    fetch("http://localhost:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => console.log(res)) //res.data if you are sucess fetch data, otherwise receive error message from res.errors
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <form className='auth-form' onSubmit={this.submitForm}>
        <div className='form-control'>
          <label htmlFor='email'>E-mail</label>
          <input type='email' id='email' ref={this.email} />
        </div>
        <div className='form-control'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' ref={this.password} />
        </div>
        <div className='form-action'>
          <button type='button' onClick={this.login}>
            Switch to {this.state.isLogin ? "Sign Up" : "Sign In"}
          </button>
          <button type='submit'>Submit</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
