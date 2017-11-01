import React from "react";
import ReactGridLayout  from 'react-grid-layout';

export default class page2 extends React.Component{

  render(){
    var layout = [
     {i: 'a', x: 0, y: 0, w: 3, h: 3},
     {i: 'b', x: 3, y: 0, w: 3, h: 3},
     {i: 'c', x: 6, y: 0, w: 3, h: 3},
     {i: 'd', x: 9, y: 0, w: 3, h: 3},
     {i: 'e', x: 0, y: 3, w: 3, h: 3},
     {i: 'f', x: 3, y: 3, w: 3, h: 3},
     {i: 'g', x: 6, y: 3, w: 3, h: 3},
   ];
    return(
      <ReactGridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
         <div key="a">a</div>
         <div key="b">b</div>
         <div key="c">c</div>
          <div key="d">c</div>
           <div key="e">c</div>
            <div key="f">c</div>
             <div key="g">c</div>
       </ReactGridLayout>
    );
  }
}
