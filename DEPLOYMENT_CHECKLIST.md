# 🚀 AI COMANAGER - Deployment Checklist & Environment Variables

## ✅ Pre-Deployment Checklist

Asigură-te că ai completat următoarele înainte de deployment:

### 1. GitHub Repository
- [ ] Codul este commitat pe branch `main` sau `master`
- [ ] Fișierul `.env` **NU** este în repository (verificat în .gitignore)
- [ ] Toate fișierele de documentație sunt incluse (README.md, RAILWAY_SETUP.md)
- [ ] Repository este public sau ai dat acces la Railway

### 2. Google OAuth Setup
- [ ] Ai creat un proiect în Google Cloud Console
- [ ] Ai generat OAuth 2.0 Client ID
- [ ] Ai salvat Client ID și Client Secret
- [ ] Vei actualiza Redirect URIs după primirea URL-ului de pe Railway

### 3. API Keys
- [ ] Ai obținut OpenAI API Key sau Abacus AI API Key
- [ ] Ai verificat că API key-ul are credits suficiente
- [ ] Ai generat un NEXTAUTH_SECRET (vezi mai jos cum)

### 4. Railway Account
- [ ] Ai cont activ pe Railway.app
- [ ] Ai conectat contul GitHub cu Railway
- [ ] Ai acces la create new projects

---

## 🔑 Environment Variables pentru Railway

### Variabile care trebuie setate MANUAL în Railway Dashboard:

#### 1. **NEXTAUTH_URL**
```
${{RAILWAY_PUBLIC_DOMAIN}}
```
> **Explicație**: Railway va înlocui automat cu URL-ul tău public (ex: `https://ai-comanager-production.up.railway.app`)

#### 2. **NEXTAUTH_SECRET**
Generează unul nou cu comanda:
```bash
openssl rand -base64 32
```

Sau folosește: https://generate-secret.vercel.app/32

**Exemplu**: `KP10Q2io22DJpF0E4wLKyfICTxI3OQJX`

> ⚠️ **IMPORTANT**: Nu folosi același secret ca în development!

#### 3. **GOOGLE_CLIENT_ID**
```
282067129846-xxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```
> Obținut din Google Cloud Console → APIs & Services → Credentials

#### 4. **GOOGLE_CLIENT_SECRET**
```
GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx
```
> Obținut din Google Cloud Console (același loc ca Client ID)

#### 5. **ABACUSAI_API_KEY** (sau OPENAI_API_KEY)
```
your-api-key-here
```
> Obținut din:
> - Abacus AI: https://abacus.ai
> - OpenAI: https://platform.openai.com/api-keys

---

### Variabile generate AUTOMAT de Railway:

#### **DATABASE_URL**
```
postgresql://postgres:password@hostname:5432/railway
```
> ✅ Această variabilă este **generată automat** de Railway când adaugi PostgreSQL database.
> **NU o seta manual!**

---

## 📊 Tabel Sumar - Environment Variables

| Variabilă | Sursa | Generat de Railway? | Obligatoriu? |
|-----------|-------|---------------------|--------------|
| `DATABASE_URL` | PostgreSQL service | ✅ DA | ✅ DA |
| `NEXTAUTH_URL` | Railway variable | ❌ NU - manual | ✅ DA |
| `NEXTAUTH_SECRET` | Generat de tine | ❌ NU - manual | ✅ DA |
| `GOOGLE_CLIENT_ID` | Google Cloud Console | ❌ NU - manual | ✅ DA |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console | ❌ NU - manual | ✅ DA |
| `ABACUSAI_API_KEY` | Abacus AI Dashboard | ❌ NU - manual | ✅ DA |
| `OPENAI_API_KEY` | OpenAI Platform | ❌ NU - manual | ⚠️ Opțional* |

> *Opțional: Folosește fie `ABACUSAI_API_KEY`, fie `OPENAI_API_KEY`, în funcție de ce AI service alegi.

---

## 🛠 Comenzi Utile

### Generare NEXTAUTH_SECRET
```bash
# Opțiunea 1: OpenSSL
openssl rand -base64 32

# Opțiunea 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Verificare Git Status
```bash
cd /home/ubuntu/ai-comanager/nextjs_space
git status
```

### Push la GitHub
```bash
# Prima dată
git remote add origin https://github.com/YOUR_USERNAME/ai-comanager.git
git push -u origin main

# Pentru update-uri ulterioare
git push
```

### Testare Local înainte de Deploy
```bash
# Build production local
npm run build

# Rulează în production mode
npm run start

# Verifică health endpoint
curl http://localhost:3000/api/health
```

---

## 📝 Pași Post-Deployment

După ce aplicația e live pe Railway:

### 1. Obține URL-ul Public
- Mergi în Railway Dashboard → Settings → Networking
- Copiază URL-ul generat (ex: `ai-comanager-production.up.railway.app`)

### 2. Actualizează Google OAuth Redirect URIs
- Accesează Google Cloud Console
- Mergi la APIs & Services → Credentials
- Editează OAuth 2.0 Client ID
- Adaugă în **Authorized redirect URIs**:
  ```
  https://ai-comanager-production.up.railway.app/api/auth/callback/google
  ```
- Click **Save**

### 3. Rulează Database Migrations
```bash
# Opțiunea 1: Railway CLI
railway run npx prisma migrate deploy

# Opțiunea 2: Local cu Railway DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### 4. Testare Finală
- [ ] Accesează URL-ul aplicației
- [ ] Testează "Sign in with Google"
- [ ] Verifică că autentificarea funcționează
- [ ] Accesează dashboard-ul
- [ ] Verifică că datele se salvează corect

---

## 🔒 Securitate - Best Practices

### ✅ DO:
- Folosește NEXTAUTH_SECRET diferit pentru development și production
- Rotează secretele regulat (la 3-6 luni)
- Monitorizează Railway logs pentru erori sau tentative de acces neautorizat
- Setează environment variables doar în Railway Dashboard (nu le commita)
- Folosește OAuth cu Google (mai sigur decât credentials)

### ❌ DON'T:
- Nu partaja niciodată NEXTAUTH_SECRET sau API keys public
- Nu commita fișierul `.env` pe GitHub
- Nu folosi aceleași secrets în multiple environments
- Nu lăsa logs cu informații sensibile în production
- Nu ignora warning-urile de securitate din Railway

---

## 🐛 Troubleshooting Quick Reference

### Eroare: "Error: Prisma Client is not configured"
**Soluție**: Rulează `railway run npx prisma generate`

### Eroare: "NEXTAUTH_URL is undefined"
**Soluție**: Verifică că ai setat variabila în Railway: `${{RAILWAY_PUBLIC_DOMAIN}}`

### Eroare: "Database connection failed"
**Soluție**: Verifică că PostgreSQL database e activ și că `DATABASE_URL` există

### Eroare: "redirect_uri_mismatch" (Google OAuth)
**Soluție**: Adaugă exact URL-ul de pe Railway în Google Cloud Console redirect URIs

### Build fails: "Module not found"
**Soluție**: Verifică că toate dependencies sunt în `dependencies` (nu `devDependencies`)

---

## 📞 Support & Resources

- **Railway Docs**: https://docs.railway.app
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma on Railway**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway
- **NextAuth.js Docs**: https://next-auth.js.org/getting-started/introduction

---

## ✅ Final Checklist înainte de Go Live

- [ ] Toate environment variables sunt setate în Railway
- [ ] PostgreSQL database e activ și conectat
- [ ] Prisma migrations au rulat cu succes
- [ ] Build-ul se finalizează fără erori
- [ ] Health check endpoint (`/api/health`) returnează 200 OK
- [ ] Google OAuth redirect URIs sunt actualizate cu URL-ul de production
- [ ] Ai testat login-ul și autentificarea
- [ ] Dashboard-ul se încarcă corect
- [ ] Nu există erori în Railway logs

---

🎉 **Felicitări! AI COMANAGER este gata pentru deployment pe Railway!** 🚀

Pentru ghid detaliat pas cu pas, vezi **[RAILWAY_SETUP.md](./RAILWAY_SETUP.md)**
