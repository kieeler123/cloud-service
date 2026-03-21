📌 에러 처리 기록 (실전형 구조)

요청하신 포맷 그대로 일본어 → 영어 → 한국어 순서로 정리했습니다.

🇯🇵 日本語

🔹 状況
Firebase Storage / Firestore のメタデータを MongoDB に移行する作業中

🔹 エラー

MongoDB にデータが保存されない
すべて failed として処理される
scannedCount: 1156
insertedCount: 0
updatedCount: 0
skippedCount: 0
failedCount: 1156

エラーメッセージ:

Path is required
Cannot update createdAt

🔹 推測（仮説）

スキーマのバリデーションに問題があるのでは？
path がないために insert が失敗している？
createdAt の更新が制限されている？

🔹 確認方法（ログ / デバッグ）

console.log("mapped preview:", mapped);
console.log("before save", {
fileId: mapped.fileId,
path: mapped.path,
title: mapped.title,
});

👉 結果:

path: ""（空）
title: 正常に存在
Firestore のデータは正常に読み込み済み

🔹 原因

MongoDB スキーマで path が required だった
Firestore データには path が存在しなかった
update 時に createdAt を上書きしようとしていた

🔹 解決

① スキーマ修正

path: { type: String, required: false }

② createdAt 修正

$setOnInsert: {
createdAt: new Date()
}

③ update 時に createdAt を除外

const { createdAt, ...rest } = mapped;

🔹 結果

MongoDB insert 成功
insertedCount 正常増加
データが画面に表示されるようになった

🔹 教訓（再発防止）

スキーマの required は実データと必ず一致させる
createdAt は更新ではなく生成専用として扱う
すべてのコードを読む必要はなく、エラーに関連するフィールドだけ追う
「保存前ログ」は最も強力なデバッグ手段
🇺🇸 English

🔹 Situation
Working on migrating metadata from Firebase Storage / Firestore to MongoDB

🔹 Error

MongoDB insert not working
All records marked as failed
scannedCount: 1156
insertedCount: 0
updatedCount: 0
skippedCount: 0
failedCount: 1156

Error messages:

Path is required
Cannot update createdAt

🔹 Hypothesis

Schema validation issue?
Missing path causing insert failure?
createdAt being incorrectly updated?

🔹 Debugging (Logs)

console.log("mapped preview:", mapped);
console.log("before save", {
fileId: mapped.fileId,
path: mapped.path,
title: mapped.title,
});

👉 Result:

path is empty
title exists
Firestore data is loaded correctly

🔹 Root Cause

path field was required in Mongo schema
Firestore documents did not contain path
createdAt was being updated during update

🔹 Solution

① Relax schema

path: { type: String, required: false }

② Use $setOnInsert for createdAt

$setOnInsert: {
createdAt: new Date()
}

③ Remove createdAt from update

const { createdAt, ...rest } = mapped;

🔹 Result

MongoDB insert successful
insertedCount increased
Data displayed on UI

🔹 Lessons Learned

Schema validation must match real data structure
createdAt should only be set on creation
No need to read entire code — trace only error-related fields
Logging before DB write is the most effective debugging method
🇰🇷 한국어

🔹 상황
Firebase Storage / Firestore 메타데이터를 MongoDB로 이관하는 작업 중

🔹 에러

MongoDB insert가 되지 않음
모든 데이터가 failed 처리됨
scannedCount: 1156
insertedCount: 0
updatedCount: 0
skippedCount: 0
failedCount: 1156

에러 메시지:

Path is required
Cannot update createdAt

🔹 추측 (가설)

스키마 validation 문제인가?
path가 없어서 insert 실패?
createdAt을 잘못 업데이트하고 있는 건가?

🔹 확인 (로그 / 디버깅)

console.log("mapped preview:", mapped);
console.log("before save", {
fileId: mapped.fileId,
path: mapped.path,
title: mapped.title,
});

👉 결과:

path: 빈 값
title: 정상 존재
Firestore 데이터 읽기 정상

🔹 원인

Mongo 스키마에서 path가 required였음
Firestore 데이터에는 path가 없음
update 시 createdAt을 수정하려고 함

🔹 해결

① 스키마 수정

path: { type: String, required: false }

② createdAt 처리 변경

$setOnInsert: {
createdAt: new Date()
}

③ update에서 createdAt 제거

const { createdAt, ...rest } = mapped;

🔹 결과

MongoDB insert 정상 동작
insertedCount 증가
화면에 데이터 표시 성공

🔹 교훈 (재발 방지)

required 필드는 실제 데이터 구조와 반드시 맞춰야 한다
createdAt은 생성 전용으로 관리해야 한다
함수 전체를 읽지 말고 에러 관련 필드만 추적한다
DB 저장 직전 로그가 가장 강력한 디버깅 방법이다
