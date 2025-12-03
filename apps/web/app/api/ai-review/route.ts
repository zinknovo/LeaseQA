import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {AIReviewModel} from "@/lib/models/AIReview";

export const runtime = "nodejs";

export async function POST(request: Request) {
    await connectToDatabase();
    const formData = await request.formData();
    // TODO: parse file/text payload and invoke the Claude API
    const contractText = String(formData.get("contractText") ?? "");

    const created = await AIReviewModel.create({
        userId: null,
        contractText,
        aiResponse: {
            summary: "Placeholder summary",
            highRisk: ["Example high-risk clause"],
            mediumRisk: [],
            lowRisk: [],
            recommendations: ["Consult an attorney for confirmation"],
        },
    });

    return NextResponse.json({data: created}, {status: 201});
}
