import React from "react";
import ReactGridLayout  from 'react-grid-layout';

export default class page3 extends React.Component{
   openCity(cityName) {
      var i;
      var x = document.getElementsByClassName("city");
      for (i = 0; i < x.length; i++) {
         x[i].style.display = "none";
      }

       document.getElementsByClassName("in-progress")[0].className=document.getElementsByClassName("in-progress")[0].className.replace(" in-progress"," complete");

      document.getElementsByClassName(cityName)[1].style.display = "block";
       document.getElementsByClassName(cityName)[0].classList.toggle("in-progress");
  }
  showWizard(){
    document.getElementsByClassName("form-wizard")[0].classList.toggle("d-block");
  }
  render(){

    return(
      <div class="container-fluid">
      <div class="card">
      <div class="table-header ">
      <div class="row">
    <div class="col-lg-8" style={{display:"flex",alignItems:"center"}}>
    <h4 class="no-margin">Vehicle Management</h4>

    </div>
    <div class="col-lg-4">

    <div class="float-right">
    <span class="bg-success btn-round" onClick={this.showWizard.bind(this)}><i class="material-icons">add</i></span>
    </div>
    </div>
    </div>
    </div>
    <div class="card-body">
    <div class="form-wizard d-none" style={{backgroundColor:"#f3f3f3"}}>

    <div class="container-fluid">

      <div class="wizard-progress">
      <div class="step Mach_Det in-progress">
        Machine Details
        <div class="node"></div>
      </div>
      <div class="step Prod_Det">
        Product Details
        <div class="node"></div>
      </div>
      <div class="step Grp_Det">
        Group Details
        <div class="node"></div>
      </div>

    </div>


    <div id="London" class="mt-4 city Mach_Det">
      <h2>Machine Detail</h2>
      <p>London is the capital city of England.</p>
      <button class="w3-btn" onClick={this.openCity.bind(this,'Prod_Det')}>Next</button>
    </div>

    <div id="Paris" class="mt-4 city Prod_Det" style={{display:"none"}}>
      <h2>Product Details</h2>
      <p>Paris is the capital of France.</p>
       <button class="w3-btn"  onClick={this.openCity.bind(this,'Mach_Det')}>Previous</button>
       <button class="w3-btn"  onClick={this.openCity.bind(this,'Grp_Det')}>Next</button>
    </div>

    <div id="Tokyo" class="mt-4 city Grp_Det" style={{display:"none"}}>
      <h2>Group Details</h2>
      <p>Tokyo is the capital of Japan.</p>
       <button class="w3-btn"  onClick={this.openCity.bind(this,'Prod_Det')}>Previous</button>
    </div>
    </div>
      </div>
    <div class="row admin-list-item">
<div class="col-lg-3">
<h4 class="no-margin">Case Ex405</h4>
<p class="small hint-text">6EX2535363636363636363636353535</p>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
</div>
<div class="row admin-list-item">
<div class="col-lg-3">
<h4 class="no-margin">Case Ex405</h4>
<p class="small hint-text">6EX2535363636363636363636353535</p>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
</div>
<div class="row admin-list-item">
<div class="col-lg-3">
<h4 class="no-margin">Case Ex405</h4>
<p class="small hint-text">6EX2535363636363636363636353535</p>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
</div>
<div class="row admin-list-item">
<div class="col-lg-3">
<h4 class="no-margin">Case Ex405</h4>
<p class="small hint-text">6EX2535363636363636363636353535</p>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
</div>
<div class="row admin-list-item">
<div class="col-lg-3">
<h4 class="no-margin">Case Ex405</h4>
<p class="small hint-text">6EX2535363636363636363636353535</p>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
</div>
<div class="row admin-list-item">
<div class="col-lg-3">
<h4 class="no-margin">Case Ex405</h4>
<p class="small hint-text">6EX2535363636363636363636353535</p>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
</div>
<div class="row admin-list-item">
<div class="col-lg-3">
<h4 class="no-margin">Case Ex405</h4>
<p class="small hint-text">6EX2535363636363636363636353535</p>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
</div>
<div class="row admin-list-item">
<div class="col-lg-3">
<h4 class="no-margin">Case Ex405</h4>
<p class="small hint-text">6EX2535363636363636363636353535</p>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
</div>
<div class="row admin-list-item">
<div class="col-lg-3">
<h4 class="no-margin">Case Ex405</h4>
<p class="small hint-text">6EX2535363636363636363636353535</p>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
<div class="col-lg-3">
<p class="small hint-text no-margin">Currently</p>
<h4 class="text-danger bold no-margin">32°
<span class="small">/ 30C</span>
</h4>
</div>
</div>
    </div>
  </div>
    </div>
    );
  }
}
