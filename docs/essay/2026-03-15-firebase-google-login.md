Firebase認証の分離と独自OAuth(Google)実装
Firebase 인증 분리와 자체 OAuth(Google) 구현
日本語 (Japanese)
概要

当初は Firebase Authentication を分離する作業はすぐ終わると思っていた。
しかし実際には予想以上に時間がかかり、最終的には 約12時間以上かかった。

作業は 夜7時頃に開始し、
翌日の朝10時近くまで続いた。

途中で何度も問題に直面し、
作業が終わらないように感じる瞬間も多かった。

作業内容

今回の作業では以下のことを行った。

Firebase Authentication をプロジェクトから分離

Google OAuth をサーバー側で実装

JWT ベースのセッション認証を導入

フロントエンドとバックエンドの認証フロー整理

Render と Vercel のデプロイ環境調整

OAuth リダイレクトフローの修正

SPA ルーティング問題の解決 (vercel.json)

最終的に以下のログインフローが完成した。

Frontend (Vercel)
↓
Backend /api/auth/google/start (Render)
↓
Google OAuth
↓
Backend callback
↓
JWT発行
↓
Frontend /auth/callback
↓
トークン保存 → ログイン完了

開発中の状態

作業が長時間続いたため、途中で以下のような状態になった。

頭がぼんやりして集中力が落ちる

問題が終わらないように感じる

何が原因なのか分からなくなる瞬間がある

特に ローカルでは正常に動作するが、デプロイ環境では動作しない問題が多く発生した。

この問題は以下の要素が絡んでいた。

OAuth redirect URL

Vercel SPA routing

環境変数

Google OAuth設定

フロントエンド / バックエンドのリダイレクト構造

結果

長時間のデバッグの結果、最終的に問題をすべて解決できた。

特に以下の問題が原因だった。

VercelのSPA routing設定不足

OAuth callbackのリダイレクト経路

環境変数の設定

vercel.json に rewrite 設定を追加することで
/auth/callback の404問題を解決した。

学んだこと

今回の作業を通して感じたことは以下の通りである。

ローカルで動作するコードでも、デプロイ環境では動作しないことが多い

OAuthはリダイレクトフローを理解することが重要

SPAはデプロイ環境で追加設定が必要になる

問題を解決すると単純に見えるが、過程は非常に大変である

しかし、この経験により
OAuth認証の全体構造を理解することができた。

English
Overview

Initially, I expected that removing Firebase Authentication from the project would be a quick task.
However, the process turned out to be much more complex than expected and eventually took over 12 hours.

The work started around 7 PM, and I continued debugging until almost 10 AM the next day.

During the process, I encountered multiple issues that made it feel like the task would never end.

What I Implemented

During this process, I completed the following tasks:

Removed Firebase Authentication from the project

Implemented Google OAuth on the backend

Introduced JWT-based session authentication

Organized the authentication flow between frontend and backend

Adjusted deployment environments (Render and Vercel)

Fixed OAuth redirect flow issues

Resolved SPA routing issues using vercel.json

The final authentication flow now works as follows:

Frontend (Vercel)
↓
Backend /api/auth/google/start (Render)
↓
Google OAuth
↓
Backend callback
↓
JWT generation
↓
Frontend /auth/callback
↓
Token stored → Login complete

Development Experience

Because the debugging process lasted for many hours, I experienced several challenges:

Mental fatigue and difficulty concentrating

Feeling like the problem would never end

Moments where it was difficult to identify the root cause

One major difficulty was that the system worked locally but failed in the production environment.

The issues were related to multiple factors:

OAuth redirect URLs

Vercel SPA routing

Environment variables

Google OAuth configuration

Redirect structure between frontend and backend

Final Result

After extensive debugging, all issues were eventually resolved.

The key problems were:

Missing SPA rewrite configuration in Vercel

Incorrect OAuth redirect flow

Environment variable configuration

Adding the following configuration solved the routing issue:

vercel.json

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}

Lessons Learned

Through this process, I learned several important things:

Code that works locally may fail in production environments

Understanding OAuth redirect flows is essential

SPA applications require additional configuration in deployment environments

Problems often look simple after they are solved, but the debugging process can be exhausting

However, this experience allowed me to fully understand the structure of OAuth authentication.

한국어 (Korean)
개요

처음에는 Firebase Authentication을 프로젝트에서 분리하는 작업이 금방 끝날 것이라고 생각했다.
하지만 실제로는 예상보다 훨씬 오래 걸렸고, 총 12시간 이상이 소요되었다.

작업은 저녁 7시쯤 시작했고,
디버깅을 계속하다 보니 다음 날 아침 10시 가까이 되었다.

문제가 계속 발생하면서 작업이 끝나지 않을 것 같은 느낌도 여러 번 들었다.

작업 내용

이번 작업에서 다음과 같은 작업을 수행했다.

Firebase Authentication 제거

서버 기반 Google OAuth 구현

JWT 기반 인증 구조 구축

프론트엔드 / 백엔드 인증 흐름 정리

Render / Vercel 배포 환경 조정

OAuth redirect 흐름 수정

SPA 라우팅 문제 해결 (vercel.json)

최종 로그인 흐름은 다음과 같다.

Frontend (Vercel)
↓
Backend /api/auth/google/start (Render)
↓
Google OAuth
↓
Backend callback
↓
JWT 발급
↓
Frontend /auth/callback
↓
토큰 저장 → 로그인 완료

개발 과정에서 느낀 점

작업 시간이 길어지면서 다음과 같은 상태가 되었다.

머리가 멍해지고 집중력이 떨어짐

문제가 끝이 없는 것처럼 느껴짐

원인을 찾기 어려운 순간이 발생

특히 로컬에서는 정상 동작하지만 배포 환경에서는 동작하지 않는 문제가 계속 발생했다.

이 문제는 다음 요소들이 복합적으로 얽혀 있었다.

OAuth redirect URL

Vercel SPA 라우팅

환경 변수 설정

Google OAuth 설정

프론트 / 백엔드 redirect 구조

결과

긴 디버깅 끝에 모든 문제를 해결할 수 있었다.

특히 다음 문제가 핵심 원인이었다.

Vercel SPA routing 설정 부족

OAuth redirect 경로 문제

환경 변수 설정 문제

vercel.json rewrite 설정을 추가하면서
/auth/callback 404 문제를 해결할 수 있었다.

교훈

이번 작업을 통해 느낀 점은 다음과 같다.

로컬에서 되는 코드가 배포 환경에서는 실패할 수 있다

OAuth는 redirect 흐름을 이해하는 것이 중요하다

SPA는 배포 환경에서 추가 설정이 필요하다

문제는 해결하고 나면 단순해 보이지만 과정은 매우 힘들다

하지만 이 과정을 통해 OAuth 인증 구조 전체를 이해할 수 있게 되었다.