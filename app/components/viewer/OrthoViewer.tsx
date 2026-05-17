import { Canvas } from "@react-three/fiber";
import {
  Center,
  Environment,
  MapControls,
  OrthographicCamera,
  View,
} from "@react-three/drei";
import { useRef, Suspense } from "react";
import { LugModel } from "./LugModel";
import { AngleIndicators } from "./AngleIndicators";
import { useViewerStore, VIEW_POSITIONS } from "~/lib/viewer-store";
import type { LugPiece } from "~/lib/types";
import styles from "./OrthoViewer.module.css";

type ViewportKey = "top" | "middle" | "bottom";

const VIEWPORTS: { which: ViewportKey; label: string }[] = [
  { which: "top", label: "Side Profile" },
  { which: "middle", label: "Top Down" },
  { which: "bottom", label: "Bottom Up" },
];

type SceneProps = {
  piece: LugPiece;
  wireframe: boolean;
  showAngles: boolean;
  which: ViewportKey;
};

function OrthoScene({ piece, wireframe, showAngles, which }: SceneProps) {
  const direction = useViewerStore((s) => s[which]);
  const position = VIEW_POSITIONS[direction];

  return (
    <>
      <OrthographicCamera makeDefault position={position} zoom={80} near={0.1} far={1000} />
      <MapControls makeDefault screenSpacePanning enableRotate={false} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <Environment preset="studio" />
      <Center>
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#444" wireframe />
            </mesh>
          }
        >
          <LugModel url={piece.model3d.url} wireframe={wireframe} />
        </Suspense>
      </Center>
      {showAngles && (
        <AngleIndicators
          lugAngle={piece.angles?.lugAngle}
          seatingAngle={piece.angles?.seatingAngle}
        />
      )}
    </>
  );
}

type Props = {
  piece: LugPiece;
};

export function OrthoViewer({ piece }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const view1 = useRef<HTMLDivElement>(null);
  const view2 = useRef<HTMLDivElement>(null);
  const view3 = useRef<HTMLDivElement>(null);
  const viewRefs = [view1, view2, view3] as const;

  const { showWireframe, showAngleLines } = useViewerStore();

  return (
    <div className={styles.container} ref={containerRef}>
      <Canvas
        className={styles.canvas}
        frameloop="demand"
        eventSource={containerRef as React.RefObject<HTMLElement>}
        gl={{ antialias: true }}
      >
        {VIEWPORTS.map((vp, i) => (
          <View
            key={vp.which}
            index={i + 1}
            track={viewRefs[i] as React.MutableRefObject<HTMLDivElement>}
          >
            <OrthoScene
              piece={piece}
              wireframe={showWireframe}
              showAngles={showAngleLines}
              which={vp.which}
            />
          </View>
        ))}
      </Canvas>
      {VIEWPORTS.map((vp, i) => (
        <div key={vp.which} className={styles.viewport} ref={viewRefs[i]}>
          <span className={styles.label}>{vp.label}</span>
        </div>
      ))}
    </div>
  );
}
