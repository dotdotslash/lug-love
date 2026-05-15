import { Card, Text, Badge, Group, Stack, AspectRatio, Box } from "@mantine/core";
import { Link } from "@remix-run/react";
import type { LugSet, Manufacturer, PieceType } from "~/lib/types";
import { PIECE_TYPE_LABELS } from "~/lib/types";

type Props = {
  lugSet: LugSet;
  pieceTypes?: PieceType[];
};

function isManufacturer(m: Manufacturer | string): m is Manufacturer {
  return typeof m === "object" && m !== null;
}

const PIECE_COLORS: Record<PieceType, string> = {
  headtube_top: "blue",
  headtube_bottom: "cyan",
  seat_tube: "violet",
  bb_shell: "orange",
  dropout_front: "teal",
  dropout_rear: "green",
  braze_on: "gray",
};

export function LugCard({ lugSet, pieceTypes = [] }: Props) {
  const manufacturer = isManufacturer(lugSet.manufacturer)
    ? lugSet.manufacturer
    : null;

  const coverUrl = lugSet.coverImage?.url;
  const coverAlt = lugSet.coverImage?.alt ?? lugSet.name;

  return (
    <Card
      component={Link}
      to={`/lug/${lugSet.slug}`}
      shadow="sm"
      padding={0}
      radius="md"
      withBorder
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      {/* Cover image */}
      <AspectRatio ratio={4 / 3}>
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={coverAlt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            style={{
              width: "100%",
              height: "100%",
              background: "#f1f3f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="xs" c="dimmed">
              No image
            </Text>
          </Box>
        )}
      </AspectRatio>

      <Stack gap={4} p="md">
        <Text fw={600} size="sm" lineClamp={1}>
          {lugSet.name}
        </Text>

        {manufacturer && (
          <Text size="xs" c="dimmed" lineClamp={1}>
            {manufacturer.name}
            {manufacturer.city && ` · ${manufacturer.city}`}
            {manufacturer.country && !manufacturer.city && ` · ${manufacturer.country}`}
          </Text>
        )}

        {/* Piece type badges */}
        {pieceTypes.length > 0 && (
          <Group gap={4} mt={2}>
            {pieceTypes.map((pt) => (
              <Badge
                key={pt}
                size="xs"
                color={PIECE_COLORS[pt]}
                variant="light"
              >
                {PIECE_TYPE_LABELS[pt]}
              </Badge>
            ))}
          </Group>
        )}

        {lugSet.purchasable && (
          <Badge size="xs" color="green" variant="dot" mt={2}>
            Available to purchase
          </Badge>
        )}
      </Stack>
    </Card>
  );
}
