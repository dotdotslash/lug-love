import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { lazy, Suspense } from "react";
import { Center, Loader } from "@mantine/core";
import { ClientOnly } from "~/components/ClientOnly";
import { getLugSetBySlug, getLugPiecesBySetId } from "~/lib/payload-api";
import type { Person, Workshop, MediaFile, Manufacturer } from "~/lib/types";

function isObj<T extends { id: string }>(v: T | string | undefined): v is T {
  return typeof v === "object" && v !== null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const lugSet = await getLugSetBySlug(slug);
  if (!lugSet) throw new Response("Not Found", { status: 404 });

  const piecesRes = await getLugPiecesBySetId(lugSet.id);
  const pieces = piecesRes.docs;

  if (pieces.length === 0) {
    throw new Response("No pieces found for this lug set", { status: 404 });
  }

  // Resolve HDRI URL from the designer's workshop scan (depth=3 chain)
  const designer = isObj<Person>(lugSet.designer as Person | string | undefined) ? lugSet.designer as Person : null;
  const workshop = designer && isObj<Workshop>(designer.workshop) ? designer.workshop : null;
  const hdriScan = workshop && isObj<MediaFile>(workshop.hdriScan) ? workshop.hdriScan : null;
  const hdriUrl = hdriScan?.url ?? undefined;

  // Narrow manufacturer for meta
  const manufacturer = isObj<Manufacturer>(lugSet.manufacturer as Manufacturer | string | undefined)
    ? lugSet.manufacturer as Manufacturer
    : { name: "" };

  return json({ lugSet, pieces, hdriUrl });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "Lug Not Found – Lug Love" }];
  const { lugSet } = data;
  const mfr = isObj<Manufacturer>(lugSet.manufacturer as Manufacturer | string | undefined)
    ? (lugSet.manufacturer as Manufacturer).name
    : "";
  return [
    { title: `${lugSet.name}${mfr ? ` – ${mfr}` : ""} – Lug Love` },
    { name: "description", content: `3D viewer for the ${lugSet.name} lug set${mfr ? ` by ${mfr}` : ""}.` },
  ];
};

const LugViewer = lazy(() =>
  import("~/components/viewer/LugViewer").then((m) => ({ default: m.LugViewer }))
);

function ViewerFallback() {
  return (
    <Center style={{ width: "100vw", height: "100vh", background: "#111" }}>
      <Loader color="gray" size="sm" />
    </Center>
  );
}

export default function LugPage() {
  const { lugSet, pieces, hdriUrl } = useLoaderData<typeof loader>();

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111", overflow: "hidden" }}>
      <ClientOnly fallback={<ViewerFallback />}>
        {() => (
          <Suspense fallback={<ViewerFallback />}>
            <LugViewer lugSet={lugSet} pieces={pieces} hdriUrl={hdriUrl} />
          </Suspense>
        )}
      </ClientOnly>
    </div>
  );
}
