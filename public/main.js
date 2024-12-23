// @ts-nocheck
import { debounce, getId } from './utils.js'

const wsMessages = {}
const ws = new WebSocket('ws://192.168.2.117:8080')

let results
let parts

const arrow0 = `<div class="arrow"></div>`
const arrow1 = `<svg class="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10" stroke-width="1" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M 1 0 V 5" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M 1 5 H 9 M 7 3 L 9 5 L 7 7" />M 1 0 V 5
  </svg>`

const arrow2 = `<svg class="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10" stroke-width="1" stroke="currentColor">
  <path d="M 1 0 V10" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M 1 5 H 9 M 7 3 L 9 5 L 7 7" />
</svg>`

const arrow3 = `<svg class="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10" stroke-width="1" stroke="currentColor">
  <path d="M 1 0 V 10" />
</svg>`

const g = data => {
  if (data.qty) return `${parts[data.uid].name} x ${data.qty}`
  return parts[data.uid].name
}

const createRow = (data, arrows, index, length) => {
  const isLast = index == length - 1

  if (data.sub) {
    return (
      `<div class="row">${isLast ? arrows + arrow1 : arrows + arrow2}<div>${g(data)}</div></div>` +
      data.sub.map((s, i) => createRow(s, isLast ? arrows + arrow0 : arrows + arrow3, i, data.sub.length)).join('')
    )
  } else {
    return `<div class="row">${isLast ? arrows + arrow1 : arrows + arrow2}<div>${g(data)}</div></div>`
  }
}

const get = async () => {
  const res = await send(4, { uid: 'A0' })
  parts = res.parts
  console.log(res)

  let html = `<div class="row">${g(res)}</div>`
  html += res.sub.sort((a, b) => a.uid < b.uid ? 1 : -1).map((s, i) => createRow(s, '', i, res.sub.length)).join('')
  results.innerHTML = html
}

document.addEventListener('DOMContentLoaded', () => {
  results = document.getElementById('results')
})

ws.onopen = () => {
  get()
}

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
