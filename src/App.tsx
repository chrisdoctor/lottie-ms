import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "./store/lottieSlice";
import { AppDispatch } from "./store";
import Main from "./components/Main";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const syncLocalStorageData = async () => {
      const offlineData = JSON.parse(
        localStorage.getItem("offlineDataUploads") || "[]"
      );
      for (const item of offlineData) {
        try {
          dispatch(addItem(item));
        } catch (error) {
          console.error("Error syncing local storage data to server:", error);
        }
      }
      // Clear localStorage after successful sync
      localStorage.removeItem("offlineDataUploads");
    };

    const handleOnline = () => {
      syncLocalStorageData();
    };

    // Add event listener
    window.addEventListener("online", handleOnline);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [dispatch]);
  return (
    <div className="App">
      <Main />
    </div>
  );
};

export default App;
