export enum MessageType {
  SearchParts = 1,
  SearchMaterials = 2,
  PartExist = 3,
  GetProduct = 4,
  SaveProduct = 5,
  GetPart = 6,
  SavePart = 7,
  Response = 8,
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

export interface ResponseMessage {
  type: MessageType.Response
  id: string
  data: Object
}

export type Message = SearchPartsMessage | GetProductMessage | ResponseMessage

export interface Product {
  uid: string
  qty: number
  sub?: Product[]
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
export type Parts = { [id: string]: Part }
