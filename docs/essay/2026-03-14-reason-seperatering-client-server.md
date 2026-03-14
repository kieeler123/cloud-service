3️⃣ Essay Version (開発エッセイ / Dev Log)
🇯🇵 日本語

プロジェクトを進める中で、クライアントとサーバーの役割を分離する必要性を感じた。

最初はフロントエンドから直接データベースやストレージにアクセスする方法も考えたが、
その場合、認証処理やデータ管理が複雑になり、コードの責任範囲が曖昧になる可能性があった。

そこで、クライアントは UI 表示に集中させ、
データ処理や認証などの重要なロジックはサーバーに集約する設計を採用した。

この構造にすることで、コードの役割が明確になり、
将来的にデータベースやストレージを変更する場合でも柔軟に対応できると考えた。

結果として、このアーキテクチャは
保守性、拡張性、セキュリティのバランスが取れた設計になったと感じている。

🇺🇸 English

During the development of this project, I realized the importance of separating the client and server responsibilities.

At first, I considered allowing the frontend to directly access the database and storage systems.
However, this approach could lead to unclear responsibility boundaries and complicated authentication handling.

Therefore, I decided to design the architecture so that the client focuses on the user interface while the server handles critical operations such as data processing, authentication, and storage management.

With this separation, the system structure becomes clearer, and it also allows the project to remain flexible if the underlying database or storage system changes in the future.

As a result, this architecture provides a good balance between maintainability, scalability, and security.

🇰🇷 한국어

프로젝트를 진행하면서 클라이언트와 서버의 역할을 분리해야 할 필요성을 느꼈다.

처음에는 프론트엔드에서 직접 데이터베이스와 스토리지에 접근하는 방식도 고려했지만,
그 경우 인증 처리나 데이터 관리 로직이 복잡해지고 코드의 책임 범위가 모호해질 수 있었다.

그래서 클라이언트는 UI와 사용자 인터페이스에 집중하도록 하고,
데이터 처리와 인증 같은 중요한 로직은 서버에 모으는 구조를 선택했다.

이러한 구조를 사용하면 코드의 역할이 명확해지고,
나중에 데이터베이스나 스토리지를 변경해야 하는 상황에서도 보다 유연하게 대응할 수 있다.

결과적으로 이 아키텍처는
유지보수성, 확장성, 보안성을 균형 있게 고려한 구조라고 생각한다.