'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileSpreadsheet, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface DataUploaderProps {
    onDataLoaded: (headers: string[], rows: any[]) => void;
    onClose: () => void;
}

export default function DataUploader({ onDataLoaded, onClose }: DataUploaderProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processFile = async (file: File) => {
        setIsProcessing(true);
        setError(null);

        try {
            if (file.name.endsWith('.csv')) {
                Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.meta.fields) {
                            onDataLoaded(results.meta.fields, results.data);
                        } else {
                            setError('Could not parse CSV headers.');
                        }
                        setIsProcessing(false);
                    },
                    error: (err) => {
                        setError(err.message);
                        setIsProcessing(false);
                    }
                });
            } else {
                // Excel
                const buffer = await file.arrayBuffer();
                const workbook = XLSX.read(buffer, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (jsonData.length > 0) {
                    const headers = jsonData[0] as string[];
                    const rows = XLSX.utils.sheet_to_json(sheet); // parsed objects
                    onDataLoaded(headers, rows as any[]);
                } else {
                    setError('Excel file appears empty.');
                }
                setIsProcessing(false);
            }
        } catch (e) {
            console.error(e);
            setError('Failed to process file.');
            setIsProcessing(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg glass-panel bg-[#1a1a1a] rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-white/10 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center border border-green-500/30">
                        <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-lg font-bold text-white">Upload Data</h2>
                        <p className="text-sm text-neutral-400">Import CSV or Excel to auto-fill certificates</p>
                    </div>
                </div>

                <div
                    {...getRootProps()}
                    className={clsx(
                        "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer",
                        isDragActive ? "border-green-500 bg-green-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5",
                        error ? "border-red-500/50" : ""
                    )}
                >
                    <input {...getInputProps()} />
                    {isProcessing ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-neutral-400">Parsing file...</p>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-neutral-500" />
                            <div className="text-center">
                                <p className="font-medium text-neutral-300">Click to upload or drag and drop</p>
                                <p className="text-xs text-neutral-500 mt-1">CSV, XLSX, XLS</p>
                            </div>
                        </>
                    )}
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
