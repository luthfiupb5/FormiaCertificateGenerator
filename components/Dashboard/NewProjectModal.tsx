'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Table, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { renderPdfToImage } from '@/lib/pdf-helper';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface NewProjectData {
    id?: string;
    name: string;
    templateUrl: string;
    templateOriginalName: string;
    dataRows: any[];
    dataHeaders: string[];
}

interface NewProjectModalProps {
    onClose: () => void;
    onCreate: (data: NewProjectData) => void;
}

export default function NewProjectModal({ onClose, onCreate }: NewProjectModalProps) {
    const [projectName, setProjectName] = useState('');
    const [templateFile, setTemplateFile] = useState<File | null>(null);
    const [dataFile, setDataFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Template Dropzone
    const onTemplateDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) setTemplateFile(acceptedFiles[0]);
    }, []);

    const templateDropzone = useDropzone({
        onDrop: onTemplateDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg'], 'application/pdf': ['.pdf'] },
        maxFiles: 1,
    });

    // Data Dropzone
    const onDataDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) setDataFile(acceptedFiles[0]);
    }, []);

    const dataDropzone = useDropzone({
        onDrop: onDataDrop,
        accept: { 'text/csv': ['.csv'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
        maxFiles: 1,
    });

    const handleSubmit = async () => {
        if (!projectName.trim()) {
            setError('Please enter a project name.');
            return;
        }
        if (!templateFile) {
            setError('Please upload a certificate template.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // 1. Upload Template to R2
            const templateFormData = new FormData();
            templateFormData.append('file', templateFile);
            templateFormData.append('folder', 'templates');

            const templateUploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: templateFormData,
            });

            if (!templateUploadRes.ok) {
                throw new Error('Failed to upload template');
            }

            const { url: templateUrl } = await templateUploadRes.json();

            // 2. Upload CSV to R2 (if exists)
            let csvUrl = null;
            let dataRows: any[] = [];
            let dataHeaders: string[] = [];

            if (dataFile) {
                const dataFormData = new FormData();
                dataFormData.append('file', dataFile);
                dataFormData.append('folder', 'data');

                const dataUploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: dataFormData,
                });

                if (dataUploadRes.ok) {
                    const { url } = await dataUploadRes.json();
                    csvUrl = url;

                    // Parse CSV/Excel for preview
                    if (dataFile.name.endsWith('.csv')) {
                        await new Promise<void>((resolve, reject) => {
                            Papa.parse(dataFile, {
                                header: true,
                                skipEmptyLines: true,
                                complete: (results) => {
                                    dataRows = results.data;
                                    dataHeaders = results.meta.fields || [];
                                    resolve();
                                },
                                error: (err) => reject(err),
                            });
                        });
                    } else {
                        // Excel
                        const arrayBuffer = await dataFile.arrayBuffer();
                        const workbook = XLSX.read(arrayBuffer);
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        dataRows = XLSX.utils.sheet_to_json(sheet);
                        if (dataRows.length > 0) {
                            dataHeaders = Object.keys(dataRows[0]);
                        }
                    }
                }
            }

            // 3. Save Project to Supabase
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('You must be logged in to create a project');
            }

            const { data: project, error: dbError } = await supabase
                .from('projects')
                .insert({
                    user_id: user.id,
                    name: projectName,
                    template_url: templateUrl,
                    original_file_name: templateFile.name,
                    csv_url: csvUrl,
                    status: 'draft',
                })
                .select()
                .single();

            if (dbError) {
                console.error('Database error:', dbError);
                throw new Error('Failed to save project to database');
            }

            // 4. Return Data to Editor
            onCreate({
                id: project.id,
                name: projectName,
                templateUrl,
                templateOriginalName: templateFile.name,
                dataRows,
                dataHeaders,
            });

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Failed to create project.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">New Project</h2>
                        <p className="text-neutral-400 text-sm mt-1">Setup your certificate generation project</p>
                    </div>
                    {/* <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button> */}
                </div>

                <div className="space-y-6 overflow-y-auto pr-2 relative z-10 pb-4">
                    {/* Project Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Project Name</label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="e.g. Workshop Cancellation 2024"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Template Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-violet-400" />
                                Certificate Template
                            </label>
                            <div
                                {...templateDropzone.getRootProps()}
                                className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all h-[180px] text-center
                                    ${templateFile ? 'border-violet-500/50 bg-violet-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                                `}
                            >
                                <input {...templateDropzone.getInputProps()} />
                                {templateFile ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white truncate max-w-[200px]">{templateFile.name}</p>
                                            <p className="text-xs text-violet-400 mt-1">Ready to upload</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-neutral-300">Drop Template</p>
                                            <p className="text-xs text-neutral-500 mt-1">PDF, PNG, JPG</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Data Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                                <Table className="w-4 h-4 text-emerald-400" />
                                Data File <span className="text-neutral-500 text-xs font-normal">(Optional)</span>
                            </label>
                            <div
                                {...dataDropzone.getRootProps()}
                                className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all h-[180px] text-center
                                    ${dataFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
                                `}
                            >
                                <input {...dataDropzone.getInputProps()} />
                                {dataFile ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white truncate max-w-[200px]">{dataFile.name}</p>
                                            <p className="text-xs text-emerald-400 mt-1">Ready to parse</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-neutral-300">Drop CSV / Excel</p>
                                            <p className="text-xs text-neutral-500 mt-1">Auto-mapping enabled</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in relative z-10">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="flex items-center justify-end gap-3 mt-4 relative z-10">
                    {/* <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-full border border-white/10 text-neutral-300 hover:bg-white/5 transition-colors font-medium text-sm"
                    >
                        Cancel
                    </button> */}
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="px-8 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Project'
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
