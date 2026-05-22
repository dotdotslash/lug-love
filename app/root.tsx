import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { MantineProvider, ColorSchemeScript, createTheme } from "@mantine/core";
import type { LinksFunction } from "@remix-run/node";
import mantineStyles from "@mantine/core/styles.css?url";
import globalStyles from "~/styles/global.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: mantineStyles },
  { rel: "stylesheet", href: globalStyles },
];

const theme = createTheme({});

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Outlet />
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error – Lug Love</title>
      </head>
      <body>
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
          <h1>Something went wrong</h1>
          <p>Please try refreshing the page.</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
