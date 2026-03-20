type InputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "password";
};

export const Input = ({ name, label, placeholder, type }: InputProps) => {
  return (
    <label className="flex flex-col gap-1 text-gray-400 text-xl">
      {!!label && <span>{label}</span>}
      <input
        type={type || "text"}
        name={name}
        className="border-solid border-[1px] border-gray-700 rounded outline-none p-1"
        placeholder={placeholder || label || ""}
      />
    </label>
  );
};
