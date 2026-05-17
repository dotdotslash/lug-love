import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  Center,
  Environment,
  MapControls,
  OrthographicCamera,
} from "@react-three/drei";
import { View } from "@react-three/drei";
import { useRef, Suspense } from "react";
import { LugModel } from "./LugModel";
import { AngleIndicators } from "./AngleIndicators";
import { useViewerStore, VIEW_POSITIONS } from "~/lib/viewer-store";
import type { LugPiece } from "~/lib/types";
import styles from "./OrthoViewer.module.css";

type SceneProps = {
  piece: LugPiece;
  wireframe: boolean;
  showAngles: boolean;
  which: "top" | "middle" | "bottom";
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

const VIEWPORT_LABELS: Record<"top" | "middle" | "bottom", string> = {
  top: "Side Profile",
  middle: "Top Down",
  bottom: "Bottom Up",
};

export function OrthoViewer({ piece }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const view1 = useRef<HTMLDivElement>(null);
  const view2 = useRef<HTMLDivElement>(null);
  const view3 = useRef<HTMLDivElement>(null);

  const { showWireframe, showAngleLines } = useViewerStore();

  return (
    <div className={styles.container} ref={containerRef}>
      <Canvas
        className={styles.canvas}
        frameloop="demand"
        eventSource={containerRef as React.RefObject<HTMLElement>}
        gl={{ antialias: true }}
      >
        <View index={1} track={view1 as React.MutableRefObject<HTMLDivElement>}>
          <OrthoScene
            piece={piece}
            wireframe={showWireframe}
            showAngles={showAngleLines}
            which="top"
          />
        </View>
        <View index={2} track={view2 as React.MutableRefObject<HTMLDivElement>}>
          <OrthoScene
            piece={piece}
            wireframe={showWireframe}
            showAngles={showAngleLines}
            which="middle"
          />
        </View>
        <View index={3} track={view3 as React.MutableRefObject<HTMLDivElement>}>
          <OrthoScene
            piece={piece}
            wireframe={showWireframe}
            showAngles={showAngleLines}
            which="bottom"
          />
        </View>
      </Canvas>

      <div className={styles.viewport} ref={view1}>
        <span className={styles.label}>{VIEWPORT_LABELS.top}</span>
      </div>
      <div className={styles.viewport} ref={view2}>
        <span className={styles.label}>{VIEWPORT_LABELS.middle}</span>
      </div>
      <div className={styles.viewport} ref={view3}>
        <span className={styles.label}>{VIEWPORT_LABELS.bottom}</span>
      </div>
    </div>
  );
}
