import { NextResponse } from 'next/server';
import { drive } from "@/lib/googleAuth";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
        return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    try {
        // Get file metadata first
        const fileMetadata = await drive.files.get({
            fileId,
            fields: 'mimeType, name',
        });

        const mimeType = fileMetadata.data.mimeType || 'application/octet-stream';

        // Stream the file content
        const response = await drive.files.get(
            { fileId, alt: 'media' },
            { responseType: 'stream' }
        );

        // Convert stream to buffer
        const chunks: Uint8Array[] = [];
        for await (const chunk of response.data as AsyncIterable<Uint8Array>) {
            chunks.push(chunk);
        }
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const buffer = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            buffer.set(chunk, offset);
            offset += chunk.length;
        }

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `inline; filename="${fileMetadata.data.name}"`,
                'Cache-Control': 'public, max-age=3600',
            },
        });

    } catch (error) {
        console.error('Error streaming file:', error);
        return NextResponse.json({ error: 'Error streaming file' }, { status: 500 });
    }
}
