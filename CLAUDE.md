# Lug Love

A web application for exploring an archive of bicycle lugs as interactive 3D models. Users can browse by manufacturer or designer, filter by lug attributes, and view detailed 3D models with multiple rendering modes and camera setups.

---

## Project Vision

Lug Love is a public archive and educational tool for framebuilders, collectors, and enthusiasts. Every lug in the database can be viewed as a 3D model with technical overlays, multiple material presentations, and dimensional data. No account is needed to browse. Content is managed through a private admin CMS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Remix (React) |
| 3D Rendering | @react-three/fiber + @react-three/drei |
| CMS / Backend | Payload CMS v3 (standalone Express adapter) |
| Database | PostgreSQL (via Payload's built-in db adapter) |
| Auth | Payload built-in JWT auth (admin-only) |
| File storage | Local filesystem (`/media` dir, served by Nginx) |
| UI components | Mantine v7 + Tailwind CSS |
| State | Zustand |
| Ads | Google Publisher Tag (client-side, `AdBanner.tsx`) |
| Self-hosting | Nginx (reverse proxy) + systemd |

### Why Remix

Remix is a React-based full-stack framework with a clean server/client model (loaders/actions), excellent self-hosting support, and no Vercel dependency. It is React compatible, so @react-three/fiber and @react-three/drei work unchanged.

### Why Payload CMS

Payload CMS v3 runs as a standalone Express server. It provides a built-in admin UI (served at `/admin`), file upload handling, JWT auth, and a REST API generated automatically from TypeScript collection definitions. No separate admin UI needs to be built from scratch.

### Two-Process Deployment

- **Payload server** – Express, port 3001 → admin UI at `/admin`, REST API at `/api`
- **Remix server** – port 3000 → all public-facing pages
- **Nginx** – routes `/admin` and `/api` to Payload; everything else to Remix; serves `/media` as static files directly

---

## Directory Structure

```
lug-love/
├── app/                              # Remix application
│   ├── root.tsx                      # Root layout (AdBanner, fonts, MantineProvider)
│   ├── routes/
│   │   ├── _index.tsx                # Homepage / landing
│   │   ├── archive.tsx               # Archive browse page (loader fetches Payload API)
│   │   ├── lug.$slug.tsx             # Lug detail + 3D viewer
│   │   └── manufacturer.$slug.tsx    # Manufacturer detail page
│   │
│   └── components/
│       ├── viewer/
│       │   ├── LugViewer.tsx               # Mode switcher wrapper (client-only)
│       │   ├── PerspectiveViewer.tsx        # Mode A: single perspective canvas + HDRI
│       │   ├── OrthoViewer.tsx              # Mode B: 3-viewport ortho (from split.js)
│       │   ├── LugModel.tsx                 # Format-aware loader (GLTF/GLB/OBJ)
│       │   ├── AngleIndicators.tsx          # Angle line overlays in scene
│       │   ├── ViewerControls.tsx           # Control panel (mode, material, toggles)
│       │   ├── ViewerSidePanel.tsx          # Lug details sidebar
│       │   └── materials/
│       │       ├── useMaterialSystem.ts     # Hook: resolves active material
│       │       ├── PhotoScanMaterial.tsx    # Material type 1: texture scan
│       │       ├── MetalMaterial.tsx        # Material type 2: solid metal
│       │       ├── OutlineMaterial.tsx      # Material type 3: technical drawing edges
│       │       └── CrosshatchMaterial.tsx   # Material type 4: ink crosshatch shader
│       │
│       ├── archive/
│       │   ├── ArchiveGrid.tsx       # Paginated grid, page state via useSearchParams
│       │   ├── LugCard.tsx           # Card: cover image, name, manufacturer, badges
│       │   ├── FilterPanel.tsx       # Sidebar: manufacturer select, purchasable switch
│       │   └── SearchBar.tsx         # Debounced 300ms search via useSearchParams
│       │
│       └── layout/
│           ├── SiteHeader.tsx
│           ├── AdBanner.tsx          # Google Publisher Tag wrapper
│           └── SiteFooter.tsx
│
├── payload/                          # Payload CMS standalone server
│   ├── server.ts                     # Express server entry point
│   ├── payload.config.ts             # Payload configuration root
│   └── collections/
│       ├── Users.ts
│       ├── Manufacturers.ts
│       ├── People.ts
│       ├── Workshops.ts
│       ├── LugSets.ts
│       ├── LugPieces.ts
│       └── Media.ts
│
│   └── lib/
│       ├── payload-api.ts            # Typed fetch helpers for Payload REST API
│       ├── viewer-store.ts           # Zustand store (extends split.jsx patterns)
│       └── types.ts                  # Shared TypeScript types
│
├── public/
│   └── models/                       # Sample dev models (existing GLTF files)
│
├── media/                            # Payload uploads directory (gitignored)
│
├── CLAUDE.md
├── TODO.md
├── docker-compose.yml                # PostgreSQL for local development
├── nginx.conf.example                # Reference nginx config for production
├── package.json
└── tsconfig.json
```

---

## Data Model

All content is managed through Payload CMS collections. Payload generates the SQL schema and REST API automatically.

### `users`
Admin accounts only. No public registration.

| Field | Type | Notes |
|---|---|---|
| email | text | unique |
| password | text | hashed by Payload |
| role | select | `admin` only |

### `media`
All uploaded files (images, 3D models, textures, HDRI scans).

| Field | Type | Notes |
|---|---|---|
| filename | text | |
| mimeType | text | |
| url | text | served from `/media` |
| alt | text | |
| fileType | select | `image`, `3d-model`, `texture-scan`, `hdri` |

**Accepted MIME types:** `image/jpeg`, `image/png`, `image/webp`, `model/gltf+json`, `model/gltf-binary`, `application/octet-stream` (OBJ/BIN), `image/x-hdr`

### `manufacturers`

| Field | Type | Notes |
|---|---|---|
| name | text | |
| slug | text | unique, used in URLs |
| city | text | |
| state | text | |
| country | text | |
| website | text | optional |
| description | richText | |
| logo | upload → media | |
| yearsActiveStart | number | |
| yearsActiveEnd | number | null = still active |

### `people`

| Field | Type | Notes |
|---|---|---|
| name | text | |
| slug | text | unique |
| socialLink | text | Instagram handle or URL |
| manufacturer | relationship → manufacturers | optional |
| workshop | relationship → workshops | optional |

### `workshops`

| Field | Type | Notes |
|---|---|---|
| name | text | |
| person | relationship → people | |
| hdriScan | upload → media | `.hdr` file for 360 background |

The workshop HDRI is displayed as the environment background in the lug viewer's perspective mode when the user has it toggled on.

### `lug_sets`

| Field | Type | Notes |
|---|---|---|
| name | text | |
| slug | text | unique, used in URLs |
| manufacturer | relationship → manufacturers | |
| designer | relationship → people | optional |
| description | richText | |
| coverImage | upload → media | shown in archive grid |
| purchasable | boolean | |
| purchaseUrls | array of `{ label, url }` | shown if purchasable |

### `lug_pieces`

Each lug piece belongs to a lug set. Not every set has every piece type — all are optional at the set level.

| Field | Type | Notes |
|---|---|---|
| lugSet | relationship → lug_sets | |
| pieceType | select | see values below |
| model3d | upload → media | OBJ or GLTF, required |
| textureScan | upload → media | optional photo scan texture |
| dimensions | JSON | structure varies by pieceType |
| angles | group | `lugAngle`, `seatingAngle`, `notes` |

**pieceType values:**
- `headtube_top` – Top Headtube
- `headtube_bottom` – Bottom Headtube
- `seat_tube` – Seat Tube Lug
- `bb_shell` – Bottom Bracket Shell
- `dropout_front` – Front Dropout
- `dropout_rear` – Rear Dropout
- `braze_on` – Braze-on (misc)

**Dimension JSON by piece type** (enforced in TypeScript):

```ts
// headtube_top
type HeadtubeTopDimensions = {
  steerTubeODTop: number      // mm – Top Steer Tube Outer Diameter
  steerTubeODBottom: number   // mm – Bottom Steer Tube Outer Diameter
  topTubeOD: number           // mm – Top Tube Outer Diameter
  angle: number               // degrees
}

// headtube_bottom
type HeadtubeBottomDimensions = {
  steerTubeODTop: number
  steerTubeODBottom: number
  downTubeOD: number          // mm – Down Tube Outer Diameter
  angle: number
}

// seat_tube
type SeatTubeDimensions = {
  seatTubeOD: number          // mm – Seat Tube Outer Diameter
  angle: number
}

// bb_shell
type BBShellDimensions = {
  shellWidth: number           // mm (standard: 68, 70, 73)
  threadStandard: string       // 'BSA' | 'Italian' | 'PF30'
  innerDiameter: number        // mm
}

// dropout_front | dropout_rear
type DropoutDimensions = {
  axleSlotWidth: number        // mm
  axleSlotDepth: number        // mm
}
```

---

## Features

### Archive Page (`/archive`)

- Responsive grid of lug set cards
- Each card shows: cover image, lug set name, manufacturer name, piece type indicators
- **Search bar**: full-text search by manufacturer name or designer name (debounced)
- **Filter panel**: filter by piece types present, manufacturer, purchasable toggle, active year range
- Filter state is URL-driven (query params) so links are shareable
- Pagination

### Lug Detail Viewer (`/lug/:slug`)

The viewer has two modes selectable from the control panel.

**Mode A – Perspective View**
- Single `<Canvas>` with perspective camera and OrbitControls
- Toggleable HDRI background from the designer's workshop scan (falls back to an Environment preset)
- Full model in the center of the canvas

**Mode B – Orthographic Multi-Camera View**
- Single `<Canvas>` with three `<View>` portals (one canvas, three rendering regions)
- Side Profile, Top Down, Bottom Up
- Each viewport has its own OrthographicCamera and MapControls (2D pan/zoom, no rotation)
- All views share a `THREE.Matrix4` for synchronized model transforms
- Derived from the existing `app/components/split.js` implementation

**Viewer Control Panel**
- Mode toggle (Perspective / Ortho)
- Material selector: Photo Scan, Metal, Outline, Crosshatch
- Toggle buttons: Texture on/off, Wireframe on/off, Angle Lines on/off

**Viewer Side Panel**
- Manufacturer name and logo
- Designer name with social link
- Piece type selector (if the set has multiple pieces)
- Dimensions table for the selected piece
- Purchase links (if purchasable)
- Description

### Material System

Four material types. The active material is resolved by `useMaterialSystem.ts`. If Photo Scan is selected but no texture scan exists for the current piece, it falls back to Metal.

| Type | Technique |
|---|---|
| Photo Scan | `meshStandardMaterial` + `useTexture` loading the `textureScan` URL |
| Metal | `meshStandardMaterial` metalness=1, roughness=0.15, silver, driven by Environment |
| Outline / Technical Drawing | `THREE.EdgesGeometry` + `LineBasicMaterial`; base mesh rendered transparent |
| Crosshatch / Ink | Custom GLSL `ShaderMaterial`; fragment shader computes hatch line density from diffuse lighting; two passes at 0° and 45° produce crosshatch. Inspired by [spite/sketch](https://github.com/spite/sketch) |

### Angle Indicators

When toggled on, Three.js `<Line>` objects (from @react-three/drei) are drawn through the lug center point in the direction of `piece.angles.lugAngle` and `piece.angles.seatingAngle`. These help visualize tube angles at a glance.

### Admin CMS (`/admin`)

- Payload CMS admin UI, served by the standalone Payload server
- Email/password login; JWT session
- Collections available to admin: Manufacturers, People, Workshops, Lug Sets, Lug Pieces, Media
- Upload support: images, OBJ/GLTF 3D models, texture scans (.png/.jpg), HDRI workshop scans (.hdr)
- First admin user is seeded via a one-time script

### Google Ads

A thin `AdBanner.tsx` client component wraps Google Publisher Tag (GPT). It initializes `googletag` in a `useEffect` after hydration and renders a `<div id="leaderboard-top">` slot. Ad slot IDs are environment variables. The banner lives in the root layout header.

---

## Model Formats

The viewer supports OBJ and GLTF/GLB. Models are loaded via:
- `useGLTF` from @react-three/drei for `.gltf` / `.glb`
- `useLoader(OBJLoader, url)` from @react-three/fiber for `.obj` (OBJLoader from `three/examples/jsm`)

OBJ is the likely primary format for scanned lugs. GLTF/GLB is preferred for animated or textured models. The `LugModel.tsx` component detects the file extension from the media URL and uses the appropriate loader.

For large OBJ files, DRACO compression (via `DRACOLoader`) can be applied at upload time for GLTF.

---

## Viewer State (Zustand)

```ts
// lib/viewer-store.ts
type ViewerState = {
  // Mode
  viewerMode: 'perspective' | 'ortho'
  setViewerMode: (mode: 'perspective' | 'ortho') => void

  // Material
  materialType: 'photoscan' | 'metal' | 'outline' | 'crosshatch'
  showTexture: boolean
  showWireframe: boolean
  showAngleLines: boolean
  setMaterialType: (type: MaterialType) => void
  toggleTexture: () => void
  toggleWireframe: () => void
  toggleAngleLines: () => void

  // Ortho view directions (from split.js)
  top: ViewDirection
  middle: ViewDirection
  bottom: ViewDirection
  setPanelView: (which: 'top' | 'middle' | 'bottom', view: ViewDirection) => void
}

type ViewDirection = 'Top' | 'Bottom' | 'Left' | 'Right' | 'Front' | 'Back'
```

---

## Existing Code to Reuse

`app/components/split.jsx` is the foundation for `OrthoViewer.tsx`:

- The `positions` map (`{ Top: [0,10,0], Bottom: [0,-10,0], ... }`) maps directly to ortho camera positions
- The `useStore` Zustand pattern becomes `viewer-store.ts`
- The `Canvas` + `View` + `MapControls` structure becomes `OrthoViewer.tsx`
- The `OrthoViewCam` component maps to the three fixed cameras in Mode B
- The CSS grid layout (`grid-template-areas: 'main top' 'main middle' 'main bottom'`) applies directly to the three-viewport layout

---

## API Design

Payload generates a full REST API at `/api` for each collection. Remix loaders call these from the server side.

**Public endpoints (no auth):**
```
GET /api/lug-sets?limit=24&page=1&where[manufacturer.slug][equals]=:slug
GET /api/lug-sets/:id
GET /api/lug-pieces?where[lugSet][equals]=:id
GET /api/manufacturers
GET /api/manufacturers/:id
GET /api/people/:id
GET /api/workshops/:id
```

**Admin endpoints (JWT auth required):**
```
POST /api/users/login
POST /api/users/logout
POST /api/lug-sets          (create)
PATCH /api/lug-sets/:id     (update)
DELETE /api/lug-sets/:id
... (same pattern for all collections)
```

---

## Self-Hosting Setup

### Local Development

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Start Payload CMS server (port 3001)
cd payload && npm run dev

# 3. Start Remix dev server (port 3000)
npm run dev
```

### Production

**Nginx** routes traffic between Payload and Remix and serves uploaded media files directly.

```nginx
server {
    server_name luglove.example.com;

    # Serve uploaded media directly (bypass Node.js)
    location /media {
        alias /var/www/luglove/media;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Payload admin and API
    location /admin {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Remix frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

**Systemd services** for both the Remix server and the Payload server.

**Docker Compose** for PostgreSQL (see `docker-compose.yml`).

### Environment Variables

```
# Database
DATABASE_URL=postgresql://luglove:password@localhost:5432/luglove

# Payload
PAYLOAD_SECRET=your-secret-key-here
PAYLOAD_PUBLIC_SERVER_URL=https://luglove.example.com

# Remix
SESSION_SECRET=your-session-secret

# Google Ads
GOOGLE_AD_PUBLISHER_ID=pub-xxxxxxxxxxxxxxxx
GOOGLE_AD_SLOT_LEADERBOARD=xxxxxxxxxx
```

---

## Development Commands

```bash
npm run dev          # Start Remix dev server
npm run build        # Build for production
npm run start        # Start production Remix server
npm run lint         # ESLint
npm run typecheck    # TypeScript check

# Payload (from /payload directory)
npm run dev          # Start Payload dev server
npm run payload generate:types   # Regenerate TypeScript types from collections
npm run payload seed             # Seed initial admin user
```

---

## Notes for AI Assistants

- **3D viewer is client-only.** All `@react-three/fiber` components must be in `'use client'` components in Remix. Use dynamic imports with `{ ssr: false }` equivalent in Remix (`<ClientOnly>` wrapper).
- **OBJ loading:** `OBJLoader` is in `three/examples/jsm/loaders/OBJLoader` — no extra package needed. Wrap with `useLoader` from @react-three/fiber.
- **Payload local API vs REST:** In Remix loaders (server-side), call Payload's REST API at `http://localhost:3001/api/...`. Do not import Payload directly into Remix server code — keep them as separate processes.
- **Material system fallback:** Always check if `piece.textureScan` exists before applying Photo Scan material. `useMaterialSystem.ts` handles the fallback to Metal.
- **HDRI files:** Workshop HDRI `.hdr` files are large. Pass the URL to drei's `<Environment files={url} />`. The URL comes from the Payload media API (`workshop.hdriScan.url`).
- **Zustand store persistence:** The viewer store is not persisted — it resets on navigation. This is intentional; each lug page starts with defaults.
- **Angle indicators:** Use drei's `<Line>` component with `points` calculated from the lug center and angle values. The center is `[0, 0, 0]` after `<Center>` is applied.
