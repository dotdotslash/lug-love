import { useState, lazy, Suspense } from "react";
import { Group, Box, Loader, Center } from "@mantine/core";
import { useViewerStore } from "~/lib/viewer-store";
import { ViewerControls } from "./ViewerControls";
import { ViewerSidePanel } from "./ViewerSidePanel";
import type { LugSet, LugPiece } from "~/lib/types";

const PerspectiveViewer = lazy(() =>
  import("./PerspectiveViewer").then((m) => ({ default: m.PerspectiveViewer }))
);
const OrthoViewer = lazy(() =>
  import("./OrthoViewer").then((m) => ({ default: m.OrthoViewer }))
);

export function ViewerFallback() {
  return (
    <Center style={{ width: "100%", height: "100%", background: "#111" }}>
      <Loader color="gray" size="sm" />
    </Center>
  );
}

type Props = {
  lugSet: LugSet;
  pieces: LugPiece[];
  hdriUrl?: string;
};

export function LugViewer({ lugSet, pieces, hdriUrl }: Props) {
  const [activePiece, setActivePiece] = useState<LugPiece>(pieces[0]);
  const viewerMode = useViewerStore((s) => s.viewerMode);
  const hasScan = Boolean(activePiece.textureScan?.url);

  return (
    <Group
      gap={0}
      align="stretch"
      style={{ width: "100%", height: "100%", background: "#111", overflow: "hidden" }}
      wrap="nowrap"
    >
      <Box style={{ flex: 1, minWidth: 0, position: "relative" }}>
        <Suspense fallback={<ViewerFallback />}>
          {viewerMode === "perspective" ? (
            <PerspectiveViewer piece={activePiece} hdriUrl={hdriUrl} />
          ) : (
            <OrthoViewer piece={activePiece} />
          )}
        </Suspense>
      </Box>

      <Box
        style={{
          width: 220,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          background: "#2a2a2a",
          borderLeft: "1px solid #2a2a2a",
          overflow: "hidden",
        }}
      >
        <ViewerControls hasScan={hasScan} />
        <Box style={{ flex: 1, overflowY: "auto", background: "#111" }}>
          <ViewerSidePanel
            lugSet={lugSet}
            pieces={pieces}
            activePiece={activePiece}
            onSelectPiece={setActivePiece}
          />
        </Box>
      </Box>
    </Group>
  );
}
