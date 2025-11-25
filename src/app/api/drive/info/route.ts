import { NextResponse } from "next/server";
import Redis from "ioredis";
import { drive } from "@/lib/googleAuth";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Hàm đệ quy để tính tổng dung lượng tất cả file trong thư mục
async function calculateFolderSize(folderId: string): Promise<number> {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "files(id, mimeType, size)",
      pageSize: 1000,
    });

    let totalSize = 0;
    const files = response.data.files || [];

    for (const file of files) {
      if (file.mimeType === "application/vnd.google-apps.folder") {
        // Nếu là thư mục, đệ quy tính dung lượng
        if (file.id) {
          totalSize += await calculateFolderSize(file.id);
        }
      } else {
        // Nếu là file, cộng dung lượng
        totalSize += Number(file.size || 0);
      }
    }

    return totalSize;
  } catch (error) {
    console.error("Error calculating folder size:", error);
    return 0;
  }
}

export async function GET() {
  try {
    // Tạo cache key cho thông tin drive
    const cacheKey = "drive_info";

    // Kiểm tra cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData), {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          "X-Cache": "HIT",
        },
      });
    }

    // Lấy root folder ID từ env
    const rootFolderId =
      process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID ||
      "1YAMjIdiDdhc5cjR7etXIpNoPW26TV1Yf";

    // Tính tổng dung lượng đã sử dụng trong thư mục root
    const usedStorage = await calculateFolderSize(rootFolderId);

    // Giả sử giới hạn là 15GB (có thể cấu hình qua env)
    const storageLimit = Number(
      process.env.STORAGE_LIMIT_BYTES || 15 * 1024 * 1024 * 1024
    ); // 15GB

    const result = {
      total: storageLimit,
      used: usedStorage,
      remaining: storageLimit - usedStorage,
    };

    // Lưu vào cache trong 5 phút
    await redis.setex(cacheKey, 300, JSON.stringify(result));

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Drive info error:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy thông tin drive" },
      { status: 500 }
    );
  }
}
