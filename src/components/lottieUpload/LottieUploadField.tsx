import React from "react";

interface FieldInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: boolean;
}

const LottieUploadField: React.FC<FieldInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  error = false,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
      />
      {required && error && (
        <p className="text-red-500 text-sm mt-1">This is a required field</p>
      )}
    </div>
  );
};

export default LottieUploadField;
