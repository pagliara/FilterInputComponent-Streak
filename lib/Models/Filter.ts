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
}

export enum FilterOperator {
  equal = "=",
  notEqual = "!=",
  greaterThan = ">",
  lessThan = "<",
}

export enum FilterPropertyAllowedValues {
  integer,
  string,
  option,
}

export type FilterProperty = {
  name: string;
  allowedValues: FilterPropertyAllowedValues[];
};
