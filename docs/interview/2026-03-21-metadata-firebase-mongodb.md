📌 3. 면접 질문 & 답변
🇯🇵 日本語

Q. Firebase と MongoDB をどのように連携しましたか？
A. Firebase Storage を原本として扱い、MongoDB にはメタデータのみを保存する構造を採用しました。同期処理を通じてデータをコピーし、失敗しても再試行可能な設計にしました。

Q. 同期処理で発生した問題は何でしたか？
A. MongoDB の required フィールドと実際のデータ構造が一致しておらず、insert が失敗していました。required を外すことで解決しました。

Q. エラー処理はどのように行いましたか？
A. ファイル単位で成功・スキップ・失敗を分類し、reason を含めてログとして収集しました。

🇺🇸 English

Q. How did you integrate Firebase with MongoDB?
A. I treated Firebase Storage as the source of truth and stored only metadata in MongoDB. A sync process copies data, allowing retries if failures occur.

Q. What issue did you encounter during synchronization?
A. MongoDB insert operations failed due to required fields that did not match the actual data. I resolved this by removing the required constraints.

Q. How did you handle errors?
A. I collected per-file results (inserted, skipped, failed) and logged reasons for each case.

🇰🇷 한국어

Q. Firebase와 MongoDB를 어떻게 연동했나요?
A. Firebase Storage를 원본으로 두고, MongoDB에는 메타데이터만 저장하는 구조로 설계했습니다. sync를 통해 데이터를 복사하며, 실패 시 재시도 가능하도록 했습니다.

Q. 동기화 과정에서 어떤 문제가 있었나요?
A. MongoDB의 required 필드와 실제 데이터 구조가 맞지 않아 insert가 실패했습니다. required를 제거하여 해결했습니다.

Q. 에러 처리는 어떻게 했나요?
A. 파일 단위로 성공, 스킵, 실패를 구분하고 그 이유를 함께 로그로 수집했습니다.