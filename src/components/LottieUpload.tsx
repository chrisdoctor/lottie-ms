import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../store/lottieSlice";
import { AppDispatch, RootState } from "../store";
import LottiePreview from "./LottiePreview";
import LottieUploadTags from "./LottieUploadTags";

interface FileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LottieFile {
  v: string;
  fr: number;
  ip: number;
  op: number;
  layers: object[];
}

const LottieUpload: React.FC<FileDialogProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [file, setFile] = useState<File | null>(null);
  const [isValidFile, setIsValidFile] = useState<boolean | null>(null);
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const itemStatus = useSelector((state: RootState) => state.item.status);
  const error = useSelector((state: RootState) => state.item.error);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addItem({ id, description }));
  };

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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <div className="inline-block align-middle bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all w-11/12 sm:w-1/2 sm:max-w-lg sm:p-6">
            <h2 className="text-xl">Upload Lottie Animation</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID:
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description:
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <LottieUploadTags tags={tags} setTags={setTags} />

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  File:
                </label>
                {!file && (
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                )}
                {file && (
                  <Fragment>
                    <div className="mt-2 flex items-center">
                      <span className="text-gray-700 truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleClearFile}
                        className="ml-4 px-3 py-1 bg-teal-500 text-white rounded-lg"
                      >
                        Clear
                      </button>
                    </div>
                    {!isValidFile && (
                      <p className="text-red-500">
                        This is not a valid Lottie animation file.
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
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg relative z-11"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg relative z-11"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LottieUpload;
