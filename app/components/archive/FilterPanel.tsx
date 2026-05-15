import {
  Stack,
  Select,
  Switch,
  Text,
  Divider,
  Button,
  Checkbox,
  Tooltip,
} from "@mantine/core";
import { useSearchParams } from "@remix-run/react";
import type { Manufacturer } from "~/lib/types";
import { PIECE_TYPE_LABELS, type PieceType } from "~/lib/types";

const PIECE_TYPE_OPTIONS = Object.entries(PIECE_TYPE_LABELS) as [
  PieceType,
  string
][];

type Props = {
  manufacturers: Manufacturer[];
};

export function FilterPanel({ manufacturers }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  function setParam(key: string, value: string | null) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.delete("page"); // reset to page 1 on filter change
      return next;
    });
  }

  function clearAll() {
    setSearchParams({});
  }

  const hasFilters =
    searchParams.has("q") ||
    searchParams.has("manufacturer") ||
    searchParams.has("purchasable") ||
    searchParams.has("types");

  const manufacturerOptions = [
    { value: "", label: "All manufacturers" },
    ...manufacturers.map((m) => ({ value: m.slug, label: m.name })),
  ];

  return (
    <Stack gap="lg">
      <div>
        <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb="xs">
          Manufacturer
        </Text>
        <Select
          data={manufacturerOptions}
          value={searchParams.get("manufacturer") ?? ""}
          onChange={(v) => setParam("manufacturer", v || null)}
          placeholder="All manufacturers"
          searchable
          clearable
          size="sm"
        />
      </div>

      <Divider />

      <div>
        <Switch
          label="Purchasable only"
          size="sm"
          checked={searchParams.get("purchasable") === "true"}
          onChange={(e) =>
            setParam("purchasable", e.target.checked ? "true" : null)
          }
        />
      </div>

      <Divider />

      {/* Piece type filter – UI ready, filtering comes in a later phase */}
      <div>
        <Tooltip
          label="Piece type filtering requires a database index — coming in a future update"
          position="right"
          multiline
          w={220}
        >
          <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb="xs">
            Piece Types
          </Text>
        </Tooltip>
        <Stack gap={6}>
          {PIECE_TYPE_OPTIONS.map(([value, label]) => (
            <Checkbox
              key={value}
              label={label}
              size="sm"
              disabled
            />
          ))}
        </Stack>
      </div>

      {hasFilters && (
        <>
          <Divider />
          <Button
            variant="subtle"
            size="xs"
            color="gray"
            onClick={clearAll}
          >
            Clear all filters
          </Button>
        </>
      )}
    </Stack>
  );
}
