import { create } from 'zustand';

// Define the Node type for our Scene Graph
// This replaces fabric.Object
export interface CanvasNode {
    id: string;
    type: 'text' | 'image' | 'rect';
    x: number;
    y: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    width?: number;
    height?: number;

    // Content properties
    text?: string;
    src?: string; // for images

    // Style properties
    fill?: string;
    fontSize?: number;
    fontFamily?: string;
    align?: string; // 'left', 'center', 'right'

    // Logic properties
    mappedColumn?: string;
}

interface CanvasState {
    // Scene Graph
    nodes: CanvasNode[];
    addNode: (node: CanvasNode) => void;
    updateNode: (id: string, updates: Partial<CanvasNode>) => void;
    removeNode: (id: string) => void;
    clearNodes: () => void; // Clear all nodes
    loadNodes: (nodes: CanvasNode[]) => void; // Load nodes from database

    // Selection
    selectedNodeId: string | null;
    selectNode: (id: string | null) => void;

    // Viewport (Stage)
    stage: {
        scale: number;
        x: number;
        y: number;
    };
    setStage: (stage: { scale: number; x: number; y: number }) => void;

    // Tools
    activeTool: 'select' | 'hand' | 'text';
    setActiveTool: (tool: 'select' | 'hand' | 'text') => void;
    isPanning: boolean;
    setIsPanning: (isPanning: boolean) => void;

    // History
    past: CanvasNode[][];
    future: CanvasNode[][];
    undo: () => void;
    redo: () => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
    nodes: [],

    // History
    past: [],
    future: [],

    addNode: (node) => set((state) => ({
        past: [...state.past, state.nodes],
        nodes: [...state.nodes, node],
        future: []
    })),

    updateNode: (id, updates) => set((state) => ({
        past: [...state.past, state.nodes],
        nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, ...updates } : node
        ),
        future: []
    })),

    removeNode: (id) => set((state) => ({
        past: [...state.past, state.nodes],
        nodes: state.nodes.filter((node) => node.id !== id),
        future: []
    })),

    clearNodes: () => set({
        nodes: [],
        past: [],
        future: [],
        selectedNodeId: null
    }),

    loadNodes: (nodes) => set({
        nodes: nodes,
        past: [],
        future: [],
        selectedNodeId: null
    }),

    undo: () => set((state) => {
        if (state.past.length === 0) return state;

        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);

        return {
            nodes: previous,
            past: newPast,
            future: [state.nodes, ...state.future],
            selectedNodeId: null // Optional: deselect on undo to avoid ghost selection
        };
    }),

    redo: () => set((state) => {
        if (state.future.length === 0) return state;

        const next = state.future[0];
        const newFuture = state.future.slice(1);

        return {
            nodes: next,
            past: [...state.past, state.nodes],
            future: newFuture,
            selectedNodeId: null
        };
    }),

    selectedNodeId: null,
    selectNode: (id) => set({ selectedNodeId: id }),

    stage: {
        scale: 1,
        x: 0,
        y: 0
    },
    setStage: (stage) => set({ stage }),

    activeTool: 'select',
    setActiveTool: (tool) => set({ activeTool: tool }),
    isPanning: false,
    setIsPanning: (isPanning) => set({ isPanning }),
}));
