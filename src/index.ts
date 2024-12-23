import WebSocket, { WebSocketServer } from 'ws'
import { findParts, getParts, getProduct } from './db'
import { dirname, join } from 'path'
import express from 'express'
import { Message, MessageType } from './types'

const __dirname = 'C:/Users/Adam/Documents/SAP Website/temp/'

const app = express()
app.use(express.static(join(__dirname, 'public')))
const wss = new WebSocketServer({ port: 8080 })

app.get('/', async (req, res) => {
  res.send(join(__dirname, 'public', 'index.html'))
})

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', async data => {
    try {
      const m = JSON.parse(String(data)) as Message

      switch (m.type) {
        case MessageType.SearchParts:
          const data1 = (await findParts(m.data.text)) as Object
          const res1: Message = { type: MessageType.Response, id: m.id, data: data1 }
          ws.send(JSON.stringify(res1))
          break
        case MessageType.GetProduct:
          console.log(m)
          const data2 = await getProduct(m.data.uid)
          const res2: Message = { type: MessageType.Response, id: m.id, data: data2 }
          ws.send(JSON.stringify(res2))
          break
      }
    } catch (e) {
      console.log(e)
    }
  })
})

app.listen(3000, () => console.log('http://192.168.2.117:3000/'))


