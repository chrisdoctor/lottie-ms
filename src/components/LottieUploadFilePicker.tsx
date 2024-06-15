import React, { Fragment, useState } from "react";
import LottiePreview from "./LottiePreview";

interface PickerInputProps {
  fileName: string;
  setFileName: (value: string) => void;
  content: string;
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
  content,
  setContent,
  error = false,
}) => {
  const [isValidFile, setIsValidFile] = useState<boolean | null>(null);
  const [isValidSize, setIsValidSize] = useState<boolean | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setIsValidFile(null);
    setIsValidSize(null);

    if (selectedFile && selectedFile.type === "application/json") {
      setFileName(selectedFile.name);

      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      if (fileSizeInMB > 5) {
        setIsValidSize(false);
        return;
      } else {
        setIsValidSize(true);
      }

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
    setIsValidSize(null);
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
            {!isValidSize && (
              <p className="text-red-500 text-sm mt-1">
                Selected file has exceeded the file size limit of 5mb
              </p>
            )}
          </Fragment>
        )}
      </div>
      {fileName && isValidFile && isValidSize && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preview:
          </label>
          <LottiePreview animation={content} />
        </div>
      )}
    </Fragment>
  );
};

export default LottieUploadFilePicker;
