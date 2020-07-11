import { template, menuitem, windowlist } from '../templates/surface-template.js'

export default class Surface extends HTMLElement {
  constructor () {
    super()

    this.style.zIndex = -1
    this._windows = []

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this._main = this.shadowRoot.querySelector('main')
    this._nav = this.shadowRoot.querySelector('nav')
    this._createWindowList()
  }

  connectedCallback () {
    this._main.addEventListener('top', event => {
      for (let i = 0; i < this._windows.length; i++) {
        if (event.detail.source() === this._windows[i]) {
          this._windows.splice(i, 1)
          this._windows.push(event.detail.source())
          this._updateZ()
          this._updateWindowList()
          return
        }
      }
    })
    this._main.addEventListener('remove', event => this._closeWindow(event))
  }

  /**
   * Creates and attaches windowlist and menu item
   */
  _createWindowList () {
    const menuitem = document.createElement('div')
    const img = document.createElement('img')
    img.src = './image/menu/menu-24px.svg'
    img.style = 'height: 30px;'
    img.id = 'windowlist-img'
    menuitem.appendChild(img)
    menuitem.setAttribute('class', 'windowlist')

    this._nav.appendChild(menuitem)
    menuitem.addEventListener('click', event => {
      event.stopPropagation()
      this._toggleWindowList()
    })

    const wl = windowlist.content.cloneNode(true)
    this._nav.appendChild(wl)
  }

  /**
   * Sets 10 most recently used windows to open window list
   */
  _updateWindowList () {
    const wl = this._nav.querySelector('#windowlist')
    wl.innerHTML = ''
    if (this._windows.length < 1) {
      const li = document.createElement('li')
      li.setAttribute('class', 'empty')
      li.innerText = 'No open windows'
      wl.appendChild(li)
    } else {
      // Add up to 10 windows in order of recently accessed
      let stop = (this._windows.length > 10) ? 10 : this._windows.length
      let i = this._windows.length - 1

      do {
        const w = this._windows[i]
        const li = document.createElement('li')

        // Add 'preview' on hover of list item
        li.addEventListener('mouseover', event => {
          w.setActive()
          for (let j = 0; j < this._windows.length; j++) {
            if (this._windows[j] !== w) {
              this._windows[j].style.visibility = 'hidden'
            }
          }
          li.addEventListener('mouseout', event => {
            for (let k = 0; k < this._windows.length; k++) {
              this._windows[k].style.visibility = null
              w.setPassive()
            }
          })
        })

        // Attach icons beside window names
        const icon = document.createElement('img')
        const text = document.createTextNode(' ' + w.getName())
        switch (w.getName()) {
          case 'Memory': icon.src = './image/menu/casino-24px.svg'
            break
          case 'Paint': icon.src = './image/menu/brush-24px.svg'
            break
          case 'Chat': icon.src = './image/menu/chat-24px.svg'
        }
        icon.style.height = '15px'
        li.append(icon, text)

        li.addEventListener('click', event => {
          event.stopPropagation()
          this._updateWindowList()
          this._toggleWindowList()
          w._clickEvent()
        }, { once: true })
        wl.appendChild(li)
        i--
        stop--
      } while (stop > 0)

      if (this._windows.length > 10) {
        const more = document.createElement('li')
        more.setAttribute('class', 'more')
        more.innerText = '...and ' + (this._windows.length - 10) + ' more'
        wl.appendChild(more)
      }

      // Add item for closing all windows
      const close = document.createElement('li')
      close.setAttribute('class', 'close')
      close.innerText = 'Close all windows'
      close.addEventListener('click', e => {
        while (this._windows.length > 0) {
          this._windows[0].shadowRoot.querySelector('#close').click()
        }
        e.stopPropagation()
        this._toggleWindowList()
      })
      wl.appendChild(close)
    }
  }

  /**
   * Shows or hides list of open windows
   */
  _toggleWindowList () {
    const wl = this._nav.querySelector('#windowlist')
    const wlimg = this._nav.querySelector('#windowlist-img')
    if (wl.style.visibility === 'visible') {
      this._updateZ()
      hide()
    } else {
      wl.style.visibility = 'visible'
      wlimg.src = './image/menu/menu_open-24px.svg'
      document.addEventListener('click', event => {
        event.stopPropagation()
        if (event.target !== wl || event.target.closest() !== wl) {
          this._updateZ()
          hide()
        }
      }, { once: true })
    }
    function hide () {
      wl.style.visibility = 'hidden'
      wlimg.src = './image/menu/menu-24px.svg'
    }
  }

  /**
   * Attach a window object to surface
   * @param {DesktopWindow} window - Window to attach
   */
  attachWindow (window) {
    this._main.appendChild(window)
    this._windows.push(window)
    this._updateZ()
    this._updateWindowList()
  }

  /**
   * @param {string} type - Identifier for event handler
   * @param {string} icon - Filename of icon WITHOUT path
   */
  addMenuItem (type, icon) {
    const item = menuitem.content.cloneNode(true)
    const li = item.querySelector('li')
    item.querySelector('img').src = './image/menu/' + icon
    li.setAttribute('type', type)
    this._nav.firstElementChild.appendChild(item)

    li.addEventListener('click', event => {
      event.stopPropagation()
      const ce = new CustomEvent('newWindow', { detail: li.getAttribute('type') })
      this.dispatchEvent(ce)
    })
  }

  _closeWindow (event) {
    this._main.removeChild(event.detail.source())
    for (let i = 0; i < this._windows.length; i++) {
      if (event.detail.source() === this._windows[i]) {
        this._windows.splice(i, 1)
        this._updateZ()
        this._updateWindowList()
        return
      }
    }
  }

  /**
   * Updates z-index of all attached windows
   */
  _updateZ () {
    for (let i = 0; i < this._windows.length; i++) {
      const elem = this._windows[i]
      elem.setZ(i)
      elem.setPassive()
      elem.style.visibility = null
    }
    if (this._windows.length > 0) {
      this._windows[this._windows.length - 1].setActive()
    }
  }

  /**
   * Returns number of open windows
   * @returns {number}
   */
  getWindowCount () {
    return this._windows.length
  }
}

window.customElements.define('desktop-surface', Surface)
