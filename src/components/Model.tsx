import React, { useEffect, useRef } from 'react';
import { Mesh, Material, Object3D } from 'three';
import {GLTFLoader} from '../../node_modules/@types/three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader, useFrame } from '@react-three/fiber';

interface ModelProps {
  url: string;
  isSelected: boolean;
  onClick: () => void;
  onChildNames: (names: string[]) => void; 
  invisibleChildren: string[];
  scaleX: number;
  Xposition: number;

}


const Model: React.FC<ModelProps> = ({
  url,
  isSelected,
  onClick,
  onChildNames,
  invisibleChildren,
  scaleX,
  Xposition
}) => {
  const gltf = useLoader(GLTFLoader, url);

  useEffect(() => {
    const names: string[] = [];
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        names.push(child.name);
        // Check visibility against the list of invisible children
        child.visible = !invisibleChildren.includes(child.name);
      }
    });
    onChildNames(names);
  }, [gltf.scene, onChildNames, invisibleChildren]);


  const originalMaterials = useRef<Map<Mesh, Material>>(new Map());

  const extendModelX = (amount: number) => {
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.scale.x = amount;
        child.updateMatrixWorld();
      }
    });
  };
  const extractFilename = (url: string) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    return filename;
  }

  const setXposition = (amount: number) => {
    const filename = extractFilename(url);
    gltf.scene.traverse((child: any) => {
      if(filename === 'Table' && child.name === 'Scene' && child.position) {
        console.log(isSelected);
        child.position.x = amount;
        child.updateMatrixWorld();
      }
    });
  };




  useEffect(() => {
    gltf.scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        originalMaterials.current.set(child, child.material.clone());
      }
    });
  }, [gltf.scene]);

  const handleModelClick = (event: any) => {
    event.stopPropagation();
    onClick(); // Call the parent component's click handler
    if (isSelected) {
      extendModelX(scaleX);
      setXposition(Xposition);

    }
  };

  // Continuous update of scaling on X-axis using useFrame
  useFrame(() => {
    if (isSelected) {
      extendModelX(scaleX);
      setXposition(Xposition);
    }
  });

  useEffect(() => {
    if (isSelected) {
      // If model is selected, change material color
      gltf.scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material.color.setHex(0xff0000);
        }
      });
    } else {
      // If model is not selected, reset to original materials
      gltf.scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const originalMaterial = originalMaterials.current.get(child);
          if (originalMaterial) {
            child.material.copy(originalMaterial);
          }
        }
      });
    }
  }, [isSelected, gltf.scene]);

  return <primitive object={gltf.scene} onClick={handleModelClick} position={[0, 1, 0]} data-testid="model-primitive" />;
};

export default Model;