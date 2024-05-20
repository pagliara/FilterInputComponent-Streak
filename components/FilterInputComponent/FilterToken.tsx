import { Filter, FilterOperator } from "@/lib/Models/Filter";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface FilterTokenProps<T> {
  filter: Filter<T>;
  isSelected?: boolean;
  onDelete: () => void;
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
  onDelete,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isSelected) {
      ref.current?.focus();
    }
  }, [isSelected]);
  return (
    <div
      tabIndex={0}
      ref={ref}
      onKeyDown={(e) => {
        if (e.key == "Delete" || e.key == "Backspace") {
          onDelete();
        }
      }}
      className={cn(
        "flex flex-row items-center",
        "p-1 px-3",
        "rounded-md border border-gray-300 bg-gray-200",
        "cursor-pointer",
        "hover:border-gray-400 hover:bg-gray-300",
        {
          " bg-blue-200 border-blue-400": isSelected,
          "hover:border-blue-400 hover:bg-blue-300": isSelected,
        }
      )}
    >
      <span>{filter.property.name}</span>
      <span className="text-2xl p-1">{operatorToString[filter.operator]}</span>
      <span className="font-bold pt-0.5">{filter.value.value.toString()}</span>
    </div>
  );
};
