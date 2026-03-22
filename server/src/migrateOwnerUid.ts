import "dotenv/config";
import { adminDb } from "./lib/firebaseAdmin.js";

async function migrateOwnerUid() {
  const oldUid = process.env.MIGRATE_OLD_UID;
  const newUid = process.env.MIGRATE_NEW_UID;

  if (!oldUid) {
    throw new Error("Missing MIGRATE_OLD_UID");
  }

  if (!newUid) {
    throw new Error("Missing MIGRATE_NEW_UID");
  }

  if (oldUid === newUid) {
    throw new Error("MIGRATE_OLD_UID and MIGRATE_NEW_UID are the same");
  }

  console.log("Starting ownerUid migration...");
  console.log("oldUid:", oldUid);
  console.log("newUid:", newUid);

  const snapshot = await adminDb
    .collection("files")
    .where("ownerUid", "==", oldUid)
    .get();

  console.log(`Matched documents: ${snapshot.size}`);

  if (snapshot.empty) {
    console.log("No documents found. Nothing to update.");
    return;
  }

  console.log("Preview (up to 10 docs):");
  snapshot.docs.slice(0, 10).forEach((docSnap, index) => {
    const data = docSnap.data();
    console.log(
      `${index + 1}. docId=${docSnap.id}, name=${data.name ?? "(no name)"}`,
    );
  });

  const batchSize = 400;
  let updatedCount = 0;

  for (let i = 0; i < snapshot.docs.length; i += batchSize) {
    const chunk = snapshot.docs.slice(i, i + batchSize);
    const batch = adminDb.batch();

    chunk.forEach((docSnap) => {
      batch.update(docSnap.ref, {
        ownerUid: newUid,
      });
    });

    await batch.commit();
    updatedCount += chunk.length;

    console.log(`Committed batch: ${updatedCount}/${snapshot.size}`);
  }

  console.log("Migration completed.");
  console.log(`Updated documents: ${updatedCount}`);
}

migrateOwnerUid()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
