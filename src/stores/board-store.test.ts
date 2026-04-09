import { getBoardSeed } from "@/lib/case-data";
import { useBoardStore } from "@/stores/board-store";

describe("board store", () => {
  beforeEach(() => {
    useBoardStore.setState({ sessions: {} });
  });

  it("hydrates a case only once and preserves an existing session", () => {
    const seed = getBoardSeed("vale-disappearance", "en");
    const movedNodes = seed.nodes.map((node, index) =>
      index === 0
        ? {
            ...node,
            position: { x: node.position.x + 120, y: node.position.y + 80 },
          }
        : node,
    );

    useBoardStore.getState().hydrateCase("vale-disappearance", seed);
    useBoardStore.getState().setNodes("vale-disappearance", movedNodes);
    useBoardStore.getState().hydrateCase("vale-disappearance", seed);

    expect(useBoardStore.getState().sessions["vale-disappearance"]?.nodes[0]?.position).toEqual(
      movedNodes[0]?.position,
    );
  });

  it("resets the session back to the provided seed", () => {
    const seed = getBoardSeed("vale-disappearance", "pt-PT");
    const movedNodes = seed.nodes.map((node, index) =>
      index === 0
        ? {
            ...node,
            position: { x: node.position.x + 40, y: node.position.y + 40 },
          }
        : node,
    );

    useBoardStore.getState().hydrateCase("vale-disappearance", seed);
    useBoardStore.getState().setNodes("vale-disappearance", movedNodes);
    useBoardStore.getState().resetCase("vale-disappearance", seed);

    expect(useBoardStore.getState().sessions["vale-disappearance"]).toEqual(seed);
  });

  it("updates manual edges without losing nodes", () => {
    const seed = getBoardSeed("vale-disappearance", "en");
    const nextEdges = [
      ...seed.edges,
      {
        id: "manual-edge-1",
        source: seed.nodes[0]!.id,
        target: seed.nodes[1]!.id,
        label: "contradicts",
      },
    ];

    useBoardStore.getState().hydrateCase("vale-disappearance", seed);
    useBoardStore.getState().setEdges("vale-disappearance", nextEdges);

    expect(useBoardStore.getState().sessions["vale-disappearance"]?.edges).toEqual(nextEdges);
    expect(useBoardStore.getState().sessions["vale-disappearance"]?.nodes).toEqual(seed.nodes);
  });

  it("updates nodes without losing stored edges", () => {
    const seed = getBoardSeed("vale-disappearance", "en");
    const noteNode = {
      id: "note-1",
      type: "note",
      position: { x: 400, y: 480 },
      data: {
        label: "Check Pike timeline",
        meta: "Manual Note",
        tone: "note" as const,
      },
    };

    useBoardStore.getState().hydrateCase("vale-disappearance", seed);
    useBoardStore.getState().setEdges("vale-disappearance", [
      ...seed.edges,
      {
        id: "manual-edge-2",
        source: seed.nodes[0]!.id,
        target: noteNode.id,
        label: "follow up",
      },
    ]);
    useBoardStore.getState().setNodes("vale-disappearance", [...seed.nodes, noteNode]);

    expect(useBoardStore.getState().sessions["vale-disappearance"]?.nodes).toContainEqual(
      noteNode,
    );
    expect(useBoardStore.getState().sessions["vale-disappearance"]?.edges).toContainEqual({
      id: "manual-edge-2",
      source: seed.nodes[0]!.id,
      target: noteNode.id,
      label: "follow up",
    });
  });

  it("removes a note node and connected edges together", () => {
    const seed = getBoardSeed("vale-disappearance", "en");
    const noteNode = {
      id: "note-2",
      type: "note",
      position: { x: 420, y: 520 },
      data: {
        label: "Cross-check ferry locker receipt",
        meta: "Manual Note",
        tone: "note" as const,
      },
    };

    useBoardStore.getState().hydrateCase("vale-disappearance", seed);
    useBoardStore.getState().setNodes("vale-disappearance", [...seed.nodes, noteNode]);
    useBoardStore.getState().setEdges("vale-disappearance", [
      ...seed.edges,
      {
        id: "manual-edge-3",
        source: seed.nodes[0]!.id,
        target: noteNode.id,
        label: "cross-check",
      },
    ]);

    useBoardStore.getState().removeNode("vale-disappearance", noteNode.id);

    expect(
      useBoardStore.getState().sessions["vale-disappearance"]?.nodes.find(
        (node) => node.id === noteNode.id,
      ),
    ).toBeUndefined();
    expect(
      useBoardStore.getState().sessions["vale-disappearance"]?.edges.find(
        (edge) => edge.id === "manual-edge-3",
      ),
    ).toBeUndefined();
  });
});
