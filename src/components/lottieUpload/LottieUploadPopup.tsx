import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { API_STATUS_SUCCESS } from "../../constants";

interface PopupProps {
  onClose: () => void;
}

const LottieUploadPopup: React.FC<PopupProps> = ({ onClose }) => {
  const itemStatus = useSelector((state: RootState) => state.item.status);
  const error = useSelector((state: RootState) => state.item.error);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded shadow-lg">
        {itemStatus === API_STATUS_SUCCESS ? (
          <Fragment>
            <h2 className="text-xl mb-1">Success</h2>
            <p className="mb-4">Your submission was successful</p>
          </Fragment>
        ) : (
          <Fragment>
            <h2 className="text-xl mb-1">Failed</h2>
            <p>Error in uploading: {error}</p>
            <p className="mb-4">Please try again later</p>
          </Fragment>
        )}

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

export default LottieUploadPopup;
