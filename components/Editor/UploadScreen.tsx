'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { renderPdfToImage } from '@/lib/pdf-helper';
import clsx from 'clsx';

interface UploadScreenProps {
    onTemplateLoaded: (url: string, originalName: string) => void;
}

export default function UploadScreen({ onTemplateLoaded }: UploadScreenProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        try {
            console.log("UploadScreen: Processing file:", file.name, file.type);
            let url = '';

            if (file.type === 'application/pdf') {
                const result = await renderPdfToImage(file);
                url = result.url;
            } else {
                url = URL.createObjectURL(file);
            }

            console.log("UploadScreen: URL generated:", url);
            onTemplateLoaded(url, file.name);
        } catch (e: any) {
            console.error("UploadScreen Error:", e);
            setError(e.message || 'Failed to process file.');
            setIsProcessing(false);
        }
    }, [onTemplateLoaded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        disabled: isProcessing,
        onDropRejected: (fileRejections) => {
            const rejection = fileRejections[0];
            if (rejection) {
                setError(`File rejected: ${rejection.errors[0]?.message}`);
            }
        }
    });

    return (
        <div className="absolute inset-0 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
            <div
                {...getRootProps()}
                className={clsx(
                    "w-full max-w-xl aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300 backdrop-blur-sm",
                    isDragActive ? "border-primary bg-primary/5 scale-105" : "border-border hover:border-primary/50 hover:bg-surface/50",
                    isProcessing && "opacity-50 cursor-wait pointer-events-none",
                    error && "border-red-500/50"
                )}
            >
                <input {...getInputProps()} />

                {isProcessing ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <p className="text-lg font-medium animate-pulse">Processing Template...</p>
                    </div>
                ) : (
                    <>
                        <div className="w-20 h-20 rounded-full bg-surface border border-border flex items-center justify-center shadow-xl shadow-black/20 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-neutral-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold">Upload Certificate</h3>
                            <p className="text-neutral-400">Drag & drop or click to upload</p>
                            <div className="flex gap-2 justify-center mt-2 opacity-60">
                                <span className="px-2 py-0.5 bg-white/5 rounded text-xs">PDF</span>
                                <span className="px-2 py-0.5 bg-white/5 rounded text-xs">PNG</span>
                                <span className="px-2 py-0.5 bg-white/5 rounded text-xs">JPG</span>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-2 bg-red-500/10 text-red-400 text-sm rounded flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}


                    </>
                )}
            </div>
        </div>
    );
}
