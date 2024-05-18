import { DataSource } from "@/lib/Models/DataSource";
import { FilterOperator, FilterValueType } from "@/lib/Models/Filter";

export function useExampleData(): DataSource {
  return {
    availableProperties: () => [
      {
        name: "Category",
        allowedValues: [FilterValueType.option],
      },
      {
        name: "Status",
        allowedValues: [FilterValueType.option],
      },
      {
        name: "Name",
        allowedValues: [FilterValueType.option],
      },
      {
        name: "Location",
        allowedValues: [FilterValueType.option],
      },
    ],
    operatorsForProperty: () => [
      FilterOperator.equal,
      FilterOperator.greaterThan,
    ],
    valuesForProperty: () => undefined,
  };
}
