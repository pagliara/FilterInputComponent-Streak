import { PropsWithChildren } from "react";

export const FilterInputToken: React.FC<PropsWithChildren> = ({ children }) => (
  <span className="animate-in fade-in pl-2 font-bold min-w-max">
    {children}
  </span>
);
