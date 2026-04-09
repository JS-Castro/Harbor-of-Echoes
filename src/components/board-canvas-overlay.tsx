"use client";

import { clsx } from "clsx";
import type { Node } from "reactflow";
import type { BoardSeed } from "@/lib/case-data";
import type {
  ConnectorSide,
  LinkDragSource,
  OverlayPoint,
} from "@/components/board-canvas-helpers";

type OverlayEdgesProps = {
  edges: BoardSeed["edges"];
  nodes: BoardSeed["nodes"];
  selectedEdgeId: string | null;
  linkDragSource: LinkDragSource | null;
  linkPointer: OverlayPoint | null;
  getConnectorPoint: (
    nodeId: string,
    side: ConnectorSide,
    position: { x: number; y: number },
  ) => OverlayPoint;
  onSelectEdge: (edgeId: string) => void;
};

export function BoardOverlayEdges({
  edges,
  nodes,
  selectedEdgeId,
  linkDragSource,
  linkPointer,
  getConnectorPoint,
  onSelectEdge,
}: OverlayEdgesProps) {
  return (
    <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible">
      {edges.map((edge) => {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        const targetNode = nodes.find((node) => node.id === edge.target);

        if (!sourceNode || !targetNode) {
          return null;
        }

        const sourcePoint = getConnectorPoint(sourceNode.id, "source", sourceNode.position);
        const targetPoint = getConnectorPoint(targetNode.id, "target", targetNode.position);
        const midX = (sourcePoint.x + targetPoint.x) / 2;
        const midY = (sourcePoint.y + targetPoint.y) / 2;

        return (
          <g key={`overlay-edge-${edge.id}`}>
            <line
              x1={sourcePoint.x}
              y1={sourcePoint.y}
              x2={targetPoint.x}
              y2={targetPoint.y}
              stroke="transparent"
              strokeWidth="18"
              className="pointer-events-auto cursor-pointer"
              onClick={() => onSelectEdge(edge.id)}
            />
            <line
              x1={sourcePoint.x}
              y1={sourcePoint.y}
              x2={targetPoint.x}
              y2={targetPoint.y}
              stroke={selectedEdgeId === edge.id ? "#fde68a" : "#d7e3ec"}
              strokeOpacity={selectedEdgeId === edge.id ? "0.95" : "0.6"}
              strokeWidth={selectedEdgeId === edge.id ? "3" : "2"}
            />
            {edge.label ? (
              <text
                x={midX}
                y={midY - 14}
                fill="#dce7ee"
                fontSize="11"
                textAnchor="middle"
                letterSpacing="0.12em"
                className="pointer-events-none"
              >
                {edge.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {linkDragSource && linkPointer ? (() => {
        const sourceNode = nodes.find((node) => node.id === linkDragSource.nodeId);

        if (!sourceNode) {
          return null;
        }

        const sourcePoint = getConnectorPoint(
          sourceNode.id,
          linkDragSource.side,
          sourceNode.position,
        );

        return (
          <line
            x1={sourcePoint.x}
            y1={sourcePoint.y}
            x2={linkPointer.x}
            y2={linkPointer.y}
            stroke="#fde68a"
            strokeOpacity="0.9"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
        );
      })() : null}
    </svg>
  );
}

type OverlayNodeCardProps = {
  node: Node;
  draggingNodeId: string | null;
  removeNoteLabel: string;
  registerNodeElement: (nodeId: string, element: HTMLDivElement | null) => void;
  registerConnectorElement: (
    nodeId: string,
    side: ConnectorSide,
    element: HTMLButtonElement | null,
  ) => void;
  onCardPointerDown: (
    event: React.PointerEvent<HTMLDivElement>,
    nodeId: string,
    position: { x: number; y: number },
  ) => void;
  onCardClick: () => void;
  onConnectorPointerDown: (
    event: React.PointerEvent<HTMLButtonElement>,
    nodeId: string,
    position: { x: number; y: number },
    side: ConnectorSide,
  ) => void;
  onConnectorPointerEnter: (
    event: React.PointerEvent<HTMLButtonElement>,
    nodeId: string,
    side: ConnectorSide,
  ) => void;
  onConnectorPointerUp: (
    event: React.PointerEvent<HTMLButtonElement>,
    nodeId: string,
    side: ConnectorSide,
  ) => void;
  onRemoveNote: (event: React.MouseEvent<HTMLButtonElement>, nodeId: string) => void;
};

export function BoardOverlayNodeCard({
  node,
  draggingNodeId,
  removeNoteLabel,
  registerNodeElement,
  registerConnectorElement,
  onCardPointerDown,
  onCardClick,
  onConnectorPointerDown,
  onConnectorPointerEnter,
  onConnectorPointerUp,
  onRemoveNote,
}: OverlayNodeCardProps) {
  return (
    <div
      ref={(element) => registerNodeElement(node.id, element)}
      className={clsx(
        "pointer-events-auto absolute w-60 rounded-[1.4rem] border px-4 py-4 shadow-[0_18px_52px_rgba(0,0,0,0.3)] backdrop-blur-sm",
        "cursor-grab active:cursor-grabbing",
        node.data?.tone === "note"
          ? "border-emerald-200/75 bg-emerald-300/32"
          : node.data?.tone === "evidence"
            ? "border-amber-200/70 bg-amber-200/24"
            : "border-cyan-200/70 bg-cyan-200/24",
        draggingNodeId === node.id ? "ring-2 ring-white/30" : "",
      )}
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
      }}
      onPointerDown={(event) => onCardPointerDown(event, node.id, node.position)}
      onClick={onCardClick}
    >
      <button
        type="button"
        ref={(element) => registerConnectorElement(node.id, "target", element)}
        onPointerDown={(event) => onConnectorPointerDown(event, node.id, node.position, "target")}
        onPointerEnter={(event) => onConnectorPointerEnter(event, node.id, "target")}
        onPointerUp={(event) => onConnectorPointerUp(event, node.id, "target")}
        className="absolute left-0 top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-label={`target-${node.id}`}
      >
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-500/25 bg-slate-300/20" />
      </button>
      <button
        type="button"
        ref={(element) => registerConnectorElement(node.id, "source", element)}
        onPointerDown={(event) => onConnectorPointerDown(event, node.id, node.position, "source")}
        onPointerEnter={(event) => onConnectorPointerEnter(event, node.id, "source")}
        onPointerUp={(event) => onConnectorPointerUp(event, node.id, "source")}
        className="absolute right-0 top-1/2 z-10 h-8 w-8 translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-label={`source-${node.id}`}
      >
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/15 bg-cyan-200/18" />
      </button>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-200">
          {String(node.data?.meta ?? "")}
        </p>
        {node.data?.tone === "note" ? (
          <button
            type="button"
            onClick={(event) => onRemoveNote(event, node.id)}
            className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-200 transition hover:border-white/25 hover:bg-white/5"
          >
            {removeNoteLabel}
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-base font-medium text-white">
        {String(node.data?.label ?? "")}
      </p>
    </div>
  );
}
