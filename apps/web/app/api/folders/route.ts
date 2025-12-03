import {NextResponse} from "next/server";
import {connectToDatabase} from "@/lib/db";
import {FolderModel} from "@/lib/models/Folder";

export async function GET() {
    await connectToDatabase();
    const folders = await FolderModel.find().sort({isDefault: -1, displayName: 1});
    return NextResponse.json({data: folders});
}

export async function POST(request: Request) {
    await connectToDatabase();
    const payload = await request.json();
    const created = await FolderModel.create(payload);
    return NextResponse.json({data: created}, {status: 201});
}
