import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";

interface PreviewProps {
  animation: string;
}

const LottiePreview: React.FC<PreviewProps> = ({ animation }) => {
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
      className="border border-gray-300 rounded-lg mx-auto w-40 p-1 mb-4 pointer-events-none"
    >
      <div className="h-40 items-center justify-center">
        <Lottie
          className="relative z-10"
          animationData={JSON.parse(animation)}
          loop={true}
        />
      </div>
    </div>
  );
};

export default LottiePreview;
