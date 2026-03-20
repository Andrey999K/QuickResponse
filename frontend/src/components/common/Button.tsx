import { ReactNode } from "react";

type ButtonProps = {
  type?: "submit" | "reset" | "button" ;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Button = ({ type, children, disabled, className }: ButtonProps) => {
  return (
    <button className={"bg-yellow-700 rounded text-black cursor-pointer " + className} type={type || "button"} disabled={disabled || false}>
      {children}
    </button>
  );
};
