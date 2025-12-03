import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {PostModel} from "@/lib/models/Post";
import {AnswerModel} from "@/lib/models/Answer";
import {UserModel} from "@/lib/models/User";

export async function GET() {
    await connectToDatabase();

    // TODO: replace with aggregation pipeline for real stats
    const [totalPosts, lawyerResponses, tenantResponses, enrolledUsers] = await Promise.all([
        PostModel.countDocuments(),
        AnswerModel.countDocuments({answerType: "lawyer_opinion"}),
        AnswerModel.countDocuments({answerType: "community_answer"}),
        UserModel.countDocuments(),
    ]);

    return NextResponse.json({
        data: {
            unreadPosts: 0,
            unansweredPosts: 0,
            totalPosts,
            lawyerResponses,
            tenantResponses,
            enrolledUsers,
        },
    });
}
