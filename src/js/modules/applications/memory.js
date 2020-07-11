import DesktopWindow from '../desktop/desktopwindow.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
.brick {
    width: 70px;
    height: 70px;
}
.brick4 {
    width: 140px;
    height: 140px;
}
#board {
    padding: 5px;
    margin: 0 auto;
    text-align: center
}
.hidden {
    visibility: hidden;
}
</style>
`

export default class Memory extends DesktopWindow {
  /**
   * @param {number} offsetY - Should be size of menu bar
   * @param {string} icon - Filename of icon to use on window
   */
  constructor (offsetY, icon) {
    super(300, 300, offsetY, 'Memory')
    this.shadowRoot.insertBefore(template.content.cloneNode(true), this.shadowRoot.firstChild)
    this.setTitlebar('Memory')
    this.setIcon(icon)
    this._imgdir = './image/memory/'
    this._initialize()
  }

  /**
   * Initializes option view
   */
  _initialize () {
    const div = document.createElement('div')
    div.setAttribute('id', 'board')

    const h3 = document.createElement('h3')
    h3.textContent = 'Choose board size:'

    const select = document.createElement('select')
    const o1 = document.createElement('option')
    o1.innerText = '4x4'
    o1.value = '16'
    const o2 = document.createElement('option')
    o2.innerText = '2x2'
    o2.value = '4'
    select.append(o1, o2)

    const ok = document.createElement('input')
    ok.setAttribute('type', 'submit')
    ok.value = 'Start'
    ok.onclick = () => {
      this._startGame(+select.options[select.selectedIndex].value)
    }

    div.append(h3, select, ok)
    this.setContent(div)
  }

  /**
   * Start game with chosen option
   * @param {number} size - Number of bricks -- 4 or 16
   */
  _startGame (size) {
    this.gameType = size
    this._comparisons = 0
    this._prevBrick = null
    this._memArray = []
    this._bricksLeftCount = size
    for (let i = 1; i <= size / 2; i++) {
      this._memArray.push(i)
      this._memArray.push(i)
    }
    this._content.innerHTML = ''
    this._createBoard(size)
  }

  /**
   * Generates the board
   * @param {number} size - Number of bricks -- 4 or 16
   */
  _createBoard (size) {
    this._board = document.createElement('div')
    this._board.setAttribute('id', 'board')
    this._content.appendChild(this._board)
    if (size === 16) {
      for (let i = 0; i < 16; i++) {
        const a = document.createElement('a')
        a.href = '#'
        const img = document.createElement('img')
        img.src = this._imgdir + '0.png'
        img.classList.add('brick')
        img.setAttribute('id', i)
        a.append(img)
        this._board.appendChild(a)
        if ((i + 1) % 4 === 0) {
          this._board.appendChild(document.createElement('br'))
        }
      }
    } else if (size === 4) {
      for (let i = 0; i < 4; i++) {
        const a = document.createElement('a')
        a.href = '#'
        const img = document.createElement('img')
        img.src = this._imgdir + '0.png'
        img.classList.add('brick4')
        img.setAttribute('id', i)
        a.append(img)
        this._board.appendChild(a)
        if (i === 1) {
          this._board.appendChild(document.createElement('br'))
        }
      }
    }
    this._shuffle()
    this._board.addEventListener('click', event => {
      this._brickListener(event)
    })
  }

  /**
   * Takes event target and sends to compare function
   * @param {event} event - Send click event on brick here
   */
  _brickListener (event) {
    const element = event.target.nodeName === 'IMG' ? event.target : event.target.firstChild
    if (element !== null) {
      const i = element.getAttribute('id')
      element.setAttribute('src', this._imgdir + this._memArray[i] + '.png')
      this._compare(element)
    }
  }

  /**
   * Compares two bricks. If no previous brick is set, sets brick as previous
   * @param {element} brick - Reference to brick element
   */
  _compare (brick) {
    if (this._prevBrick !== null) {
      if (brick === this._prevBrick) {
        return
      }
      this._comparisons++
      const i1 = brick.getAttribute('id')
      const i2 = this._prevBrick.getAttribute('id')

      if (this._memArray[i1] === this._memArray[i2]) {
        const prev = this._prevBrick
        setTimeout(() => {
          brick.classList.add('hidden')
          prev.classList.add('hidden')
        }, 300)
        this._prevBrick = null
        this._bricksLeftCount -= 2
      } else {
        const prev = this._prevBrick
        setTimeout(() => {
          brick.setAttribute('src', this._imgdir + '0.png')
          prev.setAttribute('src', this._imgdir + '0.png')
        }, 500)
        this._prevBrick = null
      }
    } else {
      this._prevBrick = brick
    }
    if (this._bricksLeftCount < 1) {
      setTimeout(() => {
        this._success()
      }, 300)
    }
  }

  /**
   * Shuffles array of brick values
   */
  _shuffle () {
    for (let i = 0; i < this._memArray.length; i++) {
      const j = Math.floor(Math.random() * this._memArray.length)
      const tmp = this._memArray[j]
      this._memArray[j] = this._memArray[i]
      this._memArray[i] = tmp
    }
  }

  /**
   * Presents success view with options to reset highscore and play new game
   */
  _success () {
    this._board.innerHTML = ''
    const h3 = document.createElement('h3')
    h3.innerText = 'Congratulations!'
    const h4 = document.createElement('h4')
    h4.innerText = 'You completed ' + ((this.gameType === 16) ? '4x4' : '2x2') + ' in ' + this._comparisons + ' comparisons.'
    const hsText = document.createElement('h4')

    const highscore = localStorage.getItem('mem' + this.gameType)
    if (highscore === null) {
      const t = document.createTextNode('New highscore!')
      hsText.appendChild(t)
      localStorage.setItem('mem' + this.gameType, this._comparisons)
    } else {
      if (highscore > this._comparisons) {
        const t = document.createTextNode('You beat previous highscore of ' + highscore + ' comparisons')
        hsText.appendChild(t)
        localStorage.setItem('mem' + this.gameType, this._comparisons)
      } else {
        const t = document.createTextNode('You didn\'t beat current highscore of ' + highscore + ' comparisons')
        hsText.appendChild(t)
      }
    }

    const ok = document.createElement('input')
    ok.setAttribute('type', 'submit')
    ok.value = 'Play again!'
    ok.onclick = () => {
      this._initialize()
    }
    const reset = document.createElement('input')
    reset.setAttribute('type', 'submit')
    reset.value = 'Reset highscore'
    reset.onclick = () => {
      console.log('reset på mem' + this.gameType)
      localStorage.removeItem('mem' + this.gameType)
    }
    this._board.append(h3, h4, hsText, ok, document.createElement('br'), reset)
  }
}

window.customElements.define('memory-window', Memory)
