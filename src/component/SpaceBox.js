import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
    const mountRef = useRef(null);

    useEffect(() => {
        // Set up the renderer
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Create Shader Material
        const starShaderMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0 }
            },
            side: THREE.BackSide // Render on the inside of the box
        });

        // Create Box Geometry
        const boxGeometry = new THREE.BoxGeometry(10, 10, 10);

        // Create the Box Mesh with the Shader Material
        const starBox = new THREE.Mesh(boxGeometry, starShaderMaterial);

        // Rotate the box to see the inside
        starBox.rotation.x = Math.PI;

        // Create a scene just for the box
        const boxScene = new THREE.Scene();
        boxScene.add(starBox);

        // Camera and perspective settings
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        // Animation loop
        function animate(time) {
            requestAnimationFrame(animate);

            starShaderMaterial.uniforms.time.value = time / 1000;

            renderer.render(boxScene, camera);
        }

        animate();

        // Clean up
        return () => {
            mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default SpaceBox;
