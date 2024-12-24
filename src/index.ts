import { findParts, getMachines, getMaterials, getMidwests, getParts, getProduct } from './db'
import { Message, MessageType } from './types'
import { WebSocketServer } from 'ws'
import express from 'express'

// const __dirname = 'C:/Users/Adam/Documents/SAP Website/temp/'
const path = __dirname.substring(0, __dirname.length - 3)

const app = express()
app.use(express.static(path + 'public'))
const wss = new WebSocketServer({ port: 8080 })

app.get('/', async (req, res) => {
  res.send(path + 'public/index.html')
})

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', async data => {
    try {
      const m = JSON.parse(String(data)) as Message

      switch (m.type) {
        case MessageType.SearchParts:
          const data1 = await findParts(m.data.text)
          const res1: Message = { type: MessageType.Response, id: m.id, data: data1 as Object }
          ws.send(JSON.stringify(res1))
          break
        case MessageType.GetProduct:
          const data2 = await getProduct(m.data.uid)
          const res2: Message = { type: MessageType.Response, id: m.id, data: data2 }
          ws.send(JSON.stringify(res2))
          break
        case MessageType.GetMaterials:
          const data3 = await getMaterials()
          const res3: Message = { type: MessageType.Response, id: m.id, data: data3 }
          ws.send(JSON.stringify(res3))
          break
        case MessageType.GetMidwests:
          const data4 = await getMidwests()
          const res4: Message = { type: MessageType.Response, id: m.id, data: data4 }
          ws.send(JSON.stringify(res4))
          break
        case MessageType.GetMachines:
          const data5 = await getMachines()
          const res5: Message = { type: MessageType.Response, id: m.id, data: data5 }
          ws.send(JSON.stringify(res5))
          break
      }
    } catch (e) {
      console.log(e)
    }
  })
})

app.listen(3000, () => console.log('http://192.168.2.117:3000/'))
