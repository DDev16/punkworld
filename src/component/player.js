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

  useFrame((_, delta) => {
    const cameraOffset = new THREE.Vector3(0, 1, -8);
    const modelPosition = model.current.position.clone();
    modelPosition.y += 2; // Adjust the height of the camera above the model
    camera.position.lerp(modelPosition.add(cameraOffset), 0.1);
    camera.lookAt(model.current.position);

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

    let speed = shiftPress ? 0.2 : 0.1;

    const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
    const cameraDirectionXZ = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
    const cameraPerpendicular = new THREE.Vector3(cameraDirection.z, 0, -cameraDirection.x).normalize();

    if (forwardPress) {
        const newPos = model.current.position.clone().addScaledVector(cameraDirectionXZ, speed);
        model.current.lookAt(newPos);
        model.current.position.addScaledVector(cameraDirectionXZ, speed);
      }
      if (backwardPress) {
        const newPos = model.current.position.clone().addScaledVector(cameraDirectionXZ, -speed);
        model.current.lookAt(newPos);
        model.current.position.addScaledVector(cameraDirectionXZ, -speed);
      }
      if (leftPress) {
        const newPos = model.current.position.clone().addScaledVector(cameraPerpendicular, speed);
        model.current.lookAt(newPos);
        model.current.position.addScaledVector(cameraPerpendicular, speed);
      }
      if (rightPress) {
        const newPos = model.current.position.clone().addScaledVector(cameraPerpendicular, -speed);
        model.current.lookAt(newPos);
        model.current.position.addScaledVector(cameraPerpendicular, -speed);
      }
      
    model.current.position.y -= gravity;
    if (model.current.position.y <= groundY) {
      model.current.position.y = groundY;
    }
  });

  return <primitive ref={model} object={gltf.scene} />;
};
