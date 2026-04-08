"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";
import "reactflow/dist/style.css";

type SeedNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    meta: string;
    tone: "entity" | "evidence";
  };
};

type SeedEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

type BoardCanvasProps = {
  nodes: SeedNode[];
  edges: SeedEdge[];
};

function InvestigationNode({ data }: NodeProps<Node["data"]>) {
  const tone =
    data?.tone === "entity"
      ? "border-cyan-100/25 bg-cyan-100/8"
      : "border-amber-100/25 bg-amber-100/8";

  return (
    <div
      className={`w-60 rounded-[1.4rem] border px-4 py-4 text-stone-100 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-sm ${tone}`}
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-300">
        {data?.meta}
      </p>
      <p className="mt-2 text-lg leading-6 text-white">{data?.label}</p>
    </div>
  );
}

const nodeTypes = {
  entity: InvestigationNode,
  evidence: InvestigationNode,
};

export function BoardCanvas({ nodes, edges }: BoardCanvasProps) {
  const flowNodes = useMemo<Node[]>(
    () =>
      nodes.map((node) => ({
        ...node,
        draggable: false,
      })),
    [nodes],
  );

  const flowEdges = useMemo<Edge[]>(
    () =>
      edges.map((edge) => ({
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
    [edges],
  );

  return (
    <div className="h-[44rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(173,202,219,0.08),transparent_30%),linear-gradient(180deg,rgba(4,10,15,0.92),rgba(11,21,30,0.98))]">
      <ReactFlow
        fitView
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        minZoom={0.5}
        maxZoom={1.2}
        fitViewOptions={{ padding: 0.18 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#89a5b7" gap={32} size={1} />
        <Controls
          showInteractive={false}
          className="[&>button]:border-white/10 [&>button]:bg-slate-900 [&>button]:text-stone-100"
        />
      </ReactFlow>
    </div>
  );
}
