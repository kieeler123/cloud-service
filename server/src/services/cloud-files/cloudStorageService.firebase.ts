import { adminDb, adminStorage } from "../../lib/firebaseAdmin.js";
import { createCloudFileMeta } from "../../features/cloud/controllers/cloudFilesApi.js";
import { trashCloudFilesByFileIds as trashCloudFilesByFileIdsRepo } from "../../features/cloud/repo/cloudFilesRepo.js";
import type { TrashDuplicateDriveFilesParams } from "../../types/drive.js";

type FindDriveFilesPageParams = {
  ownerUid: string;
  pageSize: number;
  cursor?: string | null;
};

type RestoreCloudFileParams = {
  ownerUid: string;
  fileId: string;
};

type DeleteCloudFileForeverParams = {
  ownerUid: string;
  fileId: string;
};

type UploadCloudFileParams = {
  ownerUid: string;
  file: Express.Multer.File;
};

function detectDriveFileKind(file: {
  mimetype?: string;
  originalname?: string;
}) {
  const mime = file.mimetype ?? "";
  const name = file.originalname ?? "";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (ext === "pdf") return "pdf";

  return "file";
}

export async function uploadCloudFile({
  ownerUid,
  file,
}: UploadCloudFileParams) {
  const duplicateSnapshot = await adminDb
    .collection("files")
    .where("ownerUid", "==", ownerUid)
    .where("name", "==", file.originalname)
    .where("size", "==", file.size)
    .where("isTrashed", "==", false)
    .limit(1)
    .get();

  if (!duplicateSnapshot.empty) {
    throw new Error("DUPLICATE_FILE");
  }

  const safeName = file.originalname.replace(/[^\w.\-가-힣]/g, "_");
  const path = `uploads/${ownerUid}/${Date.now()}_${safeName}`;

  const bucketFile = adminStorage.file(path);

  await bucketFile.save(file.buffer, {
    metadata: {
      contentType: file.mimetype || "application/octet-stream",
    },
    resumable: false,
  });

  const [downloadURL] = await bucketFile.getSignedUrl({
    action: "read",
    expires: "2500-01-01",
  });

  const newDocRef = adminDb.collection("files").doc();

  await newDocRef.set({
    ownerUid,
    name: file.originalname,
    size: file.size,
    path,
    downloadURL,
    contentType: file.mimetype || "application/octet-stream",
    createdAt: new Date(),
    isTrashed: false,
  });

  const bucket = adminStorage.name;
  const kind = detectDriveFileKind(file);

  await createCloudFileMeta({
    fileId: newDocRef.id,
    ownerUid,
    allowedUserUids: [ownerUid],

    provider: "firebase",
    projectKey: "firebase-old",
    bucket,
    path,
    storageKey: `firebase|${bucket}|${path}`,

    originalName: file.originalname,
    mimeType: file.mimetype || "application/octet-stream",
    size: file.size,
    kind,

    title: "",
    seriesTitle: "",
    episodeNumber: null,
    contentType: kind,
    isPlayable: kind === "video",
    displayOrder: null,
    memo: "",
    tags: [],

    status: "ready",
    migrationState: "not_required",
    source: "new-upload",
    sourceFileRef: "",

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return {
    fileId: newDocRef.id,
    path,
    downloadURL,
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

  const items = snapshot.docs.map((docSnap) => {
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

  return {
    items,
    nextCursor:
      snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1].id
        : null,
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

export async function trashDuplicateDriveFiles({
  ownerUid,
  name,
  size,
}: TrashDuplicateDriveFilesParams) {
  const snapshot = await adminDb
    .collection("files")
    .where("ownerUid", "==", ownerUid)
    .where("name", "==", name)
    .where("size", "==", size)
    .where("isTrashed", "==", false)
    .get();

  if (snapshot.empty) {
    return { count: 0, ids: [] as string[] };
  }

  const ids: string[] = [];

  for (const docSnap of snapshot.docs) {
    await docSnap.ref.update({
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

type TrashCloudFilesByFileIdsParams = {
  ownerUid: string;
  fileIds: string[];
};

export async function trashCloudFilesByFileIds({
  ownerUid,
  fileIds,
}: TrashCloudFilesByFileIdsParams) {
  return trashCloudFilesByFileIdsRepo({
    ownerUid,
    fileIds,
  });
}
