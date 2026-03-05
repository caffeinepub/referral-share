# Referral Share

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- User login with Internet Identity
- Dashboard pengguna: menampilkan kode referral unik milik user
- Tombol salin kode referral ke clipboard
- Tombol share referral link via URL
- Input untuk memasukkan kode referral orang lain (join dengan kode referral)
- Halaman leaderboard: daftar user dengan jumlah referral terbanyak
- Statistik: total referral yang berhasil, jumlah poin/reward
- Riwayat: siapa saja yang mendaftar menggunakan kode referral user

### Modify
- (tidak ada)

### Remove
- (tidak ada)

## Implementation Plan

Backend (Motoko):
1. Struct `UserProfile`: principal, referralCode (unik, auto-generated), referredBy (optional principal), referrals (list principal yang direkrut), joinedAt (timestamp)
2. `register(referralCode: ?Text)` -- mendaftarkan user baru, opsional dengan kode referral orang lain
3. `getMyProfile()` -- ambil profil + kode referral milik user
4. `getReferralStats()` -- jumlah referral berhasil, daftar referral
5. `getLeaderboard()` -- top users berdasarkan jumlah referral
6. `generateReferralCode()` -- buat kode unik dari principal

Frontend (React):
1. Halaman Landing: tombol login/daftar
2. Halaman Dashboard: kode referral, tombol copy, tombol share (generate link dengan kode), statistik referral, riwayat referral
3. Halaman Leaderboard: tabel peringkat user berdasarkan jumlah referral
4. Auto-detect referral code dari URL query param saat pendaftaran
