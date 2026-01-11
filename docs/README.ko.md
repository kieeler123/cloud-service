# Cloud Drive (React + Firebase) / 클라우드형 파일 관리 앱

React + TypeScript + TailwindCSS + Firebase로 개발한  
**클라우드 드라이브 스타일 Web 앱**입니다.

이 프로젝트는 아래 2가지 목적을 동시에 만족하도록 설계했습니다.

- ✅ 일본 기업 면접용 포트폴리오 (설계/구현 역량 증명)
- ✅ 향후 디지털노마드 활동을 위한 장기 확장 프로젝트 기반

---

## 🌐 Languages / 지원 언어
**Languages:** [日本語](README.md) | English(README.en.md) | 한국어(README.ko.md)

UI는 **react-i18next** 기반으로 동적으로 전환 가능합니다.

---

## 🚀 주요 기능

### 🔐 인증(Authentication)
- Email / Password 로그인
- Google 로그인
- 로그아웃
- 계정 삭제
- 닉네임(표시 이름) 변경

### 🌍 다국어(i18n)
- 일본어 / 영어 / 한국어 / 중국어(간체)
- 전체 UI 문구 다국어 대응

### 🎨 테마 시스템
- Dark / Light / Sky 테마
- React Context(ThemeContext) 기반 상태 관리
- Header 버튼으로 즉시 전환

### 📤 파일 업로드
- Firebase Storage 업로드
- 업로드 진행률(%) 표시
- Firestore에 metadata 실시간 저장
- 예외 처리/에러 핸들링 구현

### 🗂 My Drive
- owner(uid) 기준 파일 조회
- 최신순 정렬
- 다운로드
- 휴지통으로 이동
- i18n 지원 테이블 표시

### 🗑 Trash(휴지통)
- 파일 복구
- 완전 삭제(Delete forever)
- `isTrashed` 플래그 기반(논리 삭제)
- 실시간 업데이트

### 👤 계정 설정(Account Settings)
- 표시 이름 변경
- 이메일 확인
- 계정 삭제(re-auth 필요 여부 체크)

---

## ⭐ 면접 어필 포인트 (구현 하이라이트)
- React Context 기반 **Theme / UI 상태 관리**
- i18next 기반 **완전한 다국어 UI 전환 구조**
- Firebase Auth / Firestore / Storage 통합 구현 경험
- 휴지통은 `isTrashed` 기반 **논리 삭제 설계**
  - 복구 가능
  - 완전 삭제(Delete forever)와 책임 분리
- 업로드 진행률 표시 등 사용자 경험(UI/UX)을 고려한 구현

---

## 🔐 보안 / 권한 설계
- Firebase Authentication으로 사용자 인증
- Firestore / Storage는 Firebase Rules로 접근 제어
- 데이터 조회는 owner(uid) 기준으로 수행하며, 타 사용자 데이터 접근 불가

---

## 🧩 기술 스택

| Category | Stack |
| --- | --- |
| Frontend | React 18 / TypeScript / Vite / TailwindCSS |
| State | React Context API |
| Auth | Firebase Authentication |
| Database | Firestore |
| Storage | Firebase Storage |
| i18n | react-i18next |
| Deployment | Vercel (권장) |

---

## 📦 폴더 구조
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
🛠 실행 방법
1) 패키지 설치
bash
コードをコピーする
npm install
2) Firebase 환경변수 설정
.env 파일을 생성하고 아래 값을 설정합니다.

env
コードをコピーする
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
3) 개발 서버 실행
bash
コードをコピーする
npm run dev
🎯 프로젝트 목적
일본 기업 면접용 포트폴리오로 설계/구현 경험 증명

Firebase 기반 실전형 기능 구현 경험(Auth / DB / Storage)

장기적으로 Supabase / AWS로 마이그레이션 가능한 구조를 고려

디지털노마드를 위한 장기 프로젝트 기반 설계

🔮 향후 확장 계획
폴더 기능(Folders)

Drag & Drop 업로드

파일 미리보기 모달(File preview modal)

유저 프로필 아바타(User profile avatar)

Supabase migration version

Full client-server separation

👤 작성자
디지털노마드를꿈꾸다

GitHub: https://github.com/kieeler123