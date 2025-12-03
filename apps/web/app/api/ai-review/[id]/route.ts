import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {AIReviewModel} from "@/lib/models/AIReview";

export async function GET(_request: Request, {params}: { params: { id: string } }) {
    await connectToDatabase();
    const review = await AIReviewModel.findById(params.id);
    if (!review) {
        return NextResponse.json({error: "NOT_FOUND"}, {status: 404});
    }
    return NextResponse.json({data: review});
}
