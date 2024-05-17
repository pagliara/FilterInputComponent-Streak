import {
  FilterOperator,
  FilterProperty,
  FilterValue,
} from "@/lib/Models/Filter";

export interface DataSource {
  availableProperties: () => FilterProperty[];
  operatorsForProperty: (property: FilterProperty) => FilterOperator[];
  valuesForProperty: <T>(property: FilterProperty) => FilterValue<T>;
}
