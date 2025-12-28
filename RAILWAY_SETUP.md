# 🚂 Railway Deployment Guide - AI COMANAGER

Acest ghid te va ajuta să deploiezi aplicația **AI COMANAGER** pe Railway.app în mod corect și complet funcțional.

## 📋 Prerequisites

Înainte de a începe, asigură-te că ai:

- ✅ Cont GitHub (și repository-ul tău e pe GitHub)
- ✅ Cont Railway.app ([railway.app](https://railway.app))
- ✅ Google OAuth credentials (Client ID + Secret)
- ✅ OpenAI API key (sau Abacus AI key)
- ✅ Codul aplicației pregătit și commitat pe GitHub

---

## 🎯 PARTEA 1: Pregătire Repository GitHub

### 1.1 Push Codul pe GitHub

Dacă nu ai făcut-o deja:

```bash
cd /home/ubuntu/ai-comanager/nextjs_space

# Verifică status
git status

# Adaugă toate fișierele
git add .

# Creează commit
git commit -m "Initial commit: AI COMANAGER ready for Railway deployment"

# Adaugă remote (înlocuiește cu URL-ul tău)
git remote add origin https://github.com/username/ai-comanager.git

# Push la GitHub
git push -u origin main
```

### 1.2 Verifică că `.env` NU este commitat

```bash
# Verifică .gitignore
cat .gitignore | grep .env

# Ar trebui să vezi:
# .env
# .env.local
# .env.production
```

✅ Dacă vezi aceste linii, ești safe!

---

## 🎯 PARTEA 2: Setup Google OAuth Credentials

### 2.1 Accesează Google Cloud Console

1. Mergi la [Google Cloud Console](https://console.cloud.google.com)
2. Creează un proiect nou sau selectează unul existent
3. Navighează la **APIs & Services** → **Credentials**

### 2.2 Creează OAuth 2.0 Client ID

1. Click pe **Create Credentials** → **OAuth Client ID**
2. Alege **Web application**
3. Setează numele: `AI COMANAGER Production`

### 2.3 Configurează Authorized Redirect URIs

⚠️ **IMPORTANT**: Adaugă următoarele URIs (înlocuiește `your-app` cu numele tău de pe Railway):

```
https://your-app.up.railway.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

> **Notă**: După ce deploiezi pe Railway, vei primi URL-ul exact. Revino aici și actualizează-l.

### 2.4 Salvează Credentials

După creare, vei primi:
- **Client ID**: `282067129846-xxxxxxxxxxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxxxxxx`

⚠️ **PĂSTREAZĂ-LE ÎN SIGURANȚĂ** - le vei folosi la pasul următor!

---

## 🎯 PARTEA 3: Setup Railway Project

### 3.1 Creează Proiect Nou pe Railway

1. Accesează [railway.app](https://railway.app)
2. Click pe **New Project**
3. Alege **Deploy from GitHub repo**
4. Conectează-ți contul GitHub (dacă nu e deja conectat)
5. Selectează repository-ul `ai-comanager`

### 3.2 Adaugă PostgreSQL Database

1. În project dashboard, click pe **New**
2. Selectează **Database** → **PostgreSQL**
3. Railway va crea automat o instanță PostgreSQL
4. Așteptă până se finalizează provisionarea (~30 secunde)

✅ Railway va genera automat variabila `DATABASE_URL`

---

## 🎯 PARTEA 4: Configurare Environment Variables

### 4.1 Accesează Settings

În Railway project:
1. Click pe serviciul tău Next.js (nu database)
2. Mergi la tab-ul **Variables**

### 4.2 Adaugă Toate Variabilele

Click pe **New Variable** și adaugă următoarele:

#### 🗄️ Database (generat automat)

Railway adaugă automat `DATABASE_URL` când conectezi PostgreSQL. Verifică că există.

#### 🔐 NextAuth Configuration

```env
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXTAUTH_SECRET=your-generated-secret-here
```

**Pentru `NEXTAUTH_SECRET`**, generează unul nou:
```bash
openssl rand -base64 32
```

Sau folosește: https://generate-secret.vercel.app/32

⚠️ **IMPORTANT**: `NEXTAUTH_URL` folosește Railway's variable reference `${{RAILWAY_PUBLIC_DOMAIN}}` care se rezolvă automat la URL-ul tău de producție.

#### 🔑 Google OAuth

```env
GOOGLE_CLIENT_ID=your-google-client-id-from-step-2
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-step-2
```

#### 🤖 AI Services

```env
ABACUSAI_API_KEY=your-abacus-or-openai-key
```

Sau dacă folosești OpenAI direct:
```env
OPENAI_API_KEY=your-openai-api-key
```

### 4.3 Verifică Toate Variabilele

Ar trebui să ai în total **5 variabile**:

- ✅ `DATABASE_URL` (auto-generat de Railway)
- ✅ `NEXTAUTH_URL`
- ✅ `NEXTAUTH_SECRET`
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `ABACUSAI_API_KEY` (sau `OPENAI_API_KEY`)

---

## 🎯 PARTEA 5: Configurare Build Settings

### 5.1 Verifică Build Command

În Railway, mergi la **Settings** → **Build** și verifică:

```bash
Build Command: prisma generate && next build
```

Railway detectează automat `package.json` și ar trebui să folosească aceste comenzi:

- **Build**: `npm run build` (care rulează `prisma generate && next build`)
- **Start**: `npm run start`

### 5.2 Setează Root Directory (dacă e necesar)

Dacă repository-ul tău are structura:
```
ai-comanager/
  └── nextjs_space/
```

Atunci setează **Root Directory** la: `nextjs_space`

Altfel, lasă gol.

---

## 🎯 PARTEA 6: Database Migration

### 6.1 Rulează Migrațiile Prisma

După primul deployment, trebuie să inițializezi database-ul.

**Opțiunea 1: Prin Railway CLI**

```bash
# Instalează Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link la project
railway link

# Rulează migrația
railway run npx prisma migrate deploy
```

**Opțiunea 2: Prin Prisma Studio (local)**

```bash
# Copiază DATABASE_URL de pe Railway
export DATABASE_URL="postgresql://..."

# Rulează migrația
npx prisma migrate deploy

# (Opțional) Seed cu date de test
npm run seed
```

### 6.2 Verifică Database Schema

```bash
# Verifică că tabelele au fost create
railway run npx prisma studio
```

Sau conectează-te direct la PostgreSQL folosind DATABASE_URL și un client SQL.

---

## 🎯 PARTEA 7: Deploy & Verificare

### 7.1 Trigger Deploy

Railway face deploy automat la fiecare push pe GitHub. Dar pentru prima oară:

1. Mergi la **Deployments** tab
2. Click pe **Deploy**
3. Așteptă până build-ul se finalizează (~3-5 minute)

### 7.2 Verifică Logs

În timpul deployment-ului, monitorizează **Logs**:

```
✅ Build completed
✅ Starting server...
✅ Ready on http://0.0.0.0:3000
```

### 7.3 Obține URL-ul Public

După deploy succes:
1. Mergi la **Settings** → **Networking**
2. Click pe **Generate Domain**
3. Railway va genera un URL: `your-app-name.up.railway.app`

### 7.4 Testează Aplicația

Accesează URL-ul și verifică:
- ✅ Pagina se încarcă corect
- ✅ Poți da click pe "Sign in with Google"
- ✅ OAuth redirect funcționează
- ✅ După autentificare, dashboard-ul se încarcă

---

## 🎯 PARTEA 8: Actualizează Google OAuth

### 8.1 Adaugă Railway URL în Google Cloud

Acum că ai URL-ul final de pe Railway:

1. Revino la [Google Cloud Console](https://console.cloud.google.com)
2. Mergi la **APIs & Services** → **Credentials**
3. Editează OAuth Client ID
4. Adaugă în **Authorized redirect URIs**:

```
https://your-actual-railway-url.up.railway.app/api/auth/callback/google
```

5. **Save**

### 8.2 Re-testează Login

Accesează aplicația din nou și verifică că Google OAuth funcționează perfect.

---

## 🔧 TROUBLESHOOTING - Probleme Comune

### ❌ Problem: "Error: Invalid `prisma.user.create()`"

**Cauză**: Migrațiile Prisma nu au fost rulate.

**Soluție**:
```bash
railway run npx prisma migrate deploy
```

---

### ❌ Problem: "Error: NEXTAUTH_URL is not defined"

**Cauză**: Variabila de environment lipsește sau e incorectă.

**Soluție**:
1. Verifică în Railway **Variables** că `NEXTAUTH_URL` există
2. Valoarea ar trebui să fie: `${{RAILWAY_PUBLIC_DOMAIN}}` sau URL-ul complet

---

### ❌ Problem: "Database connection failed"

**Cauză**: DATABASE_URL nu este setată corect.

**Soluție**:
1. Verifică că PostgreSQL database e activ în Railway
2. Verifică că serviciul Next.js are variabila `DATABASE_URL` setată
3. Railway o setează automat când adaugi database - **nu o modifica manual**

---

### ❌ Problem: "Google OAuth Error: redirect_uri_mismatch"

**Cauză**: Google OAuth redirect URI nu include URL-ul de pe Railway.

**Soluție**:
1. Mergi la Google Cloud Console
2. Editează OAuth Client
3. Adaugă exact: `https://your-app.up.railway.app/api/auth/callback/google`

---

### ❌ Problem: Build fails cu "Module not found"

**Cauză**: Dependencies lipsesc din `package.json`.

**Soluție**:
1. Verifică `package.json` că toate pachetele sunt în `dependencies` (nu `devDependencies`)
2. În special: `@prisma/client`, `next-auth`, `react`, `next`

---

### ❌ Problem: "Error: Prisma schema not found"

**Cauză**: `prisma/schema.prisma` nu e în repository.

**Soluție**:
1. Verifică că `prisma/schema.prisma` **NU** e în `.gitignore`
2. Commitează și push-uiește din nou

---

## 📊 Monitoring & Maintenance

### Logs

Pentru a vedea logs în timp real:
```bash
railway logs
```

Sau accesează direct în Railway Dashboard → **Deployments** → click pe deployment → **View Logs**

### Database Backups

Railway oferă backups automate pentru PostgreSQL (Pro plan).

Pentru manual backup:
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

### Scaling

În Railway **Settings**:
- Ajustează **Memory** și **CPU** după necesitate
- Default: 512MB RAM, shared CPU (suficient pentru început)

---

## ✅ Deployment Checklist

Înainte de a considera deployment-ul finalizat:

- [ ] Codul e pe GitHub
- [ ] Railway project creat
- [ ] PostgreSQL database adăugat
- [ ] Toate environment variables setate
- [ ] `prisma migrate deploy` rulat cu succes
- [ ] Build-ul se finalizează fără erori
- [ ] Aplicația se încarcă la URL-ul public
- [ ] Google OAuth funcționează
- [ ] Poți crea un user și te poți autentifica
- [ ] Dashboard-ul se încarcă corect
- [ ] Google OAuth redirect URIs actualizate

---

## 🎉 Success!

Dacă ai urmat toți pașii, aplicația ta **AI COMANAGER** ar trebui să fie live și funcțională pe Railway! 🚀

### Next Steps:

1. **Custom Domain**: Poți adăuga un domeniu custom în Railway Settings
2. **SSL Certificate**: Railway oferă SSL automat pentru toate domeniile
3. **CI/CD**: Railway face auto-deploy la fiecare push pe `main` branch
4. **Monitoring**: Configurează alerting pentru erori în production

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma Railway Guide: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway

---

**Built with ❤️ for Railway deployment**
