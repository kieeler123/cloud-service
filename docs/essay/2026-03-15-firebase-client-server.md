2️⃣ 今日の開発記録（エッセイ）
🇯🇵 日本語

今日はクラウドサービスの認証とファイル管理構造を大きく変更した一日だった。
これまでFirebaseのクライアントSDKを直接使用していたが、セキュリティと拡張性を考えてサーバーAPIベースの構造に移行する作業を行った。

まずGoogle OAuthログインをサーバー側で処理する仕組みを構築し、JWTを利用した認証システムを導入した。
これにより、クライアントはFirebaseではなくサーバーAPIを通じてデータにアクセスする形になった。

Drive機能では、FirestoreのComposite IndexエラーやUIDの不一致問題など、いくつかの問題が発生した。
特に既存データのownerUidと新しい認証システムのUIDが一致しない問題は、マイグレーションスクリプトを作成して一括修正することで解決した。

また、localStorageに残っていた旧トークンが原因でログイン状態が正しく反映されない問題も発見し、これも修正した。

その後、Trash機能とAccountページのAPIもサーバー側に実装し、エラー処理の構造を整理した。
Firebaseの依存を一つ減らすだけでも、想像以上に多くの部分に影響があることを実感した。

🇺🇸 English

Today was focused on restructuring the authentication and file management architecture of the cloud service.

Previously, the project relied heavily on Firebase client SDK for authentication and data access.
However, for better security and scalability, I migrated the architecture to a server-driven API structure.

First, I implemented Google OAuth login on the server and introduced JWT-based authentication.
This allowed the client to communicate only with server APIs rather than directly accessing Firebase.

During the process, several issues appeared, including Firestore composite index errors and UID mismatches between existing documents and the new authentication system.
I solved the UID mismatch by creating a migration script to update existing documents.

Another issue was caused by an old token remaining in localStorage, which prevented the new authentication state from being reflected properly.
After removing the outdated token, the Drive page began displaying files correctly.

Finally, I implemented Trash APIs and basic Account page functionality while introducing a consistent error-handling structure.

This work reminded me that even removing a single dependency like Firebase client SDK can affect many parts of the system.

🇰🇷 한국어

오늘은 클라우드 서비스의 인증 구조와 파일 관리 구조를 크게 바꾼 날이었다.

기존에는 Firebase Client SDK를 통해 직접 인증과 데이터를 처리하는 구조였지만, 보안성과 확장성을 고려하여 서버 API 기반 구조로 전환하는 작업을 진행했다.

먼저 Google OAuth 로그인을 서버에서 처리하도록 만들고, JWT 기반 인증 시스템을 도입했다.
이제 클라이언트는 Firebase에 직접 접근하지 않고 서버 API를 통해 데이터를 조회하게 되었다.

이 과정에서 Firestore Composite Index 오류와 UID 불일치 문제 등 여러 문제가 발생했다.
특히 기존 Firestore 문서의 ownerUid와 새 인증 시스템의 UID가 일치하지 않는 문제는 migration script를 만들어 데이터를 일괄 수정하여 해결했다.

또한 localStorage에 남아 있던 옛 토큰 때문에 로그인 상태가 정상적으로 반영되지 않는 문제도 발견했고 이를 수정했다.

이후 Trash 기능과 Account 페이지 API도 서버 기반으로 구현하고, 에러 처리 구조를 통일했다.

Firebase 의존성을 하나 줄이는 것만으로도 예상보다 많은 부분이 영향을 받는다는 것을 다시 한번 체감한 하루였다.