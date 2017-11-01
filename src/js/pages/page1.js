import React from "react";
import * as Widgets from "../components/WidgetList"

import { WidthProvider, Responsive } from 'react-grid-layout';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS('layouts') || {};
export default class page1 extends React.Component{
  static defaultProps = {
     className: "layout",
     cols: {lg: 12, md: 12, sm: 12, xs: 3, xxs: 2},
     rowHeight: 100
   };
   constructor(props) {
    super(props);

    this.state = {
      items: [{name:"Widget1",width:6,h:6},{name:"Widget2",width:6,h:3},{name:"Widget3",width:3,h:3},{name:"Widget1",width:3,h:3},{name:"Widget3",width:3,h:3},{name:"Widget2",width:3,h:3}
      ].map(function(i, key, list) {


        return {i: i.name+"-"+key, x: key * 3, y: 0, w: i.width, h: i.h, add: key === (list.length - 1).toString()};
      }),
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
      newCounter: 0
    };

    this.onAddItem = this.onAddItem.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
  }
  onLayoutChange(layout, layouts) {
  saveToLS('layouts', layouts);

  this.setState({layouts});
}
  createElement(el) {
    const removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    };

    const i = el.add ? '+' : el.i;

const Tag=this.getWidget.bind(this,el.i.split("-")[0]);



    return (
      <div class=" w3-dark-grey w3-col  s3" key={i} data-grid={el}>
<Tag/>
   <span className="remove" style={removeStyle} onClick={this.onRemoveItem.bind(this, i)}>x</span>
  </div>
    );
  }
  getWidget (block) {
    switch (block) {
      case 'Widget1':
        return <Widgets.Widget1 />

      case 'Widget2':
        return <Widgets.Widget2 />

      case 'Widget3':
          return <Widgets.Widget3 />


    }
  }
  onAddItem() {
      /*eslint no-console: 0*/
      console.log('adding', 'n' + this.state.newCounter);
      this.setState({
        // Add a new item. It must have a unique key!
        items: this.state.items.concat({
          i: 'Widget3-' + this.state.newCounter,
          x: this.state.items.length * 3 % (this.state.cols || 12),
          y: Infinity, // puts it at the bottom
          w: 3,
          h: 3
        }),
        // Increment the counter to ensure key is always unique.
        newCounter: this.state.newCounter + 1
      });
      console.log(this.state.items)
    }

    // We're using the cols coming back from this to calculate where to add new items.
    onBreakpointChange(breakpoint, cols) {
      this.setState({
        breakpoint: breakpoint,
        cols: cols
      });
    }


  onRemoveItem(i) {


    this.setState({items: this.state.items.filter(function(item){return item.i!=i})});
  }


  render(){


    return(
      <div class="w3-container">
<div class="w3-row">
<div>
        <button onClick={this.onAddItem}>Add Item</button>
        <ResponsiveReactGridLayout layouts={this.state.layouts} onLayoutChange={(layout, layouts) => this.onLayoutChange(layout,layouts)} onBreakpointChange={this.onBreakpointChange}
            {...this.props}>
          {this.state.items.map((el,index) => this.createElement(el) )}
        </ResponsiveReactGridLayout>
      </div>
</div>
      </div>
    );
  }
}

function getFromLS(key) {
let ls = {};
if (localStorage) {
 try {
   ls = JSON.parse(localStorage.getItem('rgl-8')) || {};
 } catch(e) {/*Ignore*/}
}
return ls[key];
}

function saveToLS(key, value) {
if (localStorage) {
 localStorage.setItem('rgl-8', JSON.stringify({
   [key]: value
 }));
}
}
