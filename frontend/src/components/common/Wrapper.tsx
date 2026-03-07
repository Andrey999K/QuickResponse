import { cn } from "@/utils/cn";
import { ReactNode } from "react";

type WrapperProps = {
  children: ReactNode;
  className?: string;
};

export const Wrapper = ({ children, className }: WrapperProps) => {
  return (
    <div className={cn(className, "w-full max-w-screen-2xl mx-auto px-4")}>
      {children}
    </div>
  );
};
