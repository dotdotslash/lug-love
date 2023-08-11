'use client'
import styles from "./split.module.css"
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useHelper, useGLTF, View, Center, Environment, MapControls, OrbitControls, PivotControls, RandomizedLight } from '@react-three/drei'
import { PerspectiveCamera, OrthographicCamera, AccumulativeShadows } from '@react-three/drei'
import { Menu, Button } from '@mantine/core'
import React, { useRef, forwardRef } from 'react'
import { create } from 'zustand'


// GizmoHelper for camera controls

const matrix = new THREE.Matrix4()
const positions = { Top: [0, 10, 0], Bottom: [0, -10, 0], Left: [-10, 0, 0], Right: [10, 0, 0], Back: [0, 0, -10], Front: [0, 0, 10] }
const useStore = create((set) => ({
  projection: 'Perspective',
  modelType: 'Gold',
  top: 'Back',
  middle: 'Top',
  bottom: 'Right',
  setPanelView: (which, view) => set({ [which]: view }),
  setProjection: (projection) => set({ projection }),
  setModelType: (modelType) => set({ modelType })
}))

export default function SplitView() {
  // const [view1, view2, view3, view4] = useRef();
  const view1 = useRef();
  const view2 = useRef();
  const view3 = useRef();
  const view4 = useRef();

  const myRoot = useRef();


  return (
    <div className={styles.splitcontainer} ref={myRoot}>
        <Canvas className={styles.canvas} shadows frameloop="demand" eventSource={myRoot}  >
            <View index={1} track={view1}>
                <CameraSwitcher />
                <PivotControls scale={0.4} depthTest={false} matrix={matrix} />
                <Scene background="aquamarine" matrix={matrix}>
                    <AccumulativeShadows temporal frames={100} position={[0, -0.4, 0]} scale={14} alphaTest={0.85} color="orange" colorBlend={0.5}>
                    <RandomizedLight amount={8} radius={8} ambient={0.5} position={[5, 5, -10]} bias={0.001} />
                    </AccumulativeShadows>
                </Scene>
                <OrbitControls makeDefault />
            </View>
            <View index={2} track={view2}>
                <OrthoViewCam which="top" />
                <PivotControls activeAxes={[true, true, false]} depthTest={false} matrix={matrix} />
                <Scene background="lightpink" matrix={matrix} />
                <MapControls makeDefault screenSpacePanning enableRotate={false} />
            </View>
            <View index={3} track={view3}>
                <OrthoViewCam which="middle" />
                <PivotControls activeAxes={[true, false, true]} depthTest={false} matrix={matrix} />
                <Scene background="peachpuff" matrix={matrix} />
                <MapControls makeDefault screenSpacePanning enableRotate={false} />
            </View>
            <View index={4} track={view4}>
                <OrthoViewCam which="bottom" />
                <PivotControls activeAxes={[false, true, true]} depthTest={false} matrix={matrix} />
                <Scene background="skyblue" matrix={matrix} />
                <MapControls makeDefault screenSpacePanning enableRotate={false} />
            </View>
        </Canvas>
        <MainPanel ref={view1} />
        <ModelPanel ref={view1} />
        <SidePanel ref={view2} which="top" />
        <SidePanel ref={view3} which="middle" />
        <SidePanel ref={view4} which="bottom" />
    </div>
  )
}

function Model() {
  const { nodes, materials } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bricks/model.gltf')

  return (
    <mesh castShadow geometry={nodes.bricks.geometry} material={materials['Stone.014']} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="red" roughness={0} metalness={1} />
    </mesh>
  )
}

function NewModel() {
  const { nodes, materials } = useGLTF('/models/pineapple/scene.gltf')
  console.log(nodes)

  return (
    <mesh castShadow geometry={nodes.Object_4.geometry} material={materials['Stone.014']} scale={[0.1, 0.1, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="red" roughness={0} metalness={1} />
    </mesh>
  )
}

function Scene({ background = 'white', children, ...props }) {
  return (
    <>
      <color attach="background" args={[background]} />
      <ambientLight />
      <directionalLight position={[10, 10, -15]} castShadow shadow-bias={-0.0001} shadow-mapSize={1024} />
      <Environment preset="city" />
      <group
        matrixAutoUpdate={false}
        // Why onUpdate and not just matrix={matrix} ?
        // This is an implementation detail, overwriting (most) transform objects isn't possible in Threejs
        // because they are defined read-only. Therefore Fiber will always call .copy() if you pass
        // an object, for instance matrix={new THREE.Matrix4()} or position={new THREE.Vector3()}
        // In this rare case we do not want it to copy the matrix, but refer to it.
        onUpdate={(self) => (self.matrix = matrix)}
        {...props}>
        <Center>
          <Model />
          <NewModel />
        </Center>
        {children}
      </group>
    </>
  )
}

function ModalSwitcher() {
  const projection = useStore((state) => state.projection)
  const camera = useRef();
  useHelper(camera, THREE.CameraHelper, 'cyan');

  // Would need to remember the old coordinates to be more useful ...
  return projection === 'Perspective' ? (
    <PerspectiveCamera ref={camera} makeDefault position={[1, 2, 4]} fov={25} />
  ) : (
    <OrthographicCamera makeDefault position={[4, 4, 4]} zoom={280} />
  )
}

function CameraSwitcher() {
  const projection = useStore((state) => state.projection)
  const camera = useRef();
  useHelper(camera, THREE.CameraHelper, 'cyan');

  // Would need to remember the old coordinates to be more useful ...
  return projection === 'Perspective' ? (
    <PerspectiveCamera ref={camera} makeDefault position={[1, 2, 4]} fov={25} />
  ) : (
    <OrthographicCamera makeDefault position={[4, 4, 4]} zoom={280} />
  )
}

function OrthoViewCam({ which }) {
  const view = useStore((state) => state[which]);
  const OrthoViewCam = useRef();
  useHelper(OrthoViewCam, THREE.CameraHelper, 1, 'hotpink');
  //   return <PerspectiveCamera makeDefault position={positions[view]} fov={25} ref={OrthoViewCam} zoom={50} />
  return <OrthographicCamera makeDefault position={positions[view]} ref={OrthoViewCam} zoom={100} />
}

const MainPanel = forwardRef((props, fref) => {
    const projection = useStore((state) => state.projection)
    const setProjection = useStore((state) => state.setProjection)
    return (
      <div ref={fref} className={styles.panel} style={{ gridArea: 'main' }}>
         <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button>{projection}</Button>
        </Menu.Target>
        <Menu.Dropdown onClick={(e) => setProjection(e.target.innerText)}>
          <Menu.Item >Perspective</Menu.Item>
          <Menu.Item >Orthographic</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      </div>
    )
  })

  const ModelPanel = forwardRef((props, fref) => {
    const model = useStore((state) => state.modelType)
    const setmodelType = useStore((state) => state.setmodelType)
    return (
      <div ref={fref} className={styles.panel} style={{ gridArea: 'main' }}>
        <Menu shadow="md" width={300}>
        <Menu.Target>
          <Button>{model}</Button>
        </Menu.Target>
        <Menu.Dropdown onClick={(e) => setmodelType(e.target.innerText)}>
          <Menu.Item >Perspective</Menu.Item>
          <Menu.Item >Orthographic</Menu.Item>
        </Menu.Dropdown>
      </Menu>
      </div>
    )
  })
  
  const SidePanel = forwardRef(({ which }, fref) => {
    const value = useStore((state) => state[which])
    const setPanelView = useStore((state) => state.setPanelView)
    return (
        <div ref={fref} className={styles.panel} style={{ gridArea: which }}>
           <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button>{value}</Button>
        </Menu.Target>
        <Menu.Dropdown onClick={(e) => setPanelView(which, e.target.innerText)}>
          <Menu.Item >Top</Menu.Item>
          <Menu.Item >Bottom</Menu.Item>
          <Menu.Item >Left</Menu.Item>
          <Menu.Item >Right</Menu.Item>
          <Menu.Item >Front</Menu.Item>
          <Menu.Item >Back</Menu.Item>
        </Menu.Dropdown>
      </Menu>    
        </div>
    )
  })




