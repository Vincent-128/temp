import sqlite3 from 'sqlite3'
import { createId } from './utils'
import { Machine, Machines, Material, Materials, Midwest, Midwests, Part, Parts, Product } from './types'

const db = new sqlite3.Database('./setup/projects.db')

export const getParts = async () => {
  return new Promise((resolve, reject) => {
    const data = []
    db.all('SELECT * from parts LIMIT 10', (err, rows) => {
      if (err) reject(err)
      resolve(rows)
    })
  })
}

export const findParts = async (text: string) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT uid, id, name FROM parts WHERE name LIKE '%${text}%' OR id LIKE '%${text}%' ORDER BY id LIMIT 10`, (err, rows) => {
      if (err) reject(err)
      resolve(rows)
    })
  })
}

export const getProducts = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT uid, id, name FROM parts WHERE prod = 1 LIMIT 10`, (err, rows) => {
      console.log(rows)
      if (err) reject(err)
      resolve(rows)
    })
  })
}

export const getMaterials = async (): Promise<Materials> => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM materials`, (err, rows: Material[]) => {
      if (err) reject(err)
      resolve(Object.fromEntries(rows.map(i => [i.uid, i])))
    })
  })
}

export const getMachines = async (): Promise<Machines> => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM machines`, (err, rows: Machine[]) => {
      if (err) reject(err)
      resolve(Object.fromEntries(rows.map(i => [i.uid, i])))
    })
  })
}

export const getMidwests = async (): Promise<Midwests> => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM midwests`, (err, rows: Midwest[]) => {
      if (err) reject(err)
      resolve(Object.fromEntries(rows.map(i => [i.uid, i])))
    })
  })
}

type Res = { uid: string; parts: Parts; sub: Product[] }

export const getProduct = async (uid: string): Promise<Res | Error> => {
  return new Promise((resolve, reject) => {
    db.all(
      `WITH RECURSIVE data AS (
        SELECT '------------' AS productUid, 1 AS qty, p.uid, p.id, p.prod, p.name, p.cost, p.mtrl, p.unit, p.lgth, p.pPSh, p.anod, p.heat, p.oxid, p.zinc, p.pwdr, p.pltT, p.grdT, p.fltT, p.brkT, p.sndT, p.pemT, p.pasT, p.pasL, p.lsrT, p.lsrL, p.sawN, p.sawT, p.milN, p.milT, p.milL, p.lthN, p.lthT, p.lthL, p.rtrN, p.rtrT, p.rtrL, p.mrkN, p.mrkT, p.mrkL
        FROM parts p 
        WHERE p.uid = '${uid}'

        UNION ALL

        SELECT b.productUid, b.qty, p.uid, p.id, p.prod, p.name, p.cost, p.mtrl, p.unit, p.lgth, p.pPSh, p.anod, p.heat, p.oxid, p.zinc, p.pwdr, p.pltT, p.grdT, p.fltT, p.brkT, p.sndT, p.pemT, p.pasT, p.pasL, p.lsrT, p.lsrL, p.sawN, p.sawT, p.milN, p.milT, p.milL, p.lthN, p.lthT, p.lthL, p.rtrN, p.rtrT, p.rtrL, p.mrkN, p.mrkT, p.mrkL
        FROM parts p 
        INNER JOIN bom b ON p.uid = b.partUid 
        INNER JOIN data ON b.productUid = data.uid 
      ) SELECT uid, id, prod, name, cost, mtrl, unit, lgth, pPSh, anod, heat, oxid, zinc, pwdr, pltT, p.grdT, p.fltT, p.brkT, p.sndT, p.pemT, p.pasT, p.pasL, p.lsrT, p.lsrL, p.sawN, p.sawT, p.milN, p.milT, p.milL, p.lthN, p.lthT, p.lthL, p.rtrN, p.rtrT, p.rtrL, p.mrkN, p.mrkT, p.mrkL FROM data;`,

      (err: Error, rows: (Part & { productUid: string; qty: number })[]) => {
        if (err) reject(err)

        const getChildren = (parentUid: string): Product[] =>
          rows
            .filter(p => p.productUid == parentUid)
            .map(i => {
              if (i.prod) return { uid: i.uid, qty: i.qty, sub: getChildren(i.uid) }
              return { uid: i.uid, qty: i.qty }
            })

        const t: Res = { uid, parts: {}, sub: getChildren(uid) }
        rows.forEach(d => (t.parts[d.uid] = d))
        resolve(t)
      }
    )
  })
}

const product = (uid: string, prod: boolean) => [uid, uid, prod, uid, 0, 0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0, '', 0, 0, '', 0, 0, '', 0, 0, '', 0, 0]

const a = ['A0', 'A1', 'A2', 'A3', 'A4']
const p = ['P1', 'P2', 'P3', 'P4', 'P5']

const b = [
  ['A0', 'A1', 3],
  ['A0', 'A3', 6],
  ['A2', 'P4', 3],
  ['A1', 'P1', 2],
  ['A0', 'P3', 12],
  ['A0', 'A4', 6],
  ['A0', 'A2', 4],
  ['A3', 'P1', 6],
  ['A1', 'A2', 1],
  ['A3', 'A4', 1],
  ['A2', 'P3', 6],
  ['A3', 'P4', 5],
  ['A0', 'P5', 1],
  ['A0', 'P2', 2],
  ['A4', 'P1', 4],
  ['A4', 'P3', 2],
]

// db.serialize(() => {
//   const sPart = db.prepare('INSERT INTO parts VALUES (?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?)')
//   a.forEach(p => sPart.run(...product(p, true)))
//   p.forEach(p => sPart.run(...product(p, false)))
//   sPart.finalize()

//   const sLinks = db.prepare('INSERT INTO bom (productUid, partUid, qty) VALUES (?,?,?)')
//   b.forEach(p => sLinks.run(...p))
//   sLinks.finalize()
//   console.log('complete')
// })
