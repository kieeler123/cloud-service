# Cloud Drive (React + Firebase) / クラウド型ファイル管理アプリ

React + TypeScript + TailwindCSS + Firebase を用いて開発した  
**クラウドドライブ風Webアプリ**です。

本プロジェクトは以下2つの目的を両立する形で設計しています。

- ✅ 日本企業の面接向けポートフォリオ（設計思想・実装力の証明）
- ✅ 将来的なデジタルノマド活動に向けた長期拡張プロジェクト

---

## 🌐 Languages / 対応言語
**Languages:** 日本語 | [English](README.en.md) | [한국어](README.ko.md)

UIは **react-i18next** により動的に切り替え可能です。

---

## 🚀 Features / 機能一覧

### 🔐 Authentication
- Email / Password Login
- Google Login
- Logout
- Delete Account
- Update Display Name

### 🌍 Multi-language (i18n)
- 日本語 / English / 한국어 / 中文(简体)
- すべてのUI文言を多言語対応

### 🎨 Theme System
- Dark / Light / Sky テーマ
- React Context（ThemeContext）による状態管理
- Headerボタンで即時切り替え

### 📤 File Upload
- Firebase Storage へのアップロード
- Upload progress bar（%表示）
- Firestore に metadata をリアルタイム保存
- 例外処理 / エラーハンドリング対応

### 🗂 My Drive
- owner(uid) ベースでファイル取得
- Newest first order
- Download
- Move to trash
- i18n対応テーブル表示

### 🗑 Trash
- Restore file
- Delete forever
- `isTrashed` フラグ方式（論理削除）
- リアルタイム更新

### 👤 Account Settings
- 表示名変更
- Email確認
- アカウント削除（re-auth requiredチェック）

---

## ⭐ 面接ポイント（実装ハイライト）
- React Context を用いて **Theme / UI状態**を管理
- i18next による **完全な多言語UI切替**
- Firebase Auth / Firestore / Storage の統合実装
- ゴミ箱は `isTrashed` による **論理削除設計**
  - 復元可能
  - 完全削除（Delete forever）と責務分離
- アップロード進捗表示など、ユーザー体験を意識したUI実装

---

## 🔐 Security / 権限設計
- Firebase Authentication によりユーザー認証
- Firestore / Storage は Firebase Rules によりアクセス制御
- データ取得は owner(uid) を基準に行い、他ユーザーのデータにはアクセス不可

---

## 🧩 Tech Stack / 技術スタック

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
🛠 How to Run / 実行方法
1) Install packages
bash
コードをコピーする
npm install
2) Set Firebase environment variables
.env を作成し、以下を設定してください。

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
🎯 Purpose / 目的
日本企業向けポートフォリオとしての設計・実装経験の証明

Firebase を活用したフル機能実装（Auth / DB / Storage）

将来的に Supabase / AWS へ移行可能な構造を意識

デジタルノマド向けの長期プロジェクト基盤作り

🔮 Future Plans / 今後の拡張
Folders

Drag & Drop upload

File preview modal

User profile avatar

Supabase migration version

Full client-server separation

👤 Author
디지털노마드를꿈꾸다

GitHub: https://github.com/kieeler123