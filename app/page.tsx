"use client";
import { FilterInputComponent } from "@/components/FilterInputComponent/FilterInputComponent";
import { HasString } from "@/components/FilterInputComponent/FilterToken";
import { useExampleData } from "@/lib/Data/useExampleData";
import { Filter, FilterOperator, FilterValueType } from "@/lib/Models/Filter";
import { useCallback, useEffect, useState } from "react";

function Home() {
  const [filters, setFilters] = useState<Array<Filter<HasString>>>([]);

  const dataSource = useExampleData();

  return (
    <main className="h-full">
      <div className="p-4 flex flex-col">
        <FilterInputComponent
          dataSource={dataSource}
          filters={filters}
          onDeleteFilter={(filter) => {
            setFilters(filters.filter((f) => f != filter));
          }}
          onAddFilter={(filter: Filter<HasString>) => {
            if (!filters.find((f) => f.property == filter.property)) {
              setFilters([...filters, filter]);
            }
          }}
        />
        <div className="py-4 absolute bottom-9">
          Current Filters:{" "}
          {filters.map((f, i) => (
            <span key={i} className="p-3">
              {f.property.name}
              {f.operator}
              {f.value.value.toString()}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Home;
