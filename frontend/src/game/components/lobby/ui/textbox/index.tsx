import React, { useState, useEffect } from "react";

//styles
import { TextBox } from "./styles";

interface Props {
  width?: string;
  defaultValue?: string | undefined;
  value?: string | undefined;
  type?: any;
  placeholder?: string;
  onChange: (value: string) => void;
}

const TextBoxComponent: React.FC<Props> = ({
  defaultValue,
  value,
  onChange,
  width = "250px",
  type = "text",
  placeholder = "",
}) => {
  const [currentValue, setCurrentValue] = useState<string | undefined>(
    defaultValue
  );

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = (e: any) => {
    const {
      target: { value: newValue },
    } = e;

    setCurrentValue(newValue);
    onChange(newValue);
  };

  return (
    <TextBox
      type={type}
      style={{ width }}
      placeholder={placeholder}
      value={currentValue || ""}
      onChange={handleChange}
    />
  );
};

export default TextBoxComponent;
