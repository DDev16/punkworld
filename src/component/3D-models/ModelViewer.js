import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

const ModelViewer = ({ url }) => {
  const gltf = useGLTF(url);
  const modelRef = useRef();

  return (
    <group ref={modelRef} position={[10,-.5,50]}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <primitive object={gltf.scene} dispose={null} />
    </group>
  );
};

export default ModelViewer;
