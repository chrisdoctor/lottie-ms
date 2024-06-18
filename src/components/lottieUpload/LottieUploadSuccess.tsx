import React from "react";

interface SuccessProps {
  onClose: () => void;
}

const LottieUploadSuccess: React.FC<SuccessProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl">Success</h2>
        <p className="mb-4">Your submission was successful</p>
        <button
          onClick={onClose}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default LottieUploadSuccess;
