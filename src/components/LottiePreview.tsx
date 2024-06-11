import React from "react";
import Lottie from "lottie-react";
import lottie1 from "../data/lottie1.json";

const LottiePreview: React.FC = () => {
  return <Lottie animationData={lottie1} loop={true} />;
};

export default LottiePreview;
