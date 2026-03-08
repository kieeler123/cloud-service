MongoDB 연결 직전 체크리스트 (Cloud Service)
1. 메타데이터 컬렉션 이름 확정

먼저 MongoDB에 저장할 컬렉션 이름을 정한다.

추천:

cloud_files

이 컬렉션은 다음 역할을 한다.

Firebase / Supabase에 저장된 실제 파일의 통합 메타데이터

프론트가 파일 목록을 읽는 단일 기준 데이터

파일 상태 관리 (uploading / ready / migrating 등)

즉, 실제 파일 저장소가 아니라 인덱스 역할이다.

2. 자동 생성 필드 확정

업로드 시 파일에서 자동으로 추출 가능한 정보만 먼저 넣는다.

필수 필드:

fileId
ownerUid
provider
projectKey
bucket
path
originalName
mimeType
size
status
source
createdAt
updatedAt

설명:

fileId → 내부 고유 ID

ownerUid → Firebase Auth uid

provider → firebase / supabase

projectKey → firebase-old / firebase-new / supabase-docs

bucket → storage bucket 이름

path → 실제 파일 경로

originalName → 업로드된 파일명

mimeType → 파일 타입

size → 파일 크기

status → uploading / ready / migrating / failed / deleted

source → new-upload / migrated-from-realtime-db

createdAt / updatedAt → 생성/수정 시간

이 필드들은 업로드 시 자동으로 채워지는 필드다.

3. 수동 입력 필드 확정

파일 업로드 후 사람이 직접 입력하거나 수정할 필드.

title
seriesTitle
episodeNumber
contentType
isPlayable
memo
tags
displayOrder

설명:

title → 표시용 제목

seriesTitle → 같은 시리즈 묶기

episodeNumber → 회차

contentType → video / document / 기타

isPlayable → 실제 재생 가능한 파일인지

memo → 개인 메모

tags → 태그

displayOrder → 수동 정렬

이 필드들은 업로드 직후에는 비어 있어도 된다.

4. 파일 상태(status) 규칙 확정

status 값은 반드시 정해두는 게 좋다.

uploading
ready
migrating
failed
deleted

의미:

uploading
→ 업로드 진행 중

ready
→ 정상 사용 가능

migrating
→ old storage → new storage 이전 중

failed
→ 업로드 실패 / 이전 실패

deleted
→ 삭제 처리

5. 프로젝트 구분값(projectKey) 확정

현재 구조에서는 반드시 필요하다.

firebase-old
firebase-new
supabase-docs

설명:

firebase-old
→ 기존 Firebase Storage

firebase-new
→ 새 Firebase Storage

supabase-docs
→ Supabase 문서 저장소

프론트는 MongoDB 메타데이터만 보고
어느 저장소에서 파일을 읽어야 하는지 판단한다.

6. 권한 기준 확정

권한 기준은 Firebase uid로 통일한다.

필드:

ownerUid
allowedUserUids

ownerUid
→ 파일 소유자

allowedUserUids
→ 접근 허용 사용자 목록

지금은 owner 한 명만 있어도 충분하다.

7. 파일 경로 규칙 정하기

파일 path는 충돌을 막기 위해 규칙을 정한다.

추천 구조:

video/{uid}/{year}/{month}/{fileId}-{originalName}

예:

video/uid123/2026/03/af82c1-myvideo.mp4

문서 예:

document/uid123/2026/03/bd91e2-resume.pdf

이렇게 하면:

파일 충돌 방지

사용자별 관리

날짜 기준 정렬

이 쉬워진다.

8. MongoDB 인덱스 계획

지금 당장은 안 만들어도 되지만, 최소한 생각은 해둔다.

추천 인덱스:

fileId
ownerUid
seriesTitle
createdAt
status

이건 나중에 목록 조회 속도에 중요하다.

9. 마이그레이션 기준 확정

Realtime Database → MongoDB 이전 시 기준.

source = migrated-from-realtime-db
status = ready
projectKey = firebase-old

즉 기존 파일은:

storage 위치 유지

메타데이터만 MongoDB로 이동

10. 프론트 데이터 기준 확정

MongoDB 연결 후 프론트는 반드시 다음 규칙을 따른다.

파일 목록 = MongoDB 기준
파일 위치 = MongoDB provider + path 기준

즉 프론트는 Firebase DB를 더 이상 직접 읽지 않는다.

지금 단계에서 해야 할 순서

정리하면 실제 작업 순서는 이거야.

MongoDB cluster 생성

cloud_files 컬렉션 생성

최소 메타데이터 구조 정의

MongoDB 연결 코드 작성

insert 테스트

업로드 전 임시 메타 저장 테스트

그 다음에야 스토리지 업로드 코드와 연결하는 게 맞다.

한 줄 결론

지금 단계에서는
MongoDB 연결 전에 메타데이터 구조와 상태 규칙을 먼저 확정하는 게 맞고,
지금 만든 체크리스트 기준으로 연결 작업을 시작하면 실무 수준 구조에서도 덜 막힌다.

실무 프로젝트에서 파일 메타 컬렉션 하나만 두면 거의 반드시 나중에 막힌다.
그래서 보통 최소 2개 컬렉션을 둔다.

지금 네 구조 기준으로 보면 이 두 개가 거의 필수야.

1️⃣ cloud_files (파일 메타데이터)
2️⃣ cloud_events 또는 cloud_logs (파일 작업 기록)

많은 사람들이 두 번째를 안 만들었다가 나중에 디버깅 지옥을 겪는다.

1️⃣ cloud_files (파일 메타데이터)

이건 이미 우리가 정한 컬렉션이야.

역할은 아주 단순하다.

파일의 현재 상태를 저장하는 곳

즉:

파일이 어디 있는지

누가 올렸는지

어떤 타입인지

어떤 시리즈인지

현재 상태가 뭔지

이걸 저장한다.

예:

cloud_files

예시 문서:

{
  "fileId": "f_8ad21",
  "ownerUid": "uid123",
  "provider": "firebase",
  "projectKey": "firebase-new",
  "bucket": "cloud-video",
  "path": "video/uid123/2026/03/f_8ad21-myvideo.mp4",

  "originalName": "myvideo.mp4",
  "mimeType": "video/mp4",
  "size": 230000000,

  "status": "ready",

  "title": "도쿄 여행 브이로그 1화",
  "seriesTitle": "도쿄 여행 브이로그",
  "episodeNumber": 1,
  "isPlayable": true,

  "createdAt": "2026-03-08T10:20:00Z",
  "updatedAt": "2026-03-08T10:20:00Z"
}

이 컬렉션은 현재 상태만 저장한다.

중요한 점:

이 컬렉션은 히스토리를 저장하지 않는다.

2️⃣ cloud_events (작업 로그)

이게 실무에서 진짜 중요한 컬렉션이다.

이 컬렉션은:

파일에서 일어난 모든 작업 기록

을 저장한다.

예:

업로드 시작

업로드 완료

이전 시작

이전 완료

삭제 요청

삭제 완료

실패

즉 히스토리 로그다.

컬렉션 이름 예:

cloud_events

예시 문서:

{
  "eventId": "evt_123",
  "fileId": "f_8ad21",

  "action": "upload_complete",

  "provider": "firebase",
  "projectKey": "firebase-new",

  "uid": "uid123",

  "result": "success",

  "meta": {
    "size": 230000000
  },

  "createdAt": "2026-03-08T10:20:05Z"
}
왜 이 컬렉션이 중요한가

실무에서 반드시 이런 상황이 온다.

예:

업로드 실패

파일 이전 실패

삭제했는데 파일 남아 있음

파일 있는데 목록 안 보임

이전하다가 중간에 멈춤

누가 삭제했는지 모름

이때 로그가 없으면:

원인 추적이 거의 불가능하다.

하지만 event 로그가 있으면:

upload_start
upload_complete
migrate_start
migrate_failed

이렇게 흐름이 보인다.

cloud_files vs cloud_events 차이

정리하면 이렇게 생각하면 된다.

cloud_files

→ 현재 상태

cloud_events

→ 모든 기록

예를 들면

파일 하나가 이렇게 흘러간다.

upload_start
upload_complete
migrate_start
migrate_complete

하지만 cloud_files에는 마지막 상태만 남는다.

status: ready
projectKey: firebase-new
실무에서 흔히 터지는 문제

cloud_events 없으면 이런 일이 생긴다.

예:

파일 없음
메타데이터 있음

왜 이런지 아무도 모른다.

하지만 로그가 있으면:

upload_start
upload_failed

이걸 바로 확인할 수 있다.

네 프로젝트에서는 더 중요하다

지금 네 구조는 단순하지 않다.

Firebase Auth
Firebase Storage (old)
Firebase Storage (new)
Supabase Storage
MongoDB

그리고 추가로

Realtime DB → MongoDB 마이그레이션
old storage → new storage 이전

이 작업들이 섞여 있기 때문에

로그가 없으면 디버깅이 거의 불가능해진다.

그래서 최소 컬렉션 구조는 이거다

MongoDB

cloud_files
cloud_events

딱 두 개.

나중에 필요하면 추가로 생길 수 있는 것들:

cloud_series
cloud_users
cloud_permissions
cloud_tags

하지만 지금 단계에서는 불필요하다.

그래서 지금 순서

네가 지금 해야 할 순서는 이거다.

1️⃣ MongoDB 연결
2️⃣ cloud_files 컬렉션 생성
3️⃣ cloud_events 컬렉션 생성
4️⃣ 파일 메타 insert 테스트
5️⃣ 이벤트 로그 insert 테스트
6️⃣ 업로드 흐름 연결

아주 중요한 설계 원칙 하나

파일 관련 작업이 일어나면 항상 이벤트 로그를 남긴다.

예:

업로드 시작

event: upload_start

업로드 완료

event: upload_complete

이전 시작

event: migrate_start

이전 완료

event: migrate_complete

이것만 지켜도 나중에 문제 해결 속도가 10배 이상 빨라진다.

한 줄 결론

실무 프로젝트에서 최소로 필요한 컬렉션 두 개는

cloud_files (현재 상태)
cloud_events (작업 기록)

이 두 개다.

응, 그때 추가해도 technically는 가능해.
근데 이런 건 나중에 붙이려 하면 기존 데이터 일괄 수정이 필요해져서 귀찮아져.
그래서 지금 빈 값으로라도 자리를 만들어두는 게 좋아.

내가 말하는 반드시 넣어야 하는 3개 필드는 이거야.

1. storageKey

이건 파일이 실제 어디 있는지 식별하는 내부 키야.

예를 들면 단순히:

provider

bucket

path

를 각각 따로 들고 있어도 되지만,
실무에서는 나중에 조회/비교/로그 확인할 때
한 줄로 합쳐진 식별값이 있으면 훨씬 편해.

예:

firebase-new|my-bucket|video/uid123/2026/03/abc.mp4

이 필드가 왜 중요하냐면:

이전 전/후 비교 쉬움

중복 확인 쉬움

로그와 연결 쉬움

파일 존재 여부 점검 배치 만들기 쉬움

즉, storageKey는 현재 저장 위치를 한 번에 식별하는 값이야.

2. migrationState

이건 status랑 비슷해 보여도 역할이 달라.

예를 들어 status는 보통:

uploading

ready

failed

deleted

이런 파일 사용 상태를 뜻하잖아.

근데 이전 작업은 별도 흐름이야.

예:

not_required

pending

queued

migrating

migrated

verify_failed

이런 식으로 이전 전용 상태가 따로 있어야 해.

왜냐면 이런 상황이 생기거든:

파일은 지금 사용 가능함 → status = ready

하지만 old → new 이전은 아직 안 됨 → migrationState = pending

즉,
사용 가능 상태와 이전 상태는 분리해야 한다.

이걸 나중에 추가하면 기존 문서들에 다 기본값 넣어야 해서 귀찮아져.

3. sourceFileRef

이건 이 파일이 어디서 왔는지 추적하는 원본 참조값이야.

특히 지금 너처럼:

Realtime Database 메타 이전

old Firebase 파일 유지

new Firebase 신규 업로드

나중에 old → new 이사

이런 흐름에서는 원본 추적이 엄청 중요해.

예:

sourceFileRef: {
  sourceType: "realtime-db" | "firebase-old" | "new-upload",
  sourceId: "old_file_123",
  sourcePath: "video/uid123/oldname.mp4"
}

처음엔 단순 문자열로 둬도 돼.

예:

realtime-db:old_file_123

이게 왜 중요하냐면:

같은 파일이 중복 이전됐는지 추적 가능

메타만 옮긴 파일인지 확인 가능

old/new 연결관계 추적 가능

문제 생겼을 때 원본 복구 기준이 생김

즉 sourceFileRef는 이 문서가 어떤 원본에서 출발했는지 알려주는 필드야.

왜 지금 넣는 게 좋냐

네 말대로 나중에 넣어도 돼.
근데 그때 되면 보통 이런 문제가 생겨.

어떤 파일은 old 기준이고

어떤 파일은 new 기준이고

어떤 건 신규 업로드인데

어떤 건 이전된 파일인지

나중에 구분이 애매해짐

그러면 결국
기존 데이터 전체에 대해 스크립트 돌려서 보정해야 해.

그래서 지금은 값이 완벽하지 않아도 좋아.

예를 들면 초기엔 이렇게만 둬도 된다.

storageKey: ""
migrationState: "not_required"
sourceFileRef: ""

즉 빈 껍데기라도 먼저 만들어두는 게 이득이야.

정리하면

반드시 넣어두면 좋은 3개는:

storageKey
→ 현재 저장 위치를 한 줄로 식별

migrationState
→ 파일 이전 전용 상태

sourceFileRef
→ 원본 파일/원본 메타 추적용 참조값

네 구조에 맞춰 아주 최소로 넣으면

이렇게만 추가해도 충분해.

storageKey: string;
migrationState: "not_required" | "pending" | "migrating" | "migrated" | "failed";
sourceFileRef?: string;

이 정도면 나중에 파일 이전 시스템 붙일 때 훨씬 덜 고생해.

한 줄 결론

응, 나중에 넣어도 되긴 하는데
이 3개는 지금 빈 값으로라도 자리만 만들어두는 게 나중에 스키마 다시 뜯는 일을 많이 줄여준다.