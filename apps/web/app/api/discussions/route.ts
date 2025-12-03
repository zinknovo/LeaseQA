import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {DiscussionModel} from "@/lib/models/Discussion";

export async function POST(request: Request) {
    await connectToDatabase();
    const payload = await request.json();
    const created = await DiscussionModel.create(payload);
    return NextResponse.json({data: created}, {status: 201});
}
