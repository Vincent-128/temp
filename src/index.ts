import WebSocket, { WebSocketServer } from 'ws'
import { findParts, getParts, getProduct } from './db'
import { dirname, join } from 'path'
import express from 'express'

const __dirname = '/Users/adamvincent/Downloads/server/'

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
      const m = JSON.parse(String(data))
      const res = await findParts(m.data.text)
      ws.send(JSON.stringify({ wsId: m.wsId, data: res }))
    } catch (e) {
      console.log(e)
    }
  })
})

app.listen(3000, () => console.log('http://192.168.2.158:3000/'))

const test = async () => {
  const uid = 'wnhereDpZ4lD'
  type Res = { productUid: string; uid: string; qty: number; prod: 0 | 1 }[]
  const data = (await getProduct(uid)) as Res

  const getChildren = (parentUid: string): any => {
    return data
      .filter(p => p.productUid == parentUid)
      .map(i => {
        if (i.prod) {
          return { uid: i.uid, qty: i.qty, sub: getChildren(i.uid) }
        }
        return { uid: i.uid, qty: i.qty }
      })
  }

  const t: any = { uid, parts: {}, sub: getChildren(uid) }
  data.forEach(d => (t.parts[d.uid] = d))

  console.log(JSON.stringify(t))
}
test()
