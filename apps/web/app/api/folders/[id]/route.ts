import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {FolderModel} from "@/lib/models/Folder";

export async function PUT(request: Request, {params}: { params: { id: string } }) {
    await connectToDatabase();
    const payload = await request.json();
    const updated = await FolderModel.findByIdAndUpdate(params.id, payload, {new: true});
    return NextResponse.json({data: updated});
}

export async function DELETE(_request: Request, {params}: { params: { id: string } }) {
    await connectToDatabase();
    await FolderModel.findByIdAndDelete(params.id);
    return NextResponse.json({}, {status: 204});
}
