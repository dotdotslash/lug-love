import { TextInput } from "@mantine/core";
import { useDebouncedCallback } from "@mantine/hooks";
import { useSearchParams } from "@remix-run/react";
import { IconSearch } from "@tabler/icons-react";

export function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = useDebouncedCallback((value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value.trim()) {
        next.set("q", value.trim());
      } else {
        next.delete("q");
      }
      next.delete("page"); // reset to page 1 on new search
      return next;
    });
  }, 300);

  return (
    <TextInput
      placeholder="Search by lug set name, manufacturer, or designer…"
      leftSection={<IconSearch size={16} />}
      defaultValue={searchParams.get("q") ?? ""}
      onChange={(e) => handleChange(e.target.value)}
      size="md"
    />
  );
}
