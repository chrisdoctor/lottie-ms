import React, { Fragment, useState } from "react";
import LottiePreview from "./LottiePreview";

interface PickerInputProps {
  fileName: string;
  setFileName: (value: string) => void;
  setContent: (value: string) => void;
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
  fileName,
  setFileName,
  setContent,
  error = false,
}) => {
  const [isValidFile, setIsValidFile] = useState<boolean | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setIsValidFile(null);

    if (selectedFile && selectedFile.type === "application/json") {
      console.log("selectedFile.name", selectedFile.name);
      setFileName(selectedFile.name);

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result as string;
          if (validateLottieFile(JSON.parse(content))) {
            setIsValidFile(true);
            setContent(content);
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
    setFileName("");
    setIsValidFile(null);
  };

  return (
    <Fragment>
      <div>
        <label className="block text-sm font-medium text-gray-700">File:</label>
        {!fileName && (
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
        {fileName && (
          <Fragment>
            <div className="mt-2 flex items-center">
              <span className="text-gray-700 truncate">{fileName}</span>
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
      {fileName && isValidFile && (
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
