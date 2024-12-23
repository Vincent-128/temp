import { getId } from './utils.js'

const wsMessages = {}
const ws = new WebSocket('ws://192.168.2.117:8080')

ws.onmessage = message => {
  const data = JSON.parse(message.data)
  if ('id' in data) {
    if (data.type == 8) {
      wsMessages[data.id](data.data)
      delete wsMessages[data.id]
    } else {
      console.log(data)
    }
  }
}

const send = (type, data) => {
  const id = getId()
  return new Promise((resolve, reject) => {
    wsMessages[id] = resolve
    ws.send(JSON.stringify({ id, type, data }))
    setTimeout(() => reject('Timeout'), 5000)
  })
}

// Create BOM tree structure
function createBOMTree(item) {
  const li = document.createElement('li')
  const content = document.createElement('div')
  content.className = 'bom-item'

  const name = document.createElement('span')
  name.textContent = `${item.uid} (Qty: ${item.qty})`
  content.appendChild(name)

  if (item.sub && item.sub.length > 0) {
    const toggle = document.createElement('button')
    toggle.textContent = '+'
    toggle.className = 'toggle'
    content.insertBefore(toggle, content.firstChild)

    const ul = document.createElement('ul')
    ul.className = 'nested'
    item.sub.forEach(component => {
      ul.appendChild(createBOMTree(component))
    })

    toggle.addEventListener('click', () => {
      toggle.textContent = toggle.textContent === '+' ? '-' : '+'
      ul.classList.toggle('active')
    })

    li.appendChild(content)
    li.appendChild(ul)
  } else {
    li.appendChild(content)
  }

  return li
}

// Enhance BOM tree styles
const enhancedStyle = document.createElement('style')
enhancedStyle.textContent = `
    .bom-item {
        padding: 8px 12px;
        margin: 4px 0;
        background: linear-gradient(to right, #ffffff, #f0f0f0);
        border: 1px solid #ddd;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        transition: all 0.2s ease;
    }

    .bom-item:hover {
        transform: translateX(5px);
        box-shadow: 3px 3px 7px rgba(0,0,0,0.15);
    }

    .toggle {
        background: linear-gradient(to bottom, #ffffff, #e0e0e0);
        border: 1px solid #ccc;
        transition: all 0.2s ease;
    }

    .toggle:hover {
        background: linear-gradient(to bottom, #f0f0f0, #d0d0d0);
        transform: scale(1.1);
    }
`
document.head.appendChild(enhancedStyle)

// Add styles to document
const style = document.createElement('style')
style.textContent = `
    .bom-tree {
        list-style-type: none;
        padding-left: 20px;
    }
    
    .bom-item {
        padding: 5px;
        margin: 2px 0;
        background-color: #f5f5f5;
        border-radius: 4px;
        display: flex;
        align-items: center;
    }
    
    .toggle {
        width: 20px;
        height: 20px;
        margin-right: 8px;
        background-color: #ddd;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    
    .nested {
        display: none;
        list-style-type: none;
        padding-left: 30px;
    }
    
    .nested.active {
        display: block;
    }
`
document.head.appendChild(style)

// Initialize BOM tree
window.onload = async () => {
  const bomTree = document.createElement('ul')
  const data = await send(4, { uid: 'A0' })
  bomTree.className = 'bom-tree'
  document.body.appendChild(createBOMTree(data))
}
