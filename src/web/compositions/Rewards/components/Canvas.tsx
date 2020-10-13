import React, { useRef, useEffect } from 'react'
import Img from '@icons/twitterPost.png'
import copy from 'clipboard-copy'
import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'

export const Canvas = props => {
  
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const TestImage = new Image()
    TestImage.src = Img
    TestImage.onload = function() {
        context.drawImage(TestImage,0,0, context.canvas.width, context.canvas.height);
        context.font = "70px Monaco";
        context.fillStyle = "#E2FDE7";
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.shadowColor="rgba(226, 253, 231, 0.49)";
        context.shadowBlur=10;
        context.fillText(`${stripDigitPlaces(props.dcfiEarned, 3)} DCFI`, 506, 288);
    }


    // context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    // const img = canvas.toDataURL(TestImage);
    // console.log('copy', img)
    try {
        navigator.clipboard.write([
            new ClipboardItem({
                'image/png': TestImage
            })
        ]);
    } catch (error) {
        console.error(error);
    }

    // console.log('img', img)
    // document.write('<img src="'+img+'"/>');
  }, [])
  
  return <canvas width={1012} height={506} ref={canvasRef} {...props}/>
}