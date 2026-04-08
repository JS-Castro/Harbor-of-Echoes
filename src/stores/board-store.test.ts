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
});
