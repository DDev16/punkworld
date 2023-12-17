import React, { useRef, useEffect } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

// Custom Shader Material Component
const CustomShaderMaterial = ({ modelRef }) => {
  const simplex = new SimplexNoise();
  let transitionLevel = { value: 0.5 };
  let t = 0;

  useEffect(() => {
    if (modelRef.current) {
      const model = modelRef.current;

      // Custom textures
      const blackTexture = createBlackTexture();
      const neonTexture = createNeonTexture();

      // Custom Shader Material
      model.material = new THREE.MeshMatcapMaterial({
        matcap: blackTexture,
        onBeforeCompile: shader => {
          shader.uniforms.transitionLevel = transitionLevel;
          shader.uniforms.matcap2 = { value: neonTexture };
          shader.vertexShader = `
            varying vec4 vClipPos;
            ${shader.vertexShader}
          `.replace(
            `vViewPosition = - mvPosition.xyz;`,
            `vViewPosition = - mvPosition.xyz;
              vClipPos = gl_Position;
            `
          );
          shader.fragmentShader = `
            uniform float transitionLevel;
            uniform sampler2D matcap2;
            varying vec4 vClipPos;
            ${shader.fragmentShader}
          `.replace(
            `vec4 matcapColor = texture2D( matcap, uv );`,
            `
              vec4 mc1 = texture( matcap, uv );
              vec4 mc2 = texture( matcap2, uv );
              
              vec2 clipUV = (vClipPos.xy / vClipPos.w) * 0.5 + 0.5;
              
              vec4 matcapColor = mix(mc1, mc2, smoothstep(transitionLevel-0.1, transitionLevel+0.1, clipUV.y));
            `
          );
        }
      });
    }
  }, [modelRef]);

  useFrame(({ clock }) => {
    t = clock.getElapsedTime();
    transitionLevel.value = simplex.noise(t * 0.25, Math.PI) * 0.5 + 0.5;
  });

  return null;
};

// Helper function to create black texture
function createBlackTexture() {
  let canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  let ctx = canvas.getContext('2d');
  let unit = (val) => val * canvas.height * 0.01;

  ctx.fillStyle = "#222222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = "round";
  ctx.strokeStyle = "#ddd";
  ctx.filter = `blur(${unit(0.5)}px)`;

  let rows = 8;
  let cols = 4;
  let colFactor = 0.75;
  let colAngle = Math.PI / cols;
  let colAngleHalf = colAngle * 0.5;
  for (let row = 0; row < rows; row++) {
    ctx.lineWidth = unit(10 - row) * 0.25;
    let r = 47 - row * 5;
    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      let centralAngle = -colAngleHalf - colAngle * col;
      ctx.arc(
        unit(50),
        unit(50),
        unit(r),
        centralAngle - colAngleHalf * colFactor,
        centralAngle + colAngleHalf * colFactor
      );
      ctx.stroke();
    }
  }
  
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(unit(50), unit(50));
  ctx.arc(unit(50), unit(50), unit(50), Math.PI * 0.25, Math.PI * 0.75);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// Helper function to create neon texture
function createNeonTexture() {
  let canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  let ctx = canvas.getContext('2d');

  let grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grd.addColorStop(0.25, "#ff00ff");
  grd.addColorStop(0.5, "#ff88ff");
  grd.addColorStop(0.75, "#0044ff");
  grd.addColorStop(1, "#ffff00");

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return new THREE.CanvasTexture(canvas);
}

// Main Component
const LeePerrySmithModel = () => {
  const modelRef = useRef();
  const glb = useLoader(GLTFLoader, 'LeePerrySmith.glb');

  useEffect(() => {
    if (glb.scene.children[0]) {
      modelRef.current = glb.scene.children[0];
      modelRef.current.position.y = -0.75;
    }
  }, [glb]);

  return (
    <>
                               {/* eslint-disable-next-line react/no-unknown-property */}
                               <primitive object={glb.scene} scale={[5, 5, 5]} position={[-10,20,45]} rotation={[0,5,0]} />
      <CustomShaderMaterial modelRef={modelRef} />
    </>
  );
};

export default LeePerrySmithModel;
