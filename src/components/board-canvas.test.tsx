import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardCanvas } from "@/components/board-canvas";
import { getBoardSeed } from "@/lib/case-data";
import { useBoardStore } from "@/stores/board-store";

describe("BoardCanvas", () => {
  beforeEach(() => {
    useBoardStore.setState({ sessions: {} });
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
