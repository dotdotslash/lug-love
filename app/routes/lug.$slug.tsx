import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { lazy, Suspense } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import { getLugSetBySlug, getLugPiecesBySetId } from "~/lib/payload-api";
import type { Person, Workshop, MediaFile, Manufacturer } from "~/lib/types";
import { isPopulated } from "~/lib/types";

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

  // Resolve HDRI URL through the depth=3 chain: designer → workshop → hdriScan
  const designer = isPopulated<Person>(lugSet.designer as Person | string | undefined)
    ? (lugSet.designer as Person)
    : null;
  const workshop = designer && isPopulated<Workshop>(designer.workshop) ? designer.workshop : null;
  const hdriUrl = workshop && isPopulated<MediaFile>(workshop.hdriScan)
    ? workshop.hdriScan.url
    : undefined;

  return json({ lugSet, pieces, hdriUrl });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "Lug Not Found – Lug Love" }];
  const { lugSet } = data;
  const mfr = isPopulated<Manufacturer>(lugSet.manufacturer as Manufacturer | string | undefined)
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

const DARK_SCREEN = <div style={{ width: "100vw", height: "100vh", background: "#111" }} />;

export default function LugPage() {
  const { lugSet, pieces, hdriUrl } = useLoaderData<typeof loader>();

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111", overflow: "hidden" }}>
      <ClientOnly fallback={DARK_SCREEN}>
        {() => (
          <Suspense fallback={DARK_SCREEN}>
            <LugViewer lugSet={lugSet} pieces={pieces} hdriUrl={hdriUrl} />
          </Suspense>
        )}
      </ClientOnly>
    </div>
  );
}
