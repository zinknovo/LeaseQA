import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {PostModel} from "@/lib/models/Post";

export async function GET(_request: Request, {params}: { params: { id: string } }) {
    await connectToDatabase();
    const post = await PostModel.findById(params.id);
    if (!post) {
        return NextResponse.json({error: "NOT_FOUND"}, {status: 404});
    }
    return NextResponse.json({data: post});
}

export async function PUT(request: Request, {params}: { params: { id: string } }) {
    await connectToDatabase();
    const payload = await request.json();
    const updated = await PostModel.findByIdAndUpdate(params.id, payload, {new: true});
    return NextResponse.json({data: updated});
}

export async function DELETE(_request: Request, {params}: { params: { id: string } }) {
    await connectToDatabase();
    await PostModel.findByIdAndDelete(params.id);
    return NextResponse.json({}, {status: 204});
}
