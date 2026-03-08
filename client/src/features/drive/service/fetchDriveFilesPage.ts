import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type DriveFile = {
  id: string;
  name: string;
  size: number;
  path: string;
  downloadURL: string;
  contentType?: string;
  createdAt?: { seconds: number; nanoseconds: number } | null;
  isTrashed?: boolean;
};

type FetchDriveFilesPageParams = {
  ownerUid: string;
  pageSize?: number;
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null;
};

export async function fetchDriveFilesPage({
  ownerUid,
  pageSize = 10,
  lastVisible = null,
}: FetchDriveFilesPageParams) {
  const baseConstraints = [
    where("ownerUid", "==", ownerUid),
    orderBy("createdAt", "desc"),
    limit(pageSize),
  ];

  const q = lastVisible
    ? query(
        collection(db, "files"),
        where("ownerUid", "==", ownerUid),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(pageSize),
      )
    : query(collection(db, "files"), ...baseConstraints);

  const snapshot = await getDocs(q);

  const items: DriveFile[] = snapshot.docs
    .map((docSnap) => {
      const data = docSnap.data() as any;
      return {
        id: docSnap.id,
        name: data.name,
        size: data.size,
        path: data.path,
        downloadURL: data.downloadURL,
        contentType: data.contentType ?? "",
        createdAt: data.createdAt ?? null,
        isTrashed: data.isTrashed ?? false,
      };
    })
    .filter((f) => !f.isTrashed);

  return {
    items,
    lastVisible:
      snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
    hasMore: snapshot.docs.length === pageSize,
  };
}
