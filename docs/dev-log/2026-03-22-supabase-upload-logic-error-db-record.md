📌 1. 리스트 형식
🇯🇵 일본어
Supabase ストレージにファイルアップロード機能を実装
Firebase から Supabase へアップロードロジックを分離
MongoDB にメタデータおよびエラーログ保存構造を設計
Multer エラー（ファイルサイズ制限など）をサーバー側で処理
クライアントの fetch エラーを localStorage に一時保存
サーバー復旧後にエラーログを再送信する仕組みを実装
ネットワーク復旧・アプリ起動・定期実行でログ同期処理追加
React でファイル一覧取得とエラーハンドリングロジック実装

팁
일본어 기술 정리는 “〜を実装 / 〜を設計” 형태로 통일하면 깔끔합니다.

🇺🇸 English
Implemented file upload to Supabase Storage
Separated upload logic from Firebase to Supabase
Designed MongoDB structure for metadata and error logging
Handled Multer errors (e.g., file size limits) on the server
Stored client-side fetch errors temporarily in localStorage
Implemented retry mechanism for sending logs after server recovery
Added log flush triggers (app start, network recovery, interval)
Built React logic for file fetching and error handling

팁
이력서용은 “Implemented / Designed / Handled” 같은 동사로 시작하면 좋습니다.

🇰🇷 한국어
Supabase Storage 기반 파일 업로드 기능 구현
Firebase와 Supabase 업로드 로직 분리
MongoDB에 메타데이터 및 에러 로그 저장 구조 설계
Multer 파일 업로드 에러 서버 측 처리
클라이언트 fetch 에러 localStorage 임시 저장 구조 구현
서버 복구 시 에러 로그 재전송 로직 구현
앱 시작 / 네트워크 복구 / 주기 실행 기반 flush 처리 추가
React 파일 목록 조회 및 에러 처리 로직 구현

팁
한국어는 “구현 / 설계 / 처리 / 추가” 4개 키워드로 정리하면 가장 깔끔합니다.
