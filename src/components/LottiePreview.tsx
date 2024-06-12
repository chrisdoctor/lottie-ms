import React from "react";
import Lottie from "lottie-react";
import lottie1 from "../data/lottie1.json";

const LottiePreview: React.FC = () => {
  return (
    <div style={{ height: "200px", width: "200px" }}>
      <Lottie animationData={lottie1} loop={true} />
    </div>
  );
};

export default LottiePreview;
