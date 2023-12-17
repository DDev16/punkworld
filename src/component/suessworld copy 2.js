import React, { useState  } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls, Plane } from '@react-three/drei';

import RainbowSphere from './Sphere copy.js';
import Spherecustom from '../component/Sphere.js';
import SkyBox1 from '../component/SkyBox/SkyBox1.js';
import Sky1 from '../component/SkyBox/stars.jpg';
import { Player } from './player';
import LeePerrySmithModel from '../component/3D-models/Lerry.js';
import ModelViewer from '../component/3D-models/ModelViewer.js'; // Import the ModelViewer component
import TorusKnot from './Torus.js';




const SeussWorld = () => {
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const playerPosition = { x: 0, z: 0 };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Canvas style={{ width: '100%', height: '100%' }} shadows>
        <ambientLight intensity={1.45} />
                               {/* eslint-disable-next-line react/no-unknown-property */}
 <directionalLight position={[2, 8, 22]} intensity={3} castShadow={true} />
                                {/* eslint-disable-next-line react/no-unknown-property */}
<directionalLight position={[80, 8, 22]} intensity={3} castShadow={true} />

        <Box args={[2, 5, 2]} position={[-1.2, 2, 0]}>
          <meshLambertMaterial color={'red'} />
        </Box>
        <Spherecustom args={[2, 55, 42]} position={[1.2, 2, 0]} />
        <RainbowSphere args={[10, 1, 42]} position={[20.2, 2, 0]}  />
        <Plane args={[500, 500]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <meshLambertMaterial color={'green'} />
        </Plane>
<ModelViewer url="/technical_difficulties (1).glb" />

        <SkyBox1 textureUrl={Sky1} />
        <OrbitControls enablePan={true} enableZoom={true} enabled={orbitEnabled} />
        <Player firstPerson={false} setOrbitEnabled={setOrbitEnabled} position={playerPosition} />
<TorusKnot position={[50, 10, 0]} />
<LeePerrySmithMoel />
      </Canvas>
    </div>
  );
};

export default SeussWorld;
