import { getMongoDb } from "../../../app/config/mongodb.js";
import { CloudFile } from "../model/cloudFile.types.js";

import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase.js";
import { adminDb, adminStorage } from "@/lib/firebaseAdmin.js";
import {
  DeleteCloudFileForeverParams,
  DriveFile,
  FindDriveFilesPageParams,
  RestoreCloudFileParams,
  TrashDuplicateDriveFilesParams,
} from "@/types/drive.js";

const COLLECTION = "cloud_files";

export async function insertCloudFile(doc: CloudFile) {
  const db = await getMongoDb();
  return db.collection(COLLECTION).insertOne(doc);
}

export async function findCloudFiles() {
  const db = await getMongoDb();

  return db
    .collection(COLLECTION)
    .find({ status: { $ne: "trashed" } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function trashCloudFilesByFileIds(fileIds: string[]) {
  const db = await getMongoDb();

  return db.collection(COLLECTION).updateMany(
    {
      fileId: { $in: fileIds },
    },
    {
      $set: {
        status: "trashed",
        trashedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  );
}

export async function trashDuplicateDriveFiles({
  ownerUid,
  name,
  size,
}: TrashDuplicateDriveFilesParams) {
  const q = query(
    collection(db, "files"),
    where("ownerUid", "==", ownerUid),
    where("name", "==", name),
    where("size", "==", size),
    where("isTrashed", "==", false),
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { count: 0, ids: [] as string[] };
  }

  const ids: string[] = [];

  for (const docSnap of snapshot.docs) {
    await updateDoc(doc(db, "files", docSnap.id), {
      isTrashed: true,
      trashedAt: new Date(),
    });

    ids.push(docSnap.id);
  }

  return {
    count: ids.length,
    ids,
  };
}

export async function findDriveFilesPageByOwnerUid({
  ownerUid,
  pageSize,
  cursor,
}: FindDriveFilesPageParams) {
  let q = adminDb
    .collection("files")
    .where("ownerUid", "==", ownerUid)
    .where("isTrashed", "==", false)
    .orderBy("createdAt", "desc")
    .limit(pageSize);

  if (cursor) {
    const cursorDoc = await adminDb.collection("files").doc(cursor).get();
    if (cursorDoc.exists) {
      q = q.startAfter(cursorDoc);
    }
  }

  const snapshot = await q.get();

  const items: DriveFile[] = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      name: data.name,
      size: data.size,
      path: data.path,
      downloadURL: data.downloadURL,
      contentType: data.contentType ?? "",
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
      isTrashed: data.isTrashed ?? false,
    };
  });

  const nextCursor =
    snapshot.docs.length > 0
      ? snapshot.docs[snapshot.docs.length - 1].id
      : null;

  return {
    items,
    nextCursor,
    hasMore: snapshot.docs.length === pageSize,
  };
}

export async function findTrashFilesByOwnerUid(ownerUid: string) {
  const snapshot = await adminDb
    .collection("files")
    .where("ownerUid", "==", ownerUid)
    .where("isTrashed", "==", true)
    .orderBy("trashedAt", "desc")
    .get();

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      size: data.size,
      downloadURL: data.downloadURL,
      path: data.path,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
      trashedAt: data.trashedAt?.toDate?.()?.toISOString?.() ?? null,
    };
  });
}

export async function restoreCloudFileById({
  ownerUid,
  fileId,
}: RestoreCloudFileParams) {
  const ref = adminDb.collection("files").doc(fileId);
  const snap = await ref.get();

  if (!snap.exists) {
    throw new Error("FILE_NOT_FOUND");
  }

  const data = snap.data();
  if (data?.ownerUid !== ownerUid) {
    throw new Error("FORBIDDEN");
  }

  await ref.update({
    isTrashed: false,
    trashedAt: null,
  });
}

export async function deleteCloudFileForeverById({
  ownerUid,
  fileId,
}: DeleteCloudFileForeverParams) {
  const ref = adminDb.collection("files").doc(fileId);
  const snap = await ref.get();

  if (!snap.exists) {
    throw new Error("FILE_NOT_FOUND");
  }

  const data = snap.data();
  if (data?.ownerUid !== ownerUid) {
    throw new Error("FORBIDDEN");
  }

  if (data?.path) {
    await adminStorage
      .file(data.path)
      .delete()
      .catch(() => {});
  }

  await ref.delete();
}
