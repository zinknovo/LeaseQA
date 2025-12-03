import {type InferSchemaType, model, models, Schema, Types} from "mongoose";

const DiscussionSchema = new Schema(
    {
        postId: {type: Types.ObjectId, ref: "Post", required: true, index: true},
        parentId: {type: Types.ObjectId, ref: "Discussion", default: null},
        authorId: {type: Types.ObjectId, ref: "User", required: true},
        content: {type: String, required: true},
        isResolved: {type: Boolean, default: false},
    },
    {timestamps: true},
);

DiscussionSchema.index({postId: 1, parentId: 1});

export type DiscussionDocument = InferSchemaType<typeof DiscussionSchema>;

export const DiscussionModel = models.Discussion || model("Discussion", DiscussionSchema);
