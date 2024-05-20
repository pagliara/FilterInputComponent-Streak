import { FilterInputToken } from "@/components/FilterInputComponent/FilterInputToken";
import { HasString } from "@/components/FilterInputComponent/FilterToken";
import {
  Action,
  Actions,
  FilterInputMode,
  State,
} from "@/components/FilterInputComponent/useFilterInputState";
import { AutocompleteField } from "@/components/ui/autocompleteField";
import {
  Filter,
  FilterProperty,
  FilterPropertyAllowedValues,
  FilterValue,
  FilterValueType,
} from "@/lib/Models/Filter";
import {
  Dispatch,
  KeyboardEventHandler,
  KeyboardEvent,
  useMemo,
  useState,
  LegacyRef,
  forwardRef,
} from "react";

export const FilterInputField = forwardRef(
  (
    props: {
      filters: Filter<HasString>[];
      state: State<HasString>;
      dispatch: Dispatch<Action>;
    },
    ref
  ) => {
    const { state, dispatch, filters } = props;
    const {
      selectedProperty,
      selectedOperator,
      inputMode,
      inputText,
      dataSource,
    } = state;
    const [selectedAutocompleteItem, setSelectedAutocompleteItem] = useState(0);
    const placeholderForMode: Record<FilterInputMode, string> = {
      [FilterInputMode.property]: "Filter by...",
      [FilterInputMode.operator]: "",
      [FilterInputMode.value]: "",
    };

    const filteredProperties = useMemo(() => {
      return dataSource
        .availableProperties()
        .filter((p: FilterProperty) =>
          inputText?.length ?? 0 > 0
            ? inputText
              ? p.name.toLowerCase().startsWith(inputText.toLowerCase())
              : false
            : true
        );
    }, [dataSource, inputText]);

    const filteredOperators = useMemo(() => {
      if (!selectedProperty) return;
      return dataSource
        .operatorsForProperty(selectedProperty)
        .filter((o: HasString) => o.toString().includes(inputText));
    }, [dataSource, inputText, selectedProperty]);

    const filteredValues = useMemo(() => {
      if (!selectedProperty) return;
      return (
        dataSource.valuesForProperty<HasString>(selectedProperty) ?? []
      ).filter((v: FilterValue<HasString>) =>
        v.value.toString().toLowerCase().includes(inputText.toLowerCase())
      );
    }, [dataSource, inputText, selectedProperty]);

    function handleEnterKey() {
      handleSelectDropdownItem(selectedAutocompleteItem);
    }

    function handleSelectDropdownItem(index: number) {
      switch (inputMode) {
        case FilterInputMode.property:
          if (filteredProperties.length == 0) return;
          // TODO: support for using the selected item from the autocomplete dropdown
          const firstProperty = filteredProperties[index];
          dispatch({ type: Actions.SelectProperty, payload: firstProperty });
          break;
        case FilterInputMode.operator:
          if (!filteredOperators || filteredOperators.length == 0) return;
          const firstOperator = filteredOperators[index];
          dispatch({ type: Actions.SelectOperator, payload: firstOperator });
          break;
        case FilterInputMode.value:
          if (
            selectedProperty?.allowedValues.includes(
              FilterPropertyAllowedValues.string
            )
          ) {
            dispatch({
              type: Actions.SelectValue,
              payload: {
                value: inputText,
                type: FilterValueType.string,
              },
            });
          } else if (
            selectedProperty?.allowedValues.includes(
              FilterPropertyAllowedValues.integer
            )
          ) {
            dispatch({
              type: Actions.SelectValue,
              payload: {
                value: Number(inputText),
                type: FilterValueType.integer,
              },
            });
          } else {
            // use the selected option
            if (!filteredValues || filteredValues.length == 0) return;
            const selectedValue = filteredValues[index];
            dispatch({
              type: Actions.SelectValue,
              payload: selectedValue,
            });
          }
          break;
        default:
          break;
      }
    }

    function handleDeleteKey(e: KeyboardEvent) {
      switch (inputMode) {
        case FilterInputMode.property:
          if (inputText == "") {
            if (filters.length > 0) {
              (e.target as HTMLInputElement).blur();
              dispatch({
                type: Actions.SelectToken,
                payload: filters[filters.length - 1],
              });
            }
          }
        case FilterInputMode.operator:
          if (inputText == "") {
            e.preventDefault();
            dispatch({ type: Actions.SelectProperty, payload: undefined });
          }
          break;
        case FilterInputMode.value:
          if (inputText == "") {
            e.preventDefault();
            dispatch({ type: Actions.SelectOperator, payload: undefined });
          }
          break;
        default:
          break;
      }
    }

    function handleArrowDown() {
      setSelectedAutocompleteItem(
        Math.min(
          (autocompleteItemsForMode[inputMode] ?? []).length - 1,
          selectedAutocompleteItem + 1
        )
      );
    }

    function handleArrowUp() {
      setSelectedAutocompleteItem(Math.max(0, selectedAutocompleteItem - 1));
    }

    const autocompleteItemsForMode = {
      [FilterInputMode.property]: filteredProperties.map((p) => p.name),
      [FilterInputMode.operator]: filteredOperators,
      [FilterInputMode.value]: filteredValues?.map((v) => v.value.toString()),
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
      switch (e.key) {
        case "Enter":
          handleEnterKey();
          return;
        case "Delete":
        case "Backspace":
          handleDeleteKey(e);
          return;
        case "ArrowDown":
          handleArrowDown();
          return;
        case "ArrowUp":
          handleArrowUp();
          return;
        case "Escape":
          ref && "current" in ref
            ? (ref.current as HTMLInputElement).blur()
            : null;
          return;
      }
    };

    function handleClickItem(item: number) {
      handleSelectDropdownItem(item);
    }

    return (
      <div className="flex flex-row items-center flex-grow">
        {selectedProperty ? (
          <FilterInputToken>{selectedProperty.name}</FilterInputToken>
        ) : undefined}
        {selectedOperator ? (
          <FilterInputToken>{selectedOperator}</FilterInputToken>
        ) : undefined}
        <AutocompleteField
          ref={ref}
          onClickItem={handleClickItem}
          onFocus={(e) => {
            setSelectedAutocompleteItem(0);
            dispatch({ type: Actions.SelectToken, payload: undefined });
          }}
          items={autocompleteItemsForMode[inputMode] ?? []}
          placeholder={placeholderForMode[inputMode]}
          className="text-xl w-full"
          selectedItem={selectedAutocompleteItem}
          value={inputText}
          onKeyDown={handleKeyDown}
          onChange={(e) =>
            dispatch({ type: Actions.UpdateInputText, payload: e.target.value })
          }
        />
      </div>
    );
  }
);

FilterInputField.displayName = "FilterInputField";
