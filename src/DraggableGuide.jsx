// DraggableGuide.js
import { useState } from 'react';
import { useGuideContext } from './GuideContext';

const DraggableGuide = ({ index, _position }) => {
  const { guides, setGuides } = useGuideContext();
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(_position);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      console.log(e);
      // Calculate relative position based on parent's dimensions
      const parentWidth = e.target.offsetParent.clientWidth;
      const parentHeight = e.target.offsetParent.clientHeight;

      const newPosition = {
        x: e.target.offsetLeft / parentWidth,
        y: e.target.offsetTop / parentHeight,
      };

      console.log({
        parentWidth,
        parentHeight,
        mouseX: e.clientX,
        mouseY: e.clientY,
        newPosition,
        offset: e.target.offsetParent.offsetTop,
        e,
      });

      setPosition(newPosition);
      setMousePosition({ x: e.clientX, y: e.clientY });
      const newGuides = [...guides];
      newGuides[index] = position;
      setGuides(newGuides);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    const newGuides = [...guides];
    newGuides[index] = position;
    setGuides(newGuides);
  };

  return (
    <div
      className="draggable-guide"
      style={{
        left: `${mousePosition.x * 100}%`,
        top: `${mousePosition.y * 100}%`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    ></div>
  );
};

export default DraggableGuide;
