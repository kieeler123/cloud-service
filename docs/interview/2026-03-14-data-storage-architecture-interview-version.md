2️⃣ Interview Version
🇯🇵 日本語

Q: なぜ開発過程を記録する方式を採用しましたか？

A:
ソフトウェア開発では完成した結果だけでなく、
設計の背景や問題解決の過程も重要だと考えたからです。

エラー原因や設計変更の理由を記録することで、
将来的にシステムを理解しやすくなり、
保守や改善がしやすくなります。

Q: なぜ複数のデータサービスを使用していますか？

A:
それぞれのサービスが得意とする役割が異なるためです。

Firebase → 大容量ファイル保存

MongoDB → メタデータ管理

Supabase → 文書データと認証

このように役割を分離することで
システムの拡張性と柔軟性を高めることができます。

🇺🇸 English

Q: Why do you document the development process instead of only the final result?

A:
Because understanding the reasoning behind architectural decisions is as important as the final implementation.

Recording error causes, design changes, and problem-solving processes helps maintain a deeper understanding of the system over time.

Q: Why are you using multiple data services?

A:
Each service has different strengths.

Firebase → large media storage

MongoDB → metadata storage

Supabase → document storage and authentication

Separating responsibilities allows the system to scale and evolve more easily.

🇰🇷 한국어

Q: 왜 개발 결과뿐 아니라 개발 과정까지 기록하나요?

A:
소프트웨어 개발에서는 결과뿐 아니라
설계의 이유와 문제 해결 과정도 중요한 정보이기 때문입니다.

에러 발생 원인과 해결 과정, 구조 변경 이유를 기록하면
나중에 시스템을 이해하거나 유지보수할 때 큰 도움이 됩니다.

Q: 왜 여러 데이터 서비스를 사용하나요?

A:
각 서비스가 잘하는 역할이 다르기 때문입니다.

Firebase → 대용량 미디어 저장

MongoDB → 메타데이터 관리

Supabase → 문서 데이터 및 인증

역할을 분리하면 시스템 확장성과 유연성이 높아집니다.