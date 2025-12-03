import {type InferSchemaType, model, models, Schema, Types} from "mongoose";

const AIReviewSchema = new Schema(
    {
        userId: {type: Types.ObjectId, ref: "User", required: false, index: true},
        contractType: {type: String},
        contractText: {type: String, required: true},
        contractFileUrl: {type: String},
        aiResponse: {
            summary: {type: String, required: true},
            highRisk: {type: [String], default: []},
            mediumRisk: {type: [String], default: []},
            lowRisk: {type: [String], default: []},
            recommendations: {type: [String], default: []},
        },
        relatedPostId: {type: Types.ObjectId, ref: "Post"},
    },
    {timestamps: true},
);

export type AIReviewDocument = InferSchemaType<typeof AIReviewSchema>;

export const AIReviewModel = models.AIReview || model("AIReview", AIReviewSchema);
