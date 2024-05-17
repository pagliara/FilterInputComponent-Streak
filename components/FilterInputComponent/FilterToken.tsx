import { Filter, FilterOperator } from "@/lib/Models/Filter";
import { cn } from "@/lib/utils";

interface FilterTokenProps<T> {
  filter: Filter<T>;
  isSelected?: boolean;
}

export interface HasString {
  toString: () => string;
}

const operatorToString: Record<FilterOperator, string> = {
  [FilterOperator.equal]: "=",
  [FilterOperator.lessThan]: "<",
  [FilterOperator.greaterThan]: ">",
  [FilterOperator.notEqual]: "!=",
};

export const FilterToken: React.FC<FilterTokenProps<HasString>> = ({
  filter,
  isSelected = false,
}) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center",
        "p-1 px-3",
        "rounded-md border border-gray-300 bg-gray-200",
        "cursor-pointer",
        "hover:border-gray-400 hover:bg-gray-300",
        {
          " bg-blue-200 border-blue-400": isSelected,
        }
      )}
    >
      <span>{filter.property.name}</span>
      <span className="text-2xl p-1">{operatorToString[filter.operator]}</span>
      <span className="font-bold pt-0.5">{filter.value.value.toString()}</span>
    </div>
  );
};
