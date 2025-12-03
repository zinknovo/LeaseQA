import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {PostModel} from "@/lib/models/Post";

export async function GET() {
    await connectToDatabase();
    // TODO: replace with real filtering and pagination logic
    const posts = await PostModel.find().sort({createdAt: -1}).limit(20);
    return NextResponse.json({data: posts});
}

export async function POST(request: Request) {
    await connectToDatabase();
    const payload = await request.json();

    // TODO: add authentication and payload validation
    const created = await PostModel.create(payload);
    return NextResponse.json({data: created}, {status: 201});
}
