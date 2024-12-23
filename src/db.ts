import sqlite3 from 'sqlite3'
import { createId } from './utils'

const db = new sqlite3.Database('projects.db')

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

export const getProducts = async () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT uid, id, name FROM parts WHERE prod = 1 LIMIT 10`, (err, rows) => {
      if (err) reject(err)
      resolve(rows)
    })
  })
}

export const getProduct = async (uid: string) => {
  return new Promise((resolve, reject) => {
    db.all(
      `WITH RECURSIVE data AS (
        SELECT b.productUid, b.qty, p.uid, p.id, p.prod, p.name, p.cost, p.mtrl, p.unit, p.lgth, p.pPSh, p.anod, p.heat, p.oxid, p.zinc, p.pwdr, p.pltT, p.grdT, p.fltT, p.brkT, p.sndT, p.pemT, p.pasT, p.pasL, p.lsrT, p.lsrL, p.sawN, p.sawT, p.milN, p.milT, p.milL, p.lthN, p.lthT, p.lthL, p.rtrN, p.rtrT, p.rtrL, p.mrkN, p.mrkT, p.mrkL
        FROM parts p 
        INNER JOIN bom b ON p.uid = b.partUid
        WHERE b.productUid = '${uid}'

        UNION

        SELECT b.productUid, b.qty, p.uid, p.id, p.prod, p.name, p.cost, p.mtrl, p.unit, p.lgth, p.pPSh, p.anod, p.heat, p.oxid, p.zinc, p.pwdr, p.pltT, p.grdT, p.fltT, p.brkT, p.sndT, p.pemT, p.pasT, p.pasL, p.lsrT, p.lsrL, p.sawN, p.sawT, p.milN, p.milT, p.milL, p.lthN, p.lthT, p.lthL, p.rtrN, p.rtrT, p.rtrL, p.mrkN, p.mrkT, p.mrkL
        FROM parts p 
        INNER JOIN bom b ON p.uid = b.partUid 
        INNER JOIN data ON b.productUid = data.uid 
      ) SELECT * FROM data;`,

      (err, rows) => {
        if (err) reject(err)
        resolve(rows)
      }
    )
  })
}

// export const getProduct = async (uid: string) => {
//   return new Promise((resolve, reject) => {
//     db.all(
//       `WITH RECURSIVE data AS (
//         SELECT b.productUid, b.qty, p.uid, p.prod
//         FROM parts p 
//         INNER JOIN bom b ON p.uid = b.partUid
//         WHERE b.productUid = '${uid}'

//         UNION ALL

//         SELECT b.productUid, b.qty, p.uid, p.prod
//         FROM parts p 
//         INNER JOIN bom b ON p.uid = b.partUid 
//         INNER JOIN data ON b.productUid = data.uid 
//       ) SELECT * FROM data;`,

//       (err, rows) => {
//         if (err) reject(err)
//         resolve(rows)
//       }
//     )
//   })
// }

// const product = [createId(), '08932', true, 'T-Square Combo', 0, 0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0, '', 0, 0, '', 0, 0, '', 0, 0, '', 0, 0]
// const bom = [
//   [product[0], 'p1tDdCFtUQYS', 1],
//   [product[0], 'RsYG0dtuvmTl', 1],
//   [product[0], 'tAO5AVoxvFaw', 1],
//   [product[0], 'wKBp1XaEKMEg', 1],
// ]

// db.serialize(() => {
//   const sPart = db.prepare('INSERT INTO parts VALUES (?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?)')
//   sPart.run(...product)
//   sPart.finalize()

//   const sLinks = db.prepare('INSERT INTO bom (productUid, partUid, qty) VALUES (?,?,?)')
//   bom.forEach(p => sLinks.run(...p))
//   sLinks.finalize()
// })

