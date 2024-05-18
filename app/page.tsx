"use client";
import { FilterInputComponent } from "@/components/FilterInputComponent/FilterInputComponent";
import { HasString } from "@/components/FilterInputComponent/FilterToken";
import { useExampleData } from "@/lib/Data/useExampleData";
import { Filter, FilterOperator, FilterValueType } from "@/lib/Models/Filter";
import { useCallback, useEffect, useState } from "react";

function Home() {
  const [filters, setFilters] = useState<Array<Filter<HasString>>>([
    {
      property: {
        name: "Category",
        allowedValues: [FilterValueType.option],
      },
      operator: FilterOperator.equal,
      value: {
        value: "Toys",
        type: FilterValueType.option,
      },
    },
    {
      property: {
        name: "Status",
        allowedValues: [FilterValueType.option],
      },
      operator: FilterOperator.lessThan,
      value: {
        value: "8",
        type: FilterValueType.integer,
      },
    },
  ]);

  const dataSource = useExampleData();

  return (
    <main className="h-full">
      <div className="p-4">
        <FilterInputComponent dataSource={dataSource} filters={filters} />
      </div>
    </main>
  );
}

export default Home;
