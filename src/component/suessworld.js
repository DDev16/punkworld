import React, { useState, useEffect } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { Box, OrbitControls, Plane } from '@react-three/drei';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { Layers } from 'three';
import TorusKnot from './Torus.js';
import RainbowSphere from './Sphere copy.js';
import Spherecustom from './Sphere.js';
import SkyBox1 from './SkyBox/SkyBox1.js';
import Sky1 from '../component/SkyBox/stars.jpg';
import { Player } from './player.js';
import LeePerrySmithModel from '../component/3D-models/Lerry.js';
import Tvs from '../component/3D-models/Tvs.js';
// Extend will make these available as JSX components
extend({ EffectComposer, ShaderPass, RenderPass, UnrealBloomPass });

// Layer for bloom effect
const BLOOM_LAYER = new Layers(1);

const PostProcessing = () => {
  const { gl, scene, camera, size } = useThree();
  const composer = new EffectComposer(gl);
  const renderPass = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass();
  const fxaaPass = new ShaderPass(FXAAShader);
  const smaaPass = new SMAAPass(size.width, size.height);

  useEffect(() => {
    // Render bloom layer
    const bloomComposer = new EffectComposer(gl);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderPass);
    bloomComposer.addPass(bloomPass);
  
    // Render non-bloom layers
    const finalComposer = new EffectComposer(gl);
    finalComposer.addPass(renderPass);
    finalComposer.addPass(fxaaPass);
    finalComposer.addPass(smaaPass);
  
    composer.addPass(renderPass);
  
    return () => {
      composer.dispose();
      bloomComposer.dispose();
      finalComposer.dispose();
    };
  }, [composer, renderPass, bloomPass, fxaaPass, smaaPass]);
  

  useFrame(() => {
    scene.traverse((obj) => {
      if (obj.layers.test(BLOOM_LAYER)) {
        obj.layers.enable(BLOOM_LAYER);
      } else {
        obj.layers.disable(BLOOM_LAYER);
      }
    });

    composer.render();
  }, 1);
};

const SeussWorld = () => {
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const playerPosition = { x: 0, z: 0 };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Canvas style={{ width: '100%', height: '100%' }} shadows>
        <ambientLight intensity={1.45} />
                               {/* eslint-disable-next-line react/no-unknown-property */}
                               <directionalLight
  position={[2, 8, 22]}
  intensity={3}
  /* eslint-disable */
  castShadow={true}
  shadow-mapSize-width={1024}
  shadow-mapSize-height={1024}
  /* eslint-enable */
></directionalLight>
<directionalLight
  position={[80, 8, 22]}
  intensity={3}
  /* eslint-disable */
  castShadow={true}
  shadow-mapSize-width={4024}
  shadow-mapSize-height={4024}
  /* eslint-enable */
></directionalLight>

        <Box args={[2, 5, 2]} position={[-1.2, 2, 0]} castShadow receiveShadow>
          <meshLambertMaterial color={'red'} />
        </Box>
        <Spherecustom args={[2, 55, 42]}  castShadow receiveShadow/>
        <RainbowSphere args={[20, 5, 42]}  castShadow receiveShadow/>
        <Plane args={[500, 500]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} castShadow receiveShadow>
          <meshLambertMaterial color={'green'} />
        </Plane>
<Tvs url={'./technical_difficulties (1).glb'} castShadow receiveShadow/>
        <TorusKnot position={[50, 10, 0]} castShadow receiveShadow />
        <TorusKnot position={[50, 10, 0]} castShadow receiveShadow />
<LeePerrySmithModel castShadow receiveShadow/>
        <SkyBox1 textureUrl={Sky1} />

        <OrbitControls enablePan={true} enableZoom={true} enabled={orbitEnabled} />
        <Player firstPerson={false} setOrbitEnabled={setOrbitEnabled} position={playerPosition} castShadow receiveShadow />

        <PostProcessing />
      </Canvas>
    </div>
  );
};

export default SeussWorld;
