import React from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, Vector2 } from 'three';
import * as THREE from 'three';

const IKEA = {
  uniforms: {
    u_time: { value: 0.0 },
    u_resolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
    u_color_yellow: { value: new THREE.Color(0xfedc56) }, // IKEA Yellow
    u_color_blue: { value: new THREE.Color(0x00008B) } // Dark Blue
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float u_time;
    uniform vec3 u_color_yellow;
    uniform vec3 u_color_blue;
    varying vec2 vUv;

    void main() {
      // Horizontal wave animation influenced by time
      float horizontalWave = 0.5 + 0.5 * sin(vUv.x * 4.0 + u_time);
      float gradient = vUv.y * horizontalWave; // Modulate the vertical gradient with the horizontal wave
      vec3 color = mix(u_color_blue, u_color_yellow, gradient); // Mix from blue to yellow with the animated gradient
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

const PlaneShaderforIKEA: React.FC = () => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const material = meshRef.current?.material as ShaderMaterial;
    material.uniforms.u_time.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} data-testid="shader-plane">
      <planeGeometry args={[100, 100]} />
      <shaderMaterial attach="material" args={[IKEA]} />
    </mesh>
  );
};

export default PlaneShaderforIKEA;