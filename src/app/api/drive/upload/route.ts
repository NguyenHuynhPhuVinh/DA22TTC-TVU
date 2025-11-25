import { NextResponse } from "next/server";
import Redis from "ioredis";
import { drive } from "@/lib/googleAuth";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const parentId = formData.get("parentId") as string;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const rootFolderId =
      process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID ||
      "1YAMjIdiDdhc5cjR7etXIpNoPW26TV1Yf";
    const fileMetadata = {
      name: file.name,
      parents: [parentId || rootFolderId],
    };

    const media = {
      mimeType: file.type,
      body: require("stream").Readable.from(buffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
      supportsAllDrives: true,
    });

    // Xóa cache của thư mục cha
    const parentKey = parentId
      ? `drive_files:${parentId}_`
      : "drive_files:root_";

    const deleteResult = await redis.del(parentKey);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Lỗi khi tải file lên" },
      { status: 500 }
    );
  }
}
