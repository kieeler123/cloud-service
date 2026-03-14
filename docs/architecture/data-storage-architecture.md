1️⃣ Architecture Version
🇯🇵 日本語
開発過程を記録するアーキテクチャ方針

本プロジェクトでは、完成した結果だけでなく
開発の過程そのものを記録する方針を採用している。

通常の開発記録は完成した機能だけをまとめることが多いが、
本プロジェクトでは以下の内容も記録対象とする。

なぜその設計を選択したのか

エラーが発生した原因

どのように問題を解決したのか

設計変更の理由

このような記録を残すことで、
将来的にプロジェクト構造を理解しやすくすることを目的としている。

データストレージ構成

現在のプロジェクトでは複数のデータサービスを役割ごとに分離して使用している。

Firebase

大容量ファイル保存

動画

画像

メディアファイル

MongoDB

メタデータ保存

ファイル情報

システムデータ

Supabase（予定）

将来的には Supabase を次の用途で使用する予定である。

文書ファイル保存

認証システム

ユーザー管理

アーキテクチャ設計の考え方

このプロジェクトでは
「適切な役割ごとにサービスを分離する」
という設計方針を採用している。

例

Firebase → メディアストレージ

MongoDB → メタデータ管理

Supabase → 文書データ管理

この構造により、

スケーラビリティ

柔軟性

システム拡張

を実現することを目指している。

🇺🇸 English
Architecture Philosophy: Recording the Development Process

In this project, development documentation focuses not only on the final result but also on the entire development process.

Instead of documenting only completed features, the following information is also recorded:

Why a specific design decision was made

What kind of errors occurred

How the problems were solved

Why architectural changes were introduced

This approach helps maintain a deeper understanding of the system structure over time.

Data Storage Architecture

The project currently separates different storage systems according to their responsibilities.

Firebase

Used for large file storage:

videos

images

media assets

MongoDB

Used for metadata storage:

file metadata

system data

indexing information

Supabase (planned)

Supabase will be integrated later for:

document storage

authentication system

user management

Architecture Design Philosophy

This project follows the principle of:

“Using the right service for the right responsibility.”

Examples:

Firebase → media storage

MongoDB → metadata management

Supabase → document storage

This separation improves:

scalability

flexibility

system evolution

🇰🇷 한국어
개발 과정을 기록하는 아키텍처 철학

이 프로젝트에서는 단순히 완성된 기능만 기록하는 것이 아니라
개발 과정 자체를 기록하는 방식을 채택하였다.

일반적인 개발 기록은 결과 중심으로 작성되는 경우가 많지만,
이 프로젝트에서는 다음과 같은 내용도 함께 기록한다.

왜 해당 설계를 선택했는지

어떤 에러가 발생했는지

문제를 어떻게 해결했는지

구조를 변경하게 된 이유

이러한 기록을 남김으로써
시간이 지나도 프로젝트 구조와 의도를 쉽게 이해할 수 있도록 한다.

데이터 저장 구조

현재 프로젝트에서는 데이터 역할에 따라 저장 시스템을 분리하고 있다.

Firebase

대용량 파일 저장

영상

이미지

미디어 파일

MongoDB

메타데이터 저장

파일 정보

시스템 데이터

인덱스 데이터

Supabase (예정)

향후 Supabase는 다음 용도로 사용할 계획이다.

문서 파일 저장

인증 시스템

사용자 관리

설계 철학

이 프로젝트는

“역할에 맞는 서비스를 분리해서 사용하는 구조”

를 설계 원칙으로 사용한다.

예

Firebase → 미디어 저장

MongoDB → 메타데이터 관리

Supabase → 문서 데이터 관리

이 구조를 통해

확장성

유연성

시스템 발전 가능성

을 확보하는 것을 목표로 한다.