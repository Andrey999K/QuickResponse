type InputProps = {
  label?: string;
  placeholder?: string;
  type?: "text" | "password";
};

export const Input = ({ label, placeholder, type }: InputProps) => {
  return (
    <label className="flex flex-col gap-1 text-gray-400 text-xs">
      {!!label && <span>{label}</span>}
      <input
        type={type || "text"}
        className="border-solid border-[1px] border-gray-700 rounded outline-none p-1"
        placeholder={placeholder || label || ""}
      />
    </label>
  );
};
