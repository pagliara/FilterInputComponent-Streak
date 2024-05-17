import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/atoms/ui/dropdown-menu";
import { Input, InputProps } from "@/components/ui/atoms/input";

interface AutocompleteFieldProps extends InputProps {
  selectedItem: number;
}

export const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
  selectedItem,
  value,
  onChange,
  ...rest
}) => {
  return (
    <div className="relative flex items-center">
      <Input value={value} onChange={onChange} {...rest} />
      <div className="absolute top-[70px] bg-white rounded-md shadow-lg p-4 w-full h-[200px]">
        <p>Test</p>
      </div>
    </div>
  );
};
