import { NextRequest, NextResponse } from 'next/server';
import { r2 } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'uploads';
        const projectId = formData.get('projectId') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Get user from Supabase
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `${folder}/${user.id}/${timestamp}_${sanitizedFileName}`;

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to R2
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        });

        await r2.send(command);

        // Generate public URL (if R2 bucket has public access enabled)
        // Or use a custom domain if you have one configured
        const publicUrl = `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`;

        // If you have a custom domain, use this instead:
        // const publicUrl = `https://your-custom-domain.com/${key}`;

        return NextResponse.json({
            url: publicUrl,
            key,
            filename: file.name
        });

    } catch (error: any) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
