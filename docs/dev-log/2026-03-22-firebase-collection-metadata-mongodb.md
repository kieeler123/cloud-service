1️⃣ 리스트 형식
🇯🇵 日本語
Firebase Storage からファイルを読み込み、画面表示まで実装
Firestore メタデータを MongoDB に移行する処理を構築
マッピング関数を作成し、Firestore構造を Mongo スキーマに変換
厳しすぎるバリデーション（path required など）を緩和
createdAt 更新エラーを解決（$setOnInsert 使用）
MongoDB スキーマを実用的な形に調整
metadataStatus（temp / complete）による段階管理を導入
Express サーバー構造を整理（app / index 分離）
로그 기반 디버깅 방식 이해 및 적용
🇺🇸 English
Implemented file reading from Firebase Storage and rendering on UI
Built migration logic from Firestore metadata to MongoDB
Created mapping function to transform Firestore structure into Mongo schema
Relaxed strict validation rules (e.g., removed required path)
Fixed createdAt update issue using $setOnInsert
Refactored MongoDB schema for practical usage
Introduced metadata lifecycle (temp → complete)
Cleaned up Express server structure (app vs index separation)
Improved debugging using targeted logging
🇰🇷 한국어
Firebase Storage 파일 읽기 및 화면 출력 구현
Firestore 메타데이터 → MongoDB 마이그레이션 구축
Firestore → Mongo 변환 매핑 함수 작성
path required 등 과도한 검증 조건 완화
createdAt 업데이트 에러 해결 ($setOnInsert 적용)
MongoDB 스키마 실사용 기준으로 정리
metadataStatus(temp/complete) 단계 구조 도입
Express 서버 구조 분리 및 정리 (app / index)
로그 기반 디버깅 방식 체득
