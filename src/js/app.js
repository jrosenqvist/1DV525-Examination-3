import Surface from './modules/desktop/surface.js'
import Chat from './modules/applications/chat.js'
import Memory from './modules/applications/memory.js'
import Paint from './modules/applications/paint.js'

let offsets = 0
const offsetY = 40
const offsetX = 40
const menuOffset = 40
const windowIcons = './image/window/'

const s = new Surface()

document.querySelector('body').appendChild(s)
s.addMenuItem('chat', 'chat-24px.svg')
s.addMenuItem('memory', 'casino-24px.svg')
s.addMenuItem('paint', 'brush-24px.svg')

s.addEventListener('newWindow', event => {
  event.stopPropagation()
  if (s.getWindowCount() < 1) {
    offsets = 0
  }
  let sizeX, sizeY, newWin
  switch (event.detail) {
    case 'chat':
      newWin = new Chat(menuOffset, windowIcons + 'chat.png')
      sizeX = newWin.minX
      sizeY = newWin.minY
      break
    case 'memory':
      newWin = new Memory(menuOffset, windowIcons + 'memory.png')
      sizeX = newWin.minX
      sizeY = newWin.minY
      break
    case 'paint':
      newWin = new Paint(menuOffset, windowIcons + 'paint.png')
      sizeX = newWin.minX
      sizeY = newWin.minY
  }
  newWin.setSize(sizeX, sizeY)
  if (offsetX * offsets + sizeX + 50 > window.innerWidth ||
        menuOffset + offsetY * offsets + sizeY + 50 > window.innerHeight) {
    offsets = 0
  }
  const posX = offsetX * offsets + 10
  const posY = menuOffset + offsetY * offsets + 10
  newWin.setPosition(posX, posY)
  offsets++
  s.attachWindow(newWin)
})
