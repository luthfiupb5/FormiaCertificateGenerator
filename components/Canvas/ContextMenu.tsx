'use client';

import { useEffect, useRef } from 'react';
import { Copy, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onAction: (action: string) => void;
}

export default function ContextMenu({ x, y, onClose, onAction }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        window.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('wheel', onClose); // Close on scroll
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('wheel', onClose);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="fixed z-50 min-w-[160px] bg-neutral-900 border border-white/10 rounded-lg shadow-2xl p-1 animate-in fade-in zoom-in-95 duration-100"
            style={{ left: x, top: y }}
            onContextMenu={(e) => e.preventDefault()}
        >
            <button
                onClick={() => onAction('bringForward')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
                <ArrowUp className="w-4 h-4" />
                <span>Bring Forward</span>
            </button>
            <button
                onClick={() => onAction('sendBackward')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
                <ArrowDown className="w-4 h-4" />
                <span>Send Backward</span>
            </button>
            <div className="h-px bg-white/10 my-1" />
            <button
                onClick={() => onAction('duplicate')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
                <Copy className="w-4 h-4" />
                <span>Duplicate</span>
            </button>
            <div className="h-px bg-white/10 my-1" />
            <button
                onClick={() => onAction('delete')}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
            </button>
        </div>
    );
}
