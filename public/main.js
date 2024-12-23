import { debounce, getId } from './utils.js'

const wsMessages = {}
const ws = new WebSocket('ws://192.168.2.158:8080')

let input
let results

document.addEventListener('DOMContentLoaded', () => {
  input = document.getElementById('search')
  results = document.getElementById('results')

  const test = debounce(async e => {
    console.log(input.value)
    const data = await send({ text: input.value })
    results.innerHTML = data.map(d => `<div>${d.uid}</div><div>${d.id}</div><div>${d.name}</div>`).join('\n')
  }, 0)

  document.getElementById('search').addEventListener('input', test)
})

ws.onmessage = message => {
  const data = JSON.parse(message.data)
  if ('wsId' in data) {
    wsMessages[data.wsId](data.data)
    delete wsMessages[data.wsId]
  }
}

const send = data => {
  const wsId = getId()
  return new Promise((resolve, reject) => {
    wsMessages[wsId] = resolve
    ws.send(JSON.stringify({ wsId, data }))
    setTimeout(() => reject('Timeout'), 5000)
  })
}
