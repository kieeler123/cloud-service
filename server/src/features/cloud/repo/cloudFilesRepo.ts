import { getMongoDb } from "@/app/config/mongodb.js";
import { CloudFile } from "../model/cloudFile.types.js";

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
