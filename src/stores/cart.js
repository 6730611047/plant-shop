import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../boot/axios'

const loadCart = () => {
  try {
    const d = JSON.parse(localStorage.getItem('cart'))
    return Array.isArray(d) ? d : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCart())
  const save = () => localStorage.setItem('cart', JSON.stringify(items.value))

  const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0))
  const total = computed(() => items.value.reduce((s, i) => s + i.qty * i.price, 0))

  function add(plant) {
    const f = items.value.find((i) => i.id === plant.id)
    if (f) f.qty = Math.min(f.qty + 1, plant.stock)
    else items.value.push({ id: plant.id, name: plant.name, price: plant.price, stock: plant.stock, qty: 1 })
    save()
  }
  function setQty(id, qty) {
    const f = items.value.find((i) => i.id === id)
    if (f) f.qty = Math.max(1, Math.min(Number(qty) || 1, f.stock))
    save()
  }
  function remove(id) { items.value = items.value.filter((i) => i.id !== id); save() }
  function clear() { items.value = []; save() }

  async function checkout(userId) {
    const { data: u } = await api.get(`/users/${userId}`)
    const old = u.orders ? JSON.parse(u.orders) : []
    old.push({ items: items.value, total: total.value, createdAt: new Date().toISOString() })
    await api.put(`/users/${userId}`, { orders: JSON.stringify(old) })
    clear()
  }
  return { items, count, total, add, setQty, remove, clear, checkout }
})