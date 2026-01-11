# Cloud Drive (React + Firebase)

A modern **cloud-drive style web application** built with  
**React + TypeScript + TailwindCSS + Firebase**.

This project was designed for two purposes:

- ✅ A practical portfolio for Japanese job interviews
- ✅ A long-term foundation project for future digital-nomad development

---

## 🌐 Languages
**Docs:** [日本語](README.md) | [English](README.en.md) | [한국어](README.ko.md)  
**UI Languages:** 日本語 / English / 한국어 / 中文(简体)

The UI supports dynamic language switching using **react-i18next**.

---

## 🚀 Features

### 🔐 Authentication
- Email & Password login
- Google login
- Logout
- Delete account
- Update display name

### 🌍 Multi-language (i18n)
- Japanese / English / Korean / Chinese (Simplified)
- Full UI translation support

### 🎨 Theme System
- Dark / Light / Sky themes
- Global theme state managed with React Context (ThemeContext)
- Instant theme switching via header buttons

### 📤 File Upload
- Upload to Firebase Storage
- Upload progress bar + percentage
- Realtime metadata updates in Firestore
- Error handling / validation

### 🗂 My Drive
- Fetch files by owner(uid)
- Newest-first ordering
- Download files
- Move files to trash
- i18n-supported table UI

### 🗑 Trash
- Restore files
- Delete forever
- Logical deletion using `isTrashed` flag
- Realtime updates

### 👤 Account Settings
- Change display name
- View email
- Delete account (re-auth required check)

---

## ⭐ Interview Highlights (Implementation Points)
- Theme / UI state management using **React Context**
- Full multi-language UI system using **react-i18next**
- Integrated Firebase implementation:
  - Authentication
  - Firestore database
  - Storage upload
- Trash system designed with **logical deletion (`isTrashed`)**
  - supports restore
  - separates “restore” and “delete forever” responsibilities
- Improved UX with upload progress UI and realtime updates

---

## 🔐 Security / Access Control
- User authentication handled by Firebase Authentication
- Firestore / Storage access controlled by Firebase Security Rules
- Files are fetched by owner(uid), preventing access to other users’ data

---

## 🧩 Tech Stack

| Category | Stack |
| --- | --- |
| Frontend | React 18 / TypeScript / Vite / TailwindCSS |
| State | React Context API |
| Auth | Firebase Authentication |
| Database | Firestore |
| Storage | Firebase Storage |
| i18n | react-i18next |
| Deployment | Vercel (recommended) |

---

## 📦 Folder Structure
```txt
src/
 ├─ components/
 │   ├─ LanguageSwitcher.tsx
 │   └─ ThemeSwitcher.tsx
 ├─ contexts/
 │   └─ ThemeContext.tsx
 ├─ layouts/
 │   └─ AppLayout.tsx
 ├─ pages/
 │   ├─ DrivePage.tsx
 │   ├─ TrashPage.tsx
 │   ├─ LoginPage.tsx
 │   └─ AccountPage.tsx
 ├─ i18n/
 │   ├─ en.json
 │   ├─ ja.json
 │   ├─ ko.json
 │   └─ zh.json
 ├─ lib/
 │   └─ firebase.ts
 ├─ App.tsx
 └─ main.tsx
🛠 How to Run
1) Install packages
bash
コードをコピーする
npm install
2) Set Firebase environment variables
Create a .env file and set:

env
コードをコピーする
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
3) Start dev server
bash
コードをコピーする
npm run dev
🎯 Purpose
Build a strong portfolio project for Japanese job interviews

Gain hands-on experience with Firebase (Auth / Firestore / Storage)

Design an architecture that can be migrated to Supabase / AWS in the future

Create a scalable long-term project foundation for digital-nomad work

🔮 Future Plans
Folders

Drag & Drop upload

File preview modal

User profile avatar

Supabase migration version

Full client-server separation

👤 Author
디지털노마드를꿈꾸다

GitHub: https://github.com/kieeler123