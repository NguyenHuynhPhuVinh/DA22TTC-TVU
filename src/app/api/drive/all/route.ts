import { NextResponse } from 'next/server';
import Redis from 'ioredis';
import { drive } from "@/lib/googleAuth";

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function GET() {
    try {
        const response = await drive.files.list({
            pageSize: 1000,
            fields: 'files(id, name, mimeType, size, createdTime, parents)',
            q: "trashed = false",
        });

        return NextResponse.json({ files: response.data.files || [] });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả files:', error);
        return NextResponse.json({ error: 'Không thể lấy danh sách files' }, { status: 500 });
    }
} 