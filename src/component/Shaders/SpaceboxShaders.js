/* eslint-disable react/prop-types */
import React from 'react';
import { Canvas, extend } from 'react-three-fiber';
import { BoxGeometry } from 'three';

extend({ BoxGeometry });

const vertexShader = `
varying vec3 vPosition;

void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec3 vPosition;
uniform float time;

void main() {
    float starDensity = 1.0;
    float speed = 0.1;
    vec2 starPosition = vec2(vPosition.x * starDensity, vPosition.y * starDensity + time * speed);
    float starBrightness = clamp(1.0 - mod(length(starPosition), 1.0), 0.0, 1.0);
    gl_FragColor = vec4(vec3(starBrightness), 1.0);
}
`;

const SpaceBox = () => {
    return (
        <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <mesh rotation={[Math.PI, 0, 0]}>
            <boxGeometry /* eslint-disable-next-line react/no-unknown-property */ args={[10, 10, 10]} />
                <shaderMaterial /* eslint-disable-next-line react/no-unknown-property */ args={{
                        vertexShader,
                        fragmentShader,
                        uniforms: {
                            time: { value: 0 },
                        },
                    }}
                />
            </mesh>
        </Canvas>
    );
};

export default SpaceBox;
