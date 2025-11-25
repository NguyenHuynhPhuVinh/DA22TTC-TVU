import { NextResponse } from "next/server";
import Redis from "ioredis";
import { drive } from "@/lib/googleAuth";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function POST(request: Request) {
  const { name, parentId } = await request.json();
  try {
    const rootFolderId =
      process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID ||
      "1YAMjIdiDdhc5cjR7etXIpNoPW26TV1Yf";
    const fileMetadata = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId || rootFolderId],
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
      supportsAllDrives: true,
    });

    // Xác định key chính xác của thư mục cha
    const parentKey = parentId
      ? `drive_files:${parentId}_`
      : "drive_files:root_";

    // Xóa cache
    const deleteResult = await redis.del(parentKey);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Create folder error:", error);
    return NextResponse.json({ error: "Lỗi khi tạo thư mục" }, { status: 500 });
  }
}
