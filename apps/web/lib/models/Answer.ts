import {type InferSchemaType, model, models, Schema, Types} from "mongoose";

const AnswerSchema = new Schema(
    {
        postId: {type: Types.ObjectId, ref: "Post", required: true, index: true},
        authorId: {type: Types.ObjectId, ref: "User", required: true},
        answerType: {
            type: String,
            enum: ["lawyer_opinion", "community_answer"],
            default: "community_answer",
        },
        content: {type: String, required: true},
        isAccepted: {type: Boolean, default: false},
    },
    {timestamps: true},
);

export type AnswerDocument = InferSchemaType<typeof AnswerSchema>;

export const AnswerModel = models.Answer || model("Answer", AnswerSchema);
