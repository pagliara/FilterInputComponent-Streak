import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export interface DropdownProps {
  open: boolean;
  items: Array<string>;
  selectedItem?: number;
  onClickItem: (index: number) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  open,
  selectedItem,
  onClickItem,
  items,
}) => {
  return (
    <div
      className={cn(
        "absolute top-[50px]",
        "bg-white rounded-md shadow-lg",
        "p-2 w-full h-min max-h-80 overflow-scroll",
        "animate-in slide-in-from-top-[70px]",
        {
          hidden: !open,
        }
      )}
    >
      {items.length > 0 ? (
        items.map((item, index) => {
          return (
            <div
              key={index}
              onClick={(e) => {
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
        <DropdownItem selectable={false}>
          <p className="w-full">No results.</p>
        </DropdownItem>
      )}
    </div>
  );
};

interface DropdownItemProps {
  selected?: boolean;
  selectable?: boolean;
}

const DropdownItem: React.FC<PropsWithChildren<DropdownItemProps>> = ({
  children,
  selected,
  selectable = true,
}) => {
  return (
    <div
      // this is so focus is not removed from the parent component
      onMouseDown={(e) => e.preventDefault()}
      className={cn("rounded p-1", "font-medium text-lg", {
        "hover:bg-gray-50 cursor-pointer": selectable,
        "bg-blue-100 hover:bg-blue-100 outline-blue-200 outline": selected,
      })}
    >
      {children}
    </div>
  );
};
