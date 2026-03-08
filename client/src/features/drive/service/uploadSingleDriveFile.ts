import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { createCloudFileMeta } from "@/features/cloud/api/cloudFilesApi";
import { detectDriveFileKind } from "../utils/detectDriveFileKind";

type Params = {
  file: File;
  ownerUid: string;
  onProgress?: (progress: number) => void;
};

export function uploadSingleDriveFile({ file, ownerUid, onProgress }: Params) {
  return new Promise<{ fileId: string; path: string }>((resolve, reject) => {
    const path = `uploads/${ownerUid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(Math.round(progress));
      },
      (err) => {
        console.error("[uploadSingleDriveFile] firebase upload failed", err);
        reject(err);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const newFileRef = doc(collection(db, "files"));

          await setDoc(newFileRef, {
            ownerUid,
            name: file.name,
            size: file.size,
            path,
            downloadURL,
            contentType: file.type,
            createdAt: serverTimestamp(),
            isTrashed: false,
          });

          const bucket = storage.app.options.storageBucket || "unknown-bucket";
          const kind = detectDriveFileKind(file);

          await createCloudFileMeta({
            fileId: newFileRef.id,
            ownerUid,
            allowedUserUids: [ownerUid],

            provider: "firebase",
            projectKey: "firebase-old",
            bucket,
            path,
            storageKey: `firebase|${bucket}|${path}`,

            originalName: file.name,
            mimeType: file.type || "application/octet-stream",
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

          resolve({
            fileId: newFileRef.id,
            path,
          });
        } catch (err) {
          console.error("[uploadSingleDriveFile] final step failed", err);
          reject(err);
        }
      },
    );
  });
}
