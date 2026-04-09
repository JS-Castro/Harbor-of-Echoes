import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import * as caseSessionActions from "@/app/actions/case-session";
import { BoardCanvas } from "@/components/board-canvas";
import { getBoardSeed } from "@/lib/case-data";
import { useBoardStore } from "@/stores/board-store";

vi.mock("@/app/actions/case-session", () => ({
  loadBoardSnapshot: vi.fn(),
  saveBoardSnapshot: vi.fn(),
}));

describe("BoardCanvas", () => {
  beforeEach(() => {
    useBoardStore.setState({ sessions: {} });
    vi.restoreAllMocks();
    vi.mocked(caseSessionActions.loadBoardSnapshot).mockResolvedValue(null);
    vi.mocked(caseSessionActions.saveBoardSnapshot).mockResolvedValue();
  });

  it("adds and removes a manual note from the visible overlay controls", async () => {
    const user = userEvent.setup();
    const seed = getBoardSeed("vale-disappearance", "en");

    render(<BoardCanvas caseSlug="vale-disappearance" seed={seed} locale="en" />);

    const noteInput = screen.getByLabelText("Note Text");

    await user.clear(noteInput);
    await user.type(noteInput, "Check harbor manifest");
    await user.click(screen.getByRole("button", { name: "Add Note" }));

    expect(screen.getAllByText("Check harbor manifest")).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Remove Note" }).length).toBeGreaterThan(0);

    await user.click(screen.getAllByRole("button", { name: "Remove Note" }).at(-1)!);

    expect(screen.queryByText("Check harbor manifest")).not.toBeInTheDocument();
  });
});
