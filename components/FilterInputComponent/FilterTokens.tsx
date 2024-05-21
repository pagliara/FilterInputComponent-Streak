import {
  FilterToken,
  HasString,
} from "@/components/FilterInputComponent/FilterToken";
import { Filter } from "@/lib/Models/Filter";

interface FilterTokenProps<T> {
  filters: Array<Filter<T>>;
  selectedToken?: Filter<T>;
  onDeleteToken: (token: Filter<T>) => void;
  onClickToken: (token: Filter<T>) => void;
}

export const FilterTokens: React.FC<FilterTokenProps<HasString>> = ({
  filters,
  selectedToken,
  onDeleteToken,
  onClickToken,
}) => {
  return (
    <>
      {filters.map((filter, index) => {
        return (
          <div key={index} onClick={() => onClickToken(filter)}>
            <FilterToken
              isSelected={selectedToken == filter}
              filter={filter}
              onDelete={() => onDeleteToken(filter)}
            />
          </div>
        );
      })}
    </>
  );
};
