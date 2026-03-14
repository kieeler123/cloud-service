🇯🇵 日本語
クライアントとサーバーを分離した理由

本プロジェクトでは、アプリケーションの構造を明確にするために
Client（UI）とServer（機能実装）を分離するアーキテクチャを採用した。

クライアントはユーザーインターフェースとユーザー操作の処理に集中し、
サーバーはデータ処理、認証、ストレージ管理などの機能を担当する。

この分離によって、以下のようなメリットが得られる。

1. 責任の分離（Separation of Responsibilities）

クライアントは UI 表示とユーザー操作のみを担当し、
サーバーは データ処理とビジネスロジックを担当する。

このように責任を分離することで、コードの役割が明確になり、
プロジェクトの構造が理解しやすくなる。

2. セキュリティの向上

クライアントはユーザーが直接操作できる環境であるため、
重要な処理をクライアント側に置くのは安全ではない。

認証確認、権限チェック、データ操作などの重要な処理を
サーバー側で実行することで、アプリケーションの安全性を高めることができる。

3. データベースの変更に強い構造

クライアントが直接 Firebase や MongoDB にアクセスする構造の場合、
データベースを変更するとクライアント側のコードも修正が必要になる。

一方、サーバーを経由してデータを取得する構造にすることで、
データベースを変更してもクライアント側の変更を最小限に抑えることができる。

4. 拡張性の向上

サービスが成長すると、検索機能、権限管理、ログ管理など
様々な機能が追加される可能性がある。

サーバー側にビジネスロジックを集中させることで、
機能追加や構造変更をより容易に行うことができる。

5. クライアントコードのシンプル化

クライアントがデータ処理まで担当すると、
UIコードとロジックコードが混在し、コードが複雑になる。

サーバーにロジックを集約することで、
クライアントは UI 表示に集中でき、コードの可読性が向上する。

結論

本プロジェクトでは
「クライアントは UI、サーバーは機能実装」
という役割分担を採用することで、

セキュリティ

拡張性

保守性

を向上させるアーキテクチャを構築している。

🇺🇸 English
Reason for Separating Client and Server

In this project, the architecture separates the application into two layers:

Client (UI Layer)

Server (Application Logic Layer)

The client focuses on rendering the user interface and handling user interactions,
while the server is responsible for data processing, authentication, and storage management.

This separation provides several important advantages.

1. Separation of Responsibilities

The client handles UI rendering and user interaction,
while the server handles data processing and business logic.

By separating responsibilities, the structure of the application becomes clearer and easier to maintain.

2. Improved Security

The client environment cannot be fully trusted because it runs on the user's device.

Critical operations such as:

authentication verification

permission checks

data manipulation

should be handled by the server to improve overall security.

3. Database Flexibility

If the client directly interacts with databases such as Firebase or MongoDB,
changing the database structure would require modifying the client code.

By introducing a server layer between the client and the database,
the underlying database implementation can change without affecting the client.

4. Better Scalability

As the service grows, additional features such as:

search

permission control

logging

analytics

may be required.

Keeping business logic on the server side allows the system to scale more easily.

5. Simpler Client Code

If the client handles both UI and complex logic, the codebase becomes harder to manage.

By moving the application logic to the server, the client can focus on UI rendering,
resulting in cleaner and more maintainable frontend code.

Conclusion

This project adopts a clear architectural principle:

Client = UI layer
Server = Functional implementation layer

This approach improves:

security

maintainability

scalability

and makes the system easier to evolve in the future.

🇰🇷 한국어
클라이언트와 서버를 분리한 이유

본 프로젝트에서는 애플리케이션 구조를 명확하게 하기 위해
Client(UI)와 Server(기능 구현)를 분리하는 아키텍처를 사용한다.

클라이언트는 사용자 인터페이스와 사용자 입력 처리를 담당하고,
서버는 데이터 처리, 인증, 스토리지 관리 등 핵심 기능을 담당한다.

이러한 구조 분리는 다음과 같은 장점을 가진다.

1. 책임 분리 (Separation of Responsibilities)

클라이언트는 UI 표시와 사용자 인터랙션만 담당하고
서버는 데이터 처리와 비즈니스 로직을 담당한다.

이렇게 역할을 나누면 코드의 책임이 명확해지고
프로젝트 구조를 이해하기 쉬워진다.

2. 보안 강화

클라이언트는 사용자가 직접 접근할 수 있는 환경이기 때문에
중요한 로직을 클라이언트에 두는 것은 보안상 안전하지 않다.

다음과 같은 중요한 작업은 서버에서 처리하는 것이 안전하다.

인증 검증

권한 확인

데이터 조작

이를 통해 애플리케이션의 보안성을 높일 수 있다.

3. 데이터베이스 변경에 유연한 구조

클라이언트가 Firebase나 MongoDB에 직접 접근하는 구조라면
데이터베이스가 변경될 때 클라이언트 코드도 함께 수정해야 한다.

하지만 서버를 중간 계층으로 두면
데이터베이스 구현이 변경되더라도 클라이언트는 영향을 거의 받지 않는다.

4. 확장성 향상

서비스가 성장하면 다음과 같은 기능이 추가될 수 있다.

검색 기능

권한 관리

로그 기록

통계 분석

이러한 비즈니스 로직을 서버에 모아두면
기능 확장과 구조 변경이 훨씬 쉬워진다.

5. 클라이언트 코드 단순화

클라이언트가 데이터 처리까지 담당하면
UI 코드와 로직 코드가 섞여 코드가 복잡해진다.

서버에 로직을 집중시키면
클라이언트는 UI에 집중할 수 있어 코드 가독성과 유지보수성이 좋아진다.

결론

본 프로젝트는

클라이언트 = UI 역할
서버 = 기능 구현 역할

이라는 구조를 통해

보안성

확장성

유지보수성

을 높이는 아키텍처를 구성한다.

1️⃣ Architecture Version (アーキテクチャ記録)
🇯🇵 日本語
Client / Server 分離アーキテクチャ

本プロジェクトでは、アプリケーションの構造を明確にするために
Client（UI層）とServer（機能実装層）を分離するアーキテクチャを採用した。

この設計では、それぞれの層が次の役割を持つ。

Client Layer

クライアントは主にユーザーインターフェースを担当する。

主な役割

UIレンダリング

ユーザー入力処理

状態管理

API呼び出し

ユーザー操作のフィードバック表示

クライアントはデータベースやストレージの詳細を直接扱わない。

Server Layer

サーバーはアプリケーションの機能実装を担当する。

主な役割

データベース操作

認証検証

権限チェック

ファイルストレージ管理

ビジネスロジック実装

クライアントはサーバーの API を通じてのみデータにアクセスする。

このアーキテクチャのメリット

責任分離 (Separation of Concerns)
UI とロジックを分離することでコード構造が明確になる。

セキュリティ向上
認証や権限処理をサーバーで管理できる。

データベース変更への柔軟性
Firebase や MongoDB を変更してもクライアントに影響が少ない。

拡張性の向上
検索、ログ管理、権限管理などの機能追加が容易。

コード保守性の向上
クライアントコードがシンプルになる。

🇺🇸 English
Client / Server Separation Architecture

This project adopts a Client / Server separated architecture to clearly define application responsibilities.

The system is divided into two layers.

Client Layer

The client is responsible for the user interface.

Main responsibilities:

Rendering UI

Handling user interactions

Managing client-side state

Calling APIs

Displaying user feedback

The client does not directly access databases or storage systems.

Server Layer

The server handles the application logic.

Main responsibilities:

Database operations

Authentication verification

Permission checks

File storage management

Business logic implementation

The client communicates with the server only through APIs.

Advantages of this architecture

Separation of concerns
UI and business logic are clearly separated.

Improved security
Authentication and permission logic remain on the server.

Database flexibility
Database systems can change without affecting the client.

Better scalability
Features such as search, logging, and analytics can be added easily.

Maintainability
The frontend remains simpler and easier to manage.

🇰🇷 한국어
Client / Server 분리 아키텍처

본 프로젝트는 애플리케이션 구조를 명확하게 하기 위해
Client(UI 계층)와 Server(기능 구현 계층)를 분리하는 구조를 채택하였다.

Client Layer

클라이언트는 사용자 인터페이스를 담당한다.

주요 역할

UI 렌더링

사용자 입력 처리

상태 관리

API 호출

사용자 피드백 표시

클라이언트는 데이터베이스나 스토리지를 직접 다루지 않는다.

Server Layer

서버는 애플리케이션의 기능 구현을 담당한다.

주요 역할

데이터베이스 접근

인증 검증

권한 검사

파일 스토리지 관리

비즈니스 로직 구현

클라이언트는 서버 API를 통해서만 데이터에 접근한다.

이 구조의 장점

책임 분리

보안 강화

데이터베이스 변경 유연성

확장성 향상

코드 유지보수성 향상