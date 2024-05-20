import { FilterInputField } from "@/components/FilterInputComponent/FilterInputField";
import { HasString } from "@/components/FilterInputComponent/FilterToken";
import { FilterTokens } from "@/components/FilterInputComponent/FilterTokens";
import {
  Actions,
  FilterInputMode,
  useFilterInputState,
} from "@/components/FilterInputComponent/useFilterInputState";
import { DataSource } from "@/lib/Models/DataSource";
import { Filter } from "@/lib/Models/Filter";
import { useEffect } from "react";

interface FilterInputComponentProps<T> {
  filters: Filter<T>[];
  dataSource: DataSource;
  onAddFilter: (filter: Filter<T>) => void;
  onDeleteFilter: (filter: Filter<T>) => void;
}

export const FilterInputComponent: React.FC<
  FilterInputComponentProps<HasString>
> = ({ filters, dataSource, onAddFilter, onDeleteFilter }) => {
  const { state, dispatch } = useFilterInputState({
    inputText: "",
    inputMode: FilterInputMode.property,
    dataSource, // TODO: need to update dataSource if updated
  });

  useEffect(() => {
    const { selectedOperator, selectedProperty, selectedValue } = state;
    if (selectedProperty && selectedOperator && selectedValue) {
      onAddFilter({
        property: selectedProperty,
        operator: selectedOperator,
        value: selectedValue,
      });
      dispatch({ type: Actions.AddedToken });
    }
  }, [dispatch, onAddFilter, state]);

  return (
    <div className="flex flex-row flex-wrap items-center p-3 gap-2 border rounded-md shadow-md bg-white w-full">
      <FilterTokens
        filters={filters}
        selectedToken={state.selectedToken}
        onDeleteToken={(filter) => {
          onDeleteFilter(filter);
        }}
      />
      <FilterInputField state={state} dispatch={dispatch} filters={filters} />
    </div>
  );
};
