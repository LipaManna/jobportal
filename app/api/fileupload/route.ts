import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from "cloudinary"

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const folder = formData.get("folderName") as string;

        if (!file) {
            return NextResponse.json(
                {
                    msg: "File not found",
                    statusCode: 404,
                },
                { status: 404 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder,
        });

        return NextResponse.json(
            {
                msg: "File uploaded successfully!",
                res: uploadResult,
                statusCode: 200,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                msg: error?.message || "Error in fileupload route",
                statusCode: 500,
            },
            { status: 500 }
        );
    }
}
