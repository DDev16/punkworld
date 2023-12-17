import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, PointsMaterial } from 'three';

// Extend will let react-three-fiber know about these Three.js objects
extend({ BufferAttribute, BufferGeometry, PointsMaterial });

const ParticlePlane = ({ width, height }) => {
  const meshRef = useRef();

  const particles = useMemo(() => {
    let tempParticles = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        tempParticles.push(i / 10, 0, j / 10);
      }
    }
    return new Float32Array(tempParticles);
  }, [width, height]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
            attachObject={['attributes', 'position']}
            count={particles.length / 3}
            array={particles}
            itemSize={3000}
        />
      </bufferGeometry>
      <pointsMaterial
    // eslint-disable-next-line react/no-unknown-property
attach="material"
  color={0xffffff}
  size={20}
  // eslint-disable-next-line react/no-unknown-property
  transparent={true}
  // eslint-disable-next-line react/no-unknown-property
  blending={THREE.AdditiveBlending}
  // eslint-disable-next-line react/no-unknown-property
  vertexColors={true}
/>

    </points>
  );
};

ParticlePlane.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default ParticlePlane;
