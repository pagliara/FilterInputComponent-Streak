import {
  FilterToken,
  HasString,
} from "@/components/FilterInputComponent/FilterToken";
import { FilterTokens } from "@/components/FilterInputComponent/FilterTokens";
import { AutocompleteField } from "@/components/ui/autocompleteField";
import { DataSource } from "@/lib/Models/DataSource";
import {
  Filter,
  FilterOperator,
  FilterProperty,
  FilterPropertyAllowedValues,
  FilterValue,
  FilterValueType,
} from "@/lib/Models/Filter";
import {
  Dispatch,
  KeyboardEventHandler,
  KeyboardEvent,
  PropsWithChildren,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import { ImmerReducer, useImmerReducer } from "use-immer";

enum FilterInputMode {
  property,
  operator,
  value,
}

interface FilterInputComponentProps<T> {
  filters: Filter<T>[];
  dataSource: DataSource;
  onAddFilter: (filter: Filter<T>) => void;
  onDeleteFilter: (filter: Filter<T>) => void;
}

const FilterInputToken: React.FC<PropsWithChildren> = ({ children }) => (
  <span className="animate-in fade-in pl-2 font-bold">{children}</span>
);

const FilterInputField: React.FC<{
  filters: Filter<HasString>[];
  state: State<HasString>;
  dispatch: Dispatch<Action>;
}> = ({ state, dispatch, filters }) => {
  const {
    selectedProperty,
    selectedOperator,
    inputMode,
    inputText,
    dataSource,
  } = state;
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
            ? p.name.startsWith(inputText)
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
      v.value.toString().includes(inputText)
    );
  }, [dataSource, inputText, selectedProperty]);

  function handleEnterKey() {
    switch (inputMode) {
      case FilterInputMode.property:
        if (filteredProperties.length == 0) return;
        // TODO: support for using the selected item from the autocomplete dropdown
        const firstProperty = filteredProperties[0];
        dispatch({ type: Actions.SelectProperty, payload: firstProperty });
        break;
      case FilterInputMode.operator:
        if (!filteredOperators || filteredOperators.length == 0) return;
        const firstOperator = filteredOperators[0];
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
        } else {
          // use the selected option
          if (!filteredValues || filteredValues.length == 0) return;
          const selectedValue = filteredValues[0];
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
        console.log("delete key");
        handleDeleteKey(e);
        return;
    }
  };

  return (
    <div className="flex flex-row items-center">
      {selectedProperty ? (
        <FilterInputToken>{selectedProperty.name}</FilterInputToken>
      ) : undefined}
      {selectedOperator ? (
        <FilterInputToken>{selectedOperator}</FilterInputToken>
      ) : undefined}
      <AutocompleteField
        //onBlur={(e) => dispatch({ type: Actions.OnBlur, payload: e })}
        onFocus={(e) =>
          dispatch({ type: Actions.SelectToken, payload: undefined })
        }
        items={autocompleteItemsForMode[inputMode] ?? []}
        placeholder={placeholderForMode[inputMode]}
        className="text-xl"
        selectedItem={2}
        value={inputText}
        onKeyDown={handleKeyDown}
        onChange={(e) =>
          dispatch({ type: Actions.UpdateInputText, payload: e.target.value })
        }
      />
    </div>
  );
};

// The state of the component as a whole...
// The current text of the input field
// The current filter being edited/inputted
// The selection state of any current filter tokens
interface State<T> {
  inputText: string;
  inputMode: FilterInputMode;
  selectedProperty?: FilterProperty;
  selectedOperator?: FilterOperator;
  selectedValue?: FilterValue<T>;
  selectedToken?: Filter<T>;
  dataSource: DataSource;
}

enum Actions {
  UpdateInputText,
  SelectProperty,
  SelectOperator,
  SelectValue,
  SelectToken,
  AddedToken,
}

interface UpdateInputTextAction {
  type: Actions.UpdateInputText;
  payload: string;
}

interface SelectPropertyAction {
  type: Actions.SelectProperty;
  payload?: FilterProperty;
}

interface SelectOperatorAction {
  type: Actions.SelectOperator;
  payload?: FilterOperator;
}

interface SelectValueAction {
  type: Actions.SelectValue;
  payload: FilterValue<any>;
}

interface AddedTokenAction {
  type: Actions.AddedToken;
}

interface SelectTokenAction<T> {
  type: Actions.SelectToken;
  payload?: Filter<T>;
}

type Action =
  | UpdateInputTextAction
  | SelectPropertyAction
  | SelectOperatorAction
  | SelectValueAction
  | AddedTokenAction
  | SelectTokenAction<HasString>;

function isNumeric(str: string) {
  return !isNaN(Number(str));
}

function allowUpdateValueForProperty(
  updatedText: string,
  property: FilterProperty
): boolean {
  if (property.allowedValues.includes(FilterPropertyAllowedValues.string)) {
    return true;
  } else if (
    property.allowedValues.includes(FilterPropertyAllowedValues.integer)
  ) {
    return isNumeric(updatedText);
  }
  return true;
}

function allowUpdateOperatorForProperty(
  updatedText: string,
  property: FilterProperty,
  dataSource: DataSource
): boolean {
  if (updatedText == "") return true;
  return Boolean(
    dataSource
      .operatorsForProperty(property)
      .find((o) => o.toString().includes(updatedText))
  );
}

function handleUpdateInputText(
  draft: State<HasString>,
  action: UpdateInputTextAction
) {
  switch (draft.inputMode) {
    case FilterInputMode.property:
      draft.inputText = action.payload;
      break;
    case FilterInputMode.operator:
      if (
        draft.selectedProperty &&
        allowUpdateOperatorForProperty(
          action.payload,
          draft.selectedProperty,
          draft.dataSource
        )
      ) {
        draft.inputText = action.payload;
      }
      break;
    case FilterInputMode.value:
      if (draft.selectedProperty) {
        if (
          allowUpdateValueForProperty(action.payload, draft.selectedProperty)
        ) {
          draft.inputText = action.payload;
        }
      }
      break;
  }
}

const reducer: ImmerReducer<State<HasString>, Action> = (draft, action) => {
  switch (action.type) {
    case Actions.UpdateInputText:
      handleUpdateInputText(draft, action);
      break;
    case Actions.SelectProperty:
      if (action.payload) {
        draft.selectedProperty = action.payload;
        draft.inputMode = FilterInputMode.operator;
        draft.inputText = "";
      } else {
        draft.inputText = draft.selectedProperty?.name ?? "";
        draft.selectedProperty = undefined;
        draft.inputMode = FilterInputMode.property;
      }
      break;
    case Actions.SelectOperator:
      if (action.payload) {
        draft.selectedOperator = action.payload;
        draft.inputMode = FilterInputMode.value;
        draft.inputText = "";
      } else {
        draft.inputText = draft.selectedOperator ?? "";
        draft.selectedOperator = undefined;
        draft.inputMode = FilterInputMode.operator;
      }
      break;
    case Actions.SelectValue:
      if (!draft.selectedProperty || !draft.selectedOperator) return;
      draft.selectedValue = action.payload;
      break;
    case Actions.AddedToken:
      draft.inputMode = FilterInputMode.property;
      draft.inputText = "";
      draft.selectedProperty = undefined;
      draft.selectedOperator = undefined;
      draft.selectedValue = undefined;
      break;
    case Actions.SelectToken:
      draft.selectedToken = action.payload;
      break;
    default:
      break;
  }
};

export const FilterInputComponent: React.FC<
  FilterInputComponentProps<HasString>
> = ({ filters, dataSource, onAddFilter, onDeleteFilter }) => {
  const [state, dispatch] = useImmerReducer<State<HasString>, Action>(reducer, {
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
    <div className="flex flex-row items-center p-3 gap-2 border rounded-md shadow-md bg-white transition-all">
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
