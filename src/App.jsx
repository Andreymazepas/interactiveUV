import React from 'react';
import ImageCanvas from './ImageCanvas';
import ThreeCanvas from './ThreeCanvas';
import { GuideProvider } from './GuideContext';
import './App.css';

const image = 'room.jpeg';

const App = () => {
  return (
    <GuideProvider>
      <div className="app-container">
        <ImageCanvas image={image} />
        <ThreeCanvas image={image} />
      </div>
    </GuideProvider>
  );
};

export default App;
