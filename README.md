# Green Corner - Plant Shop (Quasar)
Vue Router + Route Guards, Pinia, REST/Mock API, Authentication, Deploy on Vercel.

## รัน
    npm install
    npm run dev        # http://localhost:9000
    npm run build      # -> dist/spa
    npm run serve      # ทดสอบไฟล์ที่ build

บัญชีทดลอง: admin@plant.com / 1234 (admin), user@plant.com / 1234 (user)

## ใช้ MockAPI จริง
ใส่ QCLI_API_URL ใน .env (เช่น https://xxxx.mockapi.io/api) ถ้าเว้นว่างจะใช้ Mock ในเครื่อง (localStorage)
Resources: plants(name,category,price,stock,description) / users(name,email,password,role) / orders(userId,items,total,createdAt)
