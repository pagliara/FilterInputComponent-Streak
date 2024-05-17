// Represents a property, operator, and value to filter by
export type Filter<T> = {
  property: FilterProperty;
  operator: FilterOperator;
  value: FilterValue<T>;
};

// The value of the property
export type FilterValue<T> = {
  value: T;
  type: FilterValueType;
};

// Kinds of values
export enum FilterValueType {
  integer,
  string,
  option,
}

export enum FilterOperator {
  equal,
  notEqual,
  greaterThan,
  lessThan,
}

export type FilterProperty = {
  name: string;
  allowedValues: FilterValueType[];
};
