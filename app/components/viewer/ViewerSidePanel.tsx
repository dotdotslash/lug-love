import {
  Stack,
  Text,
  Group,
  Badge,
  Anchor,
  Divider,
  Table,
  Button,
  SegmentedControl,
  Image,
  Box,
} from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import type { LugSet, LugPiece, Manufacturer, Person } from "~/lib/types";
import { PIECE_TYPE_LABELS } from "~/lib/types";

function isObj<T extends { id: string }>(v: T | string | undefined): v is T {
  return typeof v === "object" && v !== null;
}

function DimensionsTable({ dimensions }: { dimensions: Record<string, unknown> }) {
  const rows = Object.entries(dimensions).map(([key, value]) => {
    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim();
    return (
      <Table.Tr key={key}>
        <Table.Td>
          <Text size="xs" c="dimmed">{label}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="xs" ff="monospace">{String(value)}</Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table withColumnBorders={false} withRowBorders verticalSpacing={4} styles={{ td: { padding: "4px 8px" } }}>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

type Props = {
  lugSet: LugSet;
  pieces: LugPiece[];
  activePiece: LugPiece;
  onSelectPiece: (piece: LugPiece) => void;
};

export function ViewerSidePanel({ lugSet, pieces, activePiece, onSelectPiece }: Props) {
  const manufacturer = isObj<Manufacturer>(lugSet.manufacturer as Manufacturer | string | undefined)
    ? lugSet.manufacturer as Manufacturer
    : null;
  const designer = isObj<Person>(lugSet.designer as Person | string | undefined)
    ? lugSet.designer as Person
    : null;

  return (
    <Stack gap="md" p="md" style={{ overflowY: "auto", height: "100%" }}>
      {/* Manufacturer */}
      {manufacturer && (
        <Box>
          {manufacturer.logo && (
            <Image
              src={manufacturer.logo.url}
              alt={manufacturer.name}
              w={80}
              h={40}
              fit="contain"
              mb={6}
              style={{ filter: "invert(1) brightness(0.7)" }}
            />
          )}
          <Text size="sm" fw={600}>{manufacturer.name}</Text>
          {manufacturer.city && (
            <Text size="xs" c="dimmed">
              {[manufacturer.city, manufacturer.state, manufacturer.country].filter(Boolean).join(", ")}
            </Text>
          )}
        </Box>
      )}

      {/* Designer */}
      {designer && (
        <>
          <Divider color="#333" />
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4} style={{ letterSpacing: "0.05em" }}>
              Designer
            </Text>
            <Text size="sm">{designer.name}</Text>
            {designer.socialLink && (
              <Anchor
                href={
                  designer.socialLink.startsWith("http")
                    ? designer.socialLink
                    : `https://instagram.com/${designer.socialLink.replace(/^@/, "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                c="dimmed"
              >
                {designer.socialLink}
              </Anchor>
            )}
          </Box>
        </>
      )}

      {/* Piece selector */}
      {pieces.length > 1 && (
        <>
          <Divider color="#333" />
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={6} style={{ letterSpacing: "0.05em" }}>
              Piece
            </Text>
            <SegmentedControl
              size="xs"
              orientation="vertical"
              fullWidth
              value={activePiece.id}
              onChange={(id) => {
                const found = pieces.find((p) => p.id === id);
                if (found) onSelectPiece(found);
              }}
              data={pieces.map((p) => ({
                value: p.id,
                label: PIECE_TYPE_LABELS[p.pieceType],
              }))}
              styles={{
                root: { background: "#111" },
                label: { color: "#ccc", fontSize: "11px" },
              }}
            />
          </Box>
        </>
      )}

      {/* Dimensions */}
      {activePiece.dimensions && Object.keys(activePiece.dimensions).length > 0 && (
        <>
          <Divider color="#333" />
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={6} style={{ letterSpacing: "0.05em" }}>
              Dimensions
            </Text>
            <DimensionsTable dimensions={activePiece.dimensions as Record<string, unknown>} />
          </Box>
        </>
      )}

      {/* Angles */}
      {activePiece.angles && (
        <>
          <Divider color="#333" />
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={6} style={{ letterSpacing: "0.05em" }}>
              Angles
            </Text>
            <Group gap="md">
              {activePiece.angles.lugAngle !== undefined && (
                <Box>
                  <Text size="xs" c="dimmed">Lug</Text>
                  <Text size="sm" ff="monospace">{activePiece.angles.lugAngle}°</Text>
                </Box>
              )}
              {activePiece.angles.seatingAngle !== undefined && (
                <Box>
                  <Text size="xs" c="dimmed">Seating</Text>
                  <Text size="sm" ff="monospace">{activePiece.angles.seatingAngle}°</Text>
                </Box>
              )}
            </Group>
            {activePiece.angles.notes && (
              <Text size="xs" c="dimmed" mt={4}>{activePiece.angles.notes}</Text>
            )}
          </Box>
        </>
      )}

      {/* Purchase links */}
      {lugSet.purchasable && lugSet.purchaseUrls && lugSet.purchaseUrls.length > 0 && (
        <>
          <Divider color="#333" />
          <Box>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={6} style={{ letterSpacing: "0.05em" }}>
              Buy
            </Text>
            <Stack gap={4}>
              {lugSet.purchaseUrls.map((pu, i) => (
                <Button
                  key={i}
                  component="a"
                  href={pu.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="xs"
                  variant="light"
                  rightSection={<IconExternalLink size={12} />}
                  fullWidth
                >
                  {pu.label}
                </Button>
              ))}
            </Stack>
          </Box>
        </>
      )}

      {/* Piece type badge */}
      <Divider color="#333" />
      <Badge size="xs" variant="outline" color="gray">
        {PIECE_TYPE_LABELS[activePiece.pieceType]}
      </Badge>
    </Stack>
  );
}
