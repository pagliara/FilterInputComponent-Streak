import { Input, InputProps } from "@/components/ui/atoms/input";
import { cn } from "@/lib/utils";
import { PropsWithChildren, useState } from "react";

interface AutocompleteFieldProps extends InputProps {
  items: Array<string>;
  selectedItem: number;
}

const AutocompleteDropDown: React.FC<{ items: Array<string> }> = ({
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
          return <AutocompleteItem key={index}>{item}</AutocompleteItem>;
        })
      ) : (
        <AutocompleteItem>
          <p className="w-full">No results.</p>
        </AutocompleteItem>
      )}
    </div>
  );
};

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  items,
  selectedItem,
  value,
  onChange,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex items-center">
      <Input
        value={value}
        onChange={onChange}
        {...rest}
        onFocus={(e) => {
          rest?.onFocus && rest?.onFocus(e);
          setIsFocused(true);
        }}
        onBlur={(e) => {
          rest?.onBlur && rest?.onBlur(e);
          setIsFocused(false);
        }}
      />
      {isFocused ? <AutocompleteDropDown items={items} /> : undefined}
    </div>
  );
};

const AutocompleteItem: React.FC<PropsWithChildren<{ selected?: boolean }>> = ({
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
