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
            // 1. Process Template locally (PDF or Image)
            let templateUrl = '';
            if (templateFile.type === 'application/pdf' || templateFile.name.endsWith('.pdf')) {
                const pdfResult = await renderPdfToImage(templateFile);
                templateUrl = pdfResult.url;
            } else {
                templateUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = (err) => reject(err);
                    reader.readAsDataURL(templateFile);
                });
            }

            // 2. Process CSV / Excel locally (if uploaded)
            let dataRows: any[] = [];
            let dataHeaders: string[] = [];

            if (dataFile) {
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

            const projectId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

            const projectData: NewProjectData = {
                id: projectId,
                name: projectName,
                templateUrl,
                templateOriginalName: templateFile.name,
                dataRows,
                dataHeaders,
            };

            // Save to localStorage for instant recovery
            if (typeof window !== 'undefined') {
                localStorage.setItem('korae_current_project', JSON.stringify({
                    ...projectData,
                    canvasNodes: [],
                    updatedAt: new Date().toISOString()
                }));
            }

            onCreate(projectData);

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Failed to create project.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {/* Header */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">New Project</h2>
                        <p className="text-slate-600 text-sm mt-1">Setup your certificate generation project</p>
                    </div>
                    {/* <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">
                        <X className="w-5 h-5" />
                    </button> */}
                </div>

                <div className="space-y-6 overflow-y-auto pr-2 relative z-10 pb-4">
                    {/* Project Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Project Name</label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="e.g. Workshop Cancellation 2024"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Template Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-violet-400" />
                                Certificate Template
                            </label>
                            <div
                                {...templateDropzone.getRootProps()}
                                className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all h-[180px] text-center
                                    ${templateFile ? 'border-violet-500/50 bg-violet-500/5' : 'border-slate-200 hover:border-white/20 hover:bg-slate-50'}
                                `}
                            >
                                <input {...templateDropzone.getInputProps()} />
                                {templateFile ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{templateFile.name}</p>
                                            <p className="text-xs text-violet-400 mt-1">Ready to upload</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-700">Drop Template</p>
                                            <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Data Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Table className="w-4 h-4 text-emerald-400" />
                                Data File <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                            </label>
                            <div
                                {...dataDropzone.getRootProps()}
                                className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all h-[180px] text-center
                                    ${dataFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-200 hover:border-white/20 hover:bg-slate-50'}
                                `}
                            >
                                <input {...dataDropzone.getInputProps()} />
                                {dataFile ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{dataFile.name}</p>
                                            <p className="text-xs text-emerald-400 mt-1">Ready to parse</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-700">Drop CSV / Excel</p>
                                            <p className="text-xs text-slate-500 mt-1">Auto-mapping enabled</p>
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
                        className="px-6 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium text-sm"
                    >
                        Cancel
                    </button> */}
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="px-8 py-2.5 rounded-full bg-indigo-600 text-slate-900 font-bold text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
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
