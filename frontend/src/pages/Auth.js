import React, { Component } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
    this.state = {
      isLogin: true,
    };
  }

  static contextType = AuthContext; //only used in class component-contextType

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
      mutation CreateUser($email:String!,$password:String!){
        createUser(userInput:{email:$email,password:$password}){
          _id
          email
        }
      }
      `,
        variables: {
          email: email,
          password: password
        },
      };
    } else {
      /** requestBody = {
        query: `
      query{
        login(email:"${email}",password:"${password}"){
          userId
          token
          tokenExpiration}

      }
      `,
      };
       * 
       */
      requestBody = {
        query: `
      query Login ($email:String!,$password:String!){
        login(email:$email,password:$password){
          userId
          token
          tokenExpiration}

      }
      `,
        variables: {
          email: email,
          password: password,
        },
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
      .then((res) => {
        console.log(res);
        if (res.data.login.token) {
          this.context.login(
            res.data.login.userId,
            res.data.login.token,
            res.data.login.tokenExpiration
          );
        }
      }) //res.data if you are sucess fetch data, otherwise receive error message from res.errors
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
