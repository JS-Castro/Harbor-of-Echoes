import type { BoardSeed } from "@/lib/case-data";

export type OverlayPoint = {
  x: number;
  y: number;
};

export type BoardViewport = OverlayPoint & {
  zoom: number;
};

export type ConnectorSide = "source" | "target";

export type LinkDragSource = {
  nodeId: string;
  side: ConnectorSide;
};

export type ConnectorCenters = Record<
  string,
  {
    source?: OverlayPoint;
    target?: OverlayPoint;
  }
>;

export const BOARD_SURFACE_SIZE = 3200;
export const BOARD_SURFACE_OFFSET = 1200;
export const DEFAULT_VIEWPORT: BoardViewport = { x: 0, y: 0, zoom: 0.9 };
export const FALLBACK_NODE_SIZE = { width: 240, height: 120 };

export function clampZoom(zoom: number) {
  return Math.min(1.3, Math.max(0.55, Number(zoom.toFixed(2))));
}

export function resolveManualEdge(
  startNodeId: string,
  startSide: ConnectorSide,
  endNodeId: string,
  endSide: ConnectorSide,
) {
  if (startNodeId === endNodeId || startSide === endSide) {
    return null;
  }

  if (startSide === "source" && endSide === "target") {
    return { source: startNodeId, target: endNodeId };
  }

  if (startSide === "target" && endSide === "source") {
    return { source: endNodeId, target: startNodeId };
  }

  return null;
}

export function screenToBoardPosition(
  clientX: number,
  clientY: number,
  bounds: DOMRect,
  viewport: BoardViewport,
) {
  return {
    x: (clientX - bounds.left - viewport.x) / viewport.zoom,
    y: (clientY - bounds.top - viewport.y) / viewport.zoom,
  };
}

export function getFallbackConnectorPoint(
  side: ConnectorSide,
  node: BoardSeed["nodes"][number],
  nodeSize: { width: number; height: number },
) {
  return {
    x: side === "source" ? node.position.x + nodeSize.width : node.position.x,
    y: node.position.y + nodeSize.height / 2,
  };
}
