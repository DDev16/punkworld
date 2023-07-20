import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { TextureLoader, BackSide } from 'three';
import { useLoader } from '@react-three/fiber';
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
    <mesh>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <Sphere args={[30, 10, 20]}>
        <meshBasicMaterial {...materialProps} />
      </Sphere>
    </mesh>
  );
};

SkyBox.propTypes = {
  textureUrl: PropTypes.string.isRequired,
};

export default SkyBox;
