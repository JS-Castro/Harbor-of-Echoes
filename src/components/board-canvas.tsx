"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import ReactFlow, {
  Background,
  Handle,
  MarkerType,
  Position,
  addEdge,
  applyNodeChanges,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  type NodeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { loadBoardSnapshot, saveBoardSnapshot } from "@/app/actions/case-session";
import {
  BOARD_SURFACE_OFFSET,
  BOARD_SURFACE_SIZE,
  DEFAULT_VIEWPORT,
  FALLBACK_NODE_SIZE,
  clampZoom,
  getFallbackConnectorPoint,
  resolveManualEdge,
  screenToBoardPosition,
  type ConnectorCenters,
  type ConnectorSide,
  type LinkDragSource,
  type OverlayPoint,
} from "@/components/board-canvas-helpers";
import {
  BoardOverlayEdges,
  BoardOverlayNodeCard,
} from "@/components/board-canvas-overlay";
import type { BoardSeed } from "@/lib/case-data";
import type { AppLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { useBoardStore } from "@/stores/board-store";

type BoardCanvasProps = {
  caseSlug: string;
  seed: BoardSeed;
  locale: AppLocale;
};

function InvestigationNode({ data, id }: NodeProps<Node["data"]>) {
  const removeNode = useBoardStore((state) => state.removeNode);
  const tone =
    data?.tone === "entity"
      ? "border-cyan-100/25 bg-cyan-100/8"
      : data?.tone === "note"
        ? "border-emerald-100/25 bg-emerald-100/10"
        : "border-amber-100/25 bg-amber-100/8";

  return (
    <div
      className={`relative w-60 rounded-[1.4rem] border px-4 py-4 text-stone-100 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-sm ${tone}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className={clsx(
          "!-left-2 !h-4 !w-4 !border-2 !border-slate-950",
          data?.tone === "note" ? "!bg-emerald-100" : "!bg-cyan-100",
        )}
      />
      <div className="flex items-center justify-between gap-3">
        <p
          className={clsx(
            "text-[11px] uppercase tracking-[0.22em]",
            data?.tone === "note" ? "text-emerald-100/80" : "text-slate-300",
          )}
        >
          {data?.meta}
        </p>
        {data?.tone === "note" ? (
          <button
            type="button"
            onClick={() => removeNode(String(data?.caseSlug ?? ""), id)}
            className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-300 transition hover:border-white/25 hover:bg-white/5"
          >
            {String(data?.removeLabel ?? "")}
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-lg leading-6 text-white">{data?.label}</p>
      <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span
            className={clsx(
              "h-2.5 w-2.5 rounded-full",
              data?.tone === "note" ? "bg-emerald-100" : "bg-cyan-100",
            )}
          />
          in
        </span>
        <span className="inline-flex items-center gap-2">
          out
          <span
            className={clsx(
              "h-2.5 w-2.5 rounded-full",
              data?.tone === "note" ? "bg-emerald-100" : "bg-cyan-100",
            )}
          />
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className={clsx(
          "!-right-2 !h-4 !w-4 !border-2 !border-slate-950",
          data?.tone === "note" ? "!bg-emerald-100" : "!bg-cyan-100",
        )}
      />
    </div>
  );
}

const nodeTypes = {
  entity: InvestigationNode,
  evidence: InvestigationNode,
  note: InvestigationNode,
};

export function BoardCanvas({ caseSlug, seed, locale }: BoardCanvasProps) {
  const dictionary = getDictionary(locale);
  const storedSession = useBoardStore((state) => state.sessions[caseSlug]);
  const hydrateCase = useBoardStore((state) => state.hydrateCase);
  const setSnapshot = useBoardStore((state) => state.setSnapshot);
  const setNodes = useBoardStore((state) => state.setNodes);
  const setEdges = useBoardStore((state) => state.setEdges);
  const removeNode = useBoardStore((state) => state.removeNode);
  const resetCase = useBoardStore((state) => state.resetCase);
  const [pendingNoteLabel, setPendingNoteLabel] = useState(dictionary.board.newNoteTitle);
  const [overlayViewport, setOverlayViewport] = useState(DEFAULT_VIEWPORT);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [linkDragSource, setLinkDragSource] = useState<LinkDragSource | null>(null);
  const [linkPointer, setLinkPointer] = useState<OverlayPoint | null>(null);
  const [nodeSizes, setNodeSizes] = useState<Record<string, { width: number; height: number }>>({});
  const [connectorCenters, setConnectorCenters] = useState<ConnectorCenters>({});
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const nodeElementRefs = useRef(new Map<string, HTMLDivElement>());
  const sourceConnectorRefs = useRef(new Map<string, HTMLButtonElement>());
  const targetConnectorRefs = useRef(new Map<string, HTMLButtonElement>());
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const panOriginRef = useRef({ x: 0, y: 0, viewportX: 0, viewportY: 0 });
  const [hasLoadedSnapshot, setHasLoadedSnapshot] = useState(false);

  useEffect(() => {
    hydrateCase(caseSlug, seed);
  }, [caseSlug, hydrateCase, seed]);

  useEffect(() => {
    let cancelled = false;

    void loadBoardSnapshot(caseSlug)
      .then((snapshot) => {
        if (cancelled) {
          return;
        }

        if (snapshot) {
          setSnapshot(caseSlug, snapshot);
        }

        setHasLoadedSnapshot(true);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setHasLoadedSnapshot(true);
      });

    return () => {
      cancelled = true;
    };
  }, [caseSlug, setSnapshot]);

  const activeSession = storedSession ?? seed;

  useEffect(() => {
    if (!hasLoadedSnapshot || !storedSession) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void saveBoardSnapshot(caseSlug, storedSession);
    }, 300);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [caseSlug, hasLoadedSnapshot, storedSession]);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      if (!canvasRef.current) {
        return;
      }

      const bounds = canvasRef.current.getBoundingClientRect();
      if (draggingNodeId) {
        const nextPosition = screenToBoardPosition(
          event.clientX,
          event.clientY,
          bounds,
          overlayViewport,
        );

        setNodes(
          caseSlug,
          activeSession.nodes.map((node) =>
            node.id === draggingNodeId
              ? {
                  ...node,
                  position: {
                    x: Math.max(0, nextPosition.x - dragOffsetRef.current.x),
                    y: Math.max(0, nextPosition.y - dragOffsetRef.current.y),
                  },
                }
              : node,
          ),
        );
      }

      if (isPanning) {
        setOverlayViewport((current) => ({
          ...current,
          x: panOriginRef.current.viewportX + (event.clientX - panOriginRef.current.x),
          y: panOriginRef.current.viewportY + (event.clientY - panOriginRef.current.y),
        }));
      }

      if (linkDragSource) {
        setLinkPointer(screenToBoardPosition(event.clientX, event.clientY, bounds, overlayViewport));
      }
    }

    function handlePointerUp() {
      setDraggingNodeId(null);
      setIsPanning(false);
      setLinkDragSource(null);
      setLinkPointer(null);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [activeSession.nodes, caseSlug, draggingNodeId, isPanning, linkDragSource, overlayViewport, setNodes]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;

      if (
        !(event.key === "Delete" || event.key === "Backspace") ||
        !selectedEdgeId ||
        (target instanceof HTMLElement &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable))
      ) {
        return;
      }

      event.preventDefault();
      setEdges(
        caseSlug,
        activeSession.edges.filter((edge) => edge.id !== selectedEdgeId),
      );
      setSelectedEdgeId(null);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeSession.edges, caseSlug, selectedEdgeId, setEdges]);

  const flowNodes = useMemo<Node[]>(
    () =>
      activeSession.nodes.map((node) => ({
        ...node,
        draggable: true,
        data: {
          ...node.data,
          caseSlug,
          placeholder: dictionary.board.notePlaceholder,
          removeLabel: dictionary.board.removeNote,
        },
      })),
    [activeSession.nodes, caseSlug, dictionary.board.notePlaceholder, dictionary.board.removeNote],
  );

  const flowEdges = useMemo<Edge[]>(
    () =>
      activeSession.edges.map((edge) => ({
        ...edge,
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 18,
          height: 18,
          color: "#d7e3ec",
        },
        style: {
          stroke: "#d7e3ec",
          strokeOpacity: 0.45,
          strokeWidth: 1.4,
        },
        labelStyle: {
          fill: "#dce7ee",
          fontSize: 11,
          letterSpacing: "0.12em",
        },
      })),
    [activeSession.edges],
  );

  const manualNotesCount = activeSession.nodes.filter((node) => node.type === "note").length;

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setNodeSizes((current) => {
        const next = { ...current };

        for (const entry of entries) {
          const nodeId = entry.target.getAttribute("data-node-id");

          if (!nodeId) {
            continue;
          }

          next[nodeId] = {
            width: (entry.target as HTMLDivElement).offsetWidth,
            height: (entry.target as HTMLDivElement).offsetHeight,
          };
        }

        return next;
      });
    });

    for (const [nodeId, element] of nodeElementRefs.current.entries()) {
      element.setAttribute("data-node-id", nodeId);
      resizeObserver.observe(element);
    }

    return () => resizeObserver.disconnect();
  }, [flowNodes]);

  useEffect(() => {
    function updateConnectorCenters() {
      if (!canvasRef.current) {
        return;
      }

      const canvasBounds = canvasRef.current.getBoundingClientRect();
      const nextCenters: Record<
        string,
        { source?: { x: number; y: number }; target?: { x: number; y: number } }
      > = {};

      for (const node of activeSession.nodes) {
        const sourceConnector = sourceConnectorRefs.current.get(node.id);
        const targetConnector = targetConnectorRefs.current.get(node.id);

        nextCenters[node.id] = {
          source: sourceConnector
            ? {
                x:
                  (sourceConnector.getBoundingClientRect().left +
                    sourceConnector.getBoundingClientRect().width / 2 -
                    canvasBounds.left -
                    overlayViewport.x) /
                  overlayViewport.zoom,
                y:
                  (sourceConnector.getBoundingClientRect().top +
                    sourceConnector.getBoundingClientRect().height / 2 -
                    canvasBounds.top -
                    overlayViewport.y) /
                  overlayViewport.zoom,
              }
            : undefined,
          target: targetConnector
            ? {
                x:
                  (targetConnector.getBoundingClientRect().left +
                    targetConnector.getBoundingClientRect().width / 2 -
                    canvasBounds.left -
                    overlayViewport.x) /
                  overlayViewport.zoom,
                y:
                  (targetConnector.getBoundingClientRect().top +
                    targetConnector.getBoundingClientRect().height / 2 -
                    canvasBounds.top -
                    overlayViewport.y) /
                  overlayViewport.zoom,
              }
            : undefined,
        };
      }

      setConnectorCenters(nextCenters);
    }

    updateConnectorCenters();
    window.addEventListener("resize", updateConnectorCenters);

    return () => {
      window.removeEventListener("resize", updateConnectorCenters);
    };
  }, [activeSession.nodes, overlayViewport, nodeSizes]);

  function getNodeSize(nodeId: string) {
    return nodeSizes[nodeId] ?? FALLBACK_NODE_SIZE;
  }

  function getConnectorPoint(
    nodeId: string,
    side: ConnectorSide,
    position: { x: number; y: number },
  ) {
    const connectorPoint = connectorCenters[nodeId]?.[side];

    if (connectorPoint) {
      return connectorPoint;
    }

    return getFallbackConnectorPoint(side, { id: nodeId, position } as BoardSeed["nodes"][number], getNodeSize(nodeId));
  }

  function handleNodesChange(changes: NodeChange[]) {
    const nextNodes: BoardSeed["nodes"] = applyNodeChanges(changes, flowNodes).map(
      (node) => ({
        id: node.id,
        type: node.type ?? "entity",
        position: node.position,
        data: {
          label: String(node.data?.label ?? ""),
          meta: String(node.data?.meta ?? ""),
          tone:
            (node.data?.tone as "entity" | "evidence" | "note" | undefined) === "evidence"
              ? "evidence"
              : (node.data?.tone as "entity" | "evidence" | "note" | undefined) === "note"
                ? "note"
                : "entity",
        },
      }),
    );

    setNodes(caseSlug, nextNodes);
  }

  function handleConnect(connection: Connection) {
    if (!connection.source || !connection.target || connection.source === connection.target) {
      return;
    }

    const existingManualEdge = activeSession.edges.find(
      (edge) => edge.source === connection.source && edge.target === connection.target,
    );

    const nextEdges = existingManualEdge
      ? activeSession.edges
      : addEdge(
          {
            ...connection,
            id: `manual-${connection.source}-${connection.target}-${crypto.randomUUID()}`,
          },
          flowEdges,
        ).map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        }));

    setEdges(caseSlug, nextEdges);
  }

  function upsertManualEdge(source: string, target: string) {
    if (source === target) {
      return;
    }

    const existingManualEdge = activeSession.edges.find(
      (edge) => edge.source === source && edge.target === target,
    );

    const nextEdges = existingManualEdge
      ? activeSession.edges
      : [
          ...activeSession.edges,
          {
            id: `manual-${source}-${target}-${crypto.randomUUID()}`,
            source,
            target,
          },
        ];

    setEdges(caseSlug, nextEdges);
  }

  function handleAddNote() {
    if (!hasLoadedSnapshot) {
      return;
    }

    const nextIndex = manualNotesCount + 1;
    const canvasBounds = canvasRef.current?.getBoundingClientRect();
    const viewportCenter = canvasBounds
      ? screenToBoardPosition(
          canvasBounds.left + canvasBounds.width / 2,
          canvasBounds.top + canvasBounds.height / 2,
          canvasBounds,
          overlayViewport,
        )
      : {
          x: 360 + (nextIndex % 2) * 220,
          y: 480 + Math.floor(nextIndex / 2) * 180,
        };
    const nextPosition = {
      x: viewportCenter.x - 128,
      y: viewportCenter.y - 96,
    };
    const nextNodes = [
      ...activeSession.nodes,
      {
        id: `note-${caseSlug}-${nextIndex}-${crypto.randomUUID()}`,
        type: "note",
        position: nextPosition,
        data: {
          label: pendingNoteLabel.trim() || dictionary.board.newNoteTitle,
          meta: dictionary.board.noteMeta,
          tone: "note" as const,
        },
      },
    ];

    setNodes(caseSlug, nextNodes);
    setPendingNoteLabel(dictionary.board.newNoteTitle);
  }

  function handleReset() {
    if (!hasLoadedSnapshot) {
      return;
    }

    resetCase(caseSlug, seed);
    setPendingNoteLabel(dictionary.board.newNoteTitle);
    setDraggingNodeId(null);
    setIsPanning(false);
    setSelectedEdgeId(null);
    setLinkDragSource(null);
    setLinkPointer(null);
    setOverlayViewport(DEFAULT_VIEWPORT);
  }

  function handleResetView() {
    setOverlayViewport(DEFAULT_VIEWPORT);
  }

  function handleOverlayDragStart(
    event: React.PointerEvent<HTMLDivElement>,
    nodeId: string,
    position: { x: number; y: number },
  ) {
    if (!hasLoadedSnapshot) {
      return;
    }

    event.stopPropagation();

    if (!canvasRef.current) {
      return;
    }

    const pointerPosition = screenToBoardPosition(
      event.clientX,
      event.clientY,
      canvasRef.current.getBoundingClientRect(),
      overlayViewport,
    );
    dragOffsetRef.current = {
      x: pointerPosition.x - position.x,
      y: pointerPosition.y - position.y,
    };
    setDraggingNodeId(nodeId);
  }

  function handlePanStart(event: React.PointerEvent<HTMLDivElement>) {
    if (!hasLoadedSnapshot) {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    panOriginRef.current = {
      x: event.clientX,
      y: event.clientY,
      viewportX: overlayViewport.x,
      viewportY: overlayViewport.y,
    };
    setIsPanning(true);
  }

  function handleConnectorDragStart(
    event: React.PointerEvent<HTMLButtonElement>,
    nodeId: string,
    position: { x: number; y: number },
    side: "source" | "target",
  ) {
    if (!hasLoadedSnapshot) {
      return;
    }

    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setSelectedEdgeId(null);
    setLinkDragSource({ nodeId, side });
    setLinkPointer(
    getConnectorPoint(nodeId, side, position),
    );
  }

  function handleConnectorDrop(
    event: React.PointerEvent<HTMLButtonElement>,
    targetNodeId: string,
    targetSide: "source" | "target",
  ) {
    if (!hasLoadedSnapshot) {
      return;
    }

    event.stopPropagation();

    if (!linkDragSource) {
      return;
    }

    const resolvedEdge = resolveManualEdge(
      linkDragSource.nodeId,
      linkDragSource.side,
      targetNodeId,
      targetSide,
    );

    if (!resolvedEdge) {
      return;
    }

    upsertManualEdge(resolvedEdge.source, resolvedEdge.target);
    setLinkDragSource(null);
    setLinkPointer(null);
  }

  function handleConnectorEnter(
    event: React.PointerEvent<HTMLButtonElement>,
    targetNodeId: string,
    targetSide: "source" | "target",
  ) {
    if (!hasLoadedSnapshot) {
      return;
    }

    if (!linkDragSource || event.buttons !== 1) {
      return;
    }

    const resolvedEdge = resolveManualEdge(
      linkDragSource.nodeId,
      linkDragSource.side,
      targetNodeId,
      targetSide,
    );

    if (!resolvedEdge) {
      return;
    }

    event.stopPropagation();
    upsertManualEdge(resolvedEdge.source, resolvedEdge.target);
    setLinkDragSource(null);
    setLinkPointer(null);
  }

  function handleOverlayCardClick() {
    setSelectedEdgeId(null);
  }

  function handleRemoveNote(event: React.MouseEvent<HTMLButtonElement>, nodeId: string) {
    if (!hasLoadedSnapshot) {
      return;
    }

    event.stopPropagation();
    removeNode(caseSlug, nodeId);
  }

  function handleZoom(delta: number) {
    setOverlayViewport((current) => ({
      ...current,
      zoom: clampZoom(current.zoom + delta),
    }));
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (!hasLoadedSnapshot) {
      return;
    }

    event.preventDefault();

    if (!canvasRef.current) {
      return;
    }

    const bounds = canvasRef.current.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;

    setOverlayViewport((current) => {
      const nextZoom = clampZoom(current.zoom + (event.deltaY > 0 ? -0.08 : 0.08));

      if (nextZoom === current.zoom) {
        return current;
      }

      const boardX = (pointerX - current.x) / current.zoom;
      const boardY = (pointerY - current.y) / current.zoom;

      return {
        x: pointerX - boardX * nextZoom,
        y: pointerY - boardY * nextZoom,
        zoom: nextZoom,
      };
    });
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(173,202,219,0.08),transparent_30%),linear-gradient(180deg,rgba(4,10,15,0.92),rgba(11,21,30,0.98))]">
        <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            {dictionary.board.sessionState}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {dictionary.board.sessionHelp}
          </p>
          {!hasLoadedSnapshot ? (
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-amber-100/80">
              Syncing investigation session...
            </p>
          ) : null}
          <p className="mt-2 text-xs text-cyan-100/75">
            {dictionary.board.linkInstruction}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-emerald-100/70">
            {dictionary.board.noteCounter(manualNotesCount)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
            <span>{dictionary.board.noteTextLabel}</span>
            <input
              value={pendingNoteLabel}
              onChange={(event) => setPendingNoteLabel(event.target.value)}
              placeholder={dictionary.board.newNoteTitle}
              disabled={!hasLoadedSnapshot}
              className="min-w-52 rounded-full border border-emerald-100/15 bg-slate-950/70 px-4 py-2 text-xs normal-case tracking-normal text-stone-100 outline-none placeholder:text-slate-500"
            />
          </label>
          <button
            type="button"
            onClick={handleAddNote}
            disabled={!hasLoadedSnapshot}
            className={clsx(
              "rounded-full border border-emerald-100/15 px-4 py-2 text-xs uppercase tracking-[0.18em] text-emerald-50 transition",
              "hover:border-emerald-100/35 hover:bg-emerald-100/10 disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {dictionary.board.addNote}
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className={clsx(
              "rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-100 transition",
              "hover:border-white/25 hover:bg-white/5",
            )}
          >
            {dictionary.board.resetView}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasLoadedSnapshot}
            className={clsx(
              "rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-100 transition",
              "hover:border-white/25 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {dictionary.board.resetBoard}
          </button>
        </div>
      </div>

      <div
        ref={canvasRef}
        className={clsx(
          "relative h-[40rem] overflow-hidden",
          !hasLoadedSnapshot ? "opacity-85" : "",
          isPanning ? "cursor-grabbing" : "cursor-grab",
        )}
        onPointerDown={handlePanStart}
        onWheel={handleWheel}
      >
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
          minZoom={0.5}
          maxZoom={1.2}
          proOptions={{ hideAttribution: true }}
          onNodesChange={handleNodesChange}
          onConnect={handleConnect}
          className="pointer-events-none opacity-0"
        >
          <Background color="#89a5b7" gap={32} size={1} />
        </ReactFlow>
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${overlayViewport.x}px, ${overlayViewport.y}px) scale(${overlayViewport.zoom})`,
            transformOrigin: "top left",
          }}
        >
          <div
            className="absolute opacity-45"
            onPointerDown={handlePanStart}
            style={{
              left: `-${BOARD_SURFACE_OFFSET}px`,
              top: `-${BOARD_SURFACE_OFFSET}px`,
              width: `${BOARD_SURFACE_SIZE}px`,
              height: `${BOARD_SURFACE_SIZE}px`,
              backgroundImage:
                "linear-gradient(rgba(137,165,183,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(137,165,183,0.16) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <BoardOverlayEdges
            edges={activeSession.edges}
            nodes={activeSession.nodes}
            selectedEdgeId={selectedEdgeId}
            linkDragSource={linkDragSource}
            linkPointer={linkPointer}
            getConnectorPoint={getConnectorPoint}
            onSelectEdge={setSelectedEdgeId}
          />
          <div className="pointer-events-none absolute inset-0 z-30">
            {flowNodes.map((node) => (
              <BoardOverlayNodeCard
                key={`debug-${node.id}`}
                node={node}
                draggingNodeId={draggingNodeId}
                removeNoteLabel={dictionary.board.removeNote}
                registerNodeElement={(nodeId, element) => {
                  if (element) {
                    nodeElementRefs.current.set(nodeId, element);
                  } else {
                    nodeElementRefs.current.delete(nodeId);
                  }
                }}
                registerConnectorElement={(nodeId, side, element) => {
                  const connectorRefs =
                    side === "source" ? sourceConnectorRefs.current : targetConnectorRefs.current;

                  if (element) {
                    connectorRefs.set(nodeId, element);
                  } else {
                    connectorRefs.delete(nodeId);
                  }
                }}
                onCardPointerDown={handleOverlayDragStart}
                onCardClick={handleOverlayCardClick}
                onConnectorPointerDown={handleConnectorDragStart}
                onConnectorPointerEnter={handleConnectorEnter}
                onConnectorPointerUp={handleConnectorDrop}
                onRemoveNote={handleRemoveNote}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-4 bottom-4 z-40 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleZoom(0.1)}
            className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-stone-100 transition hover:border-white/25 hover:bg-slate-900"
            aria-label={dictionary.board.zoomIn}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-0.1)}
            className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-stone-100 transition hover:border-white/25 hover:bg-slate-900"
            aria-label={dictionary.board.zoomOut}
          >
            -
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-[11px] text-stone-100 transition hover:border-white/25 hover:bg-slate-900"
          >
            {dictionary.board.centerView}
          </button>
        </div>
      </div>
    </div>
  );
}
