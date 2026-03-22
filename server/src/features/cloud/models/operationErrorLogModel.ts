import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const operationErrorLogSchema = new Schema(
  {
    ownerUid: { type: String, default: null },

    action: {
      type: String,
      required: true,
      enum: [
        "UPLOAD_FILE",
        "DOWNLOAD_FILE",
        "DELETE_FILE",
        "RESTORE_FILE",
        "MOVE_FILE",
        "RENAME_FILE",
        "SYNC_FILE",
        "UNKNOWN_ACTION",
        "LIST_FILES",
      ],
    },

    resourceType: {
      type: String,
      default: "file",
      enum: ["file", "folder", "unknown"],
    },

    route: { type: String, required: true },
    method: { type: String, default: "POST" },

    code: { type: String, required: true },
    message: { type: String, required: true },

    rawMessage: { type: String, default: "" },
    stack: { type: String, default: "" },

    provider: {
      type: String,
      default: "unknown",
      enum: ["firebase", "supabase", "mongodb", "server", "client", "unknown"],
    },

    fileId: { type: String, default: "" },
    fileName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    fileSize: { type: Number, default: 0 },

    bucket: { type: String, default: "" },
    path: { type: String, default: "" },

    statusCode: { type: Number, default: 500 },
    requestId: { type: String, default: "" },

    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "operation_error_logs",
  },
);

export const OperationErrorLogModel =
  models.OperationErrorLog ||
  model("OperationErrorLog", operationErrorLogSchema);
