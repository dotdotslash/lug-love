# Lug Love – TODO

## Phase 1: Foundation

- [x] Migrate from Next.js to Remix
  - [x] Initialize Remix project (keep existing `public/models/` and component code)
  - [x] Move `app/components/split.jsx` into new Remix component structure
  - [x] Update `package.json` with Remix deps, remove Next.js
  - [x] Configure Tailwind for Remix
  - [x] Upgrade Mantine from v6 → v7
- [x] Set up PostgreSQL via Docker Compose (`docker-compose.yml`)
- [x] Install and configure Payload CMS v3
  - [x] Add standalone Express server (`payload/server.ts`)
  - [x] Create `payload/payload.config.ts`
  - [x] Define Media collection with accepted MIME types (images, OBJ, GLTF, HDR)
  - [x] Define Users collection (admin-only, no public registration)
  - [x] Define Manufacturers collection
  - [x] Define People collection
  - [x] Define Workshops collection (with HDR upload field)
  - [x] Define LugSets collection
  - [x] Define LugPieces collection (pieceType enum, model3d upload, dimensions JSON, angles group)
  - [ ] Run `payload generate:types` and commit generated types (requires DB)
  - [ ] Seed first admin user (requires DB)
- [x] Create `lib/payload-api.ts` with typed fetch helpers
- [x] Create `lib/types.ts` with shared TypeScript types (LugSet, LugPiece, dimension types)
- [x] Create `lib/viewer-store.ts` Zustand store
- [x] Create `.env.example` with all required environment variables
- [x] Create `nginx.conf.example`
- [ ] Verify Payload admin UI loads at `/admin` on port 3001 (requires DB + running server)

## Phase 2: Archive Page

- [x] Build `app/routes/archive.tsx` Remix route with loader (server-side fetch from Payload)
- [x] Build `ArchiveGrid.tsx` with URL-driven pagination via `useSearchParams`
- [x] Build `FilterPanel.tsx`
  - [x] Filter by manufacturer (searchable select dropdown)
  - [x] Purchasable toggle (switch)
  - [ ] Filter by piece types present – needs `availablePieceTypes` denormalized field on LugSets (backlog)
  - [ ] Active year range slider (backlog)
- [x] Build `SearchBar.tsx` with debounced search (300ms) via `useDebouncedCallback`
- [x] Build `LugCard.tsx`
  - [x] Cover image with aspect ratio + placeholder
  - [x] Lug set name
  - [x] Manufacturer name + city
  - [x] Piece type badges (shown when piece data is provided)
  - [x] Purchasable indicator badge
- [x] Add pagination to archive grid (Mantine Pagination)
- [x] Mobile responsive layout (`SimpleGrid` responsive cols, sidebar hidden on mobile)

## Phase 3: 3D Viewer Infrastructure

- [x] Create `app/lib/viewer-store.ts` (Zustand — moved to app/lib, typed)
- [ ] Build `LugModel.tsx` — format-aware loader
  - [ ] GLTF/GLB via `useGLTF` from @react-three/drei
  - [ ] OBJ via `useLoader(OBJLoader, url)` from @react-three/fiber
  - [ ] Detect format from file extension in URL
- [ ] Build `LugViewer.tsx` — mode switcher wrapper (client-only)
  - [ ] `<ClientOnly>` wrapper for SSR safety in Remix
  - [ ] Switch between `PerspectiveViewer` and `OrthoViewer` based on store state
- [ ] Build `PerspectiveViewer.tsx` (Mode A)
  - [ ] Single Canvas with PerspectiveCamera
  - [ ] OrbitControls
  - [ ] `<Environment>` preset (city) as default background
  - [ ] Toggle HDRI from workshop scan using `<Environment files={url} />`
  - [ ] `LugModel` centered with `<Center>`
  - [ ] `AccumulativeShadows` + `RandomizedLight`
- [ ] Build `OrthoViewer.tsx` (Mode B — evolve from `split.jsx`)
  - [ ] Migrate JS → TypeScript
  - [ ] Three `<View>` portals: Side Profile, Top Down, Bottom Up
  - [ ] Shared `THREE.Matrix4` for synchronized transforms
  - [ ] `OrthographicCamera` + `MapControls` per viewport
  - [ ] Preserve CSS grid layout from `split.module.css`
- [ ] Build `ViewerControls.tsx` panel
  - [ ] Mode toggle (Perspective / Ortho)
  - [ ] Material selector (4 buttons)
  - [ ] Toggle: Texture, Wireframe, Angle Lines
  - [ ] Ortho view direction dropdowns (Top/Bottom/Left/Right/Front/Back per panel)
- [ ] Build `ViewerSidePanel.tsx`
  - [ ] Manufacturer name + logo
  - [ ] Designer name + social link
  - [ ] Piece type selector tabs (if set has multiple pieces)
  - [ ] Dimensions table for selected piece
  - [ ] Purchase links (shown if `lugSet.purchasable`)
  - [ ] Description (rich text render)
- [ ] Build `lug.$slug.tsx` Remix route
  - [ ] Loader: fetch lug set + pieces + manufacturer from Payload
  - [ ] Pass data as props to `LugViewer`

## Phase 4: Material System

- [ ] Build `useMaterialSystem.ts` hook
  - [ ] Resolve active material (fallback: PhotoScan → Metal if no textureScan)
- [ ] Build `PhotoScanMaterial.tsx`
  - [ ] `meshStandardMaterial` + `useTexture` loading `piece.textureScan.url`
  - [ ] roughness=0.8, metalness=0.2
- [ ] Build `MetalMaterial.tsx`
  - [ ] `meshStandardMaterial` metalness=1, roughness=0.15, silver color
- [ ] Build `OutlineMaterial.tsx`
  - [ ] Compute `THREE.EdgesGeometry` from model geometry
  - [ ] Render edges with `LineBasicMaterial`
  - [ ] Base mesh rendered with transparent material
- [ ] Build `CrosshatchMaterial.tsx` (ink / hatching shader)
  - [ ] Vertex shader: pass world normals, view-space position, UV
  - [ ] Fragment shader: compute diffuse intensity from normal + light direction
  - [ ] Use `mod(uv * frequency, 1.0)` to draw hatch lines
  - [ ] Two hatch passes at 0° and 45° for crosshatch effect
  - [ ] Hatch density driven by lighting intensity
  - [ ] Wrap with drei's `shaderMaterial` helper
  - [ ] Reference: https://github.com/spite/sketch
- [ ] Build `AngleIndicators.tsx`
  - [ ] `<Line>` objects through lug center for `lugAngle` and `seatingAngle`
  - [ ] Toggled by `showAngleLines` store state

## Phase 5: Layout & Ads

- [ ] Build `SiteHeader.tsx` with logo and nav links
- [ ] Build `AdBanner.tsx`
  - [ ] Load Google Publisher Tag script once per page
  - [ ] Initialize `googletag` in `useEffect` after hydration
  - [ ] Render `<div id="leaderboard-top">` slot
  - [ ] Ad slot IDs from environment variables
- [ ] Build `SiteFooter.tsx`
- [ ] Wire root layout in `app/root.tsx`
  - [x] MantineProvider
  - [x] Tailwind global CSS
  - [ ] `SiteHeader` with `AdBanner`
  - [ ] `SiteFooter`

## Phase 6: Production & Self-Hosting

- [x] Write `nginx.conf.example`
- [ ] Write systemd service files
  - [ ] `luglove-remix.service`
  - [ ] `luglove-payload.service`
- [x] Add `docker-compose.yml` for PostgreSQL
- [ ] Document HTTPS setup with Certbot in README
- [ ] Test production build (`npm run build && npm run start` for both servers)
- [ ] Verify media file uploads and serving in production

## Phase 7: Polish

- [ ] Add Open Graph meta tags to archive and lug detail pages
- [ ] Add `sitemap.xml` generation
- [ ] GLTF DRACO compression setup for large models
- [ ] Model loading progress indicator (for large OBJ/GLTF files)
- [ ] Keyboard navigation in viewer controls (accessibility)
- [ ] Add `robots.txt`
- [ ] Performance audit (Lighthouse)
- [ ] Cross-browser test (Safari WebGL, Firefox)

## Backlog

- [ ] Manufacturer detail page (`/manufacturer/:slug`)
- [ ] People / designer detail page (`/people/:slug`)
- [ ] Workshop HDRI upload workflow in admin
- [ ] Lug comparison view (two lugs side by side)
- [ ] Export technical drawing as PDF from angle/dimension data
- [ ] Analytics integration (Plausible or similar, self-hosted)
- [ ] RSS feed for new additions
- [ ] Related lugs suggestions on detail page
