import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from 'react-three-fiber';

const ModelViewer = ({ url }) => {
  const gltf = useGLTF(url);
  const modelRef = useRef();


  // Rotate the model if you want
  useFrame(() => {
  
  });

  return (
    <group ref={modelRef} position={[30,0,30]}>
    {/* eslint-disable-next-line react/no-unknown-property */}  
    <primitive object={gltf.scene} dispose={null} />
    </group>
  );
};

export default ModelViewer;
