import React from "react";
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
export default class login extends React.Component{
  state = {
     redirectToReferrer: false
   }

   login = () => {

       this.setState({ redirectToReferrer: true })

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
