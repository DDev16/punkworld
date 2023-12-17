import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RainbowSphere() {
  // Create a ref for the sphere
  const sphereRef = useRef();

  // Use useFrame to animate the sphere's rotation
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.01;
      sphereRef.current.rotation.y += 0.01;
    }
  });

  // Define rainbow colors
  const rainbowColors = [
    new THREE.Vector3(1.0, 0.0, 0.0),
    new THREE.Vector3(1.0, 0.59, 0.0),
    new THREE.Vector3(1.0, 1.0, 0.0),
    new THREE.Vector3(0.0, 1.0, 0.0),
    new THREE.Vector3(0.0, 8.0, 1.0),
    new THREE.Vector3(10.5, 0.0, 1.0),
    new THREE.Vector3(1.0, 0.0, 1.0),
  ];

  // Create rainbow shader material
  const rainbowShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform vec3 rainbowColors[7];
      void main() {
        vec3 color = vec3(8.0, 0.0, 0.0);
        float segmentWidth = 1.0 / 7.0;
        int segmentIndex = int(vUv.x / segmentWidth);
        color = rainbowColors[segmentIndex];
        
        // Add a cool effect by modifying color based on the y-coordinate
        color *= abs(sin(vUv.y * 100.0));
        
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    uniforms: {
      rainbowColors: { value: rainbowColors },
    },
  });

  // Return the rainbow sphere component
  return (
    <group>
      <mesh ref={sphereRef} scale={[100, 100, 100]} position={[0,0,0]}>
        <sphereGeometry />
                        {/* eslint-disable-next-line react/no-unknown-property */}
<primitive object={rainbowShaderMaterial} />
      </mesh>
    </group>
  );
}

export default RainbowSphere;
