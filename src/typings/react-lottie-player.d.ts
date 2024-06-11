declare module '@lottiefiles/react-lottie-player' {
    import { HTMLAttributes, RefAttributes } from 'react';
    import { AnimationConfigWithData, AnimationConfigWithPath, AnimationEventName, LottiePlayer } from 'lottie-web';
  
    export interface PlayerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'animationData' | 'children'>, RefAttributes<LottiePlayer> {
      animationData?: AnimationConfigWithData['animationData'];
      autoplay?: boolean;
      path?: AnimationConfigWithPath['path'];
      src?: string;
      play?: boolean;
      goTo?: number;
      speed?: number;
      direction?: 1 | -1;
      loop?: boolean | number;
      hover?: boolean;
      renderer?: 'svg' | 'canvas' | 'html';
      onEvent?: (event: AnimationEventName) => void;
    }
  
    export const Player: React.FC<PlayerProps>;
  }