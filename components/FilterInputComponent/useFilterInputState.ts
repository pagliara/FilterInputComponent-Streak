import { HasString } from "@/components/FilterInputComponent/FilterToken";
import { DataSource } from "@/lib/Models/DataSource";
import {
  Filter,
  FilterOperator,
  FilterProperty,
  FilterPropertyAllowedValues,
  FilterValue,
} from "@/lib/Models/Filter";
import { ImmerReducer, useImmerReducer } from "use-immer";

export interface State<T> {
  inputText: string;
  inputMode: FilterInputMode;
  selectedProperty?: FilterProperty;
  selectedOperator?: FilterOperator;
  selectedValue?: FilterValue<T>;
  selectedToken?: Filter<T>;
  dataSource: DataSource;
}

export enum FilterInputMode {
  property,
  operator,
  value,
}

export enum Actions {
  UpdateInputText,
  SelectProperty,
  SelectOperator,
  SelectValue,
  SelectToken,
  AddedToken,
  DeletedToken,
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

interface DeletedTokenAction {
  type: Actions.DeletedToken;
}

interface SelectTokenAction<T> {
  type: Actions.SelectToken;
  payload?: Filter<T>;
}

export type Action =
  | UpdateInputTextAction
  | SelectPropertyAction
  | SelectOperatorAction
  | SelectValueAction
  | AddedTokenAction
  | DeletedTokenAction
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
    case Actions.DeletedToken:
      draft.selectedToken = undefined;
      break;
    case Actions.SelectToken:
      draft.selectedToken = action.payload;
      break;
    default:
      break;
  }
};

export function useFilterInputState(initial: State<HasString>) {
  const [state, dispatch] = useImmerReducer<State<HasString>, Action>(
    reducer,
    initial
  );
  return {
    state,
    dispatch,
  };
}
