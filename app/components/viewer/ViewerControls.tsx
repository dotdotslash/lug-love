import {
  SegmentedControl,
  Stack,
  Switch,
  Text,
  Group,
  Paper,
  Divider,
  Select,
} from "@mantine/core";
import { useViewerStore } from "~/lib/viewer-store";
import type { MaterialType } from "~/lib/viewer-store";

const MATERIAL_OPTIONS: { value: MaterialType; label: string }[] = [
  { value: "metal", label: "Metal" },
  { value: "photoscan", label: "Photo Scan" },
  { value: "outline", label: "Outline" },
  { value: "crosshatch", label: "Crosshatch" },
];

type Props = {
  hasScan: boolean;
};

export function ViewerControls({ hasScan }: Props) {
  const {
    viewerMode,
    setViewerMode,
    materialType,
    setMaterialType,
    showTexture,
    showWireframe,
    showAngleLines,
    toggleTexture,
    toggleWireframe,
    toggleAngleLines,
  } = useViewerStore();

  return (
    <Paper p="sm" withBorder style={{ background: "#1a1a1a", borderColor: "#333" }}>
      <Stack gap="xs">
        <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.05em" }}>
          View Mode
        </Text>
        <SegmentedControl
          size="xs"
          value={viewerMode}
          onChange={(v) => setViewerMode(v as "perspective" | "ortho")}
          data={[
            { label: "Perspective", value: "perspective" },
            { label: "Ortho", value: "ortho" },
          ]}
          styles={{
            root: { background: "#111" },
            label: { color: "#ccc" },
          }}
        />

        <Divider color="#333" />

        <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.05em" }}>
          Material
        </Text>
        <Select
          size="xs"
          value={materialType}
          onChange={(v) => v && setMaterialType(v as MaterialType)}
          data={MATERIAL_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
            disabled: o.value === "photoscan" && !hasScan,
          }))}
          styles={{
            input: { background: "#111", borderColor: "#333", color: "#ccc" },
            dropdown: { background: "#1a1a1a", borderColor: "#333" },
          }}
        />

        <Divider color="#333" />

        <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.05em" }}>
          Overlays
        </Text>
        <Group gap="xs">
          <Switch
            size="xs"
            checked={showTexture}
            onChange={toggleTexture}
            label={<Text size="xs" c="dimmed">Texture</Text>}
            styles={{ track: { background: showTexture ? "#4fc3f7" : "#333" } }}
          />
        </Group>
        <Group gap="xs">
          <Switch
            size="xs"
            checked={showWireframe}
            onChange={toggleWireframe}
            label={<Text size="xs" c="dimmed">Wireframe</Text>}
            styles={{ track: { background: showWireframe ? "#4fc3f7" : "#333" } }}
          />
        </Group>
        <Group gap="xs">
          <Switch
            size="xs"
            checked={showAngleLines}
            onChange={toggleAngleLines}
            label={<Text size="xs" c="dimmed">Angle Lines</Text>}
            styles={{ track: { background: showAngleLines ? "#ef4444" : "#333" } }}
          />
        </Group>
      </Stack>
    </Paper>
  );
}
