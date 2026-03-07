import { ReactNode } from "react";

type AuthFormFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export const AuthFormField = ({
  id,
  label,
  error,
  children,
}: AuthFormFieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
