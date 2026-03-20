import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cloudFileSchema = new Schema(
  {
    fileId: { type: String, required: true, unique: true, index: true },
    ownerUid: { type: String, default: null },
    allowedUserUids: { type: [String], default: [] },

    provider: { type: String, default: "firebase" },
    projectKey: { type: String, default: "" },
    bucket: { type: String, default: "" },
    path: { type: String, required: true, index: true },
    storageKey: { type: String, default: "" },

    originalName: { type: String, required: true },
    mimeType: { type: String, default: "application/octet-stream" },
    size: { type: Number, default: 0 },
    kind: {
      type: String,
      enum: ["image", "video", "audio", "pdf", "file"],
      default: "file",
    },

    title: { type: String, default: "" },
    seriesTitle: { type: String, default: "" },
    episodeNumber: { type: Number, default: null },
    contentType: { type: String, default: "file" },
    isPlayable: { type: Boolean, default: false },
    displayOrder: { type: Number, default: null },
    memo: { type: String, default: "" },
    tags: { type: [String], default: [] },

    status: {
      type: String,
      enum: ["ready", "trashed"],
      default: "ready",
    },
    metadataStatus: {
      type: String,
      enum: ["temp", "complete"],
      default: "complete",
    },
    migrationState: { type: String, default: "not_required" },
    source: {
      type: String,
      enum: ["firebase-storage-temp", "firebase-storage", "new-upload"],
      default: "new-upload",
    },
    sourceFileRef: { type: String, default: "" },

    downloadURL: { type: String, default: null },

    isTrashed: { type: Boolean, default: false },
    trashedAt: { type: Date, default: null },

    syncedAt: { type: Date, default: null },
    createdAtStorage: { type: Date, default: null },
    updatedAtStorage: { type: Date, default: null },

    name: { type: String, required: false, default: "" },
    url: { type: String, required: false, default: null },
    createdAt: { type: Date },
    userId: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

export const CloudFileModel =
  mongoose.models.CloudFile ||
  model("CloudFile", cloudFileSchema, "cloud_files");
