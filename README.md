# Knitto Group Backend Skill Test

## Deskripsi

Repository ini berisi hasil pengerjaan **Backend Skill Test** untuk Knitto Group. Proyek ini dibuat menggunakan TypeScript dan PostgreSQL sebagai database.

Node.js 22.13.1

## Struktur Proyek

- src/

  - controllers/
    - auth.controller.ts
    - invoice.controller.ts
    - order.controller.ts
    - product.controller.ts
    - shipping.controller.ts
  - routes/
    - api.ts
  - helper/
    - DBUtil.ts
    - JwtUtil.ts
  - middleware/
    - authMiddleware.ts
  - models/
    - user.ts
  - index.ts
  - scheduler.ts

- **controllers/**: Menyimpan semua controller untuk setiap fitur API.
- **routes/**: Menyimpan definisi rute API untuk setiap modul.
- **middlewares/**: Menyimpan middleware untuk penanganan auth.
- **models/**: Menyimpan model untuk query.
- **helper/**: Menyimpan fungsi utilitas seperti db dan jwt.
- **index.ts**: Entry point utama aplikasi.
- **scheduler.ts**: Proses penjadwalan sebuah task untuk restock produk.

## Endpoint

Endpoint tersedia melalui postman url

## Install Dependencies:

npm install

## Jalankan Server:

npm run dev atau npx ts-node src/index.ts
