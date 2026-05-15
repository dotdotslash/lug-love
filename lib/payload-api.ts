import type {
  Manufacturer,
  Person,
  Workshop,
  LugSet,
  LugPiece,
  PayloadListResponse,
} from "./types.js";

const API_URL =
  process.env.PAYLOAD_API_URL ?? "http://localhost:3001/api";

type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
};

async function payloadFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `JWT ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(
      `Payload API ${method} ${endpoint} failed with ${res.status}: ${await res.text()}`
    );
  }

  return res.json() as Promise<T>;
}

// ── Lug Sets ────────────────────────────────────────────────────────────────

export async function getLugSets(params?: {
  page?: number;
  limit?: number;
  search?: string;
  manufacturerSlug?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit ?? 24));
  if (params?.search) query.set("where[or][0][manufacturer.name][like]", params.search);
  if (params?.manufacturerSlug)
    query.set("where[manufacturer.slug][equals]", params.manufacturerSlug);
  query.set("depth", "2");

  return payloadFetch<PayloadListResponse<LugSet>>(
    `/lug-sets?${query.toString()}`
  );
}

export async function getLugSetBySlug(slug: string) {
  const res = await payloadFetch<PayloadListResponse<LugSet>>(
    `/lug-sets?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`
  );
  return res.docs[0] ?? null;
}

// ── Lug Pieces ───────────────────────────────────────────────────────────────

export async function getLugPiecesBySetId(lugSetId: string) {
  return payloadFetch<PayloadListResponse<LugPiece>>(
    `/lug-pieces?where[lugSet][equals]=${lugSetId}&depth=2&limit=100`
  );
}

// ── Manufacturers ────────────────────────────────────────────────────────────

export async function getManufacturers(params?: {
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  query.set("limit", String(params?.limit ?? 100));
  query.set("sort", "name");

  return payloadFetch<PayloadListResponse<Manufacturer>>(
    `/manufacturers?${query.toString()}`
  );
}

export async function getManufacturerBySlug(slug: string) {
  const res = await payloadFetch<PayloadListResponse<Manufacturer>>(
    `/manufacturers?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`
  );
  return res.docs[0] ?? null;
}

// ── People ───────────────────────────────────────────────────────────────────

export async function getPersonBySlug(slug: string) {
  const res = await payloadFetch<PayloadListResponse<Person>>(
    `/people?where[slug][equals]=${encodeURIComponent(slug)}&depth=2&limit=1`
  );
  return res.docs[0] ?? null;
}

// ── Workshops ────────────────────────────────────────────────────────────────

export async function getWorkshopById(id: string) {
  return payloadFetch<Workshop>(`/workshops/${id}?depth=2`);
}
