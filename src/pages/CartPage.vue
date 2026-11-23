<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">🛒 ตะกร้าสินค้า</div>
    <q-banner v-if="!cart.items.length" class="bg-grey-2">ตะกร้าว่าง</q-banner>
    <q-list v-else bordered separator class="bg-white">
      <q-item v-for="i in cart.items" :key="i.id">
        <q-item-section>
          <q-item-label>{{ i.name }}</q-item-label>
          <q-item-label caption>฿{{ i.price }} / ต้น</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row items-center">
            <q-btn flat round dense icon="remove" @click="cart.setQty(i.id, i.qty - 1)" />
            <q-input :model-value="i.qty" dense outlined type="number" style="width: 70px" @update:model-value="(v) => cart.setQty(i.id, v)" />
            <q-btn flat round dense icon="add" @click="cart.setQty(i.id, i.qty + 1)" />
          </div>
        </q-item-section>
        <q-item-section side class="text-weight-bold">฿{{ i.qty * i.price }}</q-item-section>
        <q-item-section side><q-btn flat round color="negative" icon="delete" @click="cart.remove(i.id)" /></q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-h6">รวมทั้งหมด</q-item-section>
        <q-item-section side class="text-h6 text-green-9">฿{{ cart.total }}</q-item-section>
      </q-item>
    </q-list>
    <div v-if="cart.items.length" class="q-mt-md row justify-end q-gutter-sm">
      <q-btn flat color="grey" label="ล้างตะกร้า" @click="cart.clear()" />
      <q-btn color="green-8" icon="payments" label="สั่งซื้อ" :loading="loading" @click="checkout" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const cart = useCartStore()
const auth = useAuthStore()
const loading = ref(false)

async function checkout() {
  loading.value = true
  try {
    await cart.checkout(auth.user.id)
    $q.notify({ type: 'positive', message: 'สั่งซื้อสำเร็จ ขอบคุณที่อุดหนุน 🌱' })
  } catch {
    $q.notify({ type: 'negative', message: 'สั่งซื้อไม่สำเร็จ' })
  } finally {
    loading.value = false
  }
}
</script>
