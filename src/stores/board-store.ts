"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BoardSeed } from "@/lib/case-data";

type BoardSnapshot = {
  nodes: BoardSeed["nodes"];
  edges: BoardSeed["edges"];
};

type BoardState = {
  sessions: Record<string, BoardSnapshot>;
  hydrateCase: (caseSlug: string, seed: BoardSnapshot) => void;
  setNodes: (caseSlug: string, nodes: BoardSeed["nodes"]) => void;
  resetCase: (caseSlug: string, seed: BoardSnapshot) => void;
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      sessions: {},
      hydrateCase: (caseSlug, seed) =>
        set((state) => {
          if (state.sessions[caseSlug]) {
            return state;
          }

          return {
            sessions: {
              ...state.sessions,
              [caseSlug]: seed,
            },
          };
        }),
      setNodes: (caseSlug, nodes) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [caseSlug]: {
              nodes,
              edges: state.sessions[caseSlug]?.edges ?? [],
            },
          },
        })),
      resetCase: (caseSlug, seed) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [caseSlug]: seed,
          },
        })),
    }),
    {
      name: "harbor-of-echoes-board",
      partialize: (state) => ({ sessions: state.sessions }),
    },
  ),
);
