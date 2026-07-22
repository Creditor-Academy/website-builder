import React, { useState, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, TriangleAlert, ArrowUpFromLine, RefreshCcw } from 'lucide-react';
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface DuplicateAssetDialogProps {
    file: File | null;
    conflictingName: string;
    onReplace: (file: File) => void;
    onRename: (file: File, newName: string) => void;
    onCancel: () => void;
}

function baseName(f: string) {
    const i = f.lastIndexOf('.');
    return i > 0 ? f.slice(0, i) : f;
}
function ext(f: string) {
    const i = f.lastIndexOf('.');
    return i > 0 ? f.slice(i) : '';
}

export function DuplicateAssetDialog({
    file,
    conflictingName,
    onReplace,
    onRename,
    onCancel,
}: DuplicateAssetDialogProps) {
    const [newName, setNewName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (file) { setNewName(baseName(file.name)); setError(''); }
    }, [file]);

    const handleUploadNew = () => {
        const trimmed = newName.trim();
        if (!trimmed) { setError('Name cannot be empty.'); return; }
        if (trimmed.toLowerCase() === baseName(conflictingName).toLowerCase()) {
            setError('Please choose a different name than the existing file.');
            return;
        }
        if (file) onRename(file, trimmed + ext(file.name));
    };

    const fileExt = file ? ext(file.name) : '';

    return (
        <Dialog open={!!file} onOpenChange={(o) => { if (!o) onCancel(); }}>
            <DialogPortal>
                <DialogOverlay />
                <DialogPrimitive.Content
                    className={cn(
                        "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
                        "p-0 gap-0 border-0 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] rounded-2xl overflow-hidden",
                        "w-[420px] max-w-[calc(100vw-32px)] bg-white",
                        "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
                        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
                    )}
                >

                {/* ── Header ─────────────────────────────── */}
                <div className="flex items-start justify-between px-6 pt-6 pb-5">
                    <div className="flex items-center gap-3">
                        {/* icon */}
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                            <TriangleAlert className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-bold text-slate-900 leading-tight">Duplicate file name</h2>
                            <p className="text-[13px] text-slate-500 mt-0.5 leading-snug">
                                <span className="font-semibold text-slate-700">"{conflictingName}"</span> already exists
                            </p>
                        </div>
                    </div>
                    {/* close */}
                    <button
                        onClick={onCancel}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all shrink-0 ml-2 mt-0.5"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Divider ─────────────────────────────── */}
                <div className="h-px bg-slate-100 mx-6" />

                {/* ── Body ────────────────────────────────── */}
                <div className="px-6 pt-5 pb-6 space-y-4">

                    {/* context hint */}
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                        Choose to <span className="font-semibold text-slate-700">upload with a new name</span> to keep both files, or <span className="font-semibold text-slate-700">replace</span> the existing one.
                    </p>

                    {/* rename input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                            New file name
                        </label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    value={newName}
                                    onChange={(e) => { setNewName(e.target.value); setError(''); }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUploadNew()}
                                    placeholder="Enter a name…"
                                    className={`h-10 text-sm rounded-xl border-2 bg-slate-50 focus-visible:ring-0 focus-visible:bg-white transition-all outline-none px-3 ${
                                        error
                                            ? 'border-red-400 bg-red-50'
                                            : 'border-slate-200 focus:border-slate-400'
                                    }`}
                                />
                            </div>
                            {fileExt && (
                                <div className="h-10 px-3 flex items-center rounded-xl border-2 border-slate-200 bg-slate-100 text-[12px] font-mono font-semibold text-slate-500 shrink-0">
                                    {fileExt}
                                </div>
                            )}
                        </div>
                        {error && (
                            <p className="text-[12px] text-red-500 font-medium">{error}</p>
                        )}
                    </div>

                    {/* actions */}
                    <div className="flex flex-col gap-2 pt-1">
                        {/* primary */}
                        <button
                            onClick={handleUploadNew}
                            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-[13px] font-semibold transition-all active:scale-[0.98] shadow-sm"
                        >
                            <ArrowUpFromLine className="w-4 h-4" />
                            Upload as new file
                        </button>

                        {/* secondary */}
                        <button
                            onClick={() => file && onReplace(file)}
                            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-[13px] font-semibold transition-all active:scale-[0.98]"
                        >
                            <RefreshCcw className="w-3.5 h-3.5 text-slate-500" />
                            Replace existing file
                        </button>

                        {/* ghost cancel */}
                        <button
                            onClick={onCancel}
                            className="w-full h-9 text-[12px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

            </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}
