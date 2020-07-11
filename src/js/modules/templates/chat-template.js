export const template = document.createElement('template')
template.innerHTML = `
<style>
#chat {
    padding: 5px;
    text-align: center;
}

#messages {
  height: 450px;
  width: 485px;
  padding: 5px;
  overflow-y: scroll;
  text-align: left;
  overflow-wrap: break-word;
}

textarea {
  resize: none;
}

.chatinput {
  position: absolute;
  bottom: 10px  
}

hr {
  width: 450px;
}

#user {  
  font-weight: bold;
  text-decoration: underline;
  margin-bottom: 3px;
}

#msg {  
  margin-bottom: 10px;
}

#change {
  font-size: 11px;
  margin-left: 10px;
}

#interact {
  text-align: left;
  margin-left: 10px;
}

table {
  margin: 0;
  padding: 0;
}

#send {
  height: 70px;
  font-size: 20px;
}
</style>
<div id="chat">
  <div id="messages"></div>
  <hr>
  <div id="interact">
    <h3>Connecting to chat...</h3>
  </div>
</div>
`

export const openedView = document.createElement('template')
openedView.innerHTML = `
<p>Enter a name. This will be stored, but can be changed later.</p>
<form class="setname">  
  Name:
  <input type="field" id="username" autofocus>
  <input type="submit" id="submit" value="Let's chat!">
</form>
`

export const chatView = document.createElement('template')
chatView.innerHTML = `
<span>Chatting as <b id="nickname"></b></span><input type="submit" id="change" value="Change">
<form class="chatinput">
  <table>
    <tr>
      <td>Message:</td>
      <td><textarea id="message" rows="4" cols="37" autofocus></textarea></td>
      <td><input type="submit" value="Send" id="send"></td>
    </tr>
  </table>
</form>
`

export const msgTemplate = document.createElement('template')
msgTemplate.innerHTML = `
<div id="user"></div>
<div id="msg"></div>
`
