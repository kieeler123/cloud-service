# Cloud-Service

---

# 🇯🇵 日本語

## 概要

Cloud-Service は、個人用の実験プロジェクトとして開発しているクラウドサービスです。  
このプロジェクトは公開サービスではなく、アーキテクチャ実験・バックエンド設計・クラウド統合の研究を目的としたクローズドプロジェクトです。

主な目的は、複数のクラウドサービスを組み合わせたシステム構造を検証することです。

---

## プロジェクトの目的

このプロジェクトは以下の目的で作られています。

- クラウドサービスの統合アーキテクチャの実験
- クライアント / サーバー分離構造の研究
- 複数データストレージの役割分離
- バックエンドAPI設計の検証
- 将来のプロジェクトのための基盤実験

---

## アーキテクチャ概要

このプロジェクトでは以下の構造を採用しています。

### Client

フロントエンドは主に UI の役割を担当します。

主な役割

- UI 表示
- ユーザー操作
- API 通信
- 状態管理

### Server

サーバーはアプリケーションロジックを担当します。

主な役割

- API 処理
- ビジネスロジック
- データ処理
- クラウドサービス連携

---

## ストレージ構造

このプロジェクトでは複数のストレージを用途別に分離しています。

### Firebase Storage

用途

- 大容量ファイル保存
- 画像
- 動画
- その他アップロードファイル

---

### MongoDB

用途

- メタデータ保存
- ファイル情報
- クラウドファイル管理
- API データ構造

---

### Supabase（将来予定）

用途

- ドキュメントデータ保存
- 認証システム
- アプリケーションデータ管理

---

## このプロジェクトについて

Cloud-Service は以下の特徴を持つプロジェクトです。

- 実験用プロジェクト
- クローズドシステム
- アーキテクチャ検証目的
- 個人開発

---

# 🇺🇸 English

## Overview

Cloud-Service is a personal experimental project designed to explore cloud architecture, backend structure, and multi-service integration.

This project is not intended as a public service.  
Instead, it functions as a closed experimental environment for testing system design, cloud infrastructure, and backend architecture.

---

## Project Goals

The main goals of this project are:

- Experimenting with cloud service integration
- Designing a client-server separated architecture
- Exploring multi-storage architecture
- Testing backend API design
- Building a foundation for future systems

---

## Architecture Overview

The project follows a **client-server architecture**.

### Client

The client focuses primarily on the user interface.

Responsibilities:

- UI rendering
- User interaction
- API communication
- State management

---

### Server

The server is responsible for the application logic.

Responsibilities:

- API processing
- Business logic
- Data handling
- Cloud service integration

---

## Storage Architecture

The project intentionally separates storage responsibilities across different services.

### Firebase Storage

Used for:

- Large file storage
- Images
- Videos
- Uploaded files

---

### MongoDB

Used for:

- Metadata storage
- File information
- Cloud file management
- API data structures

---

### Supabase (planned)

Planned uses:

- Document storage
- Authentication system
- Application data management

---

## Project Characteristics

Cloud-Service is designed as:

- An experimental project
- A closed system
- An architecture testing environment
- A personal development project

---

# 🇰🇷 한국어

## 개요

Cloud-Service는 개인적으로 개발 중인 **클라우드 아키텍처 실험 프로젝트**입니다.

이 프로젝트는 공개 서비스를 목표로 하는 것이 아니라  
**클라우드 구조, 백엔드 설계, 멀티 스토리지 구조를 실험하기 위한 폐쇄형 실험 프로젝트**입니다.

---

## 프로젝트 목적

이 프로젝트는 다음과 같은 목적을 가지고 있습니다.

- 클라우드 서비스 통합 구조 실험
- 클라이언트 / 서버 분리 아키텍처 설계
- 멀티 스토리지 구조 연구
- 백엔드 API 구조 검증
- 향후 프로젝트를 위한 기반 구조 실험

---

## 아키텍처 개요

이 프로젝트는 **클라이언트 / 서버 분리 구조**를 기반으로 합니다.

### Client

클라이언트는 UI 역할을 담당합니다.

주요 역할

- UI 렌더링
- 사용자 인터랙션 처리
- API 통신
- 상태 관리

---

### Server

서버는 애플리케이션 로직을 담당합니다.

주요 역할

- API 처리
- 비즈니스 로직
- 데이터 처리
- 클라우드 서비스 연동

---

## 스토리지 구조

이 프로젝트는 저장소 역할을 분리하여 설계되었습니다.

### Firebase Storage

용도

- 대용량 파일 저장
- 이미지
- 영상
- 업로드 파일

---

### MongoDB

용도

- 메타데이터 저장
- 파일 정보 관리
- 클라우드 파일 관리
- API 데이터 구조

---

### Supabase (향후 예정)

용도

- 문서 데이터 저장
- 인증 시스템
- 애플리케이션 데이터 관리

---

## 프로젝트 성격

Cloud-Service는 다음과 같은 성격의 프로젝트입니다.

- 실험 프로젝트
- 폐쇄형 시스템
- 아키텍처 검증 목적
- 개인 개발 프로젝트