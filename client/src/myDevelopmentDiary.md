📘 개발 과정 정리 (한국어 → 일본어 → 영어)
🇰🇷 1. 한국어 버전 — 전체 개발 & 에러 해결 과정
✅ 1) 프로젝트 초기 설정

React + TypeScript + Vite로 프로젝트 초기화

TailwindCSS 설정

Firebase 프로젝트 생성 & 환경변수 연결

라우터 구조 설정 (Login / Drive / Trash / Account)

✅ 2) Firebase 인증 구현

이메일 로그인 & 로그아웃 구현

Google 계정 로그인 추가

onAuthStateChanged로 실시간 인증 상태 추적

로그인한 사용자만 접근할 수 있는 보호 라우트 구성

문제 발생:

로그아웃 버튼이 보이지 않음 → CSS 색상 & 위치 문제

계정 삭제 후 /login 으로 이동하지 않음 → 최근 로그인 필요(auth/requires-recent-login)

해결:

로그아웃 버튼을 헤더 오른쪽 상단으로 이동

deleteUser 에러 메시지를 직접 처리하여 사용자에게 안내

✅ 3) 다국어(i18n) 구현

i18next 설정

한국어 / 일본어 / 영어 / 중국어 4개 언어 적용

컴포넌트별 번역 키 정리 (layout, drive, trash, account 등)

문제 발생:

특정 버튼(계정, 휴지통 등)은 번역되지 않음
→ JSON 키 누락으로 확인

중국어 번역 추가 필요

해결:

누락된 모든 키를 추가 생성

테마(LanguageSwitcher / ThemeSwitcher) 번역 키도 추가

✅ 4) 테마 시스템 구현 (Dark / Light / Sky)

ThemeContext 생성

ThemeSwitcher 컴포넌트 제작

Tailwind 다크모드 및 커스텀 테마 적용

문제 해결:

테마 버튼 아이콘 표시 불일치 → 조건문 정리

Layout 내부에서 테마 변경이 즉시 반영되지 않음 → provider 위치 조정

✅ 5) 파일 업로드 구현

Firebase Storage → 파일 저장

Firestore → 파일 메타데이터 저장

업로드 진행률(%) & 프로그레스바 구현

숫자가 progress bar 안에 표시되도록 개선

progress bar가 채워진 부분만 색 반전 처리

문제 발생:

업로드가 되는데 UI에 파일 목록이 표시되지 않음

Firestore에서 createdAt 정렬 시 "index required" 에러

해결:

Firestore 쿼리 orderBy(createdAt)용 인덱스 생성

isTrashed 값 기본 false 로 저장

기존 문서 updateDoc 오류 코드 제거

✅ 6) 내 드라이브 페이지 구현

ownerUid 로 사용자 파일만 조회

download / moveToTrash 기능 구현

날짜 포맷팅

i18n 적용

문제 발생:

업로드한 파일이 실시간으로 안 보임
→ 잘못된 snapshot 필터링 조건 발견

해결:

filter(f => !f.isTrashed) 로 수정

정상적으로 리스트 표시 확인

✅ 7) 휴지통 페이지 구현

isTrashed == true 인 문서만 조회

삭제 / 복원 기능 구현

문제 발생:

휴지통에서 복원 또는 영구 삭제 후 UI 업데이트가 안 됨

해결:

상태 관리 버그 수정 (Firestore snapshot은 정상 동작 중)

컴포넌트 렌더링 위치를 AppLayout 내부로 옮김

useEffect 의 user 의존성 수정

🎉 최종 결과

Firebase 인증

Google 로그인

다국어 지원 (4개국어)

테마 3종

파일 업로드 + 진행률

MyDrive / Trash 기능 완성

계정 설정(표시 이름 변경, 계정 삭제)
이 모든 기능을 스스로 구현하고 에러를 직접 해결함.

🇯🇵 2. 日本語版 — 開発・エラー解決の全記録
✅ 1) プロジェクト初期設定

React + TypeScript + Vite による環境構築

TailwindCSS 設定

Firebase プロジェクト作成

ルーティング設定（Login / Drive / Trash / Account）

✅ 2) Firebase 認証実装

メール&パスワードログイン

Google ログイン

onAuthStateChanged による認証状態監視

認証必須ページ（保護ルート）設定

発生した問題：

ログアウトボタンが見えない → 色・位置の問題

アカウント削除後に /login に戻らない → auth/requires-recent-login エラー

解決：

ログアウトボタンをヘッダー右上に移動

エラーメッセージを正しくハンドリングし、再ログインを案内

✅ 3) 多言語（i18n）対応

i18next 導入

日本語 / 英語 / 韓国語 / 中国語対応

UI テキストをすべて辞書化

発生した問題：

特定のボタンだけ翻訳されない
→ 翻訳キーの不足

中国語版が未作成

解決：

すべての key を追加

テーマ（ThemeContext）用の翻訳も整備

✅ 4) テーマシステム実装

ダーク / ライト / スカイテーマ

ThemeContext + ThemeSwitcher

Tailwind の dark モードと連携

発生した問題：

テーマアイコンが正しく表示されない

テーマがレイアウトに反映されないことがある

解決：

条件式修正

Context Provider の位置を調整

✅ 5) ファイルアップロード

Firebase Storage へ保存

Firestore にメタデータ登録

進捗バー（％表示付き）実装

進捗バーの色反転も実装

発生した問題：

アップロードしたファイルが UI に表示されない

createdAt の orderBy で index エラー

解決：

Firestore インデックス作成

isTrashed を常に false で保存

不要な updateDoc コードを削除

✅ 6) My Drive 実装

ownerUid による自分のファイル取得

ダウンロード / ゴミ箱移動

i18n 対応テーブル

発生した問題：

ファイルが一覧に表示されない
→ フィルタ条件ミス

解決：

!isTrashed に修正

リアルタイム更新が正常に動作

✅ 7) ゴミ箱（Trash）実装

isTrashed == true のファイルのみ取得

復元 & 永久削除の実装

発生した問題：

復元後、UI が更新されない

永久削除後もリストが変わらない

解決：

useEffect の依存関係修正

レンダリング位置整理

🎉 最終結果

Firebase 認証

Google ログイン

多言語対応（4ヶ国語）

テーマ 3 種

アップロード + 進捗バー

MyDrive / Trash 完成

アカウント設定（表示名変更・削除）
全て自身で問題発見・解決しながら実装。

🇺🇸 3. English Version — Full Development & Error Solving History
✅ 1) Initial Setup

React + TypeScript + Vite project

TailwindCSS configuration

Firebase project initialization

Routing (Login / Drive / Trash / Account)

✅ 2) Authentication System

Email/Password login

Google login

onAuthStateChanged subscription

Protected routes

Issues encountered:

Logout button invisible → styling issue

deleteUser() not redirecting → requires-recent-login error

Solutions:

Move logout button to header right

Provide proper error handling & prompt re-login

✅ 3) Internationalization (i18n)

Added Japanese / English / Korean / Chinese

Created translation dictionary for all UI text

Issues:

Some buttons not translated
→ Missing translation keys

Chinese language missing

Solutions:

Added full translation sets

Included theme-related translation keys

✅ 4) Theme System

Dark / Light / Sky themes

Implemented ThemeContext

ThemeSwitcher component with icons

Issues:

Wrong icon switching

Theme not applied across layout

Solutions:

Fix conditional logic

Move provider to proper hierarchy

✅ 5) File Upload System

Upload to Firebase Storage

Save metadata to Firestore

Progress bar with percentage and color inversion

Issues:

Uploaded files not appearing in UI

Firestore index error for createdAt ordering

Solutions:

Create required Firestore composite index

Ensure isTrashed defaults to false

Remove deprecated updateDoc workaround

✅ 6) My Drive

Load files by ownerUid

Download / Move to trash

i18n table formatting

Issue:

File list not updating

Solution:

Fix filtering logic

Snapshot listener confirmed working

✅ 7) Trash Page

Restore file

Delete forever

Real-time sync

Issues:

UI not refreshing after actions

Solutions:

Fix state logic

Update useEffect dependencies

🎉 Final Result

You successfully built:

Firebase Auth + Google Login

Full i18n (4 languages)

Theme system (Dark / Light / Sky)

Upload + progress + color inversion

MyDrive + Trash + file operations

Account settings (update profile, delete account)

And most importantly:
👉 You identified issues yourself and solved them using logs, debugging, and incremental testing — exactly what companies look for.

면접예상질문과대답

✅ 【핵심 질문 1】自己紹介（자기소개）
⭐ 일본어 (짧고 자연스러운 외국인 스타일)

「はじめまして、〇〇と申します。React と TypeScript を中心に個人開発を続けてきました。
Firebase を使ったクラウドアプリを一から実装し、認証・ストレージ・データ管理の流れを理解しています。
御社ではフロントエンドとして実務経験を積み、さらに成長したいと考えております。よろしくお願いいたします。」

⭐ 한국어 번역

"안녕하세요. 저는 OO입니다. React와 TypeScript 중심으로 개인 프로젝트를 진행해왔습니다.
Firebase를 사용한 클라우드 앱을 처음부터 혼자 구현하면서 인증, 스토리지, 데이터 관리 흐름을 이해했습니다.
귀사에서 프론트엔드로 실무 경험을 쌓고 성장하고 싶습니다."

✅ 【핵심 질문 2】なぜこの技術を選びましたか？（기술 선택 이유）

React
「コンポーネント構造が分かりやすく、再利用しやすいからです。」

TypeScript
「バグを減らし、コードの可読性と保守性を高めるためです。」

Firebase
「インフラ構築なしで安全な認証やデータ管理を実装でき、個人開発で実サービスレベルの機能を作れるからです。」

→ 각 문장은 “짧고 핵심”이라 일본 면접관들이 아주 좋아함.

✅ 【핵심 질문 3】どのように問題を解決しましたか？（문제 해결 방식）

「エラーが発生した際は、まずログを確認し、公式ドキュメントを読み、必要に応じて AI を活用して原因を特定しました。
自分で試行錯誤しながら改善することを心がけました。」

이 부분은 일본에서 엄청나게 높은 점수 줌.
일본 기업은 “스스로 해결할 줄 아는가?”를 가장 중요하게 평가해.

✅ 【핵심 질문 4】作ったアプリを説明してください（프로젝트 설명）

「Firebase 認証を使いログイン機能を実装し、Firestore でユーザごとのファイルメタデータを管理しています。
Storage にアップロードしたファイルはリアルタイムで一覧に反映され、削除するとゴミ箱に移動し、復元や完全削除も可能です。
テーマ切り替えや多言語対応も実装しました。」

너 지금 만든 기능이면 신입 기준으로는 과할 정도로 수준 높음.