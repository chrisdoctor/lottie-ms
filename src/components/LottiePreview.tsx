import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import lottie1 from "../data/lottie1.json";

const LottiePreview: React.FC = () => {
  const lottieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lottieElement = lottieRef.current;

    if (lottieElement) {
      lottieElement.style.pointerEvents = "none";
    }
  }, []);

  return (
    <div
      ref={lottieRef}
      className="border border-gray-300 rounded-lg flex justify-center items-center pointer-events-none"
    >
      <div className="h-40 w-40 items-center justify-center">
        <Lottie className="relative z-10" animationData={lottie1} loop={true} />
      </div>
    </div>
  );
};

export default LottiePreview;
