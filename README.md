# 🧠 AI COMANAGER - Marketing AI Terminal

# 🧠 AI COMANAGER S2 - Development Fork

**AI COMANAGER S2** este versiunea de dezvoltare (Stage 2) a proiectului. Această versiune include arhitectură îmbunătățită, suport native pentru vectori și teste automate.

## ✨ Features Principale

### 🎯 Terminal Marketing AI
- **Strategie & Briefuri**: Generează automat briefuri de campanie bazate pe obiective și date
- **Modul Creativ**: Creează copy, headlines, și sugestii vizuale pentru campaniile tale
- **Performanță & Alertă**: Monitorizare în timp real a KPI-urilor (CTR, CPA, ROAS, conversii)
- **Producție Conținut**: Generare automată de materiale promoționale
- **Bugetare & Costuri**: Alocare inteligentă de bugete și simulări ROI

### 🧠 Creier Central (Core AI)
- **Memorie Contextuală**: Reține toate deciziile, documentele și acțiunile anterioare
- **Distribuire de Sarcini**: Coordonează task-urile între diferite terminale AI
- **Detecție de Abateri**: Monitorizează și alertează când ceva iese din parametrii stabiliți
- **Sugestii Proactive**: Propune optimizări și strategii înainte de a fi cerute

### 📊 Integrări
- **Google OAuth**: Autentificare securizată
- **OpenAI GPT-4o**: Generare inteligentă de conținut și analiză
- **PostgreSQL + Prisma**: Database robust pentru date structurate
- **Vector Search Ready**: Pregătit pentru căutare semantică (RAG)

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** + **Radix UI**
- **Framer Motion** pentru animații
- **React Hook Form** + **Zod** pentru formulare

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL** (database principal)
- **NextAuth.js** (autentificare)

### AI & Analytics
- **OpenAI API** (GPT-4o)
- **Vector Embeddings** pentru semantic search
- **Chart.js** + **Recharts** pentru vizualizări

## 📋 Prerequisites

Înainte de a începe, asigură-te că ai instalat:
- **Node.js** 18.x sau mai nou
- **PostgreSQL** 14+ (local sau cloud)
- **Git**
- **npm** sau **yarn**

## 🚀 Setup Local Development

### 1. Clone Repository

```bash
git clone <repository-url>
cd ai-comanager/nextjs_space
```

### 2. Install Dependencies

```bash
npm install
# sau
yarn install
```

### 3. Setup Environment Variables

Creează fișierul `.env` în root:

```bash
cp .env.example .env
```

Completează variabilele necesare (vezi secțiunea Environment Variables mai jos).

### 4. Setup Database

```bash
# Generează Prisma Client
npx prisma generate

# Rulează migrațiile
npx prisma migrate dev

# (Opțional) Seed database cu date de test
npm run seed
```

### 5. Start Development Server

```bash
npm run dev
```

Aplicația va fi disponibilă la [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Aplicația necesită următoarele environment variables:

### Database
```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

### NextAuth
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### Google OAuth
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### AI Services
```env
ABACUSAI_API_KEY="your-abacus-api-key"
```

> **⚠️ Important**: Nu commita niciodată fișierul `.env` cu valori reale! Folosește `.env.example` pentru template.

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build pentru production
npm run start        # Start production server

# Database
npx prisma generate  # Generează Prisma Client
npx prisma migrate   # Rulează migrații
npx prisma studio    # Deschide Prisma Studio

# Linting
npm run lint         # Rulează ESLint
```

## 🏗 Project Structure

```
nextjs_space/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── ui/               # UI components (Radix)
│   └── marketing/        # Marketing-specific components
├── lib/                   # Utility functions
│   ├── db.ts             # Database client
│   └── auth.ts           # Auth configuration
├── prisma/               # Prisma schema & migrations
│   └── schema.prisma     # Database schema
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## 🚀 Deployment

Pentru deployment pe Railway sau alte platforme cloud, vezi ghidul detaliat:

👉 **[RAILWAY_SETUP.md](./RAILWAY_SETUP.md)**

## 🔒 Security Notes

- Toate API keys sunt stocate în environment variables
- NextAuth secret trebuie generat cu: `openssl rand -base64 32`
- Google OAuth credentials trebuie configurate în Google Cloud Console
- Database URL conține credentials sensibile - nu o expune niciodată

## 📄 License

Proprietary - © 2025 AI COMANAGER

## 🤝 Contributing

Acest proiect este privat. Pentru contribuții, contactează echipa.

## 📞 Support

Pentru întrebări sau probleme, contactează:
- Email: support@ai-comanager.com
- GitHub Issues: [Create Issue](link-to-issues)

---

**Built with ❤️ using Next.js, TypeScript, and AI**
