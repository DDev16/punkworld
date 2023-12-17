import React, { useRef, useEffect, useState } from 'react';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useKeyPress } from '../component/hooks/useKeyPress';
import * as THREE from 'three';

export const Player = () => {
  const gltf = useLoader(GLTFLoader, './player.glb');
  const model = useRef();
  const actions = useRef({});
  const [currentAction, setCurrentAction] = useState(null);
  const { camera } = useThree();

  const mixer = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0 });

  const forwardPress = useKeyPress('w');
  const backwardPress = useKeyPress('s');
  const leftPress = useKeyPress('a');
  const rightPress = useKeyPress('d');
  const jumpPress = useKeyPress(' ');
  const shiftPress = useKeyPress('Shift');

  const gravity = 0.5;
  const groundY = -0.5;
  const jumpSpeed = 0.02;

  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(model.current);
    gltf.animations.forEach((clip) => {
      const action = mixer.current.clipAction(clip);
      actions.current[clip.name] = action;
      if (clip.name === 'idle') {
        action.play();
        setCurrentAction('idle');
      }
    });
  }, [gltf.animations]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;

    const { movementX, movementY } = event;
    setCameraRotation((prevRotation) => ({
      x: prevRotation.x + movementX * 0.002,
      y: Math.min(Math.max(prevRotation.y - movementY * 0.002, -Math.PI / 4), Math.PI / 4),
    }));
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging]);

  useFrame((_, delta) => {
    const cameraOffset = new THREE.Vector3(0, 2, -8);
    const modelPosition = model.current.position.clone();
    modelPosition.y += 2;

    const cameraDirection = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation.x);
    const cameraPosition = modelPosition.clone().add(cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotation.x));

    camera.position.copy(cameraPosition);
    camera.lookAt(modelPosition);

    if (mixer.current) mixer.current.update(delta);

    let newAction = currentAction;
    if (jumpPress && model.current.position.y <= groundY) {
      model.current.position.y += jumpSpeed;
      newAction = 'jumping';
    } else if (forwardPress || backwardPress || leftPress || rightPress) {
      newAction = shiftPress ? 'running' : 'walking';
    } else {
      newAction = 'idle';
    }

    if (currentAction !== newAction) {
      const currentActionObject = actions.current[currentAction];
      const newActionObject = actions.current[newAction];

      if (currentActionObject) {
        currentActionObject.stop();
        currentActionObject.reset();
      }

      if (newActionObject) {
        newActionObject.play();
      }

      setCurrentAction(newAction);
    }

    let speed = shiftPress ? 0.8 : 0.1;
    const cameraDirectionXZ = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
    const cameraPerpendicular = new THREE.Vector3(cameraDirection.z, 0, -cameraDirection.x).normalize();

    if (forwardPress) {
      const newPos = model.current.position.clone().addScaledVector(cameraDirectionXZ, -speed); // Flip the sign here
      model.current.lookAt(newPos);
      model.current.position.sub(cameraDirectionXZ.clone().multiplyScalar(speed)); // Subtract the movement vector
    }
    if (backwardPress) {
      const newPos = model.current.position.clone().addScaledVector(cameraDirectionXZ, speed); // Flip the sign here
      model.current.lookAt(newPos);
      model.current.position.add(cameraDirectionXZ.clone().multiplyScalar(speed)); // Add the movement vector
    }
    if (leftPress) {
      const newPos = model.current.position.clone().addScaledVector(cameraPerpendicular, -speed); // Flip the sign here
      model.current.lookAt(newPos);
      model.current.position.sub(cameraPerpendicular.clone().multiplyScalar(speed)); // Subtract the movement vector
    }
    if (rightPress) {
      const newPos = model.current.position.clone().addScaledVector(cameraPerpendicular, speed); // Flip the sign here
      model.current.lookAt(newPos);
      model.current.position.add(cameraPerpendicular.clone().multiplyScalar(speed)); // Add the movement vector
    }
    

    model.current.position.y -= gravity;
    if (model.current.position.y <= groundY) {
      model.current.position.y = groundY;
    }
  });

  

/* eslint-disable react/no-unknown-property */

return <primitive ref={model} object={gltf.scene} />;
};