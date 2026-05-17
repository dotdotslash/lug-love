import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Center,
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";
import { Suspense } from "react";
import { LugModel } from "./LugModel";
import { AngleIndicators } from "./AngleIndicators";
import { useViewerStore } from "~/lib/viewer-store";
import type { LugPiece } from "~/lib/types";

type Props = {
  piece: LugPiece;
  hdriUrl?: string;
};

function LoadingBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#444" wireframe />
    </mesh>
  );
}

export function PerspectiveViewer({ piece, hdriUrl }: Props) {
  const { showWireframe, showAngleLines } = useViewerStore();

  return (
    <Canvas
      shadows
      frameloop="demand"
      gl={{ antialias: true, alpha: false }}
      style={{ background: "#111" }}
    >
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={20}
      />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      <Suspense fallback={<LoadingBox />}>
        {hdriUrl ? (
          <Environment files={hdriUrl} background backgroundBlurriness={0.1} />
        ) : (
          <Environment preset="studio" />
        )}

        <Center>
          <LugModel
            url={piece.model3d.url}
            wireframe={showWireframe}
          />
        </Center>

        {showAngleLines && (
          <AngleIndicators
            lugAngle={piece.angles?.lugAngle}
            seatingAngle={piece.angles?.seatingAngle}
          />
        )}

        <AccumulativeShadows
          temporal
          frames={60}
          position={[0, -1.5, 0]}
          scale={12}
          alphaTest={0.85}
          color="#202020"
        >
          <RandomizedLight
            amount={4}
            radius={5}
            ambient={0.6}
            position={[5, 5, -10]}
            bias={0.001}
          />
        </AccumulativeShadows>
      </Suspense>
    </Canvas>
  );
}
