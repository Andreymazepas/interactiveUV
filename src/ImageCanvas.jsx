import { useState } from 'react';
import DraggableGuide from './DraggableGuide';
import { useGuideContext } from './GuideContext';

const ImageCanvas = ({ image }) => {
  const { guides } = useGuideContext();

  return (
    <div className="half-screen">
      <div className="image-canvas-container">
        <img src={image} alt="Image" className="image-canvas" />
        {guides.map((guide, index) => (
          <DraggableGuide key={index} index={index} _position={guide} />
        ))}
      </div>
    </div>
  );
};

export default ImageCanvas;
