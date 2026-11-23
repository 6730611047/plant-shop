import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const apiUrl = import.meta.env.QCLI_API_URL || 'https://6b03dae69e7cafb37dbf9307.mockapi.io/api'
console.log('API URL =', apiUrl)
export const isMock = !apiUrl

// ---------- Mock REST API (localStorage) : ใช้เมื่อไม่ได้ตั้ง QCLI_API_URL ----------
const KEY = 'greencorner_db_v9'
const seed = () => ({
  users: [
    { id: '1', name: 'Admin', email: 'admin@plant.com', password: '1234', role: 'admin' },
    { id: '2', name: 'Somchai', email: 'user@plant.com', password: '1234', role: 'user' }
  ],
  plants: [
    { id: '1', name: 'มอนสเตอร่า', image: '/plants/monstera.jpg', category: 'indoor', price: 350, stock: 12, description: 'ใบสวยแปลกตา ดูแลง่าย ชอบแสงรำไร' },
    { id: '2', name: 'ฟิโลเดนดรอน', image: '/plants/philodendron.jpg', category: 'indoor', price: 220, stock: 20, description: 'ไม้ใบฟอกอากาศ โตไว' },
    { id: '3', name: 'กระบองเพชรจิ๋ว', image: '/plants/cactus.jpg', category: 'cactus', price: 60, stock: 50, description: 'ทนแล้ง รดน้ำสัปดาห์ละครั้ง' },
    { id: '4', name: 'กุหลาบพันธุ์เล็ก', image: '/plants/rose.jpg', category: 'flower', price: 150, stock: 15, description: 'ดอกหอม เหมาะปลูกกระถาง' },
    { id: '5', name: 'โหระพา', image: '/plants/basil.jpg', category: 'herb', price: 35, stock: 40, description: 'สมุนไพรทำอาหาร ปลูกง่าย' },
    { id: '6', name: 'มะนาวแป้น', image: '/plants/lime.jpg', category: 'outdoor', price: 280, stock: 8, description: 'ไม้ผลปลูกกลางแจ้ง ให้ผลทั้งปี' }
  ],
  orders: []
})
const load = () => {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d) return d } catch { /* ignore */ }
  const d = seed()
  localStorage.setItem(KEY, JSON.stringify(d))
  return d
}
function mockAdapter(config) {
  const db = load()
  const [col, id] = config.url.replace(/^\//, '').split('/')
  const method = config.method.toLowerCase()
  const body = config.data ? JSON.parse(config.data) : {}
  const list = db[col]
  let status = 200
  let data
  if (!list) { status = 404; data = 'Not found' }
  else if (method === 'get') {
    data = id ? list.find((x) => x.id === id) : list
    if (!data) { status = 404; data = 'Not found' }
  } else if (method === 'post') {
    data = { ...body, id: String(Date.now()) }
    list.push(data)
  } else {
    const i = list.findIndex((x) => x.id === id)
    if (i < 0) { status = 404; data = 'Not found' }
    else if (method === 'put') { data = { ...list[i], ...body, id }; list[i] = data }
    else data = list.splice(i, 1)[0]
  }
  localStorage.setItem(KEY, JSON.stringify(db))
  const res = { data, status, statusText: String(status), headers: {}, config, request: {} }
  return new Promise((resolve, reject) =>
    setTimeout(() => (status < 400 ? resolve(res)
      : reject(Object.assign(new Error('Request failed ' + status), { response: res, config, isAxiosError: true }))), 300))
}

export const api = axios.create(isMock ? { adapter: mockAdapter } : { baseURL: apiUrl })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = api
})