import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Zombie = ({ position, playerPosition }) => {
  const gltf = useLoader(GLTFLoader, './player.glb');
  const model = useRef();

  useEffect(() => {
    if (model.current) {
      model.current.position.set(position[0], position[1], position[2]);
    }
  }, [position]);

  useFrame(() => {
    const { x, z } = playerPosition;
    model.current.position.x = x;
    model.current.position.z = z;
  });

  return (
    <primitive
      primitive={gltf.scene}
      ref={model}
    />
  );


};

Zombie.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  playerPosition: PropTypes.object,
};

export default Zombie;
