import {type InferSchemaType, model, models, Schema} from "mongoose";

const LawyerVerificationSchema = new Schema(
    {
        barNumber: {type: String, required: true},
        state: {type: String, required: true},
        verifiedAt: {type: Date},
    },
    {_id: false},
);

const UserSchema = new Schema(
    {
        username: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        hashedPassword: {type: String, required: true},
        role: {
            type: String,
            enum: ["tenant", "lawyer", "admin"],
            default: "tenant",
            required: true,
        },
        lawyerVerification: LawyerVerificationSchema,
    },
    {timestamps: true},
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

export const UserModel = models.User || model("User", UserSchema);
