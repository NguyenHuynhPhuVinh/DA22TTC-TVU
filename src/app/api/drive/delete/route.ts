import { NextResponse } from 'next/server';
import Redis from 'ioredis';
import { drive } from "@/lib/googleAuth";

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const fileId = searchParams.get('fileId');

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            );
        }

        // Xóa file vĩnh viễn
        await drive.files.delete({
            fileId: fileId,
        });

        // Xóa cache liên quan
        const keys = await redis.keys('drive_files:*');
        if (keys.length > 0) {
            await redis.del(keys);
        }

        return NextResponse.json(
            { message: 'File deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json(
            { error: 'Error deleting file' },
            { status: 500 }
        );
    }
} 