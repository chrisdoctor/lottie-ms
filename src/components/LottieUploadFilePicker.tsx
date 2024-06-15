import React, { Fragment, useState } from "react";
import LottiePreview from "./LottiePreview";

interface PickerInputProps {
  file: File | null;
  setFile: (value: File | null) => void;
  error?: boolean;
}

interface LottieFile {
  v: string;
  fr: number;
  ip: number;
  op: number;
  layers: object[];
}

const LottieUploadFilePicker: React.FC<PickerInputProps> = ({
  file,
  setFile,
  error = false,
}) => {
  const [isValidFile, setIsValidFile] = useState<boolean | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setIsValidFile(null);

    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const json: LottieFile = JSON.parse(e.target?.result as string);
          if (validateLottieFile(json)) {
            setIsValidFile(true);
          } else {
            setIsValidFile(false);
          }
        } catch (error) {
          setIsValidFile(false);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setIsValidFile(false);
    }
  };

  const validateLottieFile = (json: LottieFile) => {
    const requiredKeys = ["v", "fr", "ip", "op", "layers"];
    return requiredKeys.every((key) => key in json);
  };

  const handleClearFile = () => {
    setFile(null);
    setIsValidFile(null);
  };

  return (
    <Fragment>
      <div>
        <label className="block text-sm font-medium text-gray-700">File:</label>
        {!file && (
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="mt-1"
          />
        )}
        {error && (
          <p className="text-red-500 text-sm mt-1">This is a required field</p>
        )}
        {file && (
          <Fragment>
            <div className="mt-2 flex items-center">
              <span className="text-gray-700 truncate">{file.name}</span>
              <button
                type="button"
                onClick={handleClearFile}
                className="ml-4 px-3 py-1 bg-teal-500 text-white rounded-lg"
              >
                Clear
              </button>
            </div>
            {!isValidFile && (
              <p className="text-red-500 text-sm mt-1">
                This is not a valid Lottie animation file
              </p>
            )}
          </Fragment>
        )}
      </div>
      {file && isValidFile && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preview:
          </label>
          <LottiePreview />
        </div>
      )}
    </Fragment>
  );
};

export default LottieUploadFilePicker;
