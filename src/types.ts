export enum MessageType {
  SearchParts = 1,
  PartExist,
  GetPart,
  GetProduct,
  GetProducts,
  GetMidwests,
  GetMachines,
  GetMaterials,
  SavePart,
  SaveProduct,
  SaveMidwest,
  SaveMachine,
  SaveMaterial,
  Response,
}

export interface SearchPartsMessage {
  type: MessageType.SearchParts
  id: string
  data: {
    text: string
  }
}

export interface GetProductMessage {
  type: MessageType.GetProduct
  id: string
  data: {
    uid: string
  }
}

export interface GetMachinesMessage {
  type: MessageType.GetMachines
  id: string
}

export interface GetMaterialsMessage {
  type: MessageType.GetMaterials
  id: string
}

export interface GetMidwestsMessage {
  type: MessageType.GetMidwests
  id: string
}

export interface ResponseMessage {
  type: MessageType.Response
  id: string
  data: Object
}

export type Message = SearchPartsMessage | GetProductMessage | ResponseMessage | GetMaterialsMessage | GetMidwestsMessage | GetMachinesMessage

export interface Product {
  uid: string
  qty: number
  sub?: Product[]
}

export enum MaterialType {
  Angle = 0,
  Bar = 1,
  HollowExtrusion = 2,
  HollowRoundBar = 3,
  RoundBar = 4,
  Sheet = 5,
  SolidExtrusion = 6,
}

export enum MachineType {
  Lathe = 0,
  Marking = 1,
  Mill = 2,
  Router = 3,
  Saw = 4,
  Other = 5,
}

export interface Part {
  id: string
  uid: string
  prod: 0 | 1
  desc: string
  cost: number
  mtrl: string
  unit: string
  lgth: number
  pPSh: number
  anod: number
  heat: number
  oxid: number
  zinc: number
  pwdr: number
  pltT: number
  grdT: number
  fltT: number
  brkT: number
  sndT: number
  pemT: number
  pasT: number
  pasL: number
  lsrT: number
  lsrL: number
  sawN: string
  sawT: number
  milN: string
  milT: number
  milL: number
  lthN: string
  lthT: number
  lthL: number
  rtrN: string
  rtrT: number
  rtrL: number
  mrkN: string
  mrkT: number
  mrkL: number
}

export interface Material {
  id: string
  uid: string
  material: string
  description: string
  sap: number
  type: MaterialType
  unit: string
  volPerFt: number
}

export interface Machine {
  id: string
  uid: Mac
  type: MachineType
  rate: number
  labourRate: number
  machinePerPerson: number
  setupCost: number
}

export interface ProductItem {
  id: string
  description: string
  material: number
  extService: number
  labour: number
  machine: number
  subTotal: number
  total: number
}

export interface ProductBom {
  bom: ProductItems
  totals: {
    material: number
    extService: number
    labour: number
    machine: number
    total: number
  }
}

export enum MidwestMaterial {
  Aluminum = 'bQGeeSdMxgLd',
  Brass = 'YpkgkFCOwV62',
  HollowExtrusion = 'QCorXYbYXR1C',
  SolidExtrusion = 'kVO7Yl27Vinp',
  StainlessSteel = 'MO9hhNeWNGmY',
}

export interface Midwest {
  id: string
  uid: MidwestMaterial
  cad: number
  density: number
}

export type Parts = { [id: string]: Part }
export type Products = { [id: string]: Product }
export type Machines = { [id: string]: Machine }
export type Materials = { [id: string]: Material }
export type ProductItems = { [id: string]: ProductItem }
export type Midwests = { [id: string]: Midwest }

export enum Mac {
  BANDSAW = '2Oh76gk2YhnH',
  BRAKEPRESS = '4TfP3ScOGSS2',
  DEBURMACHINE = '6SYFh3Ff74pc',
  BIGSWISS = 'ADWS68Nlqpat',
  SMALLSWISS = 'FBia520fq7AS',
  PLATEPOLISHER = 'FMSh4TF0k2JL',
  LYNX = 'FkO0lPJ2l9sD',
  ROVERA = 'KrMQ5yG4Zosn',
  TUMBLER = 'NQ0I6MIq9WXk',
  COLDSAW = 'NkZs80N0Uib7',
  CNCVF2DNM = 'OGHYWTtcxPcP',
  TROTECLASER = 'OplNlCqYhmLd',
  HAASLATHE = 'X56i43jXwRL1',
  TRUMPFLASER = 'YNd14K64AcdL',
  HYUNDAI = 'eyU6TznuHqAj',
  CNCVF5DNM = 'fDRL53vwKD7A',
  CNCLASER = 'hngaY3Z3z7G2',
  MAZAK = 'jIvUllIQPsQ4',
  PEMNUT = 'jnhuVA6Q5pBp',
  EMCO = 'lErPKRmlOuyb',
  GRINDER = 'lMahNS8k2EXO',
  BEAMSAW = 'myhpyYjAJcII',
  ROVERK = 'q7bbpnjHJ40B',
  KERNLASER = 'uSCFfIue02er',
  SANDBLASTER = 'uvRAVghuR0Lw',
  FLATTERNER = 'jHJ40BuSCFfI',
  PASSIVATION = 'tcxPcPFkO0lP',
}


