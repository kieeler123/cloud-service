3️⃣ 面接質問 / Interview Q&A
🇯🇵 日本語

Q. Firebase Client SDKからServer API構造へ移行した理由は？

A.
セキュリティと拡張性のためです。
クライアントが直接Firestoreへアクセスする構造では、アクセス制御やビジネスロジックの統一管理が難しくなります。
サーバーAPIを経由することで、認証・権限管理・ログ管理などを一元化できます。

Q. UID不一致問題をどのように解決しましたか？

A.
既存のFirestoreドキュメントのownerUidと、新しい認証システムのUIDが一致していませんでした。
そのためマイグレーションスクリプトを作成し、既存データを新しいUID体系へ一括更新しました。

Q. トラブルシューティングの例はありますか？

A.
localStorageに残っていた旧トークンが原因でログイン状態が更新されない問題がありました。
トークンを削除して再ログインすることで問題を解決しました。

🇺🇸 English

Q. Why did you migrate from Firebase client SDK to a server API architecture?

A.
Mainly for security and scalability.
Allowing clients to directly access Firestore makes it harder to control permissions and business logic consistently.
Using server APIs allows centralized authentication, authorization, and logging.

Q. How did you solve the UID mismatch issue?

A.
Existing Firestore documents stored an ownerUid that did not match the UID used in the new authentication system.
I created a migration script to update all existing documents to the new UID format.

Q. Describe a debugging experience from this work.

A.
One issue occurred because an old authentication token remained in localStorage.
This caused the application to use an outdated UID, preventing files from loading correctly.
After clearing the token and re-authenticating, the issue was resolved.

🇰🇷 한국어

Q. Firebase Client SDK에서 Server API 구조로 전환한 이유는 무엇인가요?

A.
보안성과 확장성 때문입니다.
클라이언트가 Firestore에 직접 접근하면 권한 관리와 비즈니스 로직을 통제하기 어렵습니다.
서버 API를 통해 인증과 권한 관리, 로그 처리를 중앙에서 관리할 수 있습니다.

Q. UID 불일치 문제는 어떻게 해결했나요?

A.
기존 Firestore 문서의 ownerUid와 새로운 인증 시스템의 UID가 일치하지 않는 문제가 있었습니다.
이를 해결하기 위해 migration script를 작성해 기존 데이터를 새 UID 체계로 일괄 수정했습니다.

Q. 이번 작업 중 겪은 디버깅 사례가 있나요?

A.
localStorage에 남아 있던 오래된 토큰 때문에 로그인 상태가 갱신되지 않는 문제가 있었습니다.
토큰을 삭제하고 다시 로그인하여 문제를 해결했습니다.