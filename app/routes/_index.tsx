import type { MetaFunction } from "@remix-run/node";
import { lazy, Suspense } from "react";
import { ClientOnly } from "~/components/ClientOnly";

export const meta: MetaFunction = () => [
  { title: "Lug Love – Bicycle Lug Archive" },
  {
    name: "description",
    content:
      "Explore an archive of bicycle lugs as interactive 3D models. Browse by manufacturer, filter by type, and view detailed models with multiple rendering modes.",
  },
];

const SplitView = lazy(() => import("~/components/split"));

export default function Index() {
  return (
    <main className="h-screen w-screen">
      <ClientOnly
        fallback={
          <div className="h-screen w-screen flex items-center justify-center text-gray-500">
            Loading 3D viewer…
          </div>
        }
      >
        {() => (
          <Suspense
            fallback={
              <div className="h-screen w-screen flex items-center justify-center text-gray-500">
                Loading 3D viewer…
              </div>
            }
          >
            <SplitView />
          </Suspense>
        )}
      </ClientOnly>
    </main>
  );
}
