// Shared TypeScript types for the Lug Love application.
// These mirror the Payload CMS collection shapes but are safe to import
// from both Remix (frontend) and any server-side utilities.

export type MediaFile = {
  id: string;
  filename: string;
  mimeType: string;
  url: string;
  alt?: string;
  fileType?: "image" | "3d-model" | "texture-scan" | "hdri";
};

export type Manufacturer = {
  id: string;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  description?: unknown; // Lexical rich text JSON
  logo?: MediaFile;
  yearsActiveStart?: number;
  yearsActiveEnd?: number | null;
};

export type Workshop = {
  id: string;
  name: string;
  person: Person | string;
  hdriScan?: MediaFile;
};

export type Person = {
  id: string;
  name: string;
  slug: string;
  socialLink?: string;
  manufacturer?: Manufacturer | string;
  workshop?: Workshop | string;
};

export type PurchaseUrl = {
  id?: string;
  label: string;
  url: string;
};

export type LugSet = {
  id: string;
  name: string;
  slug: string;
  manufacturer: Manufacturer | string;
  designer?: Person | string;
  description?: unknown; // Lexical rich text JSON
  coverImage?: MediaFile;
  purchasable: boolean;
  purchaseUrls?: PurchaseUrl[];
};

export type PieceType =
  | "headtube_top"
  | "headtube_bottom"
  | "seat_tube"
  | "bb_shell"
  | "dropout_front"
  | "dropout_rear"
  | "braze_on";

export const PIECE_TYPE_LABELS: Record<PieceType, string> = {
  headtube_top: "Top Headtube",
  headtube_bottom: "Bottom Headtube",
  seat_tube: "Seat Tube",
  bb_shell: "Bottom Bracket Shell",
  dropout_front: "Front Dropout",
  dropout_rear: "Rear Dropout",
  braze_on: "Braze-on",
};

// Dimension shapes per piece type

export type HeadtubeTopDimensions = {
  steerTubeODTop: number; // mm
  steerTubeODBottom: number; // mm
  topTubeOD: number; // mm
  angle: number; // degrees
};

export type HeadtubeBottomDimensions = {
  steerTubeODTop: number; // mm
  steerTubeODBottom: number; // mm
  downTubeOD: number; // mm
  angle: number; // degrees
};

export type SeatTubeDimensions = {
  seatTubeOD: number; // mm
  angle: number; // degrees
};

export type BBShellDimensions = {
  shellWidth: number; // mm (standard: 68, 70, 73)
  threadStandard: "BSA" | "Italian" | "PF30";
  innerDiameter: number; // mm
};

export type DropoutDimensions = {
  axleSlotWidth: number; // mm
  axleSlotDepth: number; // mm
};

export type LugDimensions =
  | HeadtubeTopDimensions
  | HeadtubeBottomDimensions
  | SeatTubeDimensions
  | BBShellDimensions
  | DropoutDimensions;

export type LugAngles = {
  lugAngle?: number; // degrees
  seatingAngle?: number; // degrees
  notes?: string;
};

export type LugPiece = {
  id: string;
  lugSet: LugSet | string;
  pieceType: PieceType;
  model3d: MediaFile;
  textureScan?: MediaFile;
  dimensions?: LugDimensions;
  angles?: LugAngles;
};

export function isPopulated<T extends { id: string }>(
  v: T | string | undefined | null
): v is T {
  return typeof v === "object" && v !== null;
}

// Payload REST API pagination envelope
export type PayloadListResponse<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};
