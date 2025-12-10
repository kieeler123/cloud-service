📄 README.md (최종 4개 언어 버전 포함)

아래 내용 그대로 README.md 파일로 넣으면 됨.

# 📁 Cloud Drive (React + Firebase)

A modern cloud-drive style web application built with **React + TypeScript + TailwindCSS + Firebase**.  
This project is designed as a practical portfolio for Japanese job interviews and future digital-nomad development.

日本企業の面接向けポートフォリオとして設計された  
**クラウド型ファイル管理アプリ**です。

本项目是作为面向日本企业的求职作品集，同时也是未来数字游牧工作形态的基础项目。

---

# 🌐 Available Languages / 対応言語 / 可用语言
- 🇯🇵 **Japanese**
- 🇺🇸 **English**
- 🇰🇷 **Korean**
- 🇨🇳 **Chinese (Simplified)**

UI は **i18next** によって動的に切り替えできます。  
The UI can dynamically switch languages using i18next.

---

# 🚀 Features / 機能一覧 / 功能特性

## 🔐 Authentication
- Email & Password Login
- Google Login
- Logout
- Delete Account
- Update Display Name

## 🌍 Multi-language (i18n)
- JA / EN / KO / ZH 切替
- 全 UI 文言対応済み

## 🎨 Theme System
- Dark / Light / Sky themes
- ThemeContext による管理
- Header のボタンで即時切替

## 📤 File Upload
- Firebase Storage upload
- Upload progress bar + percentage
- Realtime Firestore metadata
- Error handling 完備

## 🗂 My Drive
- Owner 基準でファイル取得
- Newest first order
- Download
- Move to trash
- i18n table support

## 🗑 Trash
- Restore file
- Delete forever
- isTrashed フラグ方式
- リアルタイム更新

## 👤 Account Settings
- Change display name
- View email
- Delete account (re-auth required check)

---

# 🧩 Tech Stack / 技术栈

| Category | Stack |
|---------|-------|
| Frontend | React 18 / TypeScript / Vite / TailwindCSS |
| State | React Context API |
| Auth | Firebase Authentication |
| Database | Firestore |
| Storage | Firebase Storage |
| i18n | react-i18next |
| UI | Tailwind CSS |
| Deployment | Vercel (recommended) |

---

# 📦 Folder Structure



src/
├─ components/
│ ├─ LanguageSwitcher.tsx
│ ├─ ThemeSwitcher.tsx
├─ contexts/
│ └─ ThemeContext.tsx
├─ layouts/
│ └─ AppLayout.tsx
├─ pages/
│ ├─ DrivePage.tsx
│ ├─ TrashPage.tsx
│ ├─ LoginPage.tsx
│ └─ AccountPage.tsx
├─ i18n/
│ ├─ en.json
│ ├─ ja.json
│ ├─ ko.json
│ ├─ zh.json
├─ lib/firebase.ts
├─ App.tsx
└─ main.tsx


---

# 🛠 How to Run

### 1. Install packages


npm install


### 2. Set Firebase environment variables


VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx


### 3. Start dev server


npm run dev


---

# 🎯 Purpose

- 日本企業向けポートフォリオ  
- Firebase 実装経験の積み上げ  
- 将来的に Supabase / AWS へ移行可能な構造  
- デジタルノマド向けの長期プロジェクト基盤作り  

---

# 🔮 Future Plans
- Folders  
- Drag & Drop upload  
- File preview modal  
- User profile avatar  
- Supabase migration version  
- Full client-server separation  

---

# 👤 Author
**디지털노마드를꿈꾸다**