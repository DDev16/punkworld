import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls, Plane, Stats } from '@react-three/drei';
import { XR, useXR } from '@react-three/xr';
import { Player } from './player';
import SkyBox from '../component/SkyBox/SkyBox.js';
import SkyBox1 from '../component/SkyBox/SkyBox1.js';
import Sky1 from '../component/SkyBox/stars.jpg'
import Sky from '../component/SkyBox/cartoon_step_into_a_dr_seuss-inspired_skybox_tri.jpg'

const XRSetup = () => {

    const { setDefaultInput } = useXR();
    const buttonRef = useRef(null);
  
    useEffect(() => {
      const enterVR = () => {
        if (buttonRef.current) {
          buttonRef.current.hidden = true;
          setDefaultInput(true);
        }
      };
  
      const exitVR = () => {
        if (buttonRef.current) {
          buttonRef.current.hidden = false;
          setDefaultInput(false);
        }
      };
  
      const button = document.createElement('button');
      button.innerText = 'Enter VR';
      button.addEventListener('click', enterVR);
      button.addEventListener('contextmenu', exitVR); // Add event listener for exiting VR
      document.body.appendChild(button);
      buttonRef.current = button;
  
      return () => {
        button.removeEventListener('click', enterVR);
        button.removeEventListener('contextmenu', exitVR);
        document.body.removeChild(button);
      };
    }, [setDefaultInput]);
  
    return null;
  };
  

const SeussWorld = () => {
    const [orbitEnabled, setOrbitEnabled] = useState(true);
    const testing = false;

    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Canvas style={{ width: '100%', height: '100%' }}>
          <XR>
          {testing ? <Stats /> : null}
          {testing ? <axesHelper args={[2]} /> : null}
          {testing ? <gridHelper args={[500, 500]} /> : null}
            <ambientLight intensity={5} />
            <pointLight position={[10, 10, 10]} />
    
            <Box position={[-1.2, 2, 0]} scale={[2,5,2]}>
              <meshStandardMaterial color={'orange'} />
            </Box>
    
            <Plane args={[500, 500]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
              <meshStandardMaterial color={'green'} />
            </Plane>
    
           <SkyBox textureUrl={Sky} />  
            <SkyBox1 textureUrl={Sky1} /> 
            
    
            {/* OrbitControls allows the user to look around using the mouse */}
            <OrbitControls enablePan={false} enableZoom={true} enabled={orbitEnabled} />
            <Player firstPerson={false} setOrbitEnabled={setOrbitEnabled} /> {/* Third-person player */}
    
            <XRSetup />
          </XR>
        </Canvas>
      </div>

    );
}

export default SeussWorld;
