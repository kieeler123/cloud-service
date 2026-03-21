// src/models/cloudFile.model.ts
import { Schema, model, InferSchemaType } from "mongoose";

const CloudFileSchema = new Schema(
  {
    fileId: { type: String, required: true, unique: true, index: true },

    ownerUid: { type: String, default: null },
    userId: { type: String, default: null },
    allowedUserUids: { type: [String], default: [] },

    provider: { type: String, default: "firebase" },
    projectKey: { type: String },
    bucket: { type: String },
    path: { type: String, required: false, index: true },
    storageKey: { type: String },

    originalName: { type: String, required: true },
    name: { type: String },

    mimeType: { type: String, required: true },
    contentType: { type: String },

    size: { type: Number, required: true, default: 0 },
    kind: {
      type: String,
      enum: ["image", "video", "audio", "pdf", "file"],
      required: true,
      default: "file",
    },

    title: { type: String },
    seriesTitle: { type: String },
    episodeNumber: { type: Number, default: null },
    isPlayable: { type: Boolean, default: false },
    displayOrder: { type: Number, default: null, index: true },
    memo: { type: String },
    tags: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["ready", "trashed"],
      required: true,
      default: "ready",
      index: true,
    },
    metadataStatus: {
      type: String,
      enum: ["temp", "complete"],
      required: true,
      default: "temp",
      index: true,
    },
    migrationState: { type: String, default: "migrated-from-firestore" },
    source: {
      type: String,
      enum: ["firebase-storage-temp", "firebase-storage", "new-upload"],
      required: true,
      default: "firebase-storage",
      index: true,
    },
    sourceFileRef: { type: String },

    downloadURL: { type: String, default: null },
    url: { type: String, default: null },

    isTrashed: { type: Boolean, required: true, default: false, index: true },
    trashedAt: { type: Date, default: null },

    createdAtStorage: { type: Date, default: null, index: true },
    updatedAtStorage: { type: Date, default: null },
    syncedAt: { type: Date, default: null },

    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, required: true, default: () => new Date() },
  },
  {
    versionKey: false,
    collection: "cloud_files",
  },
);

CloudFileSchema.index({ source: 1, metadataStatus: 1, createdAtStorage: 1 });
CloudFileSchema.index({ status: 1, isTrashed: 1, createdAtStorage: 1 });

export type CloudFileMongoDoc = InferSchemaType<typeof CloudFileSchema>;
export const CloudFileModel = model("CloudFile", CloudFileSchema);
