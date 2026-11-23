<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 col">🪴 จัดการต้นไม้ (Admin)</div>
      <q-btn color="green-8" icon="add" label="เพิ่มต้นไม้" @click="openDialog()" />
    </div>
    <q-table :rows="store.plants" :columns="columns" row-key="id" :loading="store.loading" flat bordered>
      <template #body-cell-actions="props">
        <q-td align="center">
          <q-btn flat round color="primary" icon="edit" @click="openDialog(props.row)" />
          <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="show">
      <q-card style="width: 420px; max-width: 92vw">
        <q-card-section class="text-h6">{{ editId ? 'แก้ไขต้นไม้' : 'เพิ่มต้นไม้' }}</q-card-section>
        <q-card-section class="q-gutter-sm">
          <q-input v-model="form.name" label="ชื่อ" outlined dense />
          <q-input v-model="form.image" label="ลิงก์รูปภาพ (URL)" outlined dense />
          <q-select v-model="form.category" :options="['indoor', 'outdoor', 'flower', 'cactus', 'herb']" label="หมวดหมู่" outlined dense />
          <q-input v-model.number="form.price" type="number" label="ราคา (บาท)" outlined dense />
          <q-input v-model.number="form.stock" type="number" label="จำนวนในสต็อก" outlined dense />
          <q-input v-model="form.description" type="textarea" label="รายละเอียด" outlined dense autogrow />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="ยกเลิก" v-close-popup />
          <q-btn color="green-8" label="บันทึก" :loading="saving" @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { usePlantStore } from '../stores/plants'

const $q = useQuasar()
const store = usePlantStore()
const show = ref(false)
const saving = ref(false)
const editId = ref(null)
const blank = () => ({ name: '', image: '', category: 'indoor', price: 0, stock: 0, description: '' })
const form = ref(blank())
const columns = [
  { name: 'name', label: 'ชื่อ', field: 'name', align: 'left', sortable: true },
  { name: 'category', label: 'หมวดหมู่', field: 'category', align: 'left' },
  { name: 'price', label: 'ราคา', field: 'price', align: 'right', sortable: true },
  { name: 'stock', label: 'สต็อก', field: 'stock', align: 'right', sortable: true },
  { name: 'actions', label: 'จัดการ', align: 'center' }
]

onMounted(() => store.fetchPlants())

function openDialog(row) {
  editId.value = row ? row.id : null
  form.value = row ? { ...row } : blank()
  show.value = true
}
async function save() {
  if (!form.value.name || form.value.price < 0) return $q.notify({ type: 'warning', message: 'กรอกข้อมูลให้ถูกต้อง' })
  saving.value = true
  try {
    if (editId.value) await store.updatePlant(editId.value, form.value)
    else await store.addPlant(form.value)
    show.value = false
    $q.notify({ type: 'positive', message: 'บันทึกสำเร็จ' })
  } catch {
    $q.notify({ type: 'negative', message: 'บันทึกไม่สำเร็จ' })
  } finally {
    saving.value = false
  }
}
function confirmDelete(row) {
  $q.dialog({ title: 'ยืนยันการลบ', message: `ลบ "${row.name}" ?`, cancel: true })
    .onOk(async () => {
      await store.deletePlant(row.id)
      $q.notify({ type: 'positive', message: 'ลบแล้ว' })
    })
}
</script>
