🎤 3. 면접 Q&A 형식
🇯🇵 일본어

Q. 本日どのような開発を行いましたか？
A. Supabase を利用したファイルアップロード機能とエラーログ管理システムを構築しました。

Q. 特に工夫した点は何ですか？
A. クライアントの fetch エラーを localStorage に保存し、サーバー復旧後に再送信する仕組みを実装した点です。

Q. 技術的な課題はありましたか？
A. Multer のエラーがミドルウェア段階で発生する問題があり、専用ラッパーでログ処理を追加しました。

팁
일본 면접은 “結論 → 理由 → 方法” 순서로 답하면 좋습니다.

🇺🇸 English

Q. What did you work on today?
A. I implemented a cloud file upload system using Supabase along with an error logging mechanism.

Q. What was the most challenging part?
A. Handling client-side fetch failures. I solved it by storing logs in localStorage and retrying after server recovery.

Q. What improvements did you make?
A. I added retry strategies such as app startup triggers, network recovery detection, and interval-based flushing.

팁
영어 면접은 “What → How → Why” 구조로 말하면 논리적으로 보입니다.

🇰🇷 한국어

Q. 오늘 어떤 개발을 했나요?
A. Supabase 기반 파일 업로드와 에러 로그 시스템을 구현했습니다.

Q. 가장 어려웠던 부분은 무엇인가요?
A. fetch 에러가 서버에 도달하지 않는 문제였고, 이를 localStorage 저장 후 재전송 구조로 해결했습니다.

Q. 개선한 점은 무엇인가요?
A. 앱 시작, 네트워크 복구, 주기 실행을 통해 로그를 안정적으로 전송하는 구조를 만들었습니다.

팁
한국 면접은 “문제 → 해결 → 결과” 구조로 답하면 설득력이 올라갑니다.

🎯 최종 한 줄 요약

👉 오늘 작업은
“Supabase 업로드 + MongoDB 로그 + 클라이언트 에러 복구 시스템까지 포함된 거의 완성형 클라우드 구조 구축” 입니다.
