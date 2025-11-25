import { NextResponse } from 'next/server';
import { drive } from "@/lib/googleAuth";

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
};

// Supported preview types
const TEXT_TYPES = [
    'text/plain', 'text/html', 'text/css', 'text/javascript', 'text/markdown',
    'application/json', 'application/xml', 'application/javascript',
];

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
const PDF_TYPE = 'application/pdf';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
        return NextResponse.json({ error: 'File ID is required' }, { status: 400, headers: CORS_HEADERS });
    }

    try {
        // Get file metadata
        const fileMetadata = await drive.files.get({
            fileId,
            fields: 'id, name, mimeType, size, webContentLink, thumbnailLink',
        });

        const { name, mimeType, size, webContentLink, thumbnailLink } = fileMetadata.data;

        if (!mimeType) {
            return NextResponse.json({ error: 'Cannot determine file type' }, { status: 400, headers: CORS_HEADERS });
        }

        // Determine preview type
        let previewType: 'text' | 'image' | 'video' | 'audio' | 'pdf' | 'unsupported' = 'unsupported';
        let content: string | null = null;

        if (TEXT_TYPES.some(t => mimeType.startsWith(t)) || mimeType.includes('text/')) {
            previewType = 'text';
            // Fetch text content (limit to 1MB)
            const maxSize = 1024 * 1024;
            if (size && parseInt(size) > maxSize) {
                return NextResponse.json({
                    previewType: 'text',
                    name,
                    mimeType,
                    size,
                    error: 'File too large for preview',
                    canDownload: true,
                    downloadUrl: webContentLink,
                }, { headers: CORS_HEADERS });
            }

            const response = await drive.files.get(
                { fileId, alt: 'media' },
                { responseType: 'text' }
            );
            content = response.data as string;
        } else if (IMAGE_TYPES.includes(mimeType)) {
            previewType = 'image';
        } else if (VIDEO_TYPES.includes(mimeType)) {
            previewType = 'video';
        } else if (AUDIO_TYPES.includes(mimeType)) {
            previewType = 'audio';
        } else if (mimeType === PDF_TYPE) {
            previewType = 'pdf';
        }

        return NextResponse.json({
            previewType,
            name,
            mimeType,
            size,
            content,
            thumbnailLink,
            downloadUrl: webContentLink,
            // For media files, provide direct stream URL
            streamUrl: previewType !== 'text' && previewType !== 'unsupported' 
                ? `/api/drive/stream?fileId=${fileId}` 
                : null,
        }, { headers: CORS_HEADERS });

    } catch (error) {
        console.error('Error previewing file:', error);
        return NextResponse.json({ error: 'Error previewing file' }, { status: 500, headers: CORS_HEADERS });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, { headers: CORS_HEADERS });
}
