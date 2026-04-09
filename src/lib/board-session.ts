import type { BoardSeed } from "@/lib/case-data";
import type { BoardSnapshot } from "@/stores/board-store";

type StoredBoardNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: BoardSeed["nodes"][number]["data"];
};

type StoredBoardNodeRecord = {
  nodeRefId: string;
  nodeType: string;
  posX: number;
  posY: number;
  note: string | null;
};

type StoredBoardEdgeRecord = {
  id: string;
  label: string | null;
  fromNode: { nodeRefId: string };
  toNode: { nodeRefId: string };
};

function fallbackNodeTone(nodeType: string) {
  return nodeType === "EVIDENCE"
    ? "evidence"
    : nodeType === "HYPOTHESIS"
      ? "note"
      : "entity";
}

function fallbackNodeType(nodeType: string) {
  return nodeType === "HYPOTHESIS" ? "note" : nodeType.toLowerCase();
}

function parseStoredBoardData(
  value: string | null,
  nodeType: string,
  nodeRefId: string,
) {
  if (!value) {
    return {
      label: nodeRefId,
      meta: nodeRefId,
      tone: fallbackNodeTone(nodeType),
    } satisfies BoardSeed["nodes"][number]["data"];
  }

  try {
    const parsed = parseJsonRecord(JSON.parse(value));
    const nestedData = parseJsonRecord(parsed.data);

    if (Object.keys(nestedData).length > 0) {
      return {
        label: typeof nestedData.label === "string" ? nestedData.label : nodeRefId,
        meta: typeof nestedData.meta === "string" ? nestedData.meta : nodeRefId,
        tone:
          nestedData.tone === "entity" ||
          nestedData.tone === "evidence" ||
          nestedData.tone === "note"
            ? nestedData.tone
            : fallbackNodeTone(nodeType),
      } satisfies BoardSeed["nodes"][number]["data"];
    }

    return {
      label: typeof parsed.label === "string" ? parsed.label : nodeRefId,
      meta: typeof parsed.meta === "string" ? parsed.meta : nodeRefId,
      tone:
        parsed.tone === "entity" || parsed.tone === "evidence" || parsed.tone === "note"
          ? parsed.tone
          : fallbackNodeTone(nodeType),
    } satisfies BoardSeed["nodes"][number]["data"];
  } catch {
    return {
      label: nodeRefId,
      meta: nodeRefId,
      tone: fallbackNodeTone(nodeType),
    } satisfies BoardSeed["nodes"][number]["data"];
  }
}

function parseJsonRecord(value: unknown) {
  return typeof value === "object" && value ? (value as Record<string, unknown>) : {};
}

export function serializeBoardNode(node: BoardSeed["nodes"][number]) {
  return JSON.stringify({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
  } satisfies StoredBoardNode);
}

export function deserializeBoardSnapshot(
  nodes: StoredBoardNodeRecord[],
  edges: StoredBoardEdgeRecord[],
): BoardSnapshot {
  return {
    nodes: nodes.map((node) => ({
      id: node.nodeRefId,
      type: fallbackNodeType(node.nodeType),
      position: {
        x: node.posX,
        y: node.posY,
      },
      data: parseStoredBoardData(node.note, node.nodeType, node.nodeRefId),
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.fromNode.nodeRefId,
      target: edge.toNode.nodeRefId,
      label: edge.label ?? undefined,
    })),
  };
}
