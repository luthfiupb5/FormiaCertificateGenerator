'use client';

import React, { useState } from 'react';
import { 
  Type, 
  Shapes, 
  Database, 
  Layers, 
  Plus, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Square, 
  Circle, 
  Upload, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Trash2 
} from 'lucide-react';
import { useCanvasStore, CanvasNode } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

interface SidebarPanelProps {
  dataHeaders: string[];
  dataRows: any[];
  mappedColumns: Record<string, boolean>;
  onOpenDataUploader: () => void;
}

export default function SidebarPanel({
  dataHeaders,
  dataRows,
  mappedColumns,
  onOpenDataUploader,
}: SidebarPanelProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'elements' | 'layers' | 'data'>('text');
  const { 
    nodes, 
    addNode, 
    selectNode, 
    selectedNodeId, 
    selectedNodeIds, 
    toggleSelectNode, 
    updateNode, 
    removeNode, 
    duplicateNode, 
    moveNodeLayer 
  } = useCanvasStore();

  const handleAddTextNode = (text: string, fontSize: number = 36, mappedColumn: string = '') => {
    const id = uuidv4();
    addNode({
      id,
      type: 'text',
      x: 350,
      y: 250,
      text: mappedColumn ? `{${mappedColumn}}` : text,
      fontSize,
      fontFamily: 'Inter',
      fill: '#1e293b',
      width: 400,
      align: 'center',
      mappedColumn,
    });
    selectNode(id);
  };

  const handleAddShapeNode = (type: 'rect' | 'circle' | 'line' | 'star' | 'badge') => {
    const id = uuidv4();
    if (type === 'rect') {
      addNode({
        id,
        type: 'rect',
        x: 300,
        y: 200,
        width: 250,
        height: 120,
        fill: '#f1f5f9',
        stroke: '#94a3b8',
        strokeWidth: 2,
        cornerRadius: 8,
      });
    } else if (type === 'circle') {
      addNode({
        id,
        type: 'circle',
        x: 400,
        y: 250,
        width: 120,
        height: 120,
        fill: '#e2e8f0',
        stroke: '#64748b',
        strokeWidth: 2,
      });
    } else if (type === 'badge') {
      addNode({
        id,
        type: 'badge',
        x: 400,
        y: 200,
        width: 90,
        height: 90,
        fill: '#d97706',
      });
    }
    selectNode(id);
  };

  const getNodeLabel = (node: CanvasNode) => {
    if (node.id === 'background-template') return 'Template Background';
    if (node.mappedColumn) return `Field: {${node.mappedColumn}}`;
    if (node.type === 'text') return node.text ? `Text: "${node.text.slice(0, 18)}..."` : 'Text Layer';
    if (node.type === 'rect') return 'Rectangle';
    if (node.type === 'circle') return 'Circle';
    if (node.type === 'badge') return 'Gold Seal';
    return node.type;
  };

  return (
    <div className="flex h-full pointer-events-auto shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200">
      {/* ── LEFT ICON RAIL ── */}
      <div className="w-16 bg-slate-900 text-slate-400 flex flex-col items-center py-4 gap-4 border-r border-slate-800">
        {[
          { id: 'text', label: 'Text', icon: Type },
          { id: 'elements', label: 'Elements', icon: Shapes },
          { id: 'layers', label: 'Layers', icon: Layers, badge: nodes.length > 0 ? nodes.length : null },
          { id: 'data', label: 'Data', icon: Database, badge: dataHeaders.length > 0 ? dataHeaders.length : null },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group',
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              )}
              title={tab.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium tracking-tight leading-none">{tab.label}</span>
              {tab.badge !== null && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── EXPANDED TAB CONTENT PANEL ── */}
      <div className="w-64 bg-white flex flex-col h-full overflow-hidden border-r border-slate-200">
        {/* Panel Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
            {activeTab}
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Studio v2</span>
        </div>

        {/* Panel Scrollable Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
          {/* 1. TEXT TAB */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Text Hierarchy
                </span>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddTextNode('Certificate of Completion', 42)}
                    className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-bold text-base hover:bg-slate-800 transition-all shadow-sm text-left flex items-center justify-between"
                  >
                    <span>Add Heading</span>
                    <Plus className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleAddTextNode('PROUDLY PRESENTED TO', 20)}
                    className="w-full py-2.5 px-4 bg-slate-100 text-slate-800 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all text-left flex items-center justify-between"
                  >
                    <span>Add Subheading</span>
                    <Plus className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => handleAddTextNode('For successfully completing the 2026 Advanced Certification.', 15)}
                    className="w-full py-2 px-4 bg-slate-50 text-slate-600 rounded-xl text-xs hover:bg-slate-100 transition-all text-left flex items-center justify-between border border-slate-200"
                  >
                    <span>Add Body Text</span>
                    <Plus className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Dynamic CSV Data Fields Quick Insert */}
              {dataHeaders.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-500" /> Dynamic CSV Fields
                  </span>
                  <div className="space-y-1.5">
                    {dataHeaders.map((header) => (
                      <button
                        key={header}
                        onClick={() => handleAddTextNode(`{${header}}`, 36, header)}
                        className={clsx(
                          'w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border',
                          mappedColumns[header]
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                        )}
                      >
                        <span className="font-mono text-[11px] truncate">{`{${header}}`}</span>
                        {mappedColumns[header] ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. ELEMENTS TAB */}
          {activeTab === 'elements' && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Decorations & Seals
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddShapeNode('badge')}
                    className="p-3 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all flex flex-col items-center gap-2 text-amber-800"
                  >
                    <Award className="w-6 h-6 text-amber-600" />
                    <span className="text-[10px] font-bold">Gold Seal</span>
                  </button>

                  <button
                    onClick={() => handleAddShapeNode('circle')}
                    className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-all flex flex-col items-center gap-2 text-indigo-800"
                  >
                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    <span className="text-[10px] font-bold">Emblem</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Basic Shapes
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddShapeNode('rect')}
                    className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-slate-700 text-xs font-medium"
                  >
                    <Square className="w-4 h-4 text-slate-500" />
                    <span>Rectangle</span>
                  </button>

                  <button
                    onClick={() => handleAddShapeNode('circle')}
                    className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-slate-700 text-xs font-medium"
                  >
                    <Circle className="w-4 h-4 text-slate-500" />
                    <span>Circle</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. LAYERS TAB (ENHANCED MULTI-SELECT) */}
          {activeTab === 'layers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                  Canvas Layers
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const allIds = nodes.filter(n => n.id !== 'background-template').map(n => n.id);
                      useCanvasStore.getState().selectNodes(allIds);
                    }}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold font-mono"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300 text-xs">|</span>
                  <button
                    onClick={() => useCanvasStore.getState().selectNode(null)}
                    className="text-[10px] text-slate-500 hover:text-slate-700 font-medium font-mono"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-200">
                💡 Check boxes or hold <kbd className="px-1 py-0.5 bg-white border rounded text-[9px] font-mono">Shift</kbd> to select multiple layers at once.
              </p>

              <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
                {[...nodes].reverse().map((node) => {
                  const isSelected = selectedNodeIds.includes(node.id) || selectedNodeId === node.id;
                  const isBg = node.id === 'background-template';

                  return (
                    <div
                      key={node.id}
                      onClick={(e) => {
                        if (isBg) return;
                        if (e.shiftKey) {
                          toggleSelectNode(node.id);
                        } else {
                          toggleSelectNode(node.id);
                        }
                      }}
                      className={clsx(
                        'p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all group select-none',
                        isSelected
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      )}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                        {!isBg && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectNode(node.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-3.5 h-3.5 accent-indigo-600 rounded cursor-pointer flex-shrink-0"
                          />
                        )}
                        {node.type === 'text' && <Type className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />}
                        {node.type === 'rect' && <Square className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
                        {node.type === 'circle' && <Circle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
                        {node.type === 'badge' && <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                        {node.type === 'image' && <Shapes className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                        <span className="truncate text-[11px] font-mono">{getNodeLabel(node)}</span>
                      </div>

                      {!isBg && (
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateNode(node.id, { visible: node.visible === false ? true : false });
                            }}
                            className="p-1 hover:text-indigo-600 rounded"
                            title={node.visible === false ? 'Show Layer' : 'Hide Layer'}
                          >
                            {node.visible === false ? <EyeOff className="w-3 h-3 text-slate-400" /> : <Eye className="w-3 h-3 text-slate-600" />}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveNodeLayer(node.id, 'up');
                            }}
                            className="p-1 hover:text-indigo-600 rounded"
                            title="Move Layer Up"
                          >
                            <ArrowUp className="w-3 h-3 text-slate-500" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateNode(node.id);
                            }}
                            className="p-1 hover:text-indigo-600 rounded"
                            title="Duplicate Layer"
                          >
                            <Copy className="w-3 h-3 text-slate-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. DATA TAB */}
          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">Dataset Source</span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">
                    {dataRows.length} Records
                  </span>
                </div>
                <button
                  onClick={onOpenDataUploader}
                  className="w-full py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload CSV / Excel</span>
                </button>
              </div>

              {dataHeaders.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Available Columns
                  </span>
                  <div className="space-y-1.5">
                    {dataHeaders.map((header) => (
                      <div
                        key={header}
                        onClick={() => handleAddTextNode(`{${header}}`, 36, header)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 flex items-center justify-between cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
                      >
                        <span className="truncate">{header}</span>
                        <span className="text-[10px] text-indigo-600 font-sans font-semibold">Insert +</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

