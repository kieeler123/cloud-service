📌 2. 에세이 형식
🇯🇵 日本語

今日は Firebase Storage に保存されているファイルを MongoDB に同期する機能を実装した。最初は単純にメタデータを取得して保存するだけだと思っていたが、実際にはメタデータの取得失敗やスキーマの不一致など、複数の問題が発生した。特に MongoDB の required フィールドが原因で insert が完全に失敗していた点は重要な発見だった。

また、単に同期するだけではなく、どのファイルが成功し、どれが失敗したのかを記録する必要性を感じた。そのため、ファイル単位で結果を収集し、コンソールに出力する仕組みを追加した。この構造は将来的に管理者ページにもそのまま応用できると考えている。

今回の作業を通して、Firebase を原本として保持し、MongoDB は再生成可能なメタデータとして扱う設計が重要であると理解した。これにより、同期に失敗しても再試行によって復旧できる柔軟なシステムを構築できると感じた。

🇺🇸 English

Today, I implemented a sync system that transfers file metadata from Firebase Storage to MongoDB. Initially, I thought it would be a simple process of reading metadata and inserting it into the database, but multiple issues appeared in practice, including metadata fetch failures and schema mismatches. A critical issue was that required fields in MongoDB caused all insert operations to fail.

I also realized that simply syncing data is not enough; it is important to track which files succeeded, were skipped, or failed. Therefore, I introduced a structure to collect per-file results and log them to the console. This design will later be useful for building an admin dashboard.

Through this process, I learned that Firebase should be treated as the source of truth, while MongoDB should be considered a reproducible metadata layer. This approach ensures that even if synchronization fails, the system can recover through retries.

🇰🇷 한국어

오늘은 Firebase Storage에 있는 파일 메타데이터를 MongoDB로 이관하는 기능을 구현했다. 처음에는 단순히 메타데이터를 읽어서 저장하면 될 것이라고 생각했지만, 실제로는 메타데이터 조회 실패와 스키마 불일치 등 여러 문제가 발생했다. 특히 MongoDB의 required 필드 때문에 insert가 전부 실패했던 부분은 중요한 발견이었다.

또한 단순히 데이터를 이관하는 것에서 끝나는 것이 아니라, 어떤 파일이 성공했고 어떤 파일이 실패했는지를 추적하는 것이 중요하다는 것을 느꼈다. 그래서 파일 단위로 결과를 수집하고 콘솔에 출력하는 구조를 추가했다. 이 구조는 이후 관리자 페이지에서도 그대로 활용할 수 있을 것으로 보인다.

이번 작업을 통해 Firebase는 원본 데이터, MongoDB는 재생성 가능한 메타데이터라는 구조가 중요하다는 것을 이해하게 되었다. 이 구조 덕분에 동기화가 실패하더라도 언제든 다시 시도하여 복구할 수 있는 유연한 시스템을 만들 수 있다고 느꼈다.