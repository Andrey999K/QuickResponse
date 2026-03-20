import { ReactNode } from "react";
import { cn } from "@/utils/cn";

type TitleProps = {
  children: ReactNode;
  className?: string;
};

export const Title = ({ children, className }: TitleProps) => {
  return (
    <h2
      className={cn(
        className,
        "text-center text-3xl font-bold tracking-tight sm:text-4xl"
      )}
    >
      {children}
    </h2>
  );
};
