2️⃣ 에세이 형식
🇯🇵 日本語

今日はクラウドサービスの基盤を大きく前進させた一日だった。
Firebase Storage のファイルを読み込み、画面に表示する仕組みを構築した後、Firestore に保存されているメタデータを MongoDB に移行する処理を実装した。

しかし、単純な移行ではなく、データ構造の違いによって多くの問題が発生した。特に path required のような厳しすぎるバリデーションや、createdAt の更新エラーにより、すべてのデータが失敗する状況に直面した。

これらの問題を解決するために、スキーマの柔軟化や $setOnInsert の導入、そしてマッピングロジックの改善を行った。
また、ログの出力位置を工夫することで、コード全体を読むのではなく、問題のある部分だけを効率的に追跡できるようになった。

最終的には、最小限のデータでも画面に表示できるような設計に切り替え、temp から complete へと進化するメタデータ構造を確立した。

🇺🇸 English

Today was a major step forward in building the cloud service architecture.
After implementing file reading from Firebase Storage and displaying them on the UI, I built a migration system to move metadata from Firestore into MongoDB.

The process was not straightforward due to differences in data structure. Issues such as strict validation rules (like required path) and createdAt update errors caused all records to fail during migration.

To resolve this, I relaxed schema constraints, introduced $setOnInsert, and redesigned the mapping logic.
Additionally, I improved debugging by placing logs strategically, allowing me to focus only on problematic areas instead of reading entire functions.

In the end, I shifted the system to allow minimal data for rendering, and established a flexible metadata lifecycle from temp to complete.

🇰🇷 한국어

오늘은 클라우드 서비스 구조를 크게 진전시킨 날이었다.
Firebase Storage의 파일을 읽어 화면에 출력하는 기능을 구현한 이후, Firestore에 저장된 메타데이터를 MongoDB로 이관하는 로직을 구축했다.

하지만 단순한 이관이 아니라 데이터 구조 차이로 인해 여러 문제가 발생했다. 특히 path required 같은 과도한 검증 조건과 createdAt 업데이트 에러로 인해 모든 데이터가 실패하는 상황을 겪었다.

이를 해결하기 위해 스키마를 유연하게 수정하고, $setOnInsert를 도입했으며, 매핑 로직을 개선했다.
또한 로그를 찍는 위치를 전략적으로 조정하면서 전체 코드를 읽지 않고도 문제 지점을 빠르게 찾을 수 있게 되었다.

결과적으로 최소한의 정보만 있어도 화면에 표시할 수 있는 구조로 전환했고, temp → complete로 발전하는 메타데이터 흐름을 설계하게 되었다.
