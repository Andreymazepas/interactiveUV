import { useEffect, useRef, useState } from 'react';
import { useGuideContext } from './GuideContext';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  BufferGeometry,
  Float32BufferAttribute,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Plane,
  PlaneGeometry,
  Raycaster,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';

const DraggableVertex = ({ position, onDrag, planeNormal, planePoint }) => {
  const [isDragging, setIsDragging] = useState(false);
  const meshRef = useRef();

  const handlePointerDown = (event) => {
    event.stopPropagation();
    setIsDragging(true);
    event.target.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    setIsDragging(false);
  };

  useFrame((state) => {
    // set scale based on distance from camera
    const camera = state.camera;
    const distance = camera.position.distanceTo(meshRef.current.position);
    meshRef.current.scale.set(distance / 5, distance / 5, distance / 5);

    const raycaster = new Raycaster();
    const mouse = state.mouse;
    raycaster.setFromCamera(mouse, state.camera);
    const plane = new Mesh(
      new PlaneGeometry(100, 100),
      new MeshBasicMaterial()
    );
    const intersections = raycaster.intersectObject(plane);

    if (isDragging) {
      const newPosition = intersections[0].point;
      onDrag(newPosition);
    }
  });

  useEffect(() => {
    window.addEventListener('mouseup', handlePointerUp);
    return () => {
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, []);

  return (
    <mesh ref={meshRef} position={position} onPointerDown={handlePointerDown}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="blue" />
    </mesh>
  );
};

const PlaneFromVertices = ({ vertices }) => {
  const geometry = useRef(new BufferGeometry());

  const updateGeometry = () => {
    const positions = new Float32Array([
      vertices[2].x,
      vertices[2].y,
      vertices[2].z,
      vertices[1].x,
      vertices[1].y,
      vertices[1].z,
      vertices[0].x,
      vertices[0].y,
      vertices[0].z,
      vertices[1].x,
      vertices[1].y,
      vertices[1].z,
      vertices[2].x,
      vertices[2].y,
      vertices[2].z,
      vertices[3].x,
      vertices[3].y,
      vertices[3].z,
    ]);

    geometry.current.setAttribute(
      'position',
      new Float32BufferAttribute(positions, 3)
    );
    geometry.current.computeVertexNormals();
  };

  useFrame(updateGeometry);

  return (
    <mesh geometry={geometry.current}>
      <meshBasicMaterial color="red" transparent opacity={0.5} />
    </mesh>
  );
};

const ImageCanvas = ({ image }) => {
  const { guides, setGuides } = useGuideContext();
  const texture = useLoader(TextureLoader, image);
  const imageRef = useRef();

  const [vertices, setVertices] = useState([
    new Vector3(0, 1, 0),
    new Vector3(1, 1, 0),
    new Vector3(0, 0, 0),
    new Vector3(1, 0, 0),
  ]);

  const planeNormal = new Vector3(0, 0, 1);
  const planePoint = new Vector3(0, 0, 0);

  const handleVertexDrag = (index, newPosition) => {
    setVertices((prev) =>
      prev.map((vertex, i) => (i === index ? newPosition : vertex))
    );

    if (imageRef.current) {
      console.log(index);
      const positions = imageRef.current.geometry.attributes.position.array;
      const topLeft = new Vector2(positions[0], positions[1]);
      const bottomRight = new Vector2(
        positions[positions.length - 3],
        positions[positions.length - 2]
      );

      const x =
        (newPosition.x - topLeft.x) / Math.abs(bottomRight.x - topLeft.x);
      const y = (newPosition.y - topLeft.y) / (bottomRight.y - topLeft.y);

      setGuides((prev) =>
        prev.map((guide, i) => (i === index ? { x, y } : guide))
      );
    }
  };
  return (
    <div className="half-screen">
      {/* <div className="image-canvas-container"> */}
      {/* <img src={image} alt="Image" className="image-canvas" />
        {guides.map((guide, index) => (
          <DraggableGuide key={index} index={index} _position={guide} />
        ))} */}

      <Canvas>
        <OrbitControls enableRotate={false} />
        <ambientLight />
        <mesh ref={imageRef}>
          <planeGeometry
            attach="geometry"
            args={[texture.image.width / 100, texture.image.height / 100, 1, 1]}
          />
          <meshBasicMaterial attach="material" map={texture} />
        </mesh>

        <PlaneFromVertices vertices={vertices} />
        {vertices.map((vertex, index) => (
          <DraggableVertex
            key={index}
            position={vertex}
            onDrag={(newPosition) => handleVertexDrag(index, newPosition)}
            planeNormal={planeNormal}
            planePoint={planePoint}
          />
        ))}
      </Canvas>
      {/* </div> */}
    </div>
  );
};

export default ImageCanvas;
