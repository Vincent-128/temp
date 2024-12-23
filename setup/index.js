import sqlite3 from 'sqlite3'
import { readFileSync, unlinkSync } from 'fs'

unlinkSync('./projects.db', err => err && console.error(`Error removing file: ${err}`))

const test = sqlite3.verbose()
const db = new test.Database('./projects.db')
const data = JSON.parse(readFileSync('./data.json', { encoding: 'utf8', flag: 'r' }))

// prettier-ignore
const partKeyOrder = [
  'uid', 'id', 'prod', 'desc', 'cost', 'mtrl', 'unit', 'lgth', 'pPSh', 'anod', 'heat',
  'oxid', 'zinc', 'pwdr', 'pltT', 'grdT', 'fltT', 'brkT', 'sndT', 'pemT', 
  'pasT', 'pasL', 'lsrT', 'lsrL', 'sawN', 'sawT', 'milN', 'milT', 'milL', 
  'lthN', 'lthT', 'lthL', 'rtrN', 'rtrT', 'rtrL', 'mrkN', 'mrkT', 'mrkL',
]

const links = []
Object.values(data.products).forEach(p => p.bom.forEach(i => links.push([p.uid, i.id, i.qty])))

const parts = Object.values(data.parts).map(part => partKeyOrder.map(key => (key == 'prod' ? false : part[key])))
data.products.forEach(p => parts.push([p.uid, p.id, true, p.name, 0, 0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0, '', 0, 0, '', 0, 0, '', 0, 0, '', 0, 0]))
const materials = Object.values(data.materials).map(m => [m.uid, m.id, m.material, m.description, m.sap, m.type, m.unit, m.volPerFt])
const machines = Object.values(data.machines).map(m => [m.uid, m.id, m.type, m.rate, m.labourRate, m.machinePerPerson, m.setupCost])
const midwests = Object.values(data.midwests).map(m => [m.uid, m.id, m.cad, m.density])

parts.forEach(p => {
  const test = parts.filter(f => f[0] == p[0])
  if (test.length > 1) {
    console.log(p[0])
  }
})

const createLinksTable = `CREATE TABLE bom (
  bomUid INTEGER PRIMARY KEY AUTOINCREMENT,
  productUid TEXT NOT NULL,
  partUid TEXT NOT NULL,
  qty REAL NOT NULL,
  FOREIGN KEY(productUid) REFERENCES parts(uid),
  FOREIGN KEY(partUid) REFERENCES parts(uid)
);`

const createPartTable = `CREATE TABLE parts (
  uid TEXT NOT NULL PRIMARY KEY,
  id TEXT NOT NULL,
  prod INTEGER NOT NULL,
  name TEXT NOT NULL,
  cost REAL NOT NULL,
  mtrl TEXT NOT NULL,
  unit TEXT NOT NULL,
  lgth REAL NOT NULL,
  pPSh REAL NOT NULL,
  anod REAL NOT NULL,
  heat REAL NOT NULL,
  oxid REAL NOT NULL,
  zinc REAL NOT NULL,
  pwdr REAL NOT NULL,
  pltT REAL NOT NULL,
  grdT REAL NOT NULL,
  fltT REAL NOT NULL,
  brkT REAL NOT NULL,
  sndT REAL NOT NULL,
  pemT REAL NOT NULL,
  pasT REAL NOT NULL,
  pasL REAL NOT NULL,
  lsrT REAL NOT NULL,
  lsrL REAL NOT NULL,
  sawN TEXT NOT NULL,
  sawT REAL NOT NULL,
  milN TEXT NOT NULL,
  milT REAL NOT NULL,
  milL REAL NOT NULL,
  lthN TEXT NOT NULL,
  lthT REAL NOT NULL,
  lthL REAL NOT NULL,
  rtrN TEXT NOT NULL,
  rtrT REAL NOT NULL,
  rtrL REAL NOT NULL,
  mrkN TEXT NOT NULL,
  mrkT REAL NOT NULL,
  mrkL REAL NOT NULL,
  FOREIGN KEY(sawN) REFERENCES material(uid),
  FOREIGN KEY(milN) REFERENCES machines(uid),
  FOREIGN KEY(lthN) REFERENCES machines(uid),
  FOREIGN KEY(rtrN) REFERENCES machines(uid),
  FOREIGN KEY(mrkN) REFERENCES machines(uid)
);`

const createMaterialTable = `CREATE TABLE materials (
  uid TEXT NOT NULL PRIMARY KEY,
  id TEXT NOT NULL ,
  material TEXT NOT NULL,
  description TEXT NOT NULL,
  sap REAL NOT NULL,
  type INTEGER NOT NULL,
  unit TEXT NOT NULL,
  volPerFt REAL NOT NULL
);`

const createMachinesTable = `CREATE TABLE machines (
  uid TEXT NOT NULL PRIMARY KEY,
  id TEXT NOT NULL,
  type INTEGER NOT NULL,
  rate REAL NOT NULL,
  labourRate REAL NOT NULL,
  machinePerPerson REAL NOT NULL,
  setupCost REAL NOT NULL
);`

const createMidwestsTable = `CREATE TABLE midwests (
  uid TEXT NOT NULL PRIMARY KEY,
  id TEXT NOT NULL,
  cad REAL NOT NULL,
  density REAL NOT NULL
);`

db.serialize(() => {
  db.run(createPartTable)
  db.run(createMaterialTable)
  db.run(createMachinesTable)
  db.run(createMidwestsTable)
  db.run(createLinksTable)

  const sPart = db.prepare('INSERT INTO parts VALUES (?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?)')
  parts.forEach(p => sPart.run(...p))
  sPart.finalize()

  const sMaterial = db.prepare('INSERT INTO materials VALUES (?,?,?,?,?, ?,?,?)')
  materials.forEach(p => sMaterial.run(...p))
  sMaterial.finalize()

  const sMachines = db.prepare('INSERT INTO machines VALUES (?,?,?,?,?, ?,?)')
  machines.forEach(p => sMachines.run(...p))
  sMachines.finalize()

  const sMidwest = db.prepare('INSERT INTO midwests VALUES (?,?,?,?)')
  midwests.forEach(p => sMidwest.run(...p))
  sMidwest.finalize()

  const sLinks = db.prepare('INSERT INTO bom (productUid, partUid, qty) VALUES (?,?,?)')
  links.forEach(p => sLinks.run(...p))
  sLinks.finalize()
})

db.close()
