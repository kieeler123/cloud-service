✍️ 2. 에세이 형식
🇯🇵 일본어

本日はクラウドファイルアップロード機能の基盤を構築した。
従来の Firebase ベースの構造から、Supabase を利用したストレージ処理へと拡張し、アップロードロジックを分離した。

さらに、MongoDB を活用してファイルのメタデータおよびエラーログを管理する仕組みを設計した。特に、Multer を用いたアップロード時のエラー処理をサーバー側で実装し、より安定した処理を実現した。

また、クライアント側では fetch エラーを即時に localStorage に保存し、サーバー復旧後に再送信する仕組みを導入した。これにより、ネットワーク障害時でもログの欠損を防ぐことが可能となった。

最終的に、アプリ起動時・ネットワーク復旧時・定期実行によるログ同期処理を実装し、信頼性の高いログ管理システムを構築した。

팁
일본어 에세이는 “〜した / 〜を実装した” 과거형으로 쓰는 게 자연스럽습니다.

🇺🇸 English

Today, I built the foundation for a cloud file upload system.
I transitioned from a Firebase-based structure to a Supabase-based storage system and separated the upload logic accordingly.

Additionally, I designed a MongoDB structure to store file metadata and error logs. I implemented server-side error handling for file uploads using Multer, ensuring more robust processing.

On the client side, I implemented a mechanism to store fetch errors in localStorage and resend them once the server becomes available. This prevents log loss during network failures.

Finally, I added multiple triggers for log synchronization, including application startup, network recovery, and periodic retries, resulting in a reliable logging system.

팁
영어 에세이는 “I built / I implemented / I designed” 구조로 쓰면 면접에서 설명하기 좋습니다.

🇰🇷 한국어

오늘은 클라우드 파일 업로드 기능의 기반을 구축하였다.
기존 Firebase 기반 구조에서 Supabase Storage를 활용하는 구조로 확장하고, 업로드 로직을 분리하였다.

또한 MongoDB를 활용하여 파일 메타데이터와 에러 로그를 관리하는 구조를 설계하였다. 특히 Multer를 이용한 업로드 에러를 서버에서 처리하도록 구현하여 안정성을 높였다.

클라이언트에서는 fetch 에러를 localStorage에 저장하고, 서버가 복구되었을 때 재전송하는 구조를 구현하였다. 이를 통해 네트워크 장애 상황에서도 로그 유실을 방지할 수 있게 되었다.

마지막으로 앱 시작, 네트워크 복구, 주기 실행 기반의 로그 동기화 로직을 추가하여 신뢰성 있는 로그 시스템을 완성하였다.

팁
에세이는 “기반 구축 → 구조 설계 → 문제 해결 → 결과” 흐름으로 쓰면 완성도가 높아집니다.
