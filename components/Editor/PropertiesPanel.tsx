'use client';

import React from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  X, 
  ChevronDown, 
  Database, 
  Layers, 
  Copy, 
  Trash2, 
  SlidersHorizontal,
  Square,
  Circle,
  Type
} from 'lucide-react';
import { useCanvasStore } from '@/lib/store';
import { GOOGLE_FONTS } from '@/lib/fonts';
import clsx from 'clsx';

interface PropertiesPanelProps {
  dataHeaders: string[];
}

export default function PropertiesPanel({ dataHeaders }: PropertiesPanelProps) {
  const { 
    nodes, 
    selectedNodeId, 
    selectedNodeIds, 
    selectNode, 
    updateNode, 
    removeNode, 
    duplicateNode, 
    moveNodeLayer, 
    alignNodes 
  } = useCanvasStore();

  const selectedNodes = nodes.filter(n => (selectedNodeIds.includes(n.id) || selectedNodeId === n.id) && n.id !== 'background-template');

  if (selectedNodes.length === 0) return null;

  const primaryNode = selectedNodes[selectedNodes.length - 1];
  const isMultiSelect = selectedNodes.length > 1;

  const handleUpdate = (key: string, value: any) => {
    selectedNodes.forEach(node => {
      updateNode(node.id, { [key]: value });
    });
  };

  return (
    <div className="absolute top-20 right-6 w-80 animate-in slide-in-from-right-10 fade-in duration-300 z-20 pointer-events-auto shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200 ring-1 ring-slate-200/50">
      {/* ── PANEL HEADER ── */}
      <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
            {isMultiSelect ? `${selectedNodes.length} Layers Selected` : primaryNode.type.toUpperCase() + ' PROPERTIES'}
          </h3>
        </div>
        <button 
          onClick={() => selectNode(null)} 
          className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5 max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
        {/* ── 1. ALIGNMENT TOOLS (3 Horizontal + 3 Vertical) ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
              Align {isMultiSelect ? 'Selection' : 'to Canvas'}
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {/* Horizontal Alignment */}
            <button
              onClick={() => alignNodes('left')}
              className="py-2 rounded-lg flex items-center justify-center hover:bg-white text-slate-600 hover:text-indigo-600 transition-all"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => alignNodes('center')}
              className="py-2 rounded-lg flex items-center justify-center hover:bg-white text-slate-600 hover:text-indigo-600 transition-all"
              title="Align Horizontal Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => alignNodes('right')}
              className="py-2 rounded-lg flex items-center justify-center hover:bg-white text-slate-600 hover:text-indigo-600 transition-all"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            {/* Vertical Alignment Icons (Inline SVG) */}
            <button
              onClick={() => alignNodes('top')}
              className="py-2 rounded-lg flex items-center justify-center hover:bg-white text-slate-600 hover:text-indigo-600 transition-all"
              title="Align Top"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <line x1="4" y1="4" x2="20" y2="4" />
                <rect x="8" y="8" width="8" height="12" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => alignNodes('middle')}
              className="py-2 rounded-lg flex items-center justify-center hover:bg-white text-slate-600 hover:text-indigo-600 transition-all"
              title="Align Vertical Center"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <line x1="4" y1="12" x2="20" y2="12" />
                <rect x="8" y="6" width="8" height="12" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => alignNodes('bottom')}
              className="py-2 rounded-lg flex items-center justify-center hover:bg-white text-slate-600 hover:text-indigo-600 transition-all"
              title="Align Bottom"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <line x1="4" y1="20" x2="20" y2="20" />
                <rect x="8" y="4" width="8" height="12" rx="1" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── 2. DIMENSIONS & POSITION ── */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
            Transform
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] font-bold text-slate-400 font-mono">W</span>
              <input
                type="number"
                value={Math.round(primaryNode.width || 100)}
                onChange={(e) => handleUpdate('width', parseFloat(e.target.value))}
                className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] font-bold text-slate-400 font-mono">H</span>
              <input
                type="number"
                value={Math.round(primaryNode.height || 40)}
                onChange={(e) => handleUpdate('height', parseFloat(e.target.value))}
                className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] font-bold text-slate-400 font-mono">X</span>
              <input
                type="number"
                value={Math.round(primaryNode.x || 0)}
                onChange={(e) => handleUpdate('x', parseFloat(e.target.value))}
                className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="text-[10px] font-bold text-slate-400 font-mono">Y</span>
              <input
                type="number"
                value={Math.round(primaryNode.y || 0)}
                onChange={(e) => handleUpdate('y', parseFloat(e.target.value))}
                className="w-full bg-transparent text-xs font-mono font-bold text-slate-800 outline-none"
              />
            </div>
          </div>
        </div>

        {/* ── 3. SHAPE STYLING (Fill, Stroke, Corner Radius, Opacity) ── */}
        {(primaryNode.type === 'rect' || primaryNode.type === 'circle' || primaryNode.type === 'badge') && (
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
              Appearance
            </span>

            {/* Fill Color */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-medium">Fill Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryNode.fill || '#e2e8f0'}
                  onChange={(e) => handleUpdate('fill', e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                />
                <input
                  type="text"
                  value={primaryNode.fill || '#e2e8f0'}
                  onChange={(e) => handleUpdate('fill', e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono uppercase text-slate-800 outline-none"
                />
              </div>
            </div>

            {/* Stroke Color & Width */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-medium">Stroke Color</label>
                <input
                  type="color"
                  value={primaryNode.stroke || '#000000'}
                  onChange={(e) => handleUpdate('stroke', e.target.value)}
                  className="w-full h-8 rounded-lg cursor-pointer border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-medium">Stroke Width</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={primaryNode.strokeWidth || 0}
                  onChange={(e) => handleUpdate('strokeWidth', parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 outline-none"
                />
              </div>
            </div>

            {/* Corner Radius (for Rectangles) */}
            {primaryNode.type === 'rect' && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-slate-600 font-medium">Corner Radius</label>
                  <span className="text-xs font-mono font-bold text-slate-500">{primaryNode.cornerRadius || 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={primaryNode.cornerRadius || 0}
                  onChange={(e) => handleUpdate('cornerRadius', parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            )}

            {/* Opacity */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-600 font-medium">Opacity</label>
                <span className="text-xs font-mono font-bold text-slate-500">{Math.round((primaryNode.opacity ?? 1) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={primaryNode.opacity ?? 1}
                onChange={(e) => handleUpdate('opacity', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ── 4. TYPOGRAPHY STYLING (for Text Nodes) ── */}
        {primaryNode.type === 'text' && (
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
              Typography
            </span>

            {/* Font Family */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 font-medium">Font Family</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none text-slate-800 font-semibold cursor-pointer"
                value={primaryNode.fontFamily || 'Inter'}
                onChange={(e) => handleUpdate('fontFamily', e.target.value)}
              >
                {GOOGLE_FONTS.map(font => (
                  <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                ))}
              </select>
            </div>

            {/* Size & Color */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-medium">Font Size</label>
                <input
                  type="number"
                  value={primaryNode.fontSize || 24}
                  onChange={(e) => handleUpdate('fontSize', parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-800 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-medium">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryNode.fill || '#000000'}
                    onChange={(e) => handleUpdate('fill', e.target.value)}
                    className="w-full h-8 rounded-lg cursor-pointer border border-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Data Column Mapping */}
            <div className="space-y-1.5">
              <label className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" /> Linked Data Field
              </label>
              <select
                className="w-full bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl px-3 py-2 text-xs font-mono outline-none cursor-pointer"
                value={primaryNode.mappedColumn || ''}
                onChange={(e) => handleUpdate('mappedColumn', e.target.value)}
              >
                <option value="">Static Text (No Field)</option>
                {dataHeaders.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ── 5. LAYER ACTIONS ── */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => duplicateNode(primaryNode.id)}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={() => {
              removeNode(primaryNode.id);
              selectNode(null);
            }}
            className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            title="Delete Layer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
