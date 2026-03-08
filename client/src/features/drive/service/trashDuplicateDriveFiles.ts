import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Params = {
  ownerUid: string;
  name: string;
  size: number;
};

export async function trashDuplicateDriveFiles({
  ownerUid,
  name,
  size,
}: Params) {
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
