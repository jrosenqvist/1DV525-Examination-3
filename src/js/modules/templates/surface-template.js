export const template = document.createElement('template')
template.innerHTML = `
<style>
  main {
    min-width: 100%;
    min-height: 100vh;
    background-color: dodgerblue;
    background-image: url("./image/bg4.png");
    z-index: -1
  }
  nav {     
    height: 40px;
    width: 100%;
    background-color: white;    
    position: absolute;
    top: 0;
    left: 0;      
    display: block;
    z-index: 1000;
    box-shadow: 0 0 10px black;      
  }
  nav ul {
    list-style-type: none;
    margin: 0;
    padding: 0;    
  }

  nav li {        
    padding: 3px 15px 3px 15px;
    display: inline-block;
  }

  nav li:hover {
    cursor: pointer;
    background-color: gainsboro;    
  }
  
  nav li img {
    height: 30px;        
  }
  
  #windowlist {
    background-color: white;
    opacity: 0.9;
    color: black;    
    position: absolute;
    right: 0px;
    top: 40px;
    visibility: hidden;
    z-index: 9999;
    padding: 0;
    width: 200px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }

  #windowlist li {
    width: 180px;
    padding: 10px 10px 10px 10px;
  }

  #windowlist li.empty:hover {
    cursor: default;
    background-color: white;
  }

  #windowlist li.close {
    text-align: center;
    color: maroon;
    background-color: gainsboro;
  }

  #windowlist li.close:hover {
    background-color: black;
    color: white;
  }

  #windowlist li.more:hover {
    background-color: white;
    cursor: default;
  }
  
  div.windowlist {
    position: absolute; 
    top: 0px; 
    right: 0px;     
    margin: 0;
    padding: 3px 10px 3px 10px;    
  }

  div.windowlist:hover {
    background-color: gainsboro;
    cursor: pointer;
  }
</style>

<nav><ul></ul></nav>
<main></main>
`

export const menuitem = document.createElement('template')
menuitem.innerHTML = `
<li class="menuitem">       
  <img>
</li>
`
export const windowlist = document.createElement('template')
windowlist.innerHTML = `
<ul id="windowlist">
<li class="empty">No open windows</li>
</ul>
`
