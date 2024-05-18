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
  onSelectProperty: (property: FilterProperty) => void;
}

const FilterInputToken: React.FC<PropsWithChildren> = ({ children }) => (
  <span className="animate-in fade-in pl-2 font-bold">{children}</span>
);

const FilterInputField: React.FC<{
  state: State;
  dispatch: Dispatch<Action>;
}> = ({ state, dispatch }) => {
  const {
    selectedProperty,
    selectedOperator,
    selectedValue,
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
      .filter((p) =>
        inputText?.length ?? 0 > 0
          ? inputText
            ? p.name.startsWith(inputText)
            : false
          : true
      );
  }, [dataSource, inputText]);

  function handleEnterKey() {
    switch (inputMode) {
      case FilterInputMode.property:
        if (filteredProperties.length == 0) return;
        switch (inputMode) {
          case FilterInputMode.property:
            const firstProperty = filteredProperties[0];
            dispatch({ type: Actions.SelectProperty, payload: firstProperty });
        }
        break;
      default:
        break;
    }
  }

  function handleDeleteKey(e: KeyboardEvent) {
    switch (inputMode) {
      case FilterInputMode.operator:
        if (inputText == "") {
          e.preventDefault();
          dispatch({ type: Actions.SelectProperty, payload: undefined });
        }
        break;
      default:
        break;
    }
  }

  const autocompleteItemsForMode = {
    [FilterInputMode.property]: filteredProperties.map((p) => p.name),
    [FilterInputMode.operator]:
      selectedProperty &&
      dataSource
        .operatorsForProperty(selectedProperty)
        .map((o) => o.toString()),
    [FilterInputMode.value]:
      selectedProperty &&
      dataSource
        .valuesForProperty<HasString>(selectedProperty)
        ?.map((v) => v.value.toString()),
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
        onBlur={(e) => dispatch({ type: Actions.OnBlur, payload: e })}
        onFocus={(e) => dispatch({ type: Actions.OnFocus, payload: e })}
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
interface State {
  inputText: string;
  inputMode: FilterInputMode;
  selectedProperty?: FilterProperty;
  selectedOperator?: FilterOperator;
  selectedValue?: FilterValue<HasString>;
  selectedToken?: number;
  dataSource: DataSource;
}

enum Actions {
  UpdateInputText,
  OnDeleteKey,
  OnEnterKey,
  OnBlur,
  OnFocus,
  SelectProperty,
  SelectOperator,
  SelectValue,
  SelectedToken,
}

interface UpdateInputTextAction {
  type: Actions.UpdateInputText;
  payload: string;
}

interface OnBlurAction {
  type: Actions.OnBlur;
  payload?: any;
}

interface OnFocusAction {
  type: Actions.OnFocus;
  payload?: any;
}

interface OnEnterKeyAction {
  type: Actions.OnEnterKey;
  payload?: any;
}

interface SelectPropertyAction {
  type: Actions.SelectProperty;
  payload?: FilterProperty;
}

type Action =
  | UpdateInputTextAction
  | OnBlurAction
  | OnFocusAction
  | OnEnterKeyAction
  | SelectPropertyAction;

function isNumeric(str: string) {
  return !isNaN(Number(str));
}

function allowUpdateValueForProperty(
  updatedText: string,
  property: FilterProperty
): boolean {
  if (property.allowedValues.includes(FilterValueType.string)) {
    return true;
  } else if (property.allowedValues.includes(FilterValueType.integer)) {
    return isNumeric(updatedText);
  }
  return false;
}

function allowUpdateOperatorForProperty(
  updatedText: string,
  property: FilterProperty,
  dataSource: DataSource
): boolean {
  if (updatedText == "") return true;
  return dataSource
    .operatorsForProperty(property)
    .includes(updatedText as FilterOperator);
}

function handleUpdateInputText(draft: State, action: Action) {
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

const reducer: ImmerReducer<State, Action> = (draft, action) => {
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

    default:
      break;
  }
};

export const FilterInputComponent: React.FC<
  FilterInputComponentProps<HasString>
> = ({ filters, dataSource, onSelectProperty }) => {
  const [state, dispatch] = useImmerReducer<State, Action>(reducer, {
    inputText: "",
    inputMode: FilterInputMode.property,
    dataSource, // TODO: need to update dataSource if updated
  });

  const { inputText, inputMode } = state;

  /*

  const handleBlur = () => {
    setInputMode(FilterInputMode.property);
    setInputText("");
    setSelectedProperty(undefined);
    setSelectedOperator(undefined);
    setSelectedValue(undefined);
  };
  */

  const handleFocus = () => {};

  return (
    <div className="flex flex-row items-center p-3 gap-2 border rounded-md shadow-md bg-white transition-all">
      <FilterTokens filters={filters} />
      <FilterInputField state={state} dispatch={dispatch} />
    </div>
  );
};
