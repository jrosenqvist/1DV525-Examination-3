import DesktopWindow from '../desktop/desktopwindow.js'
import { template, brushes, colors } from '../templates/paint-template.js'

export default class Paint extends DesktopWindow {
  /**
   * @param {number} offsetY - Should be size of menu bar
   * @param {string} icon - Filename of icon to use on window
   */
  constructor (offsetY, icon) {
    super(480, 345, offsetY, 'Paint')
    this._content.appendChild(template.content.cloneNode(true))
    this.setTitlebar('Paint')
    this.setIcon(icon)

    this._initialize()
  }

  /**
   * Initialize the view and add listeners
   */
  _initialize () {
    this._size = 3
    this._color = 'black'

    this.shadowRoot.querySelector('.brushes').appendChild(brushes.content.cloneNode(true))
    this.shadowRoot.querySelector('.colors').appendChild(colors.content.cloneNode(true))

    const canvas = this.shadowRoot.querySelector('#canvas')
    canvas.width = 400
    canvas.height = 300

    this._makePaintable(canvas)
    this._brushListener(this.shadowRoot.querySelector('.brushes'))
    this._colorListener(this.shadowRoot.querySelector('.colors'))

    // Use element id:s to set colors
    const colorSpans = this.shadowRoot.querySelector('.colors').getElementsByTagName('span')
    for (let i = 0; i < colorSpans.length; i++) {
      colorSpans[i].style.backgroundColor = colorSpans[i].id
    }
  }

  /**
   * Adds listener to brush size selector
   * @param {HTMLDivElement} element - Element containing brush hr:s
   */
  _brushListener (element) {
    element.addEventListener('click', event => {
      if (event.target.tagName === 'HR') {
        this._size = event.target.getBoundingClientRect().height - 1.5
        const selected = element.getElementsByClassName('selected')[0]
        selected.classList.remove('selected')
        event.target.classList.add('selected')
      }
    })
  }

  /**
   * Adds listener to color selector
   * @param {HTMLDivElement} element - Element containing color spans
   */
  _colorListener (element) {
    element.addEventListener('click', event => {
      if (event.target.tagName === 'SPAN') {
        this._color = event.target.id
        this.shadowRoot.querySelector('#usedcolor').style.backgroundColor = this._color
      }
    })
  }

  /**
   * Makes canvas paintable. Requires class variables _size and _color to be set when event listener is executing
   * @param {HTMLCanvasElement} element - Canvas element
   */
  _makePaintable (element) {
    const ctx = element.getContext('2d')
    let size, color

    element.addEventListener('mousedown', event => {
      size = this._size
      color = this._color
      event.stopPropagation()
      element.addEventListener('mousemove', addFill)
      document.addEventListener('mouseup', function el () {
        element.removeEventListener('mousemove', addFill)
        document.removeEventListener('mouseup', el)
      })
    })

    function addFill (event) {
      const cPos = event.target.getBoundingClientRect()
      const scaleX = cPos.width / event.target.width
      const scaleY = cPos.height / event.target.height
      const posY = (event.clientY - cPos.top) / scaleY
      const posX = (event.clientX - cPos.left) / scaleX

      ctx.beginPath()
      ctx.arc(posX, posY, (size / 2), 0, Math.PI * 2, false)
      ctx.fillStyle = color
      ctx.fill()
    }
  }
}

window.customElements.define('paint-window', Paint)
