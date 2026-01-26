import { NextRequest, NextResponse } from 'next/server';
import { r2 } from '@/lib/r2';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(request: NextRequest) {
    try {
        const { filename, contentType, folder } = await request.json();

        if (!filename || !contentType) {
            return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 });
        }

        const key = folder ? `${folder}/${filename}` : filename;

        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

        return NextResponse.json({ uploadUrl, key });
    } catch (error: any) {
        console.error('Error generating upload URL:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json({ error: 'Missing key' }, { status: 400 });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        });

        const url = await getSignedUrl(r2, command, { expiresIn: 3600 }); // 1 hour validity

        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Error generating download URL:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
