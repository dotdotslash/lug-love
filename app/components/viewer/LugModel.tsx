import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useMemo, useEffect } from "react";
import * as THREE from "three";

// Shared materials – created once, reused across all LugModel instances.
const metalMaterial = new THREE.MeshStandardMaterial({
  metalness: 1,
  roughness: 0.15,
  color: "#c8c8c8",
  envMapIntensity: 1.2,
});

const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: "#4fc3f7",
  wireframe: true,
});

function applyMaterial(root: THREE.Object3D, wireframe: boolean) {
  root.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;
    node.castShadow = true;
    node.receiveShadow = true;
    node.material = wireframe ? wireframeMaterial : metalMaterial;
  });
}

function GLTFModel({ url, wireframe }: { url: string; wireframe: boolean }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  useEffect(() => { applyMaterial(cloned, wireframe); }, [cloned, wireframe]);
  return <primitive object={cloned} />;
}

function OBJModel({ url, wireframe }: { url: string; wireframe: boolean }) {
  const obj = useLoader(OBJLoader, url) as THREE.Group;
  const cloned = useMemo(() => obj.clone(true), [obj]);
  useEffect(() => { applyMaterial(cloned, wireframe); }, [cloned, wireframe]);
  return <primitive object={cloned} />;
}

function getFormat(url: string): "gltf" | "obj" {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  if (ext === "obj") return "obj";
  return "gltf";
}

type Props = {
  url: string;
  wireframe?: boolean;
};

export function LugModel({ url, wireframe = false }: Props) {
  const format = getFormat(url);
  return format === "obj" ? (
    <OBJModel url={url} wireframe={wireframe} />
  ) : (
    <GLTFModel url={url} wireframe={wireframe} />
  );
}

// Preload helper – call from route loaders to warm the cache
export function preloadModel(url: string) {
  if (getFormat(url) === "gltf") useGLTF.preload(url);
}
