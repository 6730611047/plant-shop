import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../boot/axios'

export const useAuthStore = defineStore('auth', () => {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('auth')) } catch { return null } })()
  const user = ref(saved?.user || null)
  const token = ref(saved?.token || null)
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const persist = () => localStorage.setItem('auth', JSON.stringify({ user: user.value, token: token.value }))

  async function login(email, password) {
    const { data } = await api.get('/users')
    const found = data.find((u) => u.email === email && u.password === password)
    if (!found) throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    const { password: _pw, ...safe } = found
    user.value = safe
    token.value = btoa(`${found.id}:${Date.now()}`)
    persist()
  }
  async function register(name, email, password) {
    const { data } = await api.get('/users')
    if (data.some((u) => u.email === email)) throw new Error('อีเมลนี้ถูกใช้แล้ว')
    await api.post('/users', { name, email, password, role: 'user' })
    await login(email, password)
  }
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth')
  }
  return { user, token, isLoggedIn, isAdmin, login, register, logout }
})
