import { Box } from '@mui/material'
import { keyframes, styled } from '@mui/material/styles'

const duration = 0.75


const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const SvgFrameBox1 = styled(Box)`
  position: relative;
  scale: 0.6;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;

  & svg {
    position: absolute;
    transform-origin: center;
    width: 450px;
    height: 450px;
    fill: none;
    animation: change-view 5s ease-in-out infinite alternate;
    filter: drop-shadow(0 0 12px #00aaff);

    #big-centro,
    #outter1,
    #solo-lines,
    #center,
    #outter-center,
    #bottom-dots,
    #center-lines,
    #squares,
    #top-dots {
      transform-origin: center;
      animation: ${spin} ${duration * 2}s ease-in-out infinite alternate;
    }
    
    #big-centro {
      animation-delay: -1.5s;
    }
    
    #outter1 {
      animation-delay: -1.2s;
    }
    
    #center {
      animation-delay: -2.2s;
    }
    
    #bottom-dots,
    #top-dots {
      animation-duration: ${duration * 3.5}s;
    }
    
    #center-lines,
    #outter-center {
      animation-duration: ${duration * 3}s;
      animation-delay: -3s;
    }
  }`

const SvgFrameBox2 = styled(Box)`
  position: relative;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;

  & svg {
    position: absolute;
    transform-origin: center;
    width: 344px;
    height: 344px;
    fill: none;

    #out2 {
      animation: ${spin} ${duration * 3.5}s ease-in-out infinite alternate;
      transform-origin: center;
    }
    
    #out3 {
        animation: ${spin} ${duration * 1.5}s ease-in-out infinite alternate;
        transform-origin: center;
        stroke: #ff0;
    }
    
    #inner3,
    #inner1 {
        animation: ${spin} ${duration * 2}s ease-in-out infinite alternate;
        transform-origin: center;
    }
    
    #center1 {
        fill: #ff0;
        animation: ${spin} ${duration}s ease-in-out infinite alternate;
        transform-origin: center;
    }
  }`

export { SvgFrameBox1, SvgFrameBox2 }
