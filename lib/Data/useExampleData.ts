import { DataSource } from "@/lib/Models/DataSource";
import {
  FilterOperator,
  FilterProperty,
  FilterPropertyAllowedValues,
  FilterValue,
  FilterValueType,
} from "@/lib/Models/Filter";

export function useExampleData(): DataSource {
  const properties: FilterProperty[] = [
    {
      name: "Genre",
      allowedValues: [FilterPropertyAllowedValues.option],
    },
    {
      name: "BPM",
      allowedValues: [
        FilterPropertyAllowedValues.option,
        FilterPropertyAllowedValues.integer,
      ],
    },
    {
      name: "Artist Name",
      allowedValues: [
        FilterPropertyAllowedValues.option,
        FilterPropertyAllowedValues.string,
      ],
    },
    {
      name: "Location",
      allowedValues: [FilterPropertyAllowedValues.option],
    },
  ];
  const numericOperators = [
    FilterOperator.equal,
    FilterOperator.greaterThan,
    FilterOperator.lessThan,
    FilterOperator.notEqual,
  ];
  const stringOperators = [FilterOperator.equal, FilterOperator.notEqual];

  return {
    availableProperties: () => properties,
    operatorsForProperty: (property) => {
      switch (property.name) {
        case "BPM":
          return numericOperators;
        default:
          return stringOperators;
      }
    },
    valuesForProperty: <T>(property: FilterProperty) => {
      switch (property.name) {
        case "Genre":
          return [
            "Techno",
            "Hard Techno",
            "Progressive House",
            "Deep House",
            "Minimal House",
            "Drum & Bass",
          ].map((v) => {
            return { value: v, type: FilterValueType.string } as FilterValue<T>;
          });
        case "BPM":
          return [128, 130, 140, 144].map((v) => {
            return {
              value: v,
              type: FilterValueType.integer,
            } as FilterValue<T>;
          });
        default:
          return [];
      }
    },
  };
}
