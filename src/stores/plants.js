import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../boot/axios'

export const usePlantStore = defineStore('plants', () => {
  const plants = ref([])
  const loading = ref(false)

  async function fetchPlants() {
    loading.value = true
    try { plants.value = (await api.get('/plants')).data } finally { loading.value = false }
  }
  async function addPlant(p) { await api.post('/plants', p); await fetchPlants() }
  async function updatePlant(id, p) { await api.put(`/plants/${id}`, p); await fetchPlants() }
  async function deletePlant(id) { await api.delete(`/plants/${id}`); await fetchPlants() }

  return { plants, loading, fetchPlants, addPlant, updatePlant, deletePlant }
})
