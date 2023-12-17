import React, { useRef } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { ShaderMaterial, UniformsUtils, UniformsLib, Vector2 } from 'three';

extend({ ShaderMaterial });

const CustomShaderMaterial = () => {
    const materialRef = useRef();
    const { size } = useThree();
    const uniforms = UniformsUtils.merge([
        UniformsLib['lights'],
        {
            iTime: { value: 0 },
            iResolution: { value: new Vector2(size.width, size.height) },
            // Add other uniforms here
        },
    ]);

    const fragmentShader = `
        uniform float iTime;
        uniform vec2 iResolution;
        
        // Define constants
        #define iterations 13
        #define formuparam 0.53
        #define volsteps 20
        #define stepsize 0.1
        #define zoom   0.800
        #define tile   0.850
        #define speed  0.000
        #define brightness 0.0055
        #define darkmatter 0.300
        #define distfading 0.730
        #define saturation 0.850

        // Define additional functions and logic
        // ... (Insert the rest of your shader logic here) ...

        void main() {
            vec2 fragCoord = gl_FragCoord.xy;
            vec4 fragColor;
            vec3 dir = vec3(0.0); // Initialize direction
            vec3 ro = vec3(0.0); // Initialize ray origin

            // Adapted logic from mainImage
            // ...

            // Set the final color
            gl_FragColor = fragColor;
        }
    `;

    const vertexShader = `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `;

    useFrame(({ clock }) => {
        const shader = materialRef.current;
        shader.uniforms.iTime.value = clock.getElapsedTime();
    });

    return (
        <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
        />
    );
};

export default CustomShaderMaterial;
