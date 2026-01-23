import { create } from 'zustand';
import type { fabric } from 'fabric';

interface CanvasState {
    canvas: fabric.Canvas | null;
    setCanvas: (canvas: fabric.Canvas) => void;

    // Selection
    selectedObject: fabric.Object | null;
    setSelectedObject: (object: fabric.Object | null) => void;

    // Viewport
    zoom: number;
    setZoom: (zoom: number) => void;

    // Tools
    activeTool: 'select' | 'hand' | 'text';
    setActiveTool: (tool: 'select' | 'hand' | 'text') => void;
    isPanning: boolean;
    setIsPanning: (isPanning: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    canvas: null,
    setCanvas: (canvas) => set({ canvas }),

    selectedObject: null,
    setSelectedObject: (object) => set({ selectedObject: object }),

    zoom: 1,
    setZoom: (zoom) => set({ zoom }),

    activeTool: 'select',
    setActiveTool: (tool) => set({ activeTool: tool }),
    isPanning: false,
    setIsPanning: (isPanning) => set({ isPanning }),
}));
