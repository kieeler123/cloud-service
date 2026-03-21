3️⃣ 면접 Q&A 형식
🇯🇵 日本語

Q. 今日どんな課題を解決しましたか？
A. Firestore のメタデータを MongoDB に移行する際に、スキーマ不一致とバリデーション問題を解決しました。

Q. 一番大きな問題は何でしたか？
A. path required と createdAt 更新エラーにより、すべてのデータが保存できなかったことです。

Q. どのように解決しましたか？
A. スキーマの制約を緩和し、$setOnInsert を使って createdAt を制御しました。またマッピングロジックも調整しました。

Q. 設計上の重要な判断は？
A. 完全なデータでなくても保存し、後から補完する「temp → complete」構造を採用したことです。

🇺🇸 English

Q. What problem did you solve today?
A. I resolved schema mismatch and validation issues during migration from Firestore to MongoDB.

Q. What was the biggest issue?
A. All records failed due to strict validation (path required) and createdAt update errors.

Q. How did you fix it?
A. I relaxed schema constraints, used $setOnInsert for createdAt, and improved the mapping logic.

Q. What design decision was important?
A. Allowing incomplete data (temp) and improving it later into complete.

🇰🇷 한국어

Q. 오늘 어떤 문제를 해결했나요?
A. Firestore에서 MongoDB로 데이터 이관 시 발생한 스키마 불일치와 검증 문제를 해결했습니다.

Q. 가장 큰 문제는 무엇이었나요?
A. path required와 createdAt 업데이트 에러로 인해 모든 데이터 저장이 실패한 점입니다.

Q. 어떻게 해결했나요?
A. 스키마 조건을 완화하고 $setOnInsert를 활용해 createdAt을 분리했으며, 매핑 로직을 수정했습니다.

Q. 중요한 설계 결정은 무엇이었나요?
A. 완전하지 않은 데이터도 먼저 저장하고 이후 보완하는 temp → complete 구조를 도입한 것입니다.
