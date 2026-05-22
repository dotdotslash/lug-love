import type { MetaFunction } from "@remix-run/node";
import { lazy, Suspense } from "react";
import { Link } from "@remix-run/react";
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
    <div className="h-screen w-screen relative">
      {/* Archive link overlay */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
        }}
      >
        <Link
          to="/archive"
          style={{
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: 6,
            fontSize: 13,
            textDecoration: "none",
            fontFamily: "sans-serif",
          }}
        >
          Browse Archive →
        </Link>
      </div>

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
    </div>
  );
}
