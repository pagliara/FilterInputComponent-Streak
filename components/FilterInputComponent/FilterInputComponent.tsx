import {
  FilterToken,
  HasString,
} from "@/components/FilterInputComponent/FilterToken";
import { FilterTokens } from "@/components/FilterInputComponent/FilterTokens";
import { AutocompleteField } from "@/components/ui/autocompleteField";
import { Filter } from "@/lib/Models/Filter";
import { useState } from "react";

enum FilterInputMode {
  property,
  operator,
  value,
}

interface FilterInputComponentProps<T> {
  filters: Filter<T>[];
}

export const FilterInputComponent: React.FC<
  FilterInputComponentProps<HasString>
> = ({ filters }) => {
  const [propertyText, setPropertyText] = useState<string | undefined>();
  const [inputMode, setInputMode] = useState(FilterInputMode.property);
  const [selectedToken, setSelectedToken] = useState<number | undefined>();

  return (
    <div className="flex flex-row p-3 gap-2 border rounded-md shadow-md bg-white">
      <FilterTokens filters={filters} />
      <AutocompleteField
        placeholder="Filter by..."
        className="text-2xl"
        selectedItem={2}
        value={propertyText}
        onChange={(e) => setPropertyText(e.target.value)}
      />
    </div>
  );
};
