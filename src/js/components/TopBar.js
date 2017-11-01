import React from "react";

export default class TopBar extends React.Component{


  render(){

    const TBLayerStyle={"zIndex":4};

    return(
      <div class="w3-bar w3-top w3-black w3-large" style={TBLayerStyle}>
        <button class="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey" ><i class="fa fa-bars"></i>  Menu</button>
        <span class="w3-bar-item w3-right">Logo</span>
      </div>
    );
  }
}
