# Rezonans Etimesgut — Student Management System

## Folder Structure

```
rezonans-app/
├── web/                  Next.js app + Capacitor workspace
│   ├── android/          Android native project (managed by Capacitor)
│   ├── components/       React UI components
│   ├── hooks/            Custom React hooks (useAuth, useAppData…)
│   ├── mock/             Mock seed data (mockData.js)
│   ├── pages/            Next.js page routes
│   ├── src/services/     API client (api.js) + push/deep-link helpers
│   ├── styles/           Global CSS
│   ├── out/              Static build output — upload this to hosting
│   ├── .htaccess         Apache rewrite rules for SPA routing (upload to public_html/)
│   ├── .env.local.example  Copy to .env.local and set your API URL
│   ├── capacitor.config.json
│   ├── next.config.js
│   ├── package.json
│   └── tailwind.config.js
│
├── mobile/               Native patch files (apply once during setup)
│   ├── android-manifest-patch.xml
│   ├── ios-appdelegate-patch.swift
│   ├── ios-info-plist-patch.xml
│   └── MOBILE_SETUP.md
│
├── backend/              PHP REST API + database
│   ├── api/              Upload the entire api/ folder to public_html/api/
│   │   ├── config.php    ← Set DB credentials here before uploading
│   │   ├── .htaccess     Blocks direct access to config.php
│   │   ├── auth-login.php
│   │   ├── auth-logout.php
│   │   ├── auth-restore.php
│   │   ├── users.php / users-delete.php
│   │   ├── students.php / students-delete.php
│   │   ├── teachers.php
│   │   ├── evaluations.php
│   │   ├── messages.php / messages-read.php
│   │   ├── announcements.php
│   │   ├── attendance.php
│   │   ├── payments.php / payments-mark-paid.php / payments-create-invoice.php
│   │   ├── demo.php
│   │   ├── products.php
│   │   └── schedule.php
│   └── database/
│       └── schema.sql    Import this into MySQL via phpMyAdmin
│
├── DEPLOYMENT.md         Step-by-step hosting deployment guide
└── README.md             This file
```

---

## 1. Run the web app locally

```bash
cd web
npm install          # first time only
npm run dev          # opens http://localhost:3000
```

The app uses mock data by default (no backend needed for local dev).

---

## 2. Point the app at your real PHP backend

```bash
cd web
cp .env.local.example .env.local
# Open .env.local and set:
#   NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

---

## 3. Build for production (static export)

```bash
cd web
npm run build        # generates web/out/
```

The `out/` folder is a fully static site — no Node.js server required on hosting.

---

## 4. Deploy to shared hosting (cPanel)

### Step 1 — Database
1. cPanel → phpMyAdmin → select your database → **Import**
2. Upload `backend/database/schema.sql` → click **Go**
3. Run the hash-generation SQL from `DEPLOYMENT.md` to set correct passwords

### Step 2 — PHP API
1. Open `backend/api/config.php` and fill in your DB credentials
2. Upload **the entire `backend/api/` folder** to `public_html/api/`

### Step 3 — Next.js static files
1. Upload **the contents of `web/out/`** (not the folder itself) to `public_html/`
2. Upload `web/.htaccess` to `public_html/`

Your hosting layout should be:
```
public_html/
├── .htaccess         ← from web/.htaccess  (SPA routing)
├── index.html
├── _next/
├── ...               (rest of web/out/ contents)
└── api/
    ├── .htaccess     ← from backend/api/.htaccess
    ├── config.php
    └── *.php
```

---

## 5. Sync and open on Android

All Capacitor commands must be run from inside the `web/` folder because
`capacitor.config.json` and the `android/` project both live there.

```bash
cd web

# After every build: sync web assets into the Android project
npm run build
npx cap sync android

# Open in Android Studio
npx cap open android
```

Inside Android Studio:
1. Wait for Gradle sync to finish
2. Select a device or emulator
3. Press Run (▶)

---

## 6. Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `web/.env.local` | Base URL of the PHP API |

---

## 7. Key files to edit before first deploy

| File | What to change |
|---|---|
| `backend/api/config.php` | DB_HOST, DB_NAME, DB_USER, DB_PASS + allowed_origins |
| `web/.env.local` | NEXT_PUBLIC_API_URL |
| `backend/database/schema.sql` | Already seeded — just import as-is |

---

## Roles & permissions

| Role | Turkish | Access |
|---|---|---|
| `admin` | Admin | Everything |
| `teacher` | Öğretmen | Own students' data, evaluations, attendance |
| `student` | Öğrenci | Own profile, schedule, evaluations |
| `veli` | Veli | Own child's evaluations, attendance, payments |

Default login credentials (change after first deploy):

| Email | Password | Role |
|---|---|---|
| admin@rezonans.com | Admin123! | admin |
| selin@rezonans.com | Teacher123! | teacher |
| fatma@rezonans.com | Veli123! | veli |
| ahmet@rezonans.com | Student123! | student |
