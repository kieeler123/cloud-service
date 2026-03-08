2026-03-09

3️⃣ 面接質問形式（Interview Q&A）
🇯🇵 日本語

Q. Node.js と TypeScript を ESM 環境で使用する場合、import 拡張子はどうなりますか？
A. NodeNext 環境では TypeScript ファイルでも import に .js 拡張子を付ける必要があります。これは最終的にコンパイルされた JavaScript ファイルを Node が読み込むためです。

Q. process.env の型問題はどのように解決しましたか？
A. requireEnv() ヘルパー関数を作成し、環境変数が存在しない場合はサーバー起動時にエラーを発生させるようにしました。これにより TypeScript が string 型として安全に扱えるようになります。

Q. MongoDB 接続コードの安定性をどのように確保しましたか？
A. MongoDB クライアントと DB インスタンスをグローバルに保持し、再利用する構造にしました。これにより毎回接続を作成することを防ぎ、接続の安定性を高めました。

🇺🇸 English

Q. How do import extensions work in a Node.js TypeScript project using ESM (NodeNext)?
A. In a NodeNext environment, even TypeScript files must import modules using the .js extension because Node ultimately executes compiled JavaScript files.

Q. How did you resolve the process.env type issue in TypeScript?
A. I implemented a helper function called requireEnv() that ensures environment variables exist and throws an error during server startup if they are missing. This allows TypeScript to treat the value as a definite string.

Q. How did you stabilize the MongoDB connection logic?
A. I reused a global MongoDB client and database instance so that the application does not create a new connection for every request, improving connection stability.

🇰🇷 한국어

Q. Node.js에서 TypeScript와 ESM(NodeNext)을 사용할 때 import 확장자는 어떻게 처리합니까?
A. NodeNext 환경에서는 TypeScript 파일이라도 import 경로에 .js 확장자를 붙여야 합니다. 이는 최종적으로 Node가 컴파일된 JavaScript 파일을 실행하기 때문입니다.

Q. TypeScript에서 process.env 타입 문제는 어떻게 해결했습니까?
A. requireEnv() 헬퍼 함수를 만들어 환경 변수가 존재하지 않을 경우 서버 시작 시 에러를 발생시키도록 했습니다. 이를 통해 TypeScript가 해당 값을 string 타입으로 안전하게 인식하도록 했습니다.

Q. MongoDB 연결 안정성은 어떻게 확보했습니까?
A. MongoDB 클라이언트와 DB 인스턴스를 전역으로 재사용하는 구조를 만들어 매 요청마다 새로운 연결이 생성되지 않도록 했습니다.