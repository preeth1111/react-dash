import React from "react";
import ReactDom from "react-dom";
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
import {createBrowserHistory} from 'history';

import Layout from "./pages/Layout";


const history = createBrowserHistory();

const app=document.getElementById('app');

const fakeAuth = {

  authenticate(cb) {
  localStorage.setItem("tokenReact","abd")
    setTimeout(cb, 100) // fake async
  },
  isAuthenticated(){
    return localStorage.getItem("tokenReact");
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

class login extends React.Component{
  state = {
     redirectToReferrer: false
   }

   login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }
  render(){
    const { from } = this.props.location.state || { from: { pathname: '/' } }
 const { redirectToReferrer } = this.state

 if (redirectToReferrer) {
   return (
     <Redirect to={from}/>
   )
 }

 return (
   <div>
     <p>You must log in to view the page at {from.pathname}</p>
     <button onClick={this.login}>Log in</button>
   </div>
 )
  }
}

ReactDom.render(
  <HashRouter history={history}>
      <Switch>
        <Route exact path="/login" name="Login Page" component={login}/>

        <PrivateRoute path="/" name="home" component={Layout}/>
      </Switch>
    </HashRouter>,app);
