
export const template = document.createElement('template')
template.innerHTML = `
<style>
.paint {
  padding: 5px;
    display: grid;
    grid-template-areas:
    'brushes canvas'
    'usedcolor colors';
    justify-content: start;
    grid-gap: 5px;
}
canvas {        
    border: 2px solid black;
}
canvas:hover {
  cursor: crosshair;
}
.brushes {
    grid-area: brushes;
}
.colors {
    grid-area: colors;
}
#usedcolor {
    grid-area: usedcolor;
    background-color: black;
}
</style>
<div class="paint">
  <div class="brushes"></div>
  <canvas id="canvas"></canvas>
  <div id="usedcolor"></div>
  <div class="colors"><div>
</div>
`
export const brushes = document.createElement('template')
brushes.innerHTML = `
<style>
hr {
  background-color: black;
  width: 50px;
}
hr:hover {
    cursor:pointer;
}
hr.selected {
  border: 3px solid red;
}
#brush1 {
  height: 3px;
}
#brush2 {
  height: 5px;
}
#brush3 {
  height: 10px;
}
#brush4 {
  height: 15px;
}
#brush5 {
  height: 20px;
}
</style>
<hr id="brush1" class="selected">
<hr id="brush2">
<hr id="brush3">
<hr id="brush4">
<hr id="brush5">
`

export const colors = document.createElement('template')
colors.innerHTML = `
<style>
span.color {
  display: inline-block;
  width: 30px;
  height: 20px;
  border: 2px solid black; 
}
span.color.selected {
  border: 2px solid red;
}

span.color:hover {
    cursor: pointer;
}

</style>
<span class="color" id="black"></span>
<span class="color" id="red"></span>
<span class="color" id="green"></span>
<span class="color" id="yellow"></span>

<span class="color" id="cyan"></span>
<span class="color" id="magenta"></span>
<span class="color" id="maroon"></span>
<span class="color" id="orange"></span>
<span class="color" id="lime"></span>
<span class="color" id="grey"></span>
`
