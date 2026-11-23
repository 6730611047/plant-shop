<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-green-8">
      <q-toolbar>
        <q-toolbar-title class="cursor-pointer" @click="$router.push('/')">🌿 {{ title }}</q-toolbar-title>
        <q-btn flat label="ร้านค้า" to="/" />
        <q-btn v-if="auth.isAdmin" flat label="จัดการต้นไม้" to="/manage" />
        <q-btn flat icon="shopping_cart" to="/cart">
          <q-badge v-if="cart.count" color="orange" floating>{{ cart.count }}</q-badge>
        </q-btn>
        <q-btn flat icon="logout" @click="logout"><q-tooltip>ออกจากระบบ</q-tooltip></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container><router-view /></q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const title = import.meta.env.QCLI_APP_TITLE || 'Green Corner'
const auth = useAuthStore()
const cart = useCartStore()
const router = useRouter()
function logout() { auth.logout(); router.push('/login') }
</script>
