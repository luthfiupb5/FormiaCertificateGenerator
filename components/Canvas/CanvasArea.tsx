'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { fabric } from 'fabric'; // Type only import
import { Maximize, ZoomIn, ZoomOut, Hand, MousePointer2 } from 'lucide-react';
import ContextMenu from './ContextMenu';
import { useCanvasStore } from '@/lib/store';
import clsx from 'clsx';

interface CanvasAreaProps {
    templateUrl?: string | null;
    onCanvasReady?: (canvas: fabric.Canvas) => void;
}

export default function CanvasArea({ templateUrl, onCanvasReady }: CanvasAreaProps) {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Global Store
    const {
        canvas: fc,
        setCanvas,
        setZoom,
        zoom: currentZoom,
        activeTool,
        setActiveTool,
        isPanning,
        setIsPanning,
        setSelectedObject
    } = useCanvasStore();

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

    // Helper: Fit to Screen
    const fitToScreen = useCallback((canvas: fabric.Canvas) => {
        if (!wrapperRef.current || !canvas) return;
        const { offsetWidth, offsetHeight } = wrapperRef.current;

        if (offsetWidth === 0 || offsetHeight === 0) return;

        const canW = canvas.width || 800;
        const canH = canvas.height || 600;

        if (canW === 0 || canH === 0) return;

        // Scale to fit with 90% margin
        const scale = Math.min(offsetWidth / canW, offsetHeight / canH) * 0.9;

        if (!scale || scale === Infinity || isNaN(scale)) return;

        // Center
        const vpt = canvas.viewportTransform;
        if (!vpt) return;

        vpt[0] = scale;
        vpt[3] = scale;
        vpt[4] = (offsetWidth - canW * scale) / 2;
        vpt[5] = (offsetHeight - canH * scale) / 2;

        canvas.setViewportTransform(vpt);
        canvas.requestRenderAll();
        setZoom(scale);
    }, [setZoom]);

    const handleZoomIn = () => {
        if (!fc) return;
        let zoom = fc.getZoom();
        zoom *= 1.1;
        if (zoom > 20) zoom = 20;
        fc.zoomToPoint({ x: fc.width! / 2, y: fc.height! / 2 }, zoom);
        setZoom(zoom);
    };

    const handleZoomOut = () => {
        if (!fc) return;
        let zoom = fc.getZoom();
        zoom /= 1.1;
        if (zoom < 0.1) zoom = 0.1;
        fc.zoomToPoint({ x: fc.width! / 2, y: fc.height! / 2 }, zoom);
        setZoom(zoom);
    };

    const handleContextMenuAction = (action: string) => {
        if (!fc) return;
        const activeObj = fc.getActiveObject();

        switch (action) {
            case 'bringForward':
                if (activeObj) fc.bringForward(activeObj);
                break;
            case 'sendBackward':
                if (activeObj) fc.sendBackwards(activeObj);
                break;
            case 'duplicate':
                if (activeObj) {
                    activeObj.clone((cloned: fabric.Object) => {
                        fc.discardActiveObject();
                        cloned.set({
                            left: cloned.left! + 20,
                            top: cloned.top! + 20,
                            evented: true,
                        });
                        if (cloned.type === 'activeSelection') {
                            // active selection needs a canvas to render.
                            (cloned as any).canvas = fc;
                            (cloned as any).forEachObject((obj: any) => {
                                fc.add(obj);
                            });
                            // this should solve the unselectability
                            cloned.setCoords();
                        } else {
                            fc.add(cloned);
                        }
                        fc.setActiveObject(cloned);
                        fc.requestRenderAll();
                    });
                }
                break;
            case 'delete':
                if (activeObj) {
                    const activeObjects = fc.getActiveObjects();
                    if (activeObjects.length) {
                        fc.discardActiveObject();
                        activeObjects.forEach((obj: any) => {
                            fc.remove(obj);
                        });
                    }
                }
                break;
        }
        setContextMenu(null);
    };


    // Initialize Fabric
    useEffect(() => {
        console.log("CanvasArea: Initializing Fabric...");
        let canvasInstance: fabric.Canvas | null = null;

        const initFabric = async () => {
            if (!canvasEl.current) return;

            try {
                const fabricModule = await import('fabric');
                const fabric: any = (fabricModule as any).fabric || fabricModule.default || fabricModule;

                // Premium Controls Styling
                fabric.Object.prototype.set({
                    transparentCorners: false,
                    cornerColor: '#ffffff',
                    cornerStrokeColor: '#6366f1',
                    borderColor: '#6366f1',
                    cornerSize: 10,
                    padding: 8,
                    cornerStyle: 'circle',
                    borderDashArray: [4, 4],
                    rotatingPointOffset: 20
                });

                canvasInstance = new fabric.Canvas(canvasEl.current, {
                    width: wrapperRef.current?.offsetWidth || 800,
                    height: wrapperRef.current?.offsetHeight || 600,
                    backgroundColor: '#171717', // Match wrapper background for infinite feel
                    preserveObjectStacking: true,
                    selection: true,
                    fireRightClick: true, // Enable right click events
                    stopContextMenu: true, // Prevent default browser menu
                });

                setCanvas(canvasInstance);
                if (onCanvasReady && canvasInstance) onCanvasReady(canvasInstance);
            } catch (e) {
                console.error("Failed to initialize Fabric.js:", e);
            }
        };

        if (!fc) {
            initFabric();
        }

        // Handle Resize
        const handleResize = () => {
            if (wrapperRef.current && canvasInstance) {
                canvasInstance.setDimensions({
                    width: wrapperRef.current.offsetWidth,
                    height: wrapperRef.current.offsetHeight
                });
                canvasInstance.requestRenderAll();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (canvasInstance) {
                canvasInstance.dispose();
                setCanvas(null as any); // Reset store
            }
        };
    }, []);

    // Zoom and Pan Interactions
    useEffect(() => {
        if (!fc) return;

        let isDragging = false;
        let lastPosX = 0;
        let lastPosY = 0;
        let isSpacePressed = false;

        const handleWheel = (opt: any) => {
            const evt = opt.e;

            // Interaction Logic:
            // 1. Alt + Wheel OR Ctrl + Wheel = Zoom
            // 2. Wheel (no keys) = Pan

            if (evt.altKey || evt.ctrlKey || evt.metaKey) {
                const delta = evt.deltaY;
                let zoom = fc.getZoom();
                zoom *= 0.999 ** delta;

                // Limits
                if (zoom > 20) zoom = 20;
                if (zoom < 0.05) zoom = 0.05;

                fc.zoomToPoint({ x: evt.offsetX, y: evt.offsetY }, zoom);
                setZoom(zoom);
            } else {
                // Pan
                const vpt = fc.viewportTransform;
                if (!vpt) return;

                vpt[4] -= evt.deltaX;
                vpt[5] -= evt.deltaY;
                fc.requestRenderAll();
            }

            evt.preventDefault();
            evt.stopPropagation();
            setContextMenu(null);
        };

        const handleMouseDown = (opt: any) => {
            const evt = opt.e;

            // Right Click (Context Menu)
            if (opt.button === 3 || evt.button === 2) {
                // Determine if we clicked an object
                if (opt.target) {
                    fc.setActiveObject(opt.target);
                    fc.renderAll();
                }

                setContextMenu({
                    x: evt.clientX,
                    y: evt.clientY
                });
                return;
            } else {
                setContextMenu(null);
            }

            // Middle Click (Pan) or Space + Left Click OR activeTool === 'hand'
            if (evt.button === 1 || isSpacePressed || activeTool === 'hand') {
                isDragging = true;
                fc.selection = false;
                lastPosX = evt.clientX;
                lastPosY = evt.clientY;
                fc.defaultCursor = 'grabbing';
                fc.setCursor('grabbing');
                setIsPanning(true);
            }
        };

        const handleMouseMove = (opt: any) => {
            if (isDragging) {
                const e = opt.e;
                const vpt = fc.viewportTransform;
                if (!vpt) return;

                vpt[4] += e.clientX - lastPosX;
                vpt[5] += e.clientY - lastPosY;
                fc.requestRenderAll();
                lastPosX = e.clientX;
                lastPosY = e.clientY;
            }
        };

        const handleMouseUp = (opt: any) => {
            if (isDragging) {
                isDragging = false;
                setIsPanning(false);

                // Restore cursor/selection based on mode
                if (isSpacePressed || activeTool === 'hand') {
                    fc.defaultCursor = 'grab';
                    fc.setCursor('grab');
                    fc.selection = false;
                } else {
                    fc.defaultCursor = 'default';
                    fc.setCursor('default');
                    fc.selection = true;
                }
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const isSpaceKey = e.code === 'Space' || e.key === ' ';
            if (isSpaceKey && !isSpacePressed) {
                // If text is being edited, don't trigger space pan
                if (fc.getActiveObject() && (fc.getActiveObject() as any).isEditing) return;

                isSpacePressed = true;
                fc.defaultCursor = 'grab';
                fc.setCursor('grab');
                fc.selection = false;
                fc.getObjects().forEach((obj: any) => { obj.evented = false; });
                // We DON'T change the activeTool in store here to avoid UI flickering, just internal state
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const isSpaceKey = e.code === 'Space' || e.key === ' ';
            if (isSpaceKey) {
                isSpacePressed = false;
                if (!isDragging) {
                    if (activeTool === 'hand') {
                        // If we are in hand mode permanently, keep grab
                        fc.defaultCursor = 'grab';
                        fc.setCursor('grab');
                    } else {
                        fc.defaultCursor = 'default';
                        fc.setCursor('default');
                        fc.selection = true;
                        fc.getObjects().forEach((obj: any) => { obj.evented = true; });
                    }
                }
            }
        };

        // Attach Listeners
        fc.on('mouse:wheel', handleWheel);
        fc.on('mouse:down', handleMouseDown);
        fc.on('mouse:move', handleMouseMove);
        fc.on('mouse:up', handleMouseUp);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            fc.off('mouse:wheel', handleWheel);
            fc.off('mouse:down', handleMouseDown);
            fc.off('mouse:move', handleMouseMove);
            fc.off('mouse:up', handleMouseUp);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [fc, activeTool, setActiveTool, setIsPanning, setZoom]); // Re-bind when tools change

    // Handle Template Update
    useEffect(() => {
        if (!fc || !templateUrl) return;

        const setBackground = async () => {
            // Clear previous content
            fc.clear();
            fc.setBackgroundColor('#171717', fc.renderAll.bind(fc));

            const img = new Image();
            img.src = templateUrl;
            img.crossOrigin = "anonymous";

            img.onload = async () => {
                try {
                    const fabricModule = await import('fabric');
                    const fabric: any = (fabricModule as any).fabric || fabricModule.default || fabricModule;

                    const fImg = new fabric.Image(img);

                    fImg.set({
                        left: 0,
                        top: 0,
                        selectable: false,
                        evented: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        lockScalingX: true,
                        lockScalingY: true,
                        hoverCursor: 'default'
                    });

                    const paper = new fabric.Rect({
                        left: 0,
                        top: 0,
                        width: img.width,
                        height: img.height,
                        fill: '#ffffff',
                        selectable: false,
                        evented: false
                    });

                    fc.add(paper);
                    fc.add(fImg);
                    fc.sendToBack(fImg);
                    fc.sendToBack(paper);

                    // Initial Fit
                    setTimeout(() => {
                        if (!wrapperRef.current) return;
                        const { offsetWidth, offsetHeight } = wrapperRef.current;
                        const scale = Math.min(offsetWidth / img.width, offsetHeight / img.height) * 0.85;

                        const vpt = fc.viewportTransform!;
                        vpt[0] = scale;
                        vpt[3] = scale;
                        vpt[4] = (offsetWidth - img.width * scale) / 2;
                        vpt[5] = (offsetHeight - img.height * scale) / 2;

                        fc.setViewportTransform(vpt);
                        fc.requestRenderAll();
                        setZoom(scale);
                    }, 100);

                } catch (e) {
                    console.error("Error initializing fabric image", e);
                }
            };

            img.onerror = (e) => {
                console.error("Error loading template image:", e);
                alert("Failed to load template image.");
            };
        };

        setBackground();
    }, [fc, templateUrl, setZoom]);


    // Keyboard Shortcuts (Ctrl+0)
    useEffect(() => {
        if (!fc) return;
        const handleKeys = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '0') {
                e.preventDefault();
                const paper = fc.getObjects().find((o: any) => o.type === 'rect' && !o.selectable);
                if (paper) {
                    if (!wrapperRef.current) return;
                    const { offsetWidth, offsetHeight } = wrapperRef.current;
                    const scale = Math.min(offsetWidth / paper.width!, offsetHeight / paper.height!) * 0.85;
                    const vpt = fc.viewportTransform!;
                    vpt[0] = scale;
                    vpt[3] = scale;
                    vpt[4] = (offsetWidth - paper.width! * scale) / 2;
                    vpt[5] = (offsetHeight - paper.height! * scale) / 2;
                    fc.setViewportTransform(vpt);
                    fc.requestRenderAll();
                    setZoom(scale);
                }
            }
        };
        window.addEventListener('keydown', handleKeys);
        return () => window.removeEventListener('keydown', handleKeys);
    }, [fc, setZoom]);

    return (
        <div
            ref={wrapperRef}
            className="w-full h-full bg-neutral-900 overflow-hidden relative"
            onContextMenu={(e) => e.preventDefault()}
        >
            <canvas ref={canvasEl} />

            {/* Bottom Floating Toolbar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2 bg-neutral-800/90 backdrop-blur border border-white/10 rounded-full shadow-xl">

                {/* Tool Switcher (Select vs Hand) */}
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


                <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-5 h-5" />
                </button>

                <span className="text-xs font-mono w-12 text-center text-neutral-400">
                    {Math.round(currentZoom * 100)}%
                </span>

                <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn className="w-5 h-5" />
                </button>

                <div className="w-px h-4 bg-white/10 mx-1" />

                <button
                    onClick={() => {
                        // Reuse Ctrl+0 Logic manually
                        const event = new KeyboardEvent('keydown', { key: '0', ctrlKey: true });
                        window.dispatchEvent(event);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full text-neutral-400 hover:text-white transition-colors"
                    title="Fit to Screen (Ctrl+0)"
                >
                    <Maximize className="w-5 h-5" />
                </button>
            </div>

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    onAction={handleContextMenuAction}
                />
            )}
        </div>
    );
}
