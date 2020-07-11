import { template } from '../templates/window-template.js'

export default class DesktopWindow extends window.HTMLElement {
  /**
   * @param {number} minX - Set minimum width of window when resized
   * @param {number} minY - Set minimum height of window when resized
   * @param {number} offsetY - Should be height of menu bar
   * @param {string} name - Reported name of window
   */
  constructor (minX, minY, offsetY, name) {
    super()
    this.name = name
    this.minX = minX
    this.minY = minY
    this.offsetY = offsetY
    this.W_HEIGHT = 40
    this.W_WIDTH = 10
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._element = this.shadowRoot.querySelector('#window')
    this._content = this.shadowRoot.querySelector('#content')
    this._makeWindowResizable()
    this._makeWindowDraggable()
  }

  connectedCallback () {
    this.click = this.shadowRoot.addEventListener('click', event => this._clickEvent(event))
    this._element.querySelector('#close').addEventListener('click', event => {
      event.stopPropagation()
      const ce = new CustomEvent('remove', { detail: { source: () => this } })
      this.parentElement.dispatchEvent(ce)
    })
  }

  disconnectedCallback () {
    this.shadowRoot.removeEventListener('click', event => this._clickEvent(event))
  }

  /**
   * Event dispatched when window is clicked on
   * @param {event} event
   */
  _clickEvent (event) {
    const ce = new CustomEvent('top', { detail: { source: () => this }, bubbles: true, cancelable: false })
    this.parentElement.dispatchEvent(ce)
  }

  /**
   * Adds listeners on window to make it user-movable
   */
  _makeWindowDraggable () {
    const titlebar = this._element.querySelector('#titlebar')
    const windowe = this._element
    const offsetY = this.offsetY
    let originalMouseX, originalMouseY, originalX, originalY, windowHeight, windowWidth, viewHeight, viewWidth
    addListener(titlebar)

    function addListener (element) {
      element.addEventListener('mousedown', e => {
        originalMouseX = e.clientX
        originalMouseY = e.clientY
        viewWidth = window.innerWidth
        viewHeight = window.innerHeight
        originalX = windowe.getBoundingClientRect().left
        originalY = windowe.getBoundingClientRect().top
        windowHeight = windowe.getBoundingClientRect().bottom - originalY
        windowWidth = windowe.getBoundingClientRect().right - originalX

        element.click()
        e.preventDefault()
        document.addEventListener('mousemove', dragWindow)
        document.addEventListener('mouseup', function el () {
          document.removeEventListener('mousemove', dragWindow)
          document.removeEventListener('mouseup', el)
        })
      })
    }

    function dragWindow (e) {
      let left = originalX + e.clientX - originalMouseX
      let top = originalY + e.clientY - originalMouseY
      const maxTop = viewHeight - windowHeight
      const maxLeft = viewWidth - windowWidth

      if (left < 0) {
        left = 0
      }
      if (left > maxLeft) {
        left = maxLeft
      }
      if (top < offsetY) {
        top = offsetY
      }
      if (top > maxTop) {
        top = maxTop
      }
      windowe.style.left = left + 'px'
      windowe.style.top = top + 'px'
    }
  }

  /**
   * Adds listeners on window to make it user-resizable
   */
  _makeWindowResizable () {
    const W_HEIGHT = this.W_HEIGHT
    const W_WIDTH = this.W_WIDTH
    const resizables = this._element.children
    const content = this._content
    const windowe = this._element
    const minX = this.minX
    const minY = this.minY
    let originalWidth, originalHeight, originalX, originalY, originalMouseX, originalMouseY

    addListener(resizables[0], reNW)
    addListener(resizables[1], reNE)
    addListener(resizables[2], reTop)
    addListener(resizables[4], reLeft)
    addListener(resizables[6], reRight)
    addListener(resizables[7], reBot)
    addListener(resizables[8], reSW)
    addListener(resizables[9], reSE)

    function addListener (element, type) {
      element.addEventListener('mousedown', e => {
        originalWidth = content.style.width.replace('px', '')
        originalHeight = content.style.height.replace('px', '')
        originalX = windowe.getBoundingClientRect().left
        originalY = windowe.getBoundingClientRect().top
        originalMouseX = e.clientX
        originalMouseY = e.clientY
        element.click()
        e.preventDefault()
        document.addEventListener('mousemove', type)
        document.addEventListener('mouseup', function el () {
          document.removeEventListener('mousemove', type)
          document.removeEventListener('mouseup', el)
        })
      })
    }

    function reRight (e) {
      const width = e.clientX - content.getBoundingClientRect().left
      if (width <= minX) {
        return
      }
      content.style.width = width + 'px'
      windowe.style.width = content.scrollWidth + W_WIDTH + 'px'
    }

    function reBot (e) {
      const height = e.clientY - content.getBoundingClientRect().top
      if (height <= minY) {
        return
      }
      content.style.height = height + 'px'
      windowe.style.height = content.scrollHeight + W_HEIGHT + 'px'
    }

    function reLeft (e) {
      const width = originalWidth - (e.clientX - originalMouseX)
      if (width <= minX) {
        return
      }
      content.style.width = width + 'px'
      windowe.style.left = originalX + (e.clientX - originalMouseX) + 'px'
      windowe.style.width = content.scrollWidth + W_WIDTH + 'px'
    }

    function reTop (e) {
      const height = originalHeight - (e.clientY - originalMouseY)
      if (height <= minY) {
        return
      }
      content.style.height = height + 'px'
      windowe.style.top = originalY + (e.clientY - originalMouseY) + 'px'
      windowe.style.height = content.scrollHeight + W_HEIGHT + 'px'
    }

    function reSE (e) {
      reBot(e)
      reRight(e)
    }

    function reNW (e) {
      reLeft(e)
      reTop(e)
    }

    function reNE (e) {
      reTop(e)
      reRight(e)
    }

    function reSW (e) {
      reBot(e)
      reLeft(e)
    }
  }

  /**
   * Set dimensions of window
   * @param {number} width - Width
   * @param {number} height - Height
   */
  setSize (width, height) {
    this._width = width
    this._height = height
    this._update()
  }

  /**
   * Sets position of window
   * @param {number} offsetX - Offset from left
   * @param {number} offsetY - Offset from top
   */
  setPosition (offsetX, offsetY) {
    this._posX = offsetX
    this._posY = offsetY
    this._update()
  }

  /**
   * Set z-index of window
   * @param {number} int - New z-index
   */
  setZ (int) {
    this._element.style.zIndex = int
  }

  /**
   * Get name of window
   * @returns {string}
   */
  getName () {
    return this.name
  }

  /**
   * Updates width and position of window
   */
  _update () {
    this._element.style.top = this._posY + 'px'
    this._element.style.left = this._posX + 'px'
    this._content.style.width = this._width + 'px'
    this._content.style.height = this._height + 'px'
    this._element.style.width = this._width + this.W_WIDTH + 'px'
    this._element.style.height = this._height + this.W_HEIGHT + 'px'
  }

  /**
   * Set titlebar of window
   * @param {string} text - Name in titlebar
   */
  setTitlebar (text) {
    this._titlebar = this.shadowRoot.querySelector('#titlebar')
    const title = document.createElement('p')
    title.innerText = text
    // const title = document.createTextNode(text)
    this._titlebar.appendChild(title)
  }

  /**
   * Set window icon in titlebar
   * @param {string} icon - Full pathway to icon
   */
  setIcon (icon) {
    this.shadowRoot.querySelector('#icon').setAttribute('src', icon)
  }

  /**
   * @param {HTMLElement} content - Replaces children of content div
   */
  setContent (content) {
    this._content = this.shadowRoot.querySelector('#content')
    this._content.innerHTML = ''
    this._content.appendChild(content)
  }

  /**
   * Set window style as active (shadow and full opacity)
   */
  setActive () {
    this._element.style.boxShadow = '0 0 10px black'
    this._element.style.opacity = null
  }

  /**
   * Set window style as passive (no shadow, 90% opacity)
   */
  setPassive () {
    this._element.style.boxShadow = null
    this._element.style.opacity = 0.9
  }

  /**
   * @param {boolean} option - True to lower opacity, false to show as active.
   */
  preview (option) {
    this._element.style.opacity = option === true ? null : 0.9
  }
}

window.customElements.define('desktop-window', DesktopWindow)
