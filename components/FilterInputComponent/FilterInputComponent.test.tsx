import { FilterInputComponent } from "@/components/FilterInputComponent/FilterInputComponent";
import { useExampleData } from "@/lib/Data/useExampleData";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
describe("FilterInputComponent", () => {
  it("should add a token with the inputted filter attributes", async () => {
    const dataSource = useExampleData();
    const mockOnAddFilter = jest.fn();
    render(
      <FilterInputComponent
        filters={[]}
        dataSource={dataSource}
        onAddFilter={mockOnAddFilter}
        onDeleteFilter={jest.fn()}
      />
    );
    await userEvent.click(screen.getByRole("textbox"));
    await userEvent.click(screen.getByText("Genre"));
    await userEvent.click(screen.getByText("="));
    await userEvent.click(screen.getByText("Deep House"));
    expect(mockOnAddFilter).toBeCalledWith(
      expect.objectContaining({
        operator: "=",
        property: expect.objectContaining({ name: "Genre" }),
        value: expect.objectContaining({ value: "Deep House" }),
      })
    );
  });
});
