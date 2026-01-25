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
        <div className="absolute inset-0 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300 overflow-hidden">
            {/* Grid Beam Animation */}
            <div className="absolute inset-0 pointer-events-none bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]"></div>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[50vh] bg-gradient-to-b from-transparent via-violet-500 to-transparent animate-grid-beam opacity-50"></div>
                <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[1px] h-[70vh] bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-grid-beam opacity-30 delay-700"></div>
                <div className="absolute top-0 left-2/3 -translate-x-1/2 w-[1px] h-[60vh] bg-gradient-to-b from-transparent via-violet-500 to-transparent animate-grid-beam opacity-30 delay-1000"></div>
            </div>

            <div
                {...getRootProps()}
                className={clsx(
                    "relative z-10 w-full max-w-xl aspect-video border rounded-3xl flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 backdrop-blur-md overflow-hidden group",
                    isDragActive
                        ? "border-violet-500 bg-violet-500/10 scale-105 shadow-[0_0_50px_rgba(139,92,246,0.3)]"
                        : "border-white/10 bg-[#0A0A0A]/60 hover:border-violet-500/50 hover:bg-[#0A0A0A]/80 hover:shadow-2xl hover:shadow-violet-900/20",
                    isProcessing && "opacity-50 cursor-wait pointer-events-none",
                    error && "border-red-500/50"
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <input {...getInputProps()} />

                {isProcessing ? (
                    <div className="flex flex-col items-center gap-4 relative z-10">
                        <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
                        <p className="text-sm font-medium animate-pulse text-violet-300">Processing Template...</p>
                    </div>
                ) : (
                    <>
                        <div className="relative">
                            <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                            <div className="w-20 h-20 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center shadow-2xl relative z-10 group-hover:scale-110 group-hover:border-violet-500/30 transition-all duration-500">
                                <Upload className="w-8 h-8 text-neutral-500 group-hover:text-violet-400 transition-colors" />
                            </div>
                        </div>

                        <div className="text-center space-y-3 relative z-10">
                            <h3 className="text-3xl font-bold font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">Upload Certificate</h3>
                            <p className="text-neutral-400 text-sm">Drag & drop PDF or Image to start</p>

                            <div className="flex gap-2 justify-center mt-4">
                                {['PDF', 'PNG', 'JPG'].map(ext => (
                                    <span key={ext} className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] font-bold text-neutral-500 group-hover:border-white/10 group-hover:text-neutral-400 transition-colors">
                                        {ext}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {error}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
