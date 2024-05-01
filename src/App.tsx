import React, { useState } from 'react';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Slider,
} from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import PlaneWithShader from './components/Plane';
import Model from './components/Model';

interface ModelInfo {
  name: string;
  path: string;
}

const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedMesh, setSelectedMesh] = useState<string | null>(null);
  const [invisibleChildren, setInvisibleChildren] = useState<string[]>([]);
  const [childNames, setChildNames] = useState<string[]>([]);
  const [scaleX, setScaleX] = useState<number>(1);
  const [Xposition, setXposition] = useState<number>(0);

  const models: ModelInfo[] = [
    { name: 'Table', path: '/Table.gltf' },
    { name: 'Model 2', path: '/Table.gltf' },
    { name: 'Model 3', path: '/Table.gltf' }
  ];

  const handleChildClick = (childName: string) => {
    setInvisibleChildren(prev => prev.includes(childName) ? prev.filter(name => name !== childName) : [...prev, childName]);
  };

  const handleModelClick = (modelPath: string) => {
    setSelectedMesh(selectedMesh === modelPath ? null : modelPath);
    console.log(selectedMesh);
  };

  const handleScaleChange = (event: Event, newValue: number | number[]) => {
    setScaleX(newValue as number);
  };

  const handleXpositionChange = (event: Event, newValue: number | number[]) => {
    setXposition(newValue as number);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Model Viewer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {models.map((model) => (
            <ListItem button key={model.name} onClick={() => setSelectedModel(model.path)}>
              <ListItemText primary={model.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main style={{ flexGrow: 1, padding: 3, marginTop: '64px' }}>
        {selectedMesh && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <Typography>Extend Scale X</Typography>
              <Slider
                value={scaleX}
                min={0.1}
                max={2}
                step={0.1}
                onChange={handleScaleChange}
                style={{ width: '200px' }}
              />
              <Typography>X Position</Typography>
              <Slider
                value={Xposition}
                min={0.1}
                max={2}
                step={0.1}
                onChange={handleXpositionChange}
                style={{ width: '200px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Typography>Selected Model: {selectedMesh}</Typography>
            </div>
          </>
        )}
        <Canvas gl={{ antialias: false }} camera={{ position: [5, 5, 5] }}>
          <PlaneWithShader />
          <ambientLight intensity={0.9} />
          <directionalLight position={[0, 10, 5]} intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbitControls />
          <gridHelper args={[99, 50]} />
          <Suspense fallback={null}>
            {selectedModel && (
              <Model
                url={selectedModel}
                isSelected={selectedModel === selectedMesh}
                onClick={() => handleModelClick(selectedModel)}
                onChildNames={setChildNames}
                invisibleChildren={invisibleChildren}
                scaleX={scaleX}
                Xposition={Xposition}
              />
            )}
            <Environment preset="sunset" />
          </Suspense>
          <EffectComposer>
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
          </EffectComposer>
        </Canvas>
        {childNames.length > 0 && (
          <div style={{ right: 0, top: 0, position: 'absolute', padding: 10, background: '#fff' }}>
            <Typography variant="h6">Child Components:</Typography>
            <List>
              {childNames.map((name, index) => (
                <ListItem button key={index} onClick={() => handleChildClick(name)}>
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;