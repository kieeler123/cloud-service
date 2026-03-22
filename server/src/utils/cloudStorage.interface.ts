import {
  UploadCloudFileParams,
  UploadCloudFileResult,
} from "../types/cloudStorage.types.js";

export interface CloudStorageService {
  uploadCloudFile(
    params: UploadCloudFileParams,
  ): Promise<UploadCloudFileResult>;

  findTrashFilesByOwnerUid(ownerUid: string): Promise<any[]>;

  restoreCloudFileById(params: {
    ownerUid: string;
    fileId: string;
  }): Promise<void>;

  deleteCloudFileForeverById(params: {
    ownerUid: string;
    fileId: string;
  }): Promise<void>;
}
