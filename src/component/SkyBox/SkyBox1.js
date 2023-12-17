import React, { useMemo } from 'react';
import { TextureLoader, BackSide } from 'three';
import { useLoader } from '@react-three/fiber';
import PropTypes from 'prop-types';
import { Sphere } from '@react-three/drei';

const SkyBox = ({ textureUrl }) => {
  const texture = useLoader(TextureLoader, textureUrl);
  const materialProps = useMemo(
    () => ({
      side: BackSide,
      map: texture,
    }),
    [texture]
  );

  return (
    <group>
      <Sphere args={[505, 505, 505]}>
        <meshBasicMaterial {...materialProps} />
      </Sphere>
    </group>
  );
};

SkyBox.propTypes = {
  textureUrl: PropTypes.string.isRequired,
};

export default SkyBox;
