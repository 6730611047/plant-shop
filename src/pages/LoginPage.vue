<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-green-1">
        <q-card style="width: 380px; max-width: 92vw">
          <q-card-section class="text-center">
            <div class="text-h5">🌿 {{ title }}</div>
          </q-card-section>
          <q-tabs v-model="tab" active-color="green-8" align="justify">
            <q-tab name="login" label="เข้าสู่ระบบ" />
            <q-tab name="register" label="สมัครสมาชิก" />
          </q-tabs>
          <q-separator />
          <q-card-section>
            <q-input v-if="tab === 'register'" v-model="name" label="ชื่อ" outlined dense class="q-mb-sm" />
            <q-input v-model="email" label="อีเมล" type="email" outlined dense class="q-mb-sm" />
            <q-input v-model="password" label="รหัสผ่าน" type="password" outlined dense @keyup.enter="submit" />
          </q-card-section>
          <q-card-actions class="q-px-md q-pb-md">
            <q-btn color="green-8" class="full-width" :loading="loading" :label="tab === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'" @click="submit" />
          </q-card-actions>
          <q-card-section v-if="tab === 'login'" class="text-caption text-grey-7 q-pt-none">
            ทดลอง: admin@plant.com / 1234 (แอดมิน) , user@plant.com / 1234 (ผู้ใช้)
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const title = import.meta.env.QCLI_APP_TITLE || 'Green Corner'
const $q = useQuasar()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const tab = ref('login')
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

async function submit() {
  if (!email.value || !password.value || (tab.value === 'register' && !name.value)) {
    return $q.notify({ type: 'warning', message: 'กรอกข้อมูลให้ครบ' })
  }
  loading.value = true
  try {
    if (tab.value === 'login') await auth.login(email.value, password.value)
    else await auth.register(name.value, email.value, password.value)
    router.push(route.query.redirect || '/')
  } catch (e) {
    $q.notify({ type: 'negative', message: e.message })
  } finally {
    loading.value = false
  }
}
</script>
