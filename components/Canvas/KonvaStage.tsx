'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Rect, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useCanvasStore, CanvasNode } from '@/lib/store';
import { Hand, MousePointer2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';

// Helper for loading images
const URLImage = ({ src, nodeProps, isSelected, onClick, onTransformEnd }: any) => {
    const [image] = useImage(src, 'anonymous');
    const shapeRef = useRef<any>(null);

    // Initial center logic could go here if needed, but we rely on store props
    return (
        <KonvaImage
            image={image}
            ref={shapeRef}
            {...nodeProps}
            draggable={isSelected}
            onClick={onClick}
            onTap={onClick}
            onTransformEnd={onTransformEnd}
            onDragEnd={(e) => {
                onTransformEnd(e); // Reuse transform end for drag end to save position
            }}
        />
    );
};

interface KonvaStageProps {
    templateUrl?: string | null;
}

export default function KonvaStage({ templateUrl }: KonvaStageProps) {
    const stageRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [editingNode, setEditingNode] = React.useState<string | null>(null);
    const [textInputStyle, setTextInputStyle] = React.useState<any>({});

    const {
        nodes,
        stage,
        setStage,
        selectedNodeId,
        selectNode,
        updateNode,
        activeTool,
        setActiveTool,
        addNode
    } = useCanvasStore();

    // Load Template as Background Node
    useEffect(() => {
        if (!templateUrl) return;

        // Check if background already exists to avoid dupes
        // In a real app we might want to be smarter, but for now just add it if empty or replace
        // For simplicity, let's just make sure we have an 'bg-image' node
        const bgNode = nodes.find(n => n.id === 'background-template');
        if (!bgNode) {
            // We need to load image dimensions first to center it? 
            // Konva handles it, but let's just add it at 0,0 first.
            addNode({
                id: 'background-template',
                type: 'image',
                x: 0,
                y: 0,
                src: templateUrl,
                // Lock background
            });

            // Auto-fit after a small delay to let image load (or we could use smarter logic)
            setTimeout(fitToScreen, 500);
        }
    }, [templateUrl]);

    // Update Transformer
    useEffect(() => {
        if (selectedNodeId && transformerRef.current && stageRef.current) {
            const selectedNode = stageRef.current.findOne('.' + selectedNodeId);
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
                transformerRef.current.getLayer().batchDraw();
            } else {
                transformerRef.current.nodes([]);
            }
        } else if (transformerRef.current) {
            transformerRef.current.nodes([]);
        }
    }, [selectedNodeId, nodes]);

    // Zoom Logic
    const handleWheel = (e: any) => {
        e.evt.preventDefault();

        if (e.evt.ctrlKey || e.evt.metaKey || e.evt.altKey) {
            // Zoom
            const scaleBy = 1.1;
            const stage = stageRef.current;
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

            // Limits
            if (newScale > 20 || newScale < 0.05) return;

            setStage({
                scale: newScale,
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            });
        } else {
            // Pan
            const stage = stageRef.current;
            const newPos = {
                x: stage.x() - e.evt.deltaX,
                y: stage.y() - e.evt.deltaY,
            };
            setStage({
                ...stage, // keep scale
                scale: stage.scaleX(),
                x: newPos.x,
                y: newPos.y
            });
        }
    };

    const fitToScreen = () => {
        if (!containerRef.current || !stageRef.current) return;
        // We assume background-template is the main content
        // In a real app we'd calculate bounding box of all content

        // For now, let's just reset to reasonable defaults or try to fit BG
        // Since we don't easily know BG size without loading it, let's just Reset to 100% at 0,0 or similar
        // Or better, let's rely on the user to zoom for now, or implement strict fit later.

        // Simple Reset
        setStage({ scale: 1, x: 50, y: 50 });
    };

    const handleStageDragEnd = (e: any) => {
        if (e.target === stageRef.current) {
            setStage({
                scale: stageRef.current.scaleX(),
                x: stageRef.current.x(),
                y: stageRef.current.y()
            });
        }
    };

    const handleNodeChange = (id: string, e: any) => {
        const node = e.target;
        updateNode(id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
        });
    };

    const handleTextDblClick = (e: any, node: CanvasNode) => {
        const textNode = e.target;
        const absPos = textNode.getAbsolutePosition();
        const absScaleX = textNode.getAbsoluteScale().x;
        const absScaleY = textNode.getAbsoluteScale().y;
        const absRotation = textNode.getAbsoluteRotation();

        setTextInputStyle({
            top: absPos.y,
            left: absPos.x,
            width: textNode.width() * absScaleX,
            height: (textNode.height() || textNode.fontSize()) * absScaleY * 1.2, // Add some padding/line-height buffer
            fontSize: (node.fontSize || 24) * absScaleY,
            fontFamily: node.fontFamily || 'Inter',
            fill: node.fill || 'black',
            align: node.align || 'center',
            transform: `rotate(${absRotation}deg)`,
        });
        setEditingNode(node.id);
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-neutral-900 overflow-hidden relative">
            <Stage
                ref={stageRef}
                width={containerRef.current?.offsetWidth || 800}
                height={containerRef.current?.offsetHeight || 600}
                onWheel={handleWheel}
                scaleX={stage.scale}
                scaleY={stage.scale}
                x={stage.x}
                y={stage.y}
                draggable={activeTool === 'hand'} // Only drag stage if Hand tool
                onDragEnd={handleStageDragEnd}
                onMouseDown={(e) => {
                    // Deselect if clicked start on empty stage
                    if (e.target === e.target.getStage()) {
                        selectNode(null);
                    }
                }}
            >
                <Layer>
                    {nodes.map((node) => {
                        const isSelected = selectedNodeId === node.id;
                        const isRefBg = node.id === 'background-template';
                        const isEditing = editingNode === node.id;

                        if (node.type === 'image') {
                            return (
                                <URLImage
                                    key={node.id}
                                    src={node.src}
                                    isSelected={isSelected}
                                    onClick={() => !isRefBg && activeTool === 'select' && selectNode(node.id)}
                                    activeTool={activeTool}
                                    nodeProps={{
                                        x: node.x,
                                        y: node.y,
                                        id: node.id,
                                        name: node.id,
                                        rotation: node.rotation,
                                        scaleX: node.scaleX,
                                        scaleY: node.scaleY,
                                        listening: activeTool !== 'hand' && !isRefBg, // Disable interactions if Hand tool or Background
                                    }}
                                    onTransformEnd={(e: any) => handleNodeChange(node.id, e)}
                                />
                            );
                        }

                        if (node.type === 'text') {
                            return (
                                <Text
                                    key={node.id}
                                    id={node.id}
                                    name={node.id}
                                    x={node.x}
                                    y={node.y}
                                    text={node.text}
                                    fontFamily={node.fontFamily || 'Inter'}
                                    fontSize={node.fontSize || 24}
                                    fill={node.fill || 'black'}
                                    width={node.width}
                                    align={node.align || 'center'}
                                    rotation={node.rotation || 0}
                                    scaleX={node.scaleX || 1}
                                    scaleY={node.scaleY || 1}
                                    draggable={activeTool === 'select'}
                                    onClick={() => activeTool === 'select' && selectNode(node.id)}
                                    onTap={() => activeTool === 'select' && selectNode(node.id)}
                                    onDblClick={(e) => activeTool === 'select' && handleTextDblClick(e, node)}
                                    opacity={isEditing ? 0 : 1} // Hide node while editing
                                    // Transformations
                                    onDragEnd={(e) => handleNodeChange(node.id, e)}
                                    onTransformEnd={(e) => {
                                        // Special handling for Text resize vs scale
                                        // Konva Transformer scales by default. 
                                        // To support "width" resize, we need to reset scale and update width.
                                        // But for now let's just stick to scale for simplicity, or we can use the "width" trick.
                                        // Let's settle for scale first to strictly follow "Transform" logic requested.
                                        handleNodeChange(node.id, e);
                                    }}
                                />
                            );
                        }
                        return null;
                    })}

                    <Transformer
                        ref={transformerRef}
                        boundBoxFunc={(oldBox, newBox) => {
                            if (newBox.width < 5 || newBox.height < 5) return oldBox;
                            return newBox;
                        }}
                    />
                </Layer>
            </Stage>

            {/* Inline Text Editing Overlay */}
            {editingNode && (
                <textarea
                    ref={(ref) => { if (ref) ref.focus(); }}
                    value={nodes.find(n => n.id === editingNode)?.text || ''}
                    onChange={(e) => updateNode(editingNode, { text: e.target.value })}
                    onBlur={() => setEditingNode(null)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            setEditingNode(null);
                        }
                    }}
                    style={{
                        position: 'absolute',
                        top: textInputStyle.top,
                        left: textInputStyle.left,
                        width: textInputStyle.width,
                        height: textInputStyle.height,
                        fontSize: textInputStyle.fontSize,
                        fontFamily: textInputStyle.fontFamily,
                        color: textInputStyle.fill,
                        textAlign: textInputStyle.align as any,
                        transform: textInputStyle.transform,
                        transformOrigin: 'top left',
                        background: 'transparent',
                        border: '1px solid #6366f1',
                        outline: 'none',
                        resize: 'none',
                        overflow: 'hidden',
                        padding: 0,
                        margin: 0,
                        lineHeight: 1, // Match Konva default
                        zIndex: 20,
                    }}
                />
            )}

            {/* Toolbar Overlay (Restoring previous UI) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2 bg-neutral-800/90 backdrop-blur border border-white/10 rounded-full shadow-xl">
                <button
                    onClick={() => setActiveTool(activeTool === 'hand' ? 'select' : 'hand')}
                    className={clsx(
                        "p-2 rounded-full transition-colors mr-2 border-r border-white/10 pr-3",
                        activeTool === 'hand' ? "bg-primary text-white" : "hover:bg-white/10 text-neutral-400 hover:text-white"
                    )}
                    title={activeTool === 'hand' ? "Switch to Select (V)" : "Switch to Hand (H)"}
                >
                    {activeTool === 'hand' ? <Hand className="w-5 h-5" /> : <MousePointer2 className="w-5 h-5" />}
                </button>

                <button onClick={() => setStage({ ...stage, scale: stage.scale / 1.1 })} className="p-2 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors">
                    <ZoomOut className="w-5 h-5" />
                </button>

                <span className="text-xs font-mono w-12 text-center text-neutral-400">{Math.round(stage.scale * 100)}%</span>

                <button onClick={() => setStage({ ...stage, scale: stage.scale * 1.1 })} className="p-2 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors">
                    <ZoomIn className="w-5 h-5" />
                </button>

                <div className="w-px h-4 bg-white/10 mx-1" />

                <button onClick={fitToScreen} className="p-2 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors">
                    <Maximize className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
