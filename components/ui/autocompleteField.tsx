import { Input, InputProps } from "@/components/ui/atoms/input";
import { Dropdown, DropdownProps } from "@/components/ui/dropdown";
import { LegacyRef, forwardRef, useEffect, useState } from "react";

type AutocompleteFieldProps = InputProps & Omit<DropdownProps, "open">;

export const AutocompleteField = forwardRef(
  (props: AutocompleteFieldProps, ref) => {
    const { items, selectedItem, value, onChange, onClickItem, ...rest } =
      props;
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="relative flex items-center w-full">
        <Input
          ref={ref as LegacyRef<HTMLInputElement>}
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
        <Dropdown
          open={isFocused}
          items={items}
          selectedItem={selectedItem}
          onClickItem={onClickItem}
        />
      </div>
    );
  }
);

AutocompleteField.displayName = "AutocompleteField";
