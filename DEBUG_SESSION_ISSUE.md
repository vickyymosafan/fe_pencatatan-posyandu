# Debug Guide: "Sesi Anda Telah Berakhir" Issue

## 🔍 Masalah
Setelah login berhasil, muncul error "Sesi Anda telah berakhir. Silakan login kembali."

## 🎯 Kemungkinan Penyebab

### 1. JWT_SECRET Mismatch (PALING LIKELY!)
Backend di Vercel menggunakan JWT_SECRET yang berbeda dengan local.

**Check:**
1. Buka Vercel Dashboard: https://vercel.com/dashboard
2. Pilih project: `be-pencatatan-posyandu`
3. Settings → Environment Variables
4. Cari `JWT_SECRET`

**Fix:**
- Jika tidak ada: Add `JWT_SECRET` dengan value dari `be/.env`
- Jika berbeda: Update dengan value yang sama dari `be/.env`
- Value: `posyandu-lansia-super-secret-jwt-key-2025`

**Setelah update:**
- Redeploy backend (Settings → Deployments → Latest → Redeploy)
- Tunggu 1-2 menit
- Test login lagi

### 2. Rate Limit (SUDAH DI-FIX)
Backend rate limit sudah di-increase ke 500 req/15min.

**Jika masih kena rate limit:**
- Tunggu 15 menit untuk reset
- Atau restart browser untuk reset IP tracking

### 3. Token Format Issue

**Debug di Browser Console (F12):**
```javascript
// Check token di localStorage
const token = localStorage.getItem('token');
console.log('Token:', token);
console.log('Token length:', token?.length);

// Check user
const user = localStorage.getItem('user');
console.log('User:', JSON.parse(user));

// Test API call dengan token
fetch('https://be-pencatatan-posyandu.vercel.app/api/laporan/dashboard', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.error('API Error:', e));
```

**Expected Output:**
- Token: String panjang (100+ characters)
- User: Object dengan id, nama, email, role
- API Response: Dashboard stats data

**Jika API return 401:**
- Token invalid atau JWT_SECRET mismatch
- Check Vercel environment variables

### 4. CORS Issue

**Check di Network Tab (F12):**
- Lihat request ke backend
- Check response headers
- Jika ada CORS error, update `CORS_ORIGIN` di Vercel

**Fix:**
1. Vercel Dashboard → Environment Variables
2. Update `CORS_ORIGIN` = `http://localhost:3000`
3. Redeploy

## 🧪 Testing Steps

### 1. Clear Everything
```javascript
// Di browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. Login Fresh
- Buka `http://localhost:3000/login`
- Login: `admin@posyandu.com` / `Admin123`
- Watch console untuk errors

### 3. Check Token
```javascript
// Immediately after login
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### 4. Test API
```javascript
// Test dashboard API
const token = localStorage.getItem('token');
fetch('https://be-pencatatan-posyandu.vercel.app/api/laporan/dashboard', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(d => console.log('Data:', d))
.catch(e => console.error('Error:', e));
```

## ✅ Expected Behavior

**After Login:**
1. ✅ Toast: "Login berhasil!"
2. ✅ Redirect to `/admin/dashboard`
3. ✅ Dashboard loads (200ms delay)
4. ✅ Stats cards show data
5. ✅ Chart renders
6. ✅ NO "Sesi berakhir" error

## 🚨 Common Issues

### Issue: "Terlalu banyak permintaan"
**Solution:** Wait 15 minutes or restart browser

### Issue: "Sesi Anda telah berakhir" immediately after login
**Solution:** Check JWT_SECRET in Vercel (most likely cause)

### Issue: Dashboard shows skeleton forever
**Solution:** Check Network tab for API errors

### Issue: CORS error
**Solution:** Update CORS_ORIGIN in Vercel

## 📝 Checklist

- [ ] JWT_SECRET di Vercel sama dengan local
- [ ] JWT_EXPIRES_IN di Vercel = `24h`
- [ ] CORS_ORIGIN di Vercel = `http://localhost:3000`
- [ ] Backend deployed successfully
- [ ] Rate limit increased (500 req/15min)
- [ ] Frontend dev server running
- [ ] localStorage cleared before testing
- [ ] Browser console shows no errors

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Backend Repo: https://github.com/vickyymosafan/be_pencatatan-posyandu
- Frontend: http://localhost:3000

## 💡 Pro Tips

1. **Always check Vercel logs** for backend errors
2. **Use browser console** untuk debug token issues
3. **Clear localStorage** sebelum testing
4. **Wait for deployment** setelah update env vars (1-2 min)
5. **Check Network tab** untuk see actual API responses
