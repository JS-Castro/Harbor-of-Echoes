"use client";

import { useEffect, useMemo } from "react";
import { clsx } from "clsx";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  applyNodeChanges,
  type Edge,
  type Node,
  type NodeProps,
  type NodeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import type { BoardSeed } from "@/lib/case-data";
import { useBoardStore } from "@/stores/board-store";

type BoardCanvasProps = {
  caseSlug: string;
  seed: BoardSeed;
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

export function BoardCanvas({ caseSlug, seed }: BoardCanvasProps) {
  const storedSession = useBoardStore((state) => state.sessions[caseSlug]);
  const hydrateCase = useBoardStore((state) => state.hydrateCase);
  const setNodes = useBoardStore((state) => state.setNodes);
  const resetCase = useBoardStore((state) => state.resetCase);

  useEffect(() => {
    hydrateCase(caseSlug, seed);
  }, [caseSlug, hydrateCase, seed]);

  const activeSession = storedSession ?? seed;

  const flowNodes = useMemo<Node[]>(
    () =>
      activeSession.nodes.map((node) => ({
        ...node,
        draggable: true,
      })),
    [activeSession.nodes],
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
            (node.data?.tone as "entity" | "evidence" | undefined) === "evidence"
              ? "evidence"
              : "entity",
        },
      }),
    );

    setNodes(caseSlug, nextNodes);
  }

  function handleReset() {
    resetCase(caseSlug, seed);
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(173,202,219,0.08),transparent_30%),linear-gradient(180deg,rgba(4,10,15,0.92),rgba(11,21,30,0.98))]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Session State
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Drag nodes to reorganize the case board. Layout is stored locally.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className={clsx(
            "rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-100 transition",
            "hover:border-white/25 hover:bg-white/5",
          )}
        >
          Reset Board
        </button>
      </div>

      <div className="h-[40rem] overflow-hidden">
        <ReactFlow
          fitView
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          minZoom={0.5}
          maxZoom={1.2}
          fitViewOptions={{ padding: 0.18 }}
          proOptions={{ hideAttribution: true }}
          onNodesChange={handleNodesChange}
        >
          <Background color="#89a5b7" gap={32} size={1} />
          <Controls
            showInteractive={false}
            className="[&>button]:border-white/10 [&>button]:bg-slate-900 [&>button]:text-stone-100"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
