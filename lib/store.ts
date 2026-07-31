import { create } from 'zustand';

// Define the Node type for our Scene Graph
// This replaces fabric.Object
export interface CanvasNode {
    id: string;
    type: 'text' | 'image' | 'rect' | 'circle' | 'line' | 'star' | 'badge';
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
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    cornerRadius?: number;
    shadowColor?: string;
    shadowBlur?: number;

    // Typography
    fontSize?: number;
    fontFamily?: string;
    fontStyle?: string; // 'normal', 'bold', 'italic', 'bold italic'
    textDecoration?: string; // 'underline' | ''
    letterSpacing?: number;
    lineHeight?: number;
    align?: string; // 'left', 'center', 'right'

    // Logic properties
    mappedColumn?: string;
    locked?: boolean;
    visible?: boolean;
}

interface CanvasState {
    // Scene Graph
    nodes: CanvasNode[];
    addNode: (node: CanvasNode) => void;
    updateNode: (id: string, updates: Partial<CanvasNode>) => void;
    removeNode: (id: string) => void;
    duplicateNode: (id: string) => void;
    moveNodeLayer: (id: string, direction: 'top' | 'up' | 'down' | 'bottom') => void;
    alignNodes: (alignType: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
    clearNodes: () => void;
    loadNodes: (nodes: CanvasNode[]) => void;

    // Selection
    selectedNodeId: string | null;
    selectedNodeIds: string[];
    selectNode: (id: string | null) => void;
    selectNodes: (ids: string[]) => void;
    toggleSelectNode: (id: string) => void;

    // Dataset Row Preview State
    activeRowIndex: number;
    setActiveRowIndex: (index: number) => void;

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
    past: [],
    future: [],
    selectedNodeId: null,
    selectedNodeIds: [],
    activeRowIndex: 0,
    setActiveRowIndex: (index) => set({ activeRowIndex: index }),

    addNode: (node) => set((state) => ({
        past: [...state.past, state.nodes],
        nodes: [...state.nodes, { visible: true, ...node }],
        selectedNodeId: node.id,
        selectedNodeIds: [node.id],
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
        selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
        selectedNodeIds: state.selectedNodeIds.filter(i => i !== id),
        future: []
    })),

    duplicateNode: (id) => set((state) => {
        const target = state.nodes.find(n => n.id === id);
        if (!target) return state;
        const newNode: CanvasNode = {
            ...target,
            id: String(Date.now()),
            x: target.x + 20,
            y: target.y + 20,
        };
        return {
            past: [...state.past, state.nodes],
            nodes: [...state.nodes, newNode],
            selectedNodeId: newNode.id,
            selectedNodeIds: [newNode.id],
            future: []
        };
    }),

    moveNodeLayer: (id, direction) => set((state) => {
        const index = state.nodes.findIndex(n => n.id === id);
        if (index === -1) return state;
        const newNodes = [...state.nodes];
        const item = newNodes.splice(index, 1)[0];

        if (direction === 'top') {
            newNodes.push(item);
        } else if (direction === 'bottom') {
            newNodes.unshift(item);
        } else if (direction === 'up') {
            const newIndex = Math.min(newNodes.length, index + 1);
            newNodes.splice(newIndex, 0, item);
        } else if (direction === 'down') {
            const newIndex = Math.max(0, index - 1);
            newNodes.splice(newIndex, 0, item);
        }

        return {
            past: [...state.past, state.nodes],
            nodes: newNodes,
            future: []
        };
    }),

    alignNodes: (alignType) => set((state) => {
        const selectedIds = state.selectedNodeIds.length > 0
            ? state.selectedNodeIds
            : (state.selectedNodeId ? [state.selectedNodeId] : []);

        if (selectedIds.length === 0) return state;

        const targets = state.nodes.filter(n => selectedIds.includes(n.id) && n.id !== 'background-template');
        if (targets.length === 0) return state;

        const bgNode = state.nodes.find(n => n.id === 'background-template');
        const canvasW = bgNode?.width || 1200;
        const canvasH = bgNode?.height || 850;

        let updatedNodes = [...state.nodes];

        if (targets.length === 1) {
            // Align single node relative to Canvas
            const node = targets[0];
            const w = node.width || 100;
            const h = node.height || 40;

            let newX = node.x;
            let newY = node.y;

            if (alignType === 'left') newX = 0;
            if (alignType === 'center') newX = (canvasW - w) / 2;
            if (alignType === 'right') newX = canvasW - w;
            if (alignType === 'top') newY = 0;
            if (alignType === 'middle') newY = (canvasH - h) / 2;
            if (alignType === 'bottom') newY = canvasH - h;

            updatedNodes = updatedNodes.map(n => n.id === node.id ? { ...n, x: newX, y: newY } : n);
        } else {
            // Align multiple selected nodes relative to their shared bounding box
            const minX = Math.min(...targets.map(n => n.x));
            const maxX = Math.max(...targets.map(n => n.x + (n.width || 100)));
            const centerX = minX + (maxX - minX) / 2;

            const minY = Math.min(...targets.map(n => n.y));
            const maxY = Math.max(...targets.map(n => n.y + (n.height || 40)));
            const centerY = minY + (maxY - minY) / 2;

            updatedNodes = updatedNodes.map(node => {
                if (!selectedIds.includes(node.id)) return node;
                const w = node.width || 100;
                const h = node.height || 40;

                let newX = node.x;
                let newY = node.y;

                if (alignType === 'left') newX = minX;
                if (alignType === 'center') newX = centerX - w / 2;
                if (alignType === 'right') newX = maxX - w;
                if (alignType === 'top') newY = minY;
                if (alignType === 'middle') newY = centerY - h / 2;
                if (alignType === 'bottom') newY = maxY - h;

                return { ...node, x: newX, y: newY };
            });
        }

        return {
            past: [...state.past, state.nodes],
            nodes: updatedNodes,
            future: []
        };
    }),

    clearNodes: () => set({
        nodes: [],
        past: [],
        future: [],
        selectedNodeId: null,
        selectedNodeIds: [],
    }),

    loadNodes: (nodes) => set({
        nodes: nodes,
        past: [],
        future: [],
        selectedNodeId: null,
        selectedNodeIds: [],
    }),

    undo: () => set((state) => {
        if (state.past.length === 0) return state;
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);
        return {
            nodes: previous,
            past: newPast,
            future: [state.nodes, ...state.future],
            selectedNodeId: null,
            selectedNodeIds: [],
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
            selectedNodeId: null,
            selectedNodeIds: [],
        };
    }),

    selectNode: (id) => set({
        selectedNodeId: id,
        selectedNodeIds: id ? [id] : [],
    }),

    selectNodes: (ids) => set({
        selectedNodeIds: ids,
        selectedNodeId: ids.length > 0 ? ids[ids.length - 1] : null,
    }),

    toggleSelectNode: (id) => set((state) => {
        const exists = state.selectedNodeIds.includes(id);
        const newIds = exists
            ? state.selectedNodeIds.filter(i => i !== id)
            : [...state.selectedNodeIds, id];
        return {
            selectedNodeIds: newIds,
            selectedNodeId: newIds.length > 0 ? newIds[newIds.length - 1] : null,
        };
    }),

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

