import {
  FilterToken,
  HasString,
} from "@/components/FilterInputComponent/FilterToken";
import { Filter } from "@/lib/Models/Filter";

interface FilterTokenProps {
  filters: Array<Filter<HasString>>;
}

export const FilterTokens: React.FC<FilterTokenProps> = ({ filters }) => {
  return (
    <>
      {filters.map((filter, index) => {
        return (
          <div key={index}>
            <FilterToken filter={filter} />
          </div>
        );
      })}
    </>
  );
};
