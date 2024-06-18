import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../store/graphql/addItem";
import { AppDispatch, RootState } from "../store";
import LottieUploadTags from "./lottieUpload/LottieUploadTags";
import LottieUploadField from "./lottieUpload/LottieUploadField";
import LottieUploadFilePicker from "./lottieUpload/LottieUploadFilePicker";
import LottieUploadPopup from "./lottieUpload/LottieUploadPopup";
import { LottieItem } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { API_STATUS_SUCCESS } from "../constants";

interface FileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LottieUpload: React.FC<FileDialogProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [author, setAuthor] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSuccessPopup, setShowPopup] = useState(false);

  const itemStatus = useSelector((state: RootState) => state.item.status);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!description.trim() && !author.trim()) {
      return;
    }

    const item: LottieItem = {
      id: uuidv4(),
      dateUploaded: Date().toString(),
      description,
      tags,
      author,
      lottieFile: {
        filename: fileName,
        contents: fileContent,
      },
    };
    dispatch(addItem(item));
    setShowPopup(true);
    // closeDialog();
  };

  const handlePopupClose = () => {
    setShowPopup(false);

    if (itemStatus === API_STATUS_SUCCESS) {
      closeDialog();
    }
  };

  const closeDialog = () => {
    setSubmitted(false);
    setFileName("");
    setFileContent("");
    setDescription("");
    setAuthor("");
    setTags([]);

    onClose();
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
            <div className="mt-4 space-y-4">
              <LottieUploadFilePicker
                fileName={fileName}
                setFileName={setFileName}
                content={fileContent}
                setContent={setFileContent}
                error={submitted && !fileName}
              />
              <LottieUploadField
                label="Description"
                value={description}
                onChange={setDescription}
                required
                error={submitted && !description.trim()}
              />
              <LottieUploadField
                label="Author"
                value={author}
                onChange={setAuthor}
                required
                error={submitted && !author.trim()}
              />
              <LottieUploadTags tags={tags} setTags={setTags} />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg relative z-11"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg relative z-11"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        {showSuccessPopup && <LottieUploadPopup onClose={handlePopupClose} />}
      </Dialog>
    </Transition>
  );
};

export default LottieUpload;
