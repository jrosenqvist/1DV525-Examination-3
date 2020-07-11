export const template = document.createElement('template')
template.innerHTML = `
<style>
div {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: 14px;
}
.vborder {
  width: 5px;
  background-color: black;
}

.hborder {
  height: 5px;
  background-color: black;
}

.corner {
  width: 5px;
  height: 5px;
  background-color: black;
}

.corner.nwse.se {
  grid-area: se;
}

.corner.nesw.ne {
  grid-area: ne;
}

.corner.nwse.nw {
  grid-area: nw;
}

.corner.nesw.sw {
  grid-area: sw;
}

.titlebar {
  grid-area: title;
  text-align: center;
  height: 30px;
  background-color: black;
  color: white;
  position: relative;  
  font-weight: bold;
  font-size: 15px;
}

.titlebar:hover {
  cursor: move;
}

.titlebar p {
  margin: 0;
  padding-top: 5px;
}

.vborder.leftborder {
  grid-area: left;
}

.hborder.bottomborder {
  grid-area: bottom;
}

.vborder.rightborder {
  grid-area: right;
}

.hborder.topborder {
  grid-area: top;
}

.nesw:hover {
  cursor: nesw-resize;
}

.nwse:hover {
  cursor: nwse-resize;
}

.vborder:hover {
  cursor: ew-resize;
}

.hborder:hover {
  cursor: ns-resize;
}

.content {
  grid-area: content;
  background-color: white;  
  padding: 0;  
}

.window {
  position: absolute;    
  display: grid;  
  grid-template-areas: 
  'nw   top     ne'
  'left title   right'
  'left content right'
  'sw   bottom  se';
  justify-content: start;
}

.close {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0px;
  right: 0px;  
  font-size: 23px;  
}

.icon {
  width: 24px;
  position: absolute;
  top: 0px;
  left: 0px;
  
}

#icon {
  color: white;
  fill: white;
}

.close:hover {
  cursor: default;
  background-color: crimson;
}

h3 {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif
}

h4 {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

</style>
<div class="window" id="window">
  <div class="corner nwse nw" id="nw"></div>
  <div class="corner nesw ne" id="ne"></div>
  <div class="hborder topborder" id="top"></div>
  <div class="titlebar" id="titlebar">
    <div class="icon"><img id="icon"></div>
    <div class="close" id="close">&times;</div>
  </div>
  <div class="vborder leftborder" id="left"></div>
  <div class="content" id="content"></div>
  <div class="vborder rightborder" id="right"></div>
  <div class="hborder bottomborder" id="bot"></div>
  <div class="corner nesw sw" id="sw"></div>
  <div class="corner nwse se" id="se"></div>
</div>
`
