import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import {
  Container,
  Title,
  Group,
  Anchor,
  Alert,
  Text,
  Divider,
  Stack,
  Box,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { getLugSets, getManufacturers } from "~/lib/payload-api";
import type { Manufacturer } from "~/lib/types";
import { SearchBar } from "~/components/archive/SearchBar";
import { FilterPanel } from "~/components/archive/FilterPanel";
import { ArchiveGrid } from "~/components/archive/ArchiveGrid";

export const meta: MetaFunction = () => [
  { title: "Archive – Lug Love" },
  {
    name: "description",
    content:
      "Browse the full archive of bicycle lugs. Search by manufacturer or designer, filter by type, and view 3D models.",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const manufacturer = url.searchParams.get("manufacturer") ?? "";
  const purchasable = url.searchParams.get("purchasable") === "true";
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));

  try {
    const [lugSetsRes, manufacturersRes] = await Promise.all([
      getLugSets({
        page,
        limit: 24,
        search: q || undefined,
        manufacturerSlug: manufacturer || undefined,
        purchasable: purchasable || undefined,
      }),
      getManufacturers({ limit: 200 }),
    ]);

    return json({
      lugSets: lugSetsRes,
      manufacturers: manufacturersRes.docs,
      error: null,
    });
  } catch {
    return json({
      lugSets: null,
      manufacturers: [] as Manufacturer[],
      error:
        "Cannot reach the CMS server. Start Payload with: cd payload && npm run dev",
    });
  }
}

export default function Archive() {
  const { lugSets, manufacturers, error } = useLoaderData<typeof loader>();

  const total = lugSets?.totalDocs ?? 0;

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="sm">
        <Title order={1} fz={{ base: "h2", sm: "h1" }}>
          Lug Archive
        </Title>
        <Anchor component={Link} to="/" size="sm">
          ← Home
        </Anchor>
      </Group>

      {error && (
        <Alert
          icon={<IconInfoCircle size={16} />}
          color="yellow"
          mb="lg"
          title="CMS offline"
        >
          {error}
        </Alert>
      )}

      {/* Search */}
      <SearchBar />

      {/* Result count */}
      {lugSets && (
        <Text size="sm" c="dimmed" mt="xs">
          {total === 0
            ? "No results"
            : `${total} lug set${total === 1 ? "" : "s"}`}
        </Text>
      )}

      <Divider my="lg" />

      {/* Filters + Grid */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        {/* Sidebar */}
        <Box
          visibleFrom="sm"
          style={{ width: 220, flexShrink: 0 }}
        >
          <Stack gap={0}>
            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb="md">
              Filters
            </Text>
            <FilterPanel manufacturers={manufacturers} />
          </Stack>
        </Box>

        {/* Grid */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          <ArchiveGrid data={lugSets} />
        </Box>
      </div>
    </Container>
  );
}
