import React, { useState } from "react";

interface FieldInputProps {
  label: string;
  value: string;
  setter: (desc: string) => void;
}

const LottieUploadField: React.FC<FieldInputProps> = ({
  label,
  value,
  setter,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
      />
    </div>
  );
};

export default LottieUploadField;
