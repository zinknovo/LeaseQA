import {type InferSchemaType, model, models, Schema} from "mongoose";

const FolderSchema = new Schema(
    {
        name: {type: String, required: true, unique: true},
        displayName: {type: String, required: true},
        description: {type: String},
        isDefault: {type: Boolean, default: false},
    },
    {timestamps: true},
);

export type FolderDocument = InferSchemaType<typeof FolderSchema>;

export const FolderModel = models.Folder || model("Folder", FolderSchema);
