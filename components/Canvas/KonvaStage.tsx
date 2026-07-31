'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Rect, Circle, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useCanvasStore, CanvasNode } from '@/lib/store';
import { Hand, MousePointer2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';

// Helper for loading images
const URLImage = ({ src, nodeProps, isSelected, onClick, onTransformEnd, updateNode }: any) => {
    const [image] = useImage(src || '', 'anonymous');
    const shapeRef = useRef<any>(null);

    useEffect(() => {
        if (image && updateNode && (!nodeProps.width || !nodeProps.height)) {
            updateNode(nodeProps.id, {
                width: image.width,
                height: image.height
            });
        }
    }, [image, nodeProps.width, nodeProps.height, nodeProps.id, updateNode]);

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
                onTransformEnd(e);
            }}
        />
    );
};

interface KonvaStageProps {
    templateUrl?: string | null;
    dataRows?: any[];
}

export default function KonvaStage({ templateUrl, dataRows = [] }: KonvaStageProps) {
    const stageRef = useRef<any>(null);
    const transformerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [editingNode, setEditingNode] = React.useState<string | null>(null);
    const [textInputStyle, setTextInputStyle] = React.useState<any>({});
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [startPos, setStartPos] = React.useState<{ x: number; y: number } | null>(null);

    const {
        nodes,
        stage,
        setStage,
        selectedNodeId,
        selectNode,
        updateNode,
        activeTool,
        setActiveTool,
        addNode,
        activeRowIndex,
    } = useCanvasStore();

    // Load Template as Background Node
    useEffect(() => {
        if (!templateUrl) return;

        const bgNode = nodes.find(n => n.id === 'background-template');
        if (!bgNode) {
            addNode({
                id: 'background-template',
                type: 'image',
                x: 0,
                y: 0,
                src: templateUrl,
            });

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

    // Handle Stage Zooming
    const handleWheel = (e: any) => {
        e.evt.preventDefault();
        const scaleBy = 1.05;
        const stageObj = stageRef.current;
        const oldScale = stageObj.scaleX();

        const pointer = stageObj.getPointerPosition();
        const mousePointTo = {
            x: (pointer.x - stageObj.x()) / oldScale,
            y: (pointer.y - stageObj.y()) / oldScale,
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        const clampedScale = Math.max(0.1, Math.min(newScale, 10));

        const newPos = {
            x: pointer.x - mousePointTo.x * clampedScale,
            y: pointer.y - mousePointTo.y * clampedScale,
        };

        setStage({
            scale: clampedScale,
            x: newPos.x,
            y: newPos.y,
        });
    };

    const fitToScreen = () => {
        const bgNode = nodes.find(n => n.id === 'background-template');
        if (!bgNode || !bgNode.width || !bgNode.height || !containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        const scaleX = (containerWidth * 0.85) / bgNode.width;
        const scaleY = (containerHeight * 0.85) / bgNode.height;
        const scale = Math.min(scaleX, scaleY, 1);

        const x = (containerWidth - bgNode.width * scale) / 2;
        const y = (containerHeight - bgNode.height * scale) / 2;

        setStage({ scale, x, y });
    };

    const handleStageDragEnd = (e: any) => {
        if (activeTool === 'hand') {
            setStage({
                ...stage,
                x: e.target.x(),
                y: e.target.y(),
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
            width: node.width ? node.width() : undefined,
            height: node.height ? node.height() : undefined,
        });
    };

    // Double Click to Edit Text
    const handleTextDblClick = (e: any, node: CanvasNode) => {
        const textNode = e.target;
        const stageObj = stageRef.current;
        const textPosition = textNode.absolutePosition();
        const stageBox = containerRef.current?.getBoundingClientRect();

        if (!stageBox) return;

        const areaPosition = {
            x: stageBox.left + textPosition.x,
            y: stageBox.top + textPosition.y,
        };

        setTextInputStyle({
            top: `${areaPosition.y}px`,
            left: `${areaPosition.x}px`,
            width: `${textNode.width() * stage.scale}px`,
            fontSize: `${node.fontSize! * stage.scale}px`,
            fontFamily: node.fontFamily,
            color: node.fill,
            textAlign: node.align || 'center',
        });
        setEditingNode(node.id);
    };

    // Drop Handler
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        stage.setPointersPositions(e);
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const x = (pointer.x - stage.x()) / stage.scaleX();
        const y = (pointer.y - stage.y()) / stage.scaleY();

        const content = e.dataTransfer.getData('text/plain');
        if (content) {
            const mappedColumn = content.startsWith('{') && content.endsWith('}')
                ? content.slice(1, -1)
                : undefined;

            addNode({
                id: uuidv4(),
                type: 'text',
                x,
                y,
                text: content,
                fontSize: 40,
                fontFamily: 'Inter',
                fill: '#000000',
                width: 300,
                align: 'center',
                mappedColumn
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleMouseDown = (e: any) => {
        if (activeTool !== 'text') {
            if (e.target === e.target.getStage()) {
                selectNode(null);
            }
            return;
        }

        const stage = stageRef.current;
        const pointer = stage.getRelativePointerPosition();
        setIsDrawing(true);
        setStartPos(pointer);
        selectNode(null);
    };

    const handleMouseMove = () => {};

    const handleMouseUp = () => {
        if (!isDrawing || activeTool !== 'text' || !startPos) return;

        const stage = stageRef.current;
        const pointer = stage.getRelativePointerPosition();
        const width = Math.abs(pointer.x - startPos.x);

        if (width > 10) {
            const id = uuidv4();
            addNode({
                id,
                type: 'text',
                x: startPos.x,
                y: startPos.y,
                text: 'Double click to edit',
                fontSize: 40,
                fontFamily: 'Inter',
                fill: '#000000',
                width: width,
                align: 'left',
            });
            selectNode(id);
            setActiveTool('select');
            setEditingNode(id);
        }

        setIsDrawing(false);
        setStartPos(null);
    };

    return (
        <div
            ref={containerRef}
            className={clsx(
                "w-full h-full bg-neutral-900 overflow-hidden relative",
                activeTool === 'text' && "cursor-crosshair"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <Stage
                ref={stageRef}
                width={containerRef.current?.offsetWidth || 800}
                height={containerRef.current?.offsetHeight || 600}
                onWheel={handleWheel}
                scaleX={stage.scale}
                scaleY={stage.scale}
                x={stage.x}
                y={stage.y}
                draggable={activeTool === 'hand'}
                onDragEnd={handleStageDragEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <Layer>
                    {[...nodes]
                        .sort((a, b) => {
                            if (a.id === 'background-template') return -1;
                            if (b.id === 'background-template') return 1;
                            return 0;
                        })
                        .map((node) => {
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
                                        updateNode={updateNode}
                                        nodeProps={{
                                            x: node.x,
                                            y: node.y,
                                            id: node.id,
                                            name: node.id,
                                            rotation: node.rotation,
                                            scaleX: node.scaleX,
                                            scaleY: node.scaleY,
                                            width: node.width,
                                            height: node.height,
                                            listening: activeTool !== 'hand' && !isRefBg,
                                        }}
                                        onTransformEnd={(e: any) => handleNodeChange(node.id, e)}
                                    />
                                );
                            }

                            if (node.type === 'rect') {
                                return (
                                    <Rect
                                        key={node.id}
                                        id={node.id}
                                        name={node.id}
                                        x={node.x}
                                        y={node.y}
                                        width={node.width || 200}
                                        height={node.height || 100}
                                        fill={node.fill || '#e2e8f0'}
                                        stroke={node.stroke}
                                        strokeWidth={node.strokeWidth || 0}
                                        cornerRadius={node.cornerRadius || 0}
                                        opacity={node.opacity ?? 1}
                                        rotation={node.rotation || 0}
                                        scaleX={node.scaleX || 1}
                                        scaleY={node.scaleY || 1}
                                        draggable={activeTool === 'select'}
                                        onClick={() => activeTool === 'select' && selectNode(node.id)}
                                        onDragEnd={(e) => handleNodeChange(node.id, e)}
                                        onTransformEnd={(e) => handleNodeChange(node.id, e)}
                                    />
                                );
                            }

                            if (node.type === 'circle' || node.type === 'badge') {
                                return (
                                    <Circle
                                        key={node.id}
                                        id={node.id}
                                        name={node.id}
                                        x={node.x}
                                        y={node.y}
                                        radius={(node.width || 100) / 2}
                                        fill={node.fill || '#cbd5e1'}
                                        stroke={node.stroke}
                                        strokeWidth={node.strokeWidth}
                                        opacity={node.opacity ?? 1}
                                        rotation={node.rotation || 0}
                                        scaleX={node.scaleX || 1}
                                        scaleY={node.scaleY || 1}
                                        draggable={activeTool === 'select'}
                                        onClick={() => activeTool === 'select' && selectNode(node.id)}
                                        onDragEnd={(e) => handleNodeChange(node.id, e)}
                                        onTransformEnd={(e) => handleNodeChange(node.id, e)}
                                    />
                                );
                            }

                            if (node.type === 'text') {
                                let displayText = node.text || '';
                                if (dataRows && dataRows.length > 0 && node.mappedColumn && dataRows[activeRowIndex]) {
                                    const val = dataRows[activeRowIndex][node.mappedColumn];
                                    if (val !== undefined && val !== null) {
                                        displayText = String(val);
                                    }
                                }

                                return (
                                    <Text
                                        key={node.id}
                                        id={node.id}
                                        name={node.id}
                                        x={node.x}
                                        y={node.y}
                                        text={displayText}
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
                                        opacity={isEditing ? 0 : (node.opacity ?? 1)}
                                        onDragEnd={(e) => handleNodeChange(node.id, e)}
                                        onTransform={(e) => {
                                            const nodeObj = e.target;
                                            const scaleX = nodeObj.scaleX();
                                            nodeObj.scaleX(1);
                                            nodeObj.scaleY(1);
                                            nodeObj.width(Math.max(nodeObj.width() * scaleX, 30));
                                        }}
                                        onTransformEnd={(e) => {
                                            const nodeObj = e.target;
                                            updateNode(nodeObj.id(), {
                                                x: nodeObj.x(),
                                                y: nodeObj.y(),
                                                rotation: nodeObj.rotation(),
                                                scaleX: 1,
                                                scaleY: 1,
                                                width: nodeObj.width(),
                                            });
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
                        border: '1px solid #5e61f9ff',
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
        </div>
    );
}
