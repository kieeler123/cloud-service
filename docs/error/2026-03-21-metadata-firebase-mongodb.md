📌 가장 좋은 기록 구조 (실전형)

이 구조로 남기면 된다 👇

1. 상황
어떤 작업 중이었는지
2. 발생한 에러
에러 메시지 그대로
3. 추측 (가설)
왜 이런 에러가 났다고 생각했는지
4. 확인 방법 (로그 / 디버깅)
어디에 로그 찍었는지
무슨 값이 나왔는지
5. 원인
실제 문제였던 부분
6. 해결
어디 코드를 어떻게 수정했는지
7. 교훈 (재발 방지)
다음에 같은 상황이면 어떻게 판단할지
🚀 지금 네 상황 기준 예시 (실제 오늘 내용)
🇰🇷 한국어 (Shiori용 추천 포맷)
🔹 상황

Firebase Storage → MongoDB로 메타데이터 sync 작업 중

🔹 에러

MongoDB insert가 되지 않고 count가 증가하지 않음

before count: 163
after count: 163
insertMany returned length: 0
🔹 추측

DB 연결 문제?

insertMany 실패?

중복 필터 문제?

🔹 확인 (로그)
console.log("db name:", CloudFileModel.db.name);
console.log("collection name:", CloudFileModel.collection.name);
console.log("docs prepared:", docs.length);
console.log("docs to insert:", docsToInsert.length);

👉 결과:

docsToInsert: 712 (정상)

insert는 실행됨

그런데 DB 변화 없음

🔹 원인

Mongo schema에서 아래 필드가 required였음

name: { type: String, required: true }
url: { type: String, required: true }
downloadURL: { type: String, required: true }

👉 sync에서는 해당 값이 없어서 insert 전부 실패

🔹 해결
required 제거

또는

default 값 설정
🔹 결과
insertedCount 정상 증가
MongoDB 데이터 생성됨
DrivePage에 표시됨
🔹 교훈

Mongo insert 실패는 에러가 안 날 수도 있다

required 필드와 실제 데이터 구조를 항상 맞춰야 한다

DB count 로그는 가장 확실한 검증 방법이다