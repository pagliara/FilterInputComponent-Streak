import { Input, InputProps } from "@/components/ui/atoms/input";
import { Dropdown, DropdownProps } from "@/components/ui/dropdown";
import { PropsWithChildren, useState } from "react";

type AutocompleteFieldProps = InputProps & DropdownProps;

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  items,
  selectedItem,
  value,
  onChange,
  onClickItem,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex items-center w-full">
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
      {isFocused ? (
        <Dropdown
          items={items}
          selectedItem={selectedItem}
          onClickItem={onClickItem}
        />
      ) : undefined}
    </div>
  );
};
