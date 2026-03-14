2️⃣ Interview Version (面接質問 / Interview Q&A)
🇯🇵 日本語

Q: なぜ Client / Server 分離アーキテクチャを採用しましたか？

A:
UI とビジネスロジックの責任を明確に分離するためです。
クライアントは UI 表示とユーザー操作に集中し、サーバーはデータ処理や認証、権限管理を担当します。

これにより次のメリットがあります。

セキュリティの向上

コードの可読性向上

データベース変更への柔軟性

サービス拡張の容易さ

結果として、長期的に保守しやすいアーキテクチャになります。

🇺🇸 English

Q: Why did you adopt a Client / Server separation architecture?

A:
To clearly separate UI responsibilities from application logic.

The client focuses on rendering the interface and handling user interaction, while the server manages data processing, authentication, and business logic.

This approach provides several benefits:

Improved security

Cleaner code structure

Database flexibility

Better scalability

Overall, it makes the system easier to maintain and evolve.

🇰🇷 한국어

Q: 왜 Client / Server 분리 구조를 선택했나요?

A:
UI와 비즈니스 로직의 책임을 명확하게 분리하기 위해서입니다.

클라이언트는 사용자 인터페이스와 사용자 입력 처리를 담당하고,
서버는 데이터 처리, 인증, 권한 관리 같은 핵심 로직을 담당합니다.

이 구조는 다음과 같은 장점을 제공합니다.

보안 강화

코드 구조 명확화

데이터베이스 변경 유연성

서비스 확장성 향상

결과적으로 유지보수와 확장이 쉬운 구조가 됩니다.