import { SimpleGrid, Pagination, Center, Text, Stack } from "@mantine/core";
import { useSearchParams } from "@remix-run/react";
import { LugCard } from "./LugCard";
import type { LugSet, PayloadListResponse } from "~/lib/types";

type Props = {
  data: PayloadListResponse<LugSet> | null;
};

export function ArchiveGrid({ data }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  function handlePageChange(page: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
  }

  if (!data) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No data — make sure the Payload CMS server is running on port 3001.
      </Text>
    );
  }

  if (data.docs.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No lug sets found matching your filters.
      </Text>
    );
  }

  return (
    <Stack gap="xl">
      <SimpleGrid
        cols={{ base: 1, xs: 2, md: 3 }}
        spacing="md"
      >
        {data.docs.map((lugSet) => (
          <LugCard key={lugSet.id} lugSet={lugSet} />
        ))}
      </SimpleGrid>

      {data.totalPages > 1 && (
        <Center>
          <Pagination
            value={data.page}
            total={data.totalPages}
            onChange={handlePageChange}
            siblings={1}
            boundaries={1}
          />
        </Center>
      )}
    </Stack>
  );
}
