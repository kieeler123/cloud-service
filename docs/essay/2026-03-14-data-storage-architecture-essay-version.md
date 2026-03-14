3️⃣ Essay Version
🇯🇵 日本語

このプロジェクトを進める中で、
完成した機能だけを記録する方法には限界があると感じた。

実際の開発では、
設計変更やエラー対応などの過程が多くの時間を占めている。

そのため、
「なぜその設計を選んだのか」
「どのように問題を解決したのか」
といった過程を記録することが重要だと考えた。

また、このプロジェクトでは複数のデータサービスを役割ごとに分離する設計を採用している。

Firebase はメディアファイル保存

MongoDB はメタデータ管理

Supabase は文書データと認証

このように役割を分けることで、
将来的な拡張や構造変更に柔軟に対応できると考えている。

🇺🇸 English

During the development of this project, I realized that documenting only the final implementation was not sufficient.

In real development, a significant amount of time is spent on:

debugging

architectural adjustments

problem-solving

Therefore, recording the reasoning behind decisions and the process of solving problems became an important part of the project.

The system also adopts a multi-service architecture.

Firebase for media storage

MongoDB for metadata

Supabase for document storage and authentication

By separating responsibilities across services, the system becomes more flexible and easier to evolve in the future.

🇰🇷 한국어

이 프로젝트를 진행하면서 단순히 완성된 기능만 기록하는 방식에는 한계가 있다는 것을 느꼈다.

실제 개발에서는 기능 구현보다도

에러 해결

구조 변경

설계 판단

과정에 더 많은 시간이 사용되기 때문이다.

그래서 이 프로젝트에서는

왜 이런 설계를 선택했는지

어떤 문제가 발생했는지

어떻게 해결했는지

와 같은 개발 과정을 기록하는 방식을 선택했다.

또한 데이터 구조 역시 역할에 따라 분리하고 있다.

Firebase → 미디어 파일 저장

MongoDB → 메타데이터 관리

Supabase → 문서 데이터 및 인증

이러한 구조는 시스템 확장과 구조 변경에 더 유연하게 대응할 수 있도록 하기 위한 선택이다.