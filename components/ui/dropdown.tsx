import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export interface DropdownProps {
  items: Array<string>;
  selectedItem?: number;
  onClickItem: (index: number) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  selectedItem,
  onClickItem,
  items,
}) => {
  return (
    <div
      className={cn(
        "absolute top-[70px]",
        "bg-white rounded-md shadow-lg",
        "p-2 w-full h-min max-h-80 overflow-scroll",
        "animate-in slide-in-from-top-[70px]"
      )}
    >
      {items.length > 0 ? (
        items.map((item, index) => {
          return (
            <div
              key={index}
              onClick={(e) => {
                e.preventDefault();
                onClickItem(index);
              }}
            >
              <DropdownItem selected={selectedItem == index}>
                {item}
              </DropdownItem>
            </div>
          );
        })
      ) : (
        <DropdownItem>
          <p className="w-full">No results.</p>
        </DropdownItem>
      )}
    </div>
  );
};

const DropdownItem: React.FC<PropsWithChildren<{ selected?: boolean }>> = ({
  children,
  selected,
}) => {
  return (
    <div
      className={cn("rounded p-2 hover:bg-blue-100 font-medium text-lg", {
        "bg-blue-100": selected,
      })}
    >
      {children}
    </div>
  );
};
