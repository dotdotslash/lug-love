import { useEffect, useState } from "react";

type Props = {
  children: (() => React.ReactNode) | React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Renders children only on the client, never during SSR.
 * Accepts either a render function (defers evaluation) or a ReactNode.
 * Use the render-function form when children import browser-only modules.
 */
export function ClientOnly({ children, fallback = null }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback}</>;
  return <>{typeof children === "function" ? children() : children}</>;
}
