import React from "react";
import {Switch, Route, Redirect} from 'react-router-dom';
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import page1 from "./page1";
import page2 from "./page2";
export default class Layout extends React.Component{

  render(){
    return(
      <div>
      <TopBar/>

      <div class="w3-main" style={{marginTop:"100px"}}>
      <Switch>
                     <Route path="/dashboard" name="Dashboard" component={page1}/>

                     <Route path="/charts" name="Charts" component={page2}/>
                     <Redirect from="/" to="/dashboard"/>
                   </Switch>
      </div>
      </div>
    );
  }
}
