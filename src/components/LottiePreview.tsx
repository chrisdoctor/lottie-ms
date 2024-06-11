import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

const LottiePreview: React.FC = () => {
  return (
    <div>
      <Player
        autoplay
        loop
        src={"lottie file here"}
        style={{ height: '300px', width: '300px' }}
      />
    </div>
  );
};

export default LottiePreview;
