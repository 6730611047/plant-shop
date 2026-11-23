<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-8">
        <q-input v-model="search" outlined dense clearable label="ค้นหาต้นไม้..." />
      </div>
      <div class="col-12 col-sm-4">
        <q-select v-model="category" :options="categories" outlined dense emit-value map-options label="หมวดหมู่" />
      </div>
    </div>
    <div v-if="store.loading" class="text-center q-pa-xl"><q-spinner-dots color="green" size="40px" /></div>
    <div v-else class="row q-col-gutter-md">
      <div v-for="p in filtered" :key="p.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card class="plant-card">
          <q-img v-if="p.image" :src="p.image" :ratio="4 / 3" fit="cover">
            <template #error>
              <div class="absolute-full flex flex-center bg-green-1" style="font-size: 56px">{{ emoji[p.category] || '🪴' }}</div>
            </template>
          </q-img>
          <div v-else class="plant-emoji">{{ emoji[p.category] || '🪴' }}</div>
          <q-card-section>
            <div class="text-h6">{{ p.name }}</div>
            <q-badge color="green-7">{{ p.category }}</q-badge>
            <div class="text-grey-8 q-mt-sm">{{ p.description }}</div>
            <div class="text-subtitle1 text-green-9 q-mt-sm">฿{{ p.price }} <span class="text-caption text-grey">เหลือ {{ p.stock }}</span></div>
          </q-card-section>
          <q-card-actions>
            <q-btn color="green-8" icon="add_shopping_cart" label="หยิบใส่ตะกร้า" :disable="p.stock < 1" class="full-width" @click="addToCart(p)" />
          </q-card-actions>
        </q-card>
      </div>
      <div v-if="!filtered.length" class="col-12 text-center text-grey">ไม่พบต้นไม้</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { usePlantStore } from '../stores/plants'
import { useCartStore } from '../stores/cart'

const $q = useQuasar()
const store = usePlantStore()
const cart = useCartStore()
const search = ref('')
const category = ref('all')
const emoji = { indoor: '🪴', outdoor: '🌳', flower: '🌸', cactus: '🌵', herb: '🌿' }
const categories = [
  { label: 'ทั้งหมด', value: 'all' }, { label: 'ไม้ในร่ม', value: 'indoor' }, { label: 'ไม้กลางแจ้ง', value: 'outdoor' },
  { label: 'ไม้ดอก', value: 'flower' }, { label: 'กระบองเพชร', value: 'cactus' }, { label: 'สมุนไพร', value: 'herb' }
]
const filtered = computed(() => store.plants.filter((p) =>
  (category.value === 'all' || p.category === category.value) &&
  p.name.toLowerCase().includes((search.value || '').toLowerCase())))

onMounted(() => store.fetchPlants().catch(() => $q.notify({ type: 'negative', message: 'โหลดข้อมูลไม่สำเร็จ' })))
function addToCart(p) { cart.add(p); $q.notify({ type: 'positive', message: `เพิ่ม ${p.name} แล้ว`, timeout: 800 }) }
</script>
