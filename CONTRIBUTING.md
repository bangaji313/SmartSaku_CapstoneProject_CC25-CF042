# 🤝 SOP GitHub untuk Kolaborasi Proyek SmartSaku

## 📌 Tujuan
Memastikan kolaborasi Capstone Project SmartSaku tim CC25-CF042 berjalan lancar, aman, dan efisien tanpa tumpang tindih.

---

## 🧩 Struktur Cabang (Branch)
- main: Branch utama, berisi versi yang *siap jalan / stabil*.
- dev: Branch pengembangan umum (opsional jika ingin testing sebelum merge ke main).
- fitur/<nama-fitur>: Branch untuk fitur baru.  
  Contoh: fitur/login, fitur/chatbot
- fix/<nama-perbaikan>: Branch untuk perbaikan bug.  
  Contoh: fix/scroll-chat, fix/responsive-home

---

## 👣 Alur Kerja Harian

### 1. Sebelum Mulai Kerja
```bash
git checkout main
```
```bash
git pull origin main
```
✅ Tujuannya: Pastikan kamu kerja dari kode terbaru.

---

### 2. Buat Branch Baru untuk Kerjaanmu
```bash
git checkout -b fitur/onboarding
```
✅ Gunakan nama branch sesuai tugas yang kamu kerjakan.

---

### 3. Kerjakan Fitur/Perbaikan
- Coding sesuai tugas
- Jangan ubah file orang lain yang tidak sedang kamu kerjakan
- Test hasilnya di local sebelum commit

---

### 4. Simpan Perubahan dan Upload
```bash
git add .
```
```bash
git commit -m "Tambah halaman onboarding dengan animasi"
```
```bash
git push origin fitur/onboarding
```
✅ Gunakan pesan commit yang jelas.

---

### 5. Minta Review dan Merge
- Buka GitHub → Masuk ke repo AndhikaDicoding/SmartSaku_Capstone_CC25-CF042
- Akan muncul tombol *“Compare & pull request”*
- Tambahkan deskripsi perubahan
- Klik *“Create Pull Request”*
- Review bersama, lalu merge ke main setelah yakin tidak bug

### 5.5. Merge ke Main
```bash
git merge fitur/onboarding
```
```bash
git push origin main
```

---

### 6. Setelah Merge, Hapus Branch
```bash
# Hapus branch lokal
git branch -d fitur/onboarding
```
```bash
# Hapus branch remote
git push origin --delete fitur/onboarding
```
✅ Supaya workspace kamu tetap bersih

---

## ✅ Checklist Kolaborasi Aman
- [ ] Sudah jadi collaborator repo GitHub
- [ ] Selalu pull sebelum mulai kerja
- [ ] Selalu buat branch baru
- [ ] Jangan langsung push ke main
- [ ] Saling review Pull Request
- [ ] Merge hanya jika sudah dites dan tidak bug
- [ ] Komunikasi aktif di WhatsApp/Trello kalau ada bentrok kode

---
