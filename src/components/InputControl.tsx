import { Input } from "@mantine/core";
import { IconAt } from "@tabler/icons";

export const InputControl = ({ placeholder, type, value, onChange }) => {
  return (
    <Input
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full `}
      autoComplete="new-password"
    />
  );
};
