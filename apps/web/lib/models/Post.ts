import {type InferSchemaType, model, models, Schema, Types} from "mongoose";

const PostSchema = new Schema(
    {
        authorId: {type: Types.ObjectId, ref: "User", required: true},
        postType: {
            type: String,
            enum: ["question", "note", "poll"],
            default: "question",
        },
        visibility: {
            type: String,
            enum: ["class", "private"],
            default: "class",
        },
        folders: {type: [String], default: [], index: true},
        summary: {type: String, required: true, maxlength: 120},
        details: {type: String, required: true},
        urgency: {type: String, enum: ["low", "medium", "high"], default: "low"},
        fromAIReview: {type: Types.ObjectId, ref: "AIReview"},
        viewCount: {type: Number, default: 0},
        isPinned: {type: Boolean, default: false},
        status: {type: String, enum: ["open", "resolved"], default: "open"},
    },
    {timestamps: true},
);

export type PostDocument = InferSchemaType<typeof PostSchema>;

export const PostModel = models.Post || model("Post", PostSchema);
