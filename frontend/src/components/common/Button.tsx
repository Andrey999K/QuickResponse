import { ReactNode } from "react";

type ButtonProps = {
  type?: "submit" | "reset" | "button" ;
  children: ReactNode;
  disabled?: boolean;
}

export const Button = ({ type, children, disabled }: ButtonProps) => {
  return (
    <button className="bg-yellow-700 rounded text-black cursor-pointer" type={type || "button"} disabled={disabled || false}>
      {children}
    </button>
  );
};
