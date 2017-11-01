import React from "react";
import {NavLink} from 'react-router-dom';
export default class SideBar extends React.Component{

render(){
const navStyle={zIndex:3,width:"300px"};
const logoWidth={width:"46px"}

return(
  <nav class="w3-sidebar w3-collapse w3-white w3-animate-left" style={navStyle} id="mySidebar"><br/>
  <div class="w3-container w3-row">
    <div class="w3-col s4">

    </div>
    <div class="w3-col s8 w3-bar">
      <span>Welcome, <strong>Mike</strong></span><br/>
      <a href="#" class="w3-bar-item w3-button"><i class="fa fa-envelope"></i></a>
      <a href="#" class="w3-bar-item w3-button"><i class="fa fa-user"></i></a>
      <a href="#" class="w3-bar-item w3-button"><i class="fa fa-cog"></i></a>
    </div>
  </div>
  <hr/>
  <div class="w3-container">
    <h5>Dashboard</h5>
  </div>
  <div class="w3-bar-block">
    <a href="#" class="w3-bar-item w3-button w3-padding-16 w3-hide-large w3-dark-grey w3-hover-black"  title="close menu"><i class="fa fa-remove fa-fw"></i>  Close Menu</a>
    <NavLink to="/dashboard" class="w3-bar-item w3-button w3-padding w3-blue"><i class="fa fa-users fa-fw"></i>  Overview</NavLink>
    <NavLink to="/charts" class="w3-bar-item w3-button w3-padding"><i class="fa fa-eye fa-fw"></i>  Views</NavLink>

  </div>
</nav>
);
}


}
