import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import vertexShader from '../component/Shaders/vertex.js';
import fragmentShader from '../component/Shaders/fragment.js';

const CustomShaderMaterial = shaderMaterial(
  // Uniforms (can be passed as props)
  {},
  // Vertex Shader
  vertexShader,
  // Fragment Shader
  fragmentShader
);

extend({ CustomShaderMaterial });

const TorusKnot = (props) => {
  const meshRef = useRef();

  useFrame(() => {
    meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh {...props} ref={meshRef}>
<torusKnotGeometry args={[150, 30, 150, 16]} />
               {/* eslint-disable-next-line react/no-unknown-property */}
 <customShaderMaterial attach="material" />
    </mesh>
  );
};

export default TorusKnot;
