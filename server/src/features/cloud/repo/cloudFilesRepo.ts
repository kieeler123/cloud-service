import { CloudFileModel } from "../models/cloudFile.model.js";
import type {
  CloudFileDoc,
  CloudFileInput,
} from "../../../types/cloudFile.types.js";

export async function insertCloudFile(doc: CloudFileInput) {
  return CloudFileModel.create(doc);
}

export async function insertCloudFiles(docs: CloudFileInput[]) {
  if (docs.length === 0) return [];

  try {
    const result = await CloudFileModel.insertMany(docs, { ordered: false });
    console.log("insertMany success count:", result.length);
    return result;
  } catch (error) {
    console.error("insertMany error:", error);
    throw error;
  }
}

export async function findCloudFiles() {
  const allCount = await CloudFileModel.countDocuments({});
  const visibleCount = await CloudFileModel.countDocuments({
    $or: [{ isTrashed: false }, { isTrashed: { $exists: false } }],
  });

  console.log("all cloud_files count:", allCount);
  console.log("visible cloud_files count:", visibleCount);

  return CloudFileModel.find({
    $or: [{ isTrashed: false }, { isTrashed: { $exists: false } }],
  })
    .sort({ createdAt: -1 })
    .lean<CloudFileDoc[]>();
}

export async function findTrashCloudFiles() {
  return CloudFileModel.find({ isTrashed: true })
    .sort({ trashedAt: -1 })
    .lean<CloudFileDoc[]>();
}

export async function findCloudFileByFileId(fileId: string) {
  return CloudFileModel.findOne({ fileId }).lean<CloudFileDoc | null>();
}

export async function findExistingFileIds(fileIds: string[]) {
  const docs = await CloudFileModel.find(
    { fileId: { $in: fileIds } },
    { fileId: 1, _id: 0 },
  ).lean<{ fileId: string }[]>();

  return docs.map((doc) => doc.fileId);
}

type TrashCloudFilesByFileIdsParams = {
  ownerUid: string;
  fileIds: string[];
};

export async function trashCloudFilesByFileIds({
  ownerUid,
  fileIds,
}: TrashCloudFilesByFileIdsParams) {
  if (!ownerUid) {
    throw new Error("UNAUTHORIZED");
  }

  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    throw new Error("INVALID_FILE_IDS");
  }

  // 예시:
  // ownerUid 소유 파일만 isTrashed: true 처리

  return {
    modifiedCount: fileIds.length,
  };
}

export async function restoreCloudFileByFileId(fileId: string) {
  return CloudFileModel.updateOne(
    { fileId },
    {
      $set: {
        isTrashed: false,
        status: "ready",
        updatedAt: new Date(),
      },
      $unset: {
        trashedAt: 1,
      },
    },
  );
}

export async function deleteCloudFileForeverByFileId(fileId: string) {
  return CloudFileModel.deleteOne({ fileId });
}

export async function insertManyIgnoreDuplicate(files: CloudFileInput[]) {
  const results = {
    insertedCount: 0,
  };

  for (const file of files) {
    try {
      await CloudFileModel.updateOne(
        { path: file.path }, // 🔥 중복 기준 OK
        { $setOnInsert: file },
        { upsert: true },
      );

      results.insertedCount++;
    } catch (e) {
      console.warn("insert 실패:", file.path);
    }
  }

  return results;
}
