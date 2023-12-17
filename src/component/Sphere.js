import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';

function RainbowSphere() {
  const sphereRef = useRef();
  const { gl, scene, camera } = useThree();
  const composerRef = useRef();

  useEffect(() => {
    composerRef.current = new EffectComposer(gl);
    composerRef.current.addPass(new RenderPass(scene, camera));
    const bloomPass = new BloomEffect();
    composerRef.current.addPass(new EffectPass(camera, bloomPass));
  }, [gl, scene, camera]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.01;
      sphereRef.current.rotation.y += 0.01;
    }

    if (composerRef.current) {
      composerRef.current.render();
    }

    sphereRef.current.material.uniforms.time.value = time;
  });

  const rainbowShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.x += sin(time + position.y) * 0.1;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        float shiftedTime = time * 0.2;
        vec3 color = vec3(0.5 + 0.5 * sin(shiftedTime), 0.5 + 0.5 * sin(shiftedTime + 2.0), 0.5 + 0.5 * sin(shiftedTime + 4.0));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  return (
    <mesh ref={sphereRef} scale={[10, 10, 10]} position={[0,0,0]} >
      <sphereGeometry />
              {/* eslint-disable-next-line react/no-unknown-property */}
<primitive object={rainbowShaderMaterial} />
    </mesh>
  );
}

export default RainbowSphere;
