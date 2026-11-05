# KoinTakdir — Web Pengambil Keputusan 🪙

Aplikasi web modern, bersih, dan profesional untuk membantu mengambil keputusan saat bimbang antara dua pilihan menggunakan animasi koin 3D dan audio interaktif.

---

## 📁 Struktur Folder

```text
kointakdir/
├── index.html       # Struktur HTML semantik & tampilan utama
├── style.css        # Desain antarmuka profesional (Dark Slate, Clean Typography)
├── app.js           # Logika aplikasi, fisika koin 3D, dan Web Audio API synthesizer
└── README.md        # Panduan penggunaan & hosting mandiri
```

---

## 🚀 Cara Menjalankan di Komputer Sendiri (Lokal)

Anda **tidak memerlukan Node.js, database, atau build tools**. Proyek ini dibuat dengan teknologi murni web (Vanilla HTML, CSS, JavaScript):

1. **Buka Langsung:**
   * Cukup klik dua kali file `index.html` di browser favorit Anda (Google Chrome, Edge, Safari, Firefox).
2. **Atau Menggunakan Local Server:**
   * Jika menggunakan VS Code, Anda bisa klik kanan `index.html` dan pilih **Open with Live Server**.
   * Atau jalankan perintah sederhana di terminal:
     ```bash
     # Jika ada python:
     python -m http.server 8080
     # Atau npx:
     npx serve .
     ```

---

## 🌐 Cara Hosting Mandiri (Self-Hosting)

Folder ini siap di-upload ke layanan hosting statis apa pun:

### 1. Vercel (Gratis & Cepat)
* Buka [vercel.com](https://vercel.com).
* Drag & drop folder `kointakdir` langsung ke dashboard Vercel, atau hubungkan repository GitHub.

### 2. Netlify (Gratis)
* Buka [netlify.com](https://netlify.com).
* Masuk ke menu **Sites** > drag & drop folder `kointakdir` ke area deploy.

### 3. GitHub Pages
* Buat repository baru di GitHub.
* Upload seluruh isi folder `kointakdir`.
* Masuk ke **Settings** > **Pages** > pilih branch `main` dan klik **Save**.

### 4. Cloudflare Pages
* Buka [pages.cloudflare.com](https://pages.cloudflare.com).
* Pilih **Upload assets** dan seret folder `kointakdir`.

### 5. cPanel / Hosting Tradisional
* Buka File Manager cPanel Anda.
* Masuk ke folder `public_html` (atau subdomain).
* Upload `index.html`, `style.css`, dan `app.js`.

---

## 🎯 Fitur Utama

1. **Alur 2 Langkah Jelas & Rapi:**
   * **Langkah 1:** Input nama peserta (wajib diisi dengan validasi bersih) + Slider durasi putaran koin (3, 5, 10, 15 detik).
   * **Langkah 2:** Input manual Opsi A (Sisi Emas) dan Opsi B (Sisi Perak) + Tombol lempar koin.
2. **Fisika Koin 3D Terkendali:**
   * Koin berputar presisi di dalam areanya sendiri (*in-place rotation*), tidak melompat atau menutupi kolom input di atasnya.
   * Tampilan logam koin timbul (*minted gold & silver*) tanpa blur berlebihan.
3. **Efek Audio Sintetis Terintegrasi (Web Audio API):**
   * **Saat berputar:** Detak jantung akseleratif (*accelerating heartbeat lub-dub*) + denting waktu + cinematic tension drone.
   * **Saat hasil keluar:** Dentuman bass pendaratan + harmoni fanfare trompet kemenangan + siulan stadion penonton + sorak-sorai vokal kerumunan + tepukan tangan meriah (850 ketukan stereo).
4. **Desain Bersih & Mudah Dibaca:**
   * Menggunakan tipografi modern *Plus Jakarta Sans* & *Space Grotesk*.
   * Kontras tinggi, bebas dari elemen norak, gradien berlebihan, atau bahasa berbelit.
