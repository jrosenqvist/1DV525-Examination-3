import DesktopWindow from '../desktop/desktopwindow.js'
import { template, openedView, msgTemplate, chatView } from '../templates/chat-template.js'

export default class Chat extends DesktopWindow {
  /**
   * @param {number} offsetY - Should be size of menu bar
   * @param {string} icon - Filename of icon to use on window
   */
  constructor (offsetY, icon) {
    super(500, 600, offsetY, 'Chat')
    this.setTitlebar('Chat')
    this.setIcon(icon)
    this._url = 'REMOVED'
    this._key = 'REMOVED'
    this._content = this.shadowRoot.querySelector('#content')
    this._content.appendChild(template.content.cloneNode(true))
    this._history = []
    this._username = ''
    this._initialize()
  }

  /**
   * Open websocket and present intial view
   */
  _initialize () {
    const messages = this._content.querySelector('#messages')

    // Fill history with stored messages //
    if (localStorage.getItem('chatlog')) {
      this._history = JSON.parse(localStorage.getItem('chatlog'))
      for (let i = 0; i < this._history.length; i++) {
        this._appendMessage(this._history[i])
      }
    }
    if (localStorage.getItem('chatname')) {
      this._username = localStorage.getItem('chatname')
    }
    // Set up websocket and listen for messages
    this._ws = new WebSocket(this._url)
    this._ws.onopen = () => {
      messages.scrollTop = messages.scrollHeight
      this._ws.onmessage = event => {
        const data = JSON.parse(event.data)
        if (data.type === 'message') {
          const msg = { user: data.username, message: data.data }
          this._appendMessage(msg)
          messages.scrollTop = messages.scrollHeight
          this._history.push(msg)
          if (this._history.length > 200) {
            this._history.slice(this._history.length - 200, this._history.length)
          }
          localStorage.setItem('chatlog', JSON.stringify(this._history))
        }
      }
      if (this._username === '') {
        this._setUsername()
      } else {
        this._startChat()
      }
    }
    this._ws.onclose = () => {
      this._initialize()
    }
  }

  /**
   * Show chat view with message input
   */
  _startChat () {
    const interact = this._content.querySelector('#interact')
    interact.innerHTML = ''
    interact.appendChild(chatView.content.cloneNode(true))
    interact.querySelector('#nickname').innerText = this._username
    interact.querySelector('#change').addEventListener('click', event => {
      event.stopPropagation()
      event.preventDefault()
      this._setUsername()
    }, { once: true })
    const send = interact.querySelector('#send')
    const message = interact.querySelector('#message')
    message.focus()
    send.addEventListener('click', event => {
      event.stopPropagation()
      event.preventDefault()
      if (message.value.length > 0) {
        this._sendMessage(message.value)
        message.value = null
        message.removeAttribute('placeholder')
      } else {
        message.setAttribute('placeholder', 'You need to write something')
      }
      message.focus()
    })
    interact.querySelector('#message').addEventListener('keydown', event => {
      event.stopPropagation()
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault()
        send.click()
      }
    })
  }

  /**
   * Present view to enter username and store value
   */
  _setUsername () {
    const interact = this._content.querySelector('#interact')
    interact.innerHTML = ''
    interact.appendChild(openedView.content.cloneNode(true))
    const user = interact.querySelector('#username')
    user.focus()
    interact.querySelector('#submit').addEventListener('click', event => {
      event.preventDefault()
      event.stopPropagation()
      if (user.value === '') {
        user.setAttribute('placeholder', 'Username is required')
      } else {
        this._username = user.value
        localStorage.setItem('chatname', this._username)
        this._startChat()
      }
    })
    user.addEventListener('keydown', event => {
      event.stopPropagation()
      if (event.keyCode === 13) {
        event.preventDefault()
        interact.querySelector('#submit').click()
      }
    })
  }

  _sendMessage (data) {
    const send = {
      type: 'message',
      data: data,
      username: this._username,
      key: this._key
    }
    this._ws.send(JSON.stringify(send))
  }

  _appendMessage (object) {
    const tmp = msgTemplate.content.cloneNode(true)
    tmp.querySelector('#user').innerText = object.user
    tmp.querySelector('#msg').innerText = object.message
    this.shadowRoot.querySelector('#messages').append(tmp)
  }
}

window.customElements.define('chat-window', Chat)
