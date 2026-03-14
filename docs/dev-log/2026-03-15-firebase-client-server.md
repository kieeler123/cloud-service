1️⃣ 今日やったこと（リスト形式）
🇯🇵 日本語
開発作業

Firebase Client 依存から Server API構造への移行

Google OAuthログインをサーバー側で処理する構造に変更

JWTベース認証構造を実装

Authorization: Bearer token 方式の認証確認を導入

/api/auth/me エンドポイントでログイン状態確認

Drive機能

DrivePageを Server APIベースのデータ取得構造に変更

useDriveInfiniteFiles フックで無限スクロール対応

/api/cloud-files APIでFirestoreファイル取得

Firestore Composite Indexエラー解決

UID問題

Firestore ownerUid と Server JWT uid 不一致問題を確認

既存データの ownerUid を 新UIDへマイグレーション

migration script を作成して一括更新

バグ修正

localStorage に残っていた 旧トークン問題を解決

DrivePage がファイルを正常表示するように修正

Login後に画面更新が必要だった問題を特定

Trash機能

/api/cloud-files/trash API追加

ゴミ箱一覧取得機能実装

ファイル復元 API 実装

完全削除 API 実装

TrashPage エラー処理構造追加

Account機能

/api/auth/me を利用したアカウント情報取得

ログアウト処理を localStorage + redirect 方式に変更

🇺🇸 English
Infrastructure Changes

Migrated from Firebase client SDK to server API architecture

Implemented Google OAuth authentication on the server

Implemented JWT-based authentication

Added Authorization: Bearer token authentication flow

Implemented /api/auth/me endpoint for session validation

Drive System

Refactored DrivePage to use server API instead of Firebase client

Implemented infinite scroll using useDriveInfiniteFiles

Implemented /api/cloud-files endpoint

Fixed Firestore composite index error

UID Migration

Identified mismatch between Firestore ownerUid and server uid

Migrated existing documents to new UID system

Created and executed migration script

Bug Fixes

Resolved old token remaining in localStorage

DrivePage now displays files correctly

Identified login state refresh issue

Trash System

Implemented /api/cloud-files/trash

Implemented trash list retrieval

Implemented file restore API

Implemented permanent delete API

Added error handling for TrashPage

Account System

Implemented account information retrieval via /api/auth/me

Implemented logout flow using localStorage + redirect

🇰🇷 한국어
인프라 구조 변경

Firebase Client SDK 의존 구조 → Server API 구조로 전환

Google OAuth 로그인 서버 처리 방식 구현

JWT 기반 인증 구조 구현

Authorization: Bearer token 인증 방식 도입

/api/auth/me 로그인 상태 확인 API 구현

Drive 기능

DrivePage를 Firebase client 방식에서 Server API 기반 구조로 변경

useDriveInfiniteFiles 훅으로 무한스크롤 구현

/api/cloud-files API로 Firestore 파일 조회

Firestore Composite Index 오류 해결

UID 문제 해결

Firestore ownerUid 와 서버 JWT uid 불일치 문제 발견

기존 데이터 ownerUid를 새 UID로 마이그레이션

migration script 작성 및 실행

버그 수정

localStorage에 남아있던 구 토큰 문제 해결

DrivePage 파일 정상 표시

로그인 후 새로고침해야 반영되던 문제 원인 파악

Trash 기능

/api/cloud-files/trash API 구현

휴지통 목록 조회 기능 구현

파일 복원 API 구현

완전 삭제 API 구현

TrashPage 에러 처리 추가

Account 기능

/api/auth/me 기반 계정 정보 조회 구현

로그아웃 로직을 localStorage 제거 + redirect 방식으로 변경