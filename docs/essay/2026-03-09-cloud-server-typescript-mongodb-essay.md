2026-03-09

2️⃣ エッセイ形式（今日の作業記録）
🇯🇵 日本語

今日は server 側の構造を JavaScript から TypeScript に移行する作業を進めた。
最初は単純に拡張子を .ts に変更するだけだと思っていたが、Node の ESM（NodeNext）環境では import の扱いが異なり、TypeScript ファイルでも .js 拡張子を付けて import する必要があることを理解した。

また、MongoDB 接続部分では process.env の型が string | undefined と推論されるため、MongoDB クライアントの初期化時に TypeScript の型エラーが発生した。
この問題を解決するために requireEnv() 関数を導入し、環境変数が存在しない場合はサーバー起動時にエラーを発生させる安全な構造に変更した。

作業の途中で構造が少し複雑になり、時間が想定以上にかかってしまったが、最終的には MongoDB Atlas と server API の接続を確認することができた。
今日の作業は想定より進捗が少なく感じるが、バックエンド構造を安定させるための重要なステップだったと思う。

🇺🇸 English

Today I focused on migrating the server-side structure from JavaScript to TypeScript.
At first, I thought it would be a simple extension change from .js to .ts, but I realized that Node’s ESM (NodeNext) environment has different import rules. Even when using TypeScript files, imports must include the .js extension.

While working on the MongoDB connection module, I encountered a TypeScript type issue because process.env variables are inferred as string | undefined. This caused a type error when initializing the MongoDB client.
To resolve this, I introduced a requireEnv() helper function to ensure that environment variables exist and are treated as proper strings.

The work took longer than expected due to structural complications, but eventually I confirmed that the server API can successfully connect to MongoDB Atlas.
Although the overall progress feels smaller than planned, stabilizing the backend structure was an important step for the project.

🇰🇷 한국어

오늘은 서버 구조를 JavaScript에서 TypeScript로 전환하는 작업을 진행했다.
처음에는 단순히 .js 파일을 .ts로 바꾸면 될 것이라고 생각했지만, Node의 ESM(NodeNext) 환경에서는 import 규칙이 달라 TypeScript 파일이라도 .js 확장자를 붙여야 한다는 점을 확인하게 되었다.

또한 MongoDB 연결 코드에서는 process.env가 string | undefined로 추론되기 때문에 MongoDB 클라이언트를 생성할 때 타입 에러가 발생했다.
이 문제를 해결하기 위해 requireEnv() 함수를 도입하여 환경 변수가 없을 경우 서버 시작 단계에서 바로 오류가 발생하도록 구조를 수정했다.

작업 도중 구조가 꼬이면서 예상보다 시간이 많이 소요되었지만, 최종적으로 MongoDB Atlas와 server API가 정상적으로 연결되는 것을 확인했다.
오늘 작업은 계획보다 진도가 많이 나간 것 같지는 않지만, 백엔드 구조를 안정화하기 위한 중요한 단계였다고 생각한다.