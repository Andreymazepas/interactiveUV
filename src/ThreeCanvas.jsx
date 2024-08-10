// ThreeCanvas.js
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { useGuideContext } from './GuideContext';
import { useLayoutEffect, useRef } from 'react';
import './ThreeCanvas.css';
import { OrbitControls } from '@react-three/drei';

const ThreeCanvas = ({ image }) => {
  const { guides } = useGuideContext();
  const planeRef = useRef();

  // Use guides to update UV coordinates
  const updateUVs = () => {
    const plane = planeRef.current;
    if (!plane || !guides.length) return;
    console.log(guides);
    const geometry = plane.geometry;

    const uvAttribute = geometry.attributes.uv;

    for (let i = 0; i < 4; i += 1) {
      const uvX = guides[i].x;
      const uvY = 1 - guides[i].y;
      //console.log(uvX, uvY);

      planeRef.current.geometry.attributes.uv.setXY(i, uvX, uvY);
      //planeRef.current.geometry.attributes.uv.setY(i, 0);
    }
    //console.log(planeRef.current.geometry.attributes.uv);

    planeRef.current.geometry.attributes.uv.needsUpdate = true;
  };

  // Trigger UV update whenever guides change
  //useLayoutEffect(() => {
  updateUVs();
  //}, [guides]);

  return (
    <div className="half-screen">
      <Canvas>
        <OrbitControls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <mesh ref={planeRef}>
          <planeGeometry attach="geometry" args={[5, 5, 1, 1]} />
          <meshBasicMaterial
            attach="material"
            map={new THREE.TextureLoader().load(image)}
          />
        </mesh>
      </Canvas>
    </div>
  );
};

export default ThreeCanvas;
