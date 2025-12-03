import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {AnswerModel} from "@/lib/models/Answer";

export async function POST(request: Request) {
    await connectToDatabase();
    const payload = await request.json();
    // TODO: enforce authorization (lawyer replies must verify role)
    const created = await AnswerModel.create(payload);
    return NextResponse.json({data: created}, {status: 201});
}
